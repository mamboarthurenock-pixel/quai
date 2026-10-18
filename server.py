#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LPCC Companion — serveur sécurisé
Authentification email + mot de passe (bcrypt), sessions, rate limiting,
en-têtes de sécurité, base SQLite.

Lancement :  python3 server.py
Accès    :  http://127.0.0.1:5000
"""
import os
import json
import re
import sqlite3
import secrets
import time
from functools import wraps
from collections import defaultdict

from flask import (
    Flask, request, session, redirect, jsonify, Response,
    send_from_directory, abort, render_template_string
)
import bcrypt

BASE = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(BASE, "lpcc.db")
SECRET_FILE = os.path.join(BASE, ".session_secret")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# --------------------------------------------------------------------------
# Clé de session persistante (générée une fois, permissions 600)
# --------------------------------------------------------------------------
def charger_secret():
    if os.path.exists(SECRET_FILE):
        with open(SECRET_FILE, "rb") as f:
            return f.read()
    s = secrets.token_bytes(48)
    fd = os.open(SECRET_FILE, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "wb") as f:
        f.write(s)
    return s


app = Flask(__name__, static_folder=None)
# app.secret_key défini plus bas (persisté en base)
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False,   # True derrière HTTPS
    MAX_CONTENT_LENGTH=1 * 1024 * 1024,
)



# --------------------------------------------------------------------------
# Base de données
# --------------------------------------------------------------------------
def _lire_env(cle):
    chemin = os.path.join(BASE, ".env")
    if os.path.exists(chemin):
        with open(chemin, encoding="utf-8") as f:
            for ligne in f:
                ligne = ligne.strip()
                if ligne.startswith(cle + "="):
                    return ligne.split("=", 1)[1].strip()
    return os.environ.get(cle, "")


ELEVEN_API_KEY = _lire_env("ELEVENLABS_API_KEY")
ELEVEN_VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "").strip() or "Vza9yt3uSx3RXnRx6YfI"
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
USE_PG = bool(DATABASE_URL)


class _Conn:
    """Connexion compatible SQLite (local) et PostgreSQL (Supabase)."""
    def __init__(self):
        if USE_PG:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            self.c = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
            self.cur = self.c.cursor()
        else:
            self.c = sqlite3.connect(DB)
            self.c.row_factory = sqlite3.Row

    def execute(self, q, params=()):
        if USE_PG:
            self.cur.execute(q.replace("?", "%s").replace("datetime('now')", "now()"), params)
            return self.cur
        return self.c.execute(q, params)

    def commit(self):
        self.c.commit()

    def close(self):
        self.c.close()


def db():
    return _Conn()


def init_db():
    conn = None
    try:
        conn = db()
        if USE_PG:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT now(),
                    last_login TIMESTAMP
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS media (
                    cle TEXT PRIMARY KEY,
                    mime TEXT NOT NULL,
                    data BYTEA NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT now()
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS courses (
                    id SERIAL PRIMARY KEY,
                    fichier TEXT UNIQUE NOT NULL,
                    dossier TEXT,
                    niveau TEXT,
                    matiere TEXT,
                    texte TEXT,
                    fiche TEXT,
                    questions TEXT,
                    statut TEXT DEFAULT 'brut',
                    created_at TIMESTAMP NOT NULL DEFAULT now()
                )
            """)
        else:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    last_login TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS media (
                    cle TEXT PRIMARY KEY,
                    mime TEXT NOT NULL,
                    data BLOB NOT NULL,
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS courses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fichier TEXT UNIQUE NOT NULL,
                    dossier TEXT,
                    niveau TEXT,
                    matiere TEXT,
                    texte TEXT,
                    fiche TEXT,
                    questions TEXT,
                    statut TEXT DEFAULT 'brut',
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                )
            """)
        conn.commit()
    except Exception as e:
        print("init_db:", e)
    finally:
        try:
            if conn is not None:
                conn.close()
        except Exception:
            pass




def media_put(cle, mime, octets):
    try:
        conn = db()
        try:
            conn.execute("DELETE FROM media WHERE cle = ?", (cle,))
            conn.execute("INSERT INTO media (cle, mime, data) VALUES (?, ?, ?)", (cle, mime, octets))
            conn.commit()
        finally:
            conn.close()
        return True
    except Exception:
        return False


def media_get(cle):
    try:
        conn = db()
        try:
            row = conn.execute("SELECT mime, data FROM media WHERE cle = ?", (cle,)).fetchone()
            if row:
                return row["mime"], bytes(row["data"])
        finally:
            conn.close()
    except Exception:
        pass
    return None

def _secret_key():
    # 1) variable d'environnement
    v = _lire_env("SESSION_SECRET")
    if v:
        return v
    # 2) base de données (persistant)
    m = media_get("session:secret")
    if m:
        return m[1].decode("utf-8", "replace")
    # 3) générer + stocker
    import secrets as _secrets
    v = _secrets.token_hex(32)
    media_put("session:secret", "text/plain", v.encode())
    return v


# Création de la table au démarrage (gunicorn inclus)
init_db()
app.secret_key = _secret_key()

# --------------------------------------------------------------------------
# AGENT D'ÉTUDE : migration + génération (DeepSeek)
# --------------------------------------------------------------------------
def migrer_cours():
    """Charge cours_data.json dans la table courses si elle est vide."""
    try:
        conn = db()
        try:
            row = conn.execute("SELECT COUNT(*) AS n FROM courses").fetchone()
            n = int(row["n"]) if row else 0
        finally:
            conn.close()
        if n > 0:
            return n
        chemin = os.path.join(BASE, "cours_data.json")
        if not os.path.exists(chemin):
            return 0
        with open(chemin, encoding="utf-8") as f:
            data = json.load(f)
        conn = db()
        try:
            for c in data:
                try:
                    conn.execute(
                        "INSERT INTO courses (fichier, dossier, niveau, matiere, texte) VALUES (?, ?, ?, ?, ?)",
                        (c.get("fichier"), c.get("dossier"), c.get("niveau"),
                         c.get("matiere"), c.get("texte") or ""),
                    )
                except Exception:
                    pass
            conn.commit()
        finally:
            conn.close()
        print("migration courses:", len(data))
        return len(data)
    except Exception as e:
        print("migrer_cours:", e)
        return 0


PROMPT_AGENT = (
    "Tu es un professeur expert en Transport Logistique Transit (TLT). "
    "À partir du COURS ci-dessous, produis UNIQUEMENT un JSON valide (sans markdown) avec : "
    '"points" (5 points essentiels, phrases courtes), '
    '"formules" (max 4 formules/définitions), '
    '"sigles" (max 6 "SIGLE : sens"), '
    '"pieges" (max 3 pièges d examen), '
    '"mnemo" (1 moyen mnémotechnique), '
    '"questions" (10 objets {q, options:[4], bonne:index 0-3, explication}). '
    "COURS :\n"
)


def agent_generer(course_id):
    """Génère la fiche + 10 questions pour un cours (DeepSeek)."""
    cle = _env("DEEPSEEK_API_KEY")
    if not cle:
        return {"ok": False, "error": "Clé DeepSeek absente"}
    conn = db()
    try:
        row = conn.execute("SELECT * FROM courses WHERE id = ?", (course_id,)).fetchone()
        if not row:
            return {"ok": False, "error": "Cours introuvable"}
        texte = (row["texte"] or "")[:12000]
        if len(texte) < 80:
            return {"ok": False, "error": "Cours trop court"}
        try:
            r = _post_json(
                "https://api.deepseek.com/chat/completions",
                {"model": "deepseek-chat",
                 "messages": [
                     {"role": "system", "content": "Tu réponds toujours en JSON strict."},
                     {"role": "user", "content": PROMPT_AGENT + (row["fichier"] or "") + "\n" + texte},
                 ],
                 "max_tokens": 2000, "temperature": 0.3},
                {"Authorization": "Bearer " + cle}, timeout=120)
            contenu = r["choices"][0]["message"]["content"]
            obj = _extraire_json(contenu)
            if not obj:
                return {"ok": False, "error": "JSON invalide"}
            fiche = {k: obj.get(k) for k in ("points", "formules", "sigles", "pieges", "mnemo")}
            questions = obj.get("questions") or []
            conn.execute(
                "UPDATE courses SET fiche = ?, questions = ?, statut = ? WHERE id = ?",
                (json.dumps(fiche, ensure_ascii=False),
                 json.dumps(questions, ensure_ascii=False), "pret", course_id))
            conn.commit()
            return {"ok": True, "id": course_id, "questions": len(questions)}
        except Exception as e:
            return {"ok": False, "error": str(e)[:200]}
    finally:
        conn.close()


# Migration au démarrage
migrer_cours()




# --------------------------------------------------------------------------
# Rate limiting simple (mémoire)
# --------------------------------------------------------------------------
TENTATIVES = defaultdict(list)
MAX_TENTATIVES = 8
FENETRE = 300  # 5 minutes


def trop_de_tentatives(ip):
    now = time.time()
    TENTATIVES[ip] = [t for t in TENTATIVES[ip] if now - t < FENETRE]
    return len(TENTATIVES[ip]) >= MAX_TENTATIVES


def enregistrer_tentative(ip):
    TENTATIVES[ip].append(time.time())


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------
def utilisateur_connecte():
    return session.get("user_id")


def login_required(f):
    @wraps(f)
    def wrapper(*a, **kw):
        if not utilisateur_connecte():
            return redirect("/login")
        return f(*a, **kw)
    return wrapper

@app.route("/api/agent/run", methods=["POST"])
@login_required
def api_agent_run():
    """Traite jusqu'à N cours sans fiche (l'agent travaille)."""
    data = request.get_json(silent=True) or {}
    limite = max(1, min(5, int(data.get("limite") or 1)))
    conn = db()
    try:
        rows = conn.execute(
            "SELECT id FROM courses WHERE fiche IS NULL ORDER BY id LIMIT ?", (limite,)).fetchall()
    finally:
        conn.close()
    resultats = []
    for r in rows:
        resultats.append(agent_generer(r["id"]))
    return jsonify(ok=True, traites=len(resultats), resultats=resultats)


@app.route("/api/courses")
@login_required
def api_courses_db():
    """Liste les cours depuis la base (léger, sans le texte)."""
    conn = db()
    try:
        rows = conn.execute(
            "SELECT id, fichier, niveau, matiere, statut FROM courses ORDER BY niveau, matiere, fichier"
        ).fetchall()
    finally:
        conn.close()
    return jsonify(ok=True, total=len(rows), cours=[dict(r) for r in rows])




@app.after_request
def securiser(reponse):
    reponse.headers["X-Content-Type-Options"] = "nosniff"
    reponse.headers["X-Frame-Options"] = "DENY"
    reponse.headers["Referrer-Policy"] = "no-referrer"
    reponse.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    reponse.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "img-src 'self' data:; "
        "style-src 'self' 'unsafe-inline'; "
        "script-src 'self' 'unsafe-inline'; "
        "font-src 'self'; "
        "connect-src 'self'; "
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self'"
    )
    return reponse


# --------------------------------------------------------------------------
# Pages
# --------------------------------------------------------------------------
LOGIN_HTML = r"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Quai — Connexion</title>
<link rel="manifest" href="/manifest.json">
<link rel="icon" href="/icon.svg">
<style>
  :root{
    --bg:#0a0616;--card:rgba(24,16,48,.72);--cyan:#22d3ee;--violet:#a78bfa;
    --rose:#f472b6;--text:#f4f6ff;--muted:#a5b0d0;--line:rgba(167,139,250,.25);
  }
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;
    background:
      radial-gradient(900px 500px at 100% 0%,rgba(34,211,238,.16),transparent 60%),
      radial-gradient(900px 600px at 0% 100%,rgba(167,139,250,.16),transparent 60%),
      var(--bg);
    color:var(--text);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:24px}
  .box{width:100%;max-width:400px;background:var(--card);
    backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px);
    border:1px solid var(--line);border-radius:24px;padding:30px 26px;
    box-shadow:0 30px 70px -30px rgba(34,211,238,.45)}
  .logo{width:52px;height:52px;border-radius:16px;margin:0 auto 14px;
    background:linear-gradient(135deg,var(--cyan),var(--violet),var(--rose));
    display:grid;place-items:center;font-weight:800;color:#0a0616;font-size:17px;
    box-shadow:0 0 28px rgba(34,211,238,.5)}
  h1{font-size:22px;margin:0 0 4px;text-align:center;
    background:linear-gradient(90deg,var(--cyan),var(--violet),var(--rose));
    -webkit-background-clip:text;background-clip:text;color:transparent}
  .sub{text-align:center;color:var(--muted);font-size:13px;margin:0 0 22px}
  label{display:block;font-size:12px;text-transform:uppercase;letter-spacing:1px;
    color:var(--muted);margin:12px 0 6px}
  input{width:100%;padding:13px 14px;border-radius:14px;border:1px solid var(--line);
    background:rgba(10,6,22,.6);color:var(--text);font-size:15px}
  input:focus{outline:none;border-color:var(--cyan);box-shadow:0 0 0 3px rgba(34,211,238,.15)}
  button{width:100%;margin-top:18px;padding:14px;border:none;border-radius:14px;
    background:linear-gradient(135deg,var(--cyan),var(--violet));color:#0a0616;
    font-weight:800;font-size:15px;cursor:pointer;
    box-shadow:0 12px 30px -12px rgba(34,211,238,.8)}
  button:hover{filter:brightness(1.08)}
  .lien{text-align:center;margin-top:16px;font-size:13px;color:var(--muted)}
  .lien a{color:var(--cyan);text-decoration:none;font-weight:600}
  .msg{padding:11px 13px;border-radius:12px;font-size:13px;margin-top:14px;display:none}
  .err{background:rgba(251,113,133,.12);border:1px solid rgba(251,113,133,.4);color:#fda4af}
  .ok{background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.4);color:#6ee7b7}
</style>
</head>
<body>
<div class="box">
  <div class="logo">LP</div>
  <h1 id="titre">Connexion</h1>
  <p class="sub">Quai — 3 BT TLT 1</p>

  <form id="form">
    <label for="email">Adresse email</label>
    <input id="email" type="email" required autocomplete="email" placeholder="toi@exemple.com">
    <label for="password">Mot de passe</label>
    <input id="password" type="password" required minlength="8"
           autocomplete="current-password" placeholder="8 caractères minimum">
    <div id="msg" class="msg"></div>
    <button type="submit" id="btn">Se connecter</button>
  </form>

  <div class="lien">
    <span id="switchText">Pas encore de compte ?</span>
    <a href="#" id="switch">Créer un compte</a>
  </div>
</div>

<script>
(function(){
  var mode = "login";
  var form = document.getElementById("form");
  var titre = document.getElementById("titre");
  var btn = document.getElementById("btn");
  var msg = document.getElementById("msg");
  var switchText = document.getElementById("switchText");
  var switchA = document.getElementById("switch");

  function afficher(texte, ok){
    msg.textContent = texte;
    msg.className = "msg " + (ok ? "ok" : "err");
    msg.style.display = "block";
  }

  function basculer(){
    mode = (mode === "login") ? "register" : "login";
    if (mode === "login"){
      titre.textContent = "Connexion";
      btn.textContent = "Se connecter";
      switchText.textContent = "Pas encore de compte ?";
      switchA.textContent = "Créer un compte";
      document.getElementById("password").autocomplete = "current-password";
    } else {
      titre.textContent = "Créer un compte";
      btn.textContent = "Créer mon compte";
      switchText.textContent = "Déjà un compte ?";
      switchA.textContent = "Se connecter";
      document.getElementById("password").autocomplete = "new-password";
    }
    msg.style.display = "none";
  }

  switchA.addEventListener("click", function(e){ e.preventDefault(); basculer(); });

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;
    if (!email || !password){ afficher("Remplis les deux champs.", false); return; }
    var url = (mode === "login") ? "/api/login" : "/api/register";
    btn.disabled = true;
    fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email: email, password: password})
    }).then(function(r){ return r.json().then(function(j){ return {s:r.status, j:j}; }); })
      .then(function(res){
        if (res.s === 200 && res.j.ok){
          afficher(res.j.message || "Connexion réussie…", true);
          setTimeout(function(){ window.location.href = "/"; }, 700);
        } else {
          afficher(res.j.error || "Erreur.", false);
        }
      })
      .catch(function(){ afficher("Serveur injoignable.", false); })
      .finally(function(){ btn.disabled = false; });
  });
})();
</script>
</body>
</html>
"""




@app.route("/health")
def health():
    info = {"ok": True, "pg": USE_PG}
    try:
        import psycopg2
        info["psycopg2"] = psycopg2.__version__
    except Exception as e:
        info["psycopg2"] = "absent"
    try:
        c = db()
        c.execute("SELECT 1")
        c.close()
        info["db"] = "ok"
    except Exception as e:
        info["db"] = str(e)[:300]
    return jsonify(info)


INTRO_SCRIPT = (
    "Bienvenue sur Quai, l'application de révision du Brevet de Technicien. "
    "Tu es en filière Transport, Logistique et Transit, une filière d'avenir. "
    "La logistique, c'est faire circuler les marchandises, l'information et l'argent, partout dans le monde. "
    "Le port d'Abidjan est le premier port d'Afrique de l'Ouest : c'est la porte du Sahel. "
    "La douane représente une grande part des recettes de l'État ivoirien. "
    "Quatre secteurs : le routier, le ferroviaire, le maritime et l'aérien. "
    "Deux modules : l'UEG, l'enseignement général, et l'UEP, l'enseignement professionnel. "
    "Le BT, c'est le Brevet de Technicien, le diplôme qui ouvre les portes. "
    "Dans l'application : quarante-cinq matières, quarante-quatre cours, des fiches, des quiz, des jeux et un coach intelligent. "
    "Union, discipline, marasse. "
    "Quai a été créé pour t'aider à réussir ton BT : des fiches à retenir, des cartes, un suivi, et une voix qui t'accompagne. "
    "Les prochaines mises à jour : des examens blancs, plus de cours, et le mode hors-ligne. "
    "Bonne chance pour le BT."
)


@app.route("/api/intro-audio")
@login_required
def intro_audio():
    # 1) PostgreSQL (persistant)
    m = media_get("intro:audio")
    if m:
        mime, data = m
        return Response(data, mimetype=mime)
    # 2) disque
    chemin = os.path.join(BASE, "intro.mp3")
    if not os.path.exists(chemin):
        if not ELEVEN_API_KEY:
            return jsonify(ok=False, error="Voix non configurée."), 503
        try:
            req = _ur.Request(
                "https://api.elevenlabs.io/v1/text-to-speech/" + ELEVEN_VOICE_ID,
                data=_json.dumps({"text": INTRO_SCRIPT, "model_id": "eleven_multilingual_v2"}).encode(),
                headers={"xi-api-key": ELEVEN_API_KEY, "Content-Type": "application/json"},
                method="POST")
            with _ur.urlopen(req, timeout=120) as r:
                audio = r.read()
            with open(chemin, "wb") as f:
                f.write(audio)
        except Exception as e:
            return jsonify(ok=False, error=str(e)[:200]), 502
    with open(chemin, "rb") as f:
        audio = f.read()
    media_put("intro:audio", "audio/mpeg", audio)
    return Response(audio, mimetype="audio/mpeg")


@app.route("/login")
def login_page():
    if utilisateur_connecte():
        return redirect("/")
    return render_template_string(LOGIN_HTML)


# --------------------------------------------------------------------------
# API d'authentification
# --------------------------------------------------------------------------
@app.route("/api/register", methods=["POST"])
def api_register():
    ip = request.remote_addr or "?"
    if trop_de_tentatives(ip):
        return jsonify(ok=False, error="Trop de tentatives. Réessaie dans 5 minutes."), 429

    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not EMAIL_RE.match(email) or len(email) > 254:
        enregistrer_tentative(ip)
        return jsonify(ok=False, error="Adresse email invalide."), 400
    if len(password) < 8 or len(password) > 200:
        enregistrer_tentative(ip)
        return jsonify(ok=False, error="Le mot de passe doit faire au moins 8 caractères."), 400

    conn = db()
    try:
        conn.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            (email, bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode())
        )
        conn.commit()
        row = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    except Exception as e:
        conn.close()
        enregistrer_tentative(ip)
        msg = str(e).lower()
        if isinstance(e, sqlite3.IntegrityError) or "unique" in msg or "duplicate" in msg:
            return jsonify(ok=False, error="Un compte existe déjà avec cet email."), 409
        return jsonify(ok=False, error="Erreur lors de la création du compte."), 500
    finally:
        conn.close()

    session.clear()
    session["user_id"] = row["id"]
    session.permanent = False
    return jsonify(ok=True, message="Compte créé. Bienvenue !")


@app.route("/api/login", methods=["POST"])
def api_login():
    ip = request.remote_addr or "?"
    if trop_de_tentatives(ip):
        return jsonify(ok=False, error="Trop de tentatives. Réessaie dans 5 minutes."), 429

    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    conn = db()
    row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if row is None:
        conn.close()
        enregistrer_tentative(ip)
        # message volontairement générique (anti-énumération)
        return jsonify(ok=False, error="Email ou mot de passe incorrect."), 401

    if not bcrypt.checkpw(password.encode(), row["password_hash"].encode()):
        conn.close()
        enregistrer_tentative(ip)
        return jsonify(ok=False, error="Email ou mot de passe incorrect."), 401

    conn.execute("UPDATE users SET last_login = datetime('now') WHERE id = ?", (row["id"],))
    conn.commit()
    conn.close()

    session.clear()
    session["user_id"] = row["id"]
    return jsonify(ok=True, message="Connexion réussie.")


@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.clear()
    return jsonify(ok=True)


@app.route("/api/me")
def api_me():
    uid = utilisateur_connecte()
    if not uid:
        return jsonify(ok=False), 401
    conn = db()
    row = conn.execute("SELECT email, created_at FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    if not row:
        session.clear()
        return jsonify(ok=False), 401
    return jsonify(ok=True, email=row["email"], since=row["created_at"])


# --------------------------------------------------------------------------
# API IA — les clés restent STRICTEMENT côté serveur
# --------------------------------------------------------------------------
import json as _json
import urllib.request as _ur

SYSTEM_COACH = (
    "Tu es « Coach », le copilote d'étude d'un élève de Terminale "
    "Transport Logistique Transit (TLT) du LPCC Cocody, Abidjan. "
    "Réponds en français, avec des phrases courtes et concrètes. "
    "Tu ne donnes jamais la réponse directe d'un exercice : tu guides par des "
    "questions. Si une information ne vient pas d'un cours de l'élève, préfixe-la "
    "exactement par « [Complément pratique non mentionné dans vos cours] : ». "
    "TLT signifie exclusivement « Transport Logistique Transit »."
)


def _env(cle):
    chemin = os.path.join(BASE, ".env")
    if os.path.exists(chemin):
        with open(chemin, encoding="utf-8") as f:
            for ligne in f:
                ligne = ligne.strip()
                if ligne.startswith(cle + "="):
                    return ligne.split("=", 1)[1].strip()
    return os.environ.get(cle, "")


def _post_json(url, charge, entetes=None, timeout=60):
    donnees = _json.dumps(charge).encode()
    entetes = {"Content-Type": "application/json", **(entetes or {})}
    req = _ur.Request(url, data=donnees, headers=entetes, method="POST")
    with _ur.urlopen(req, timeout=timeout) as r:
        return _json.loads(r.read().decode("utf-8", "replace"))


@app.route("/api/ai/chat", methods=["POST"])
@login_required
def api_ai_chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()[:4000]
    if not message:
        return jsonify(ok=False, error="Message vide."), 400
    cle = _env("DEEPSEEK_API_KEY")
    if not cle:
        return jsonify(ok=False, error="Clé DeepSeek non configurée."), 503
    try:
        r = _post_json(
            "https://api.deepseek.com/chat/completions",
            {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": SYSTEM_COACH},
                    {"role": "user", "content": message},
                ],
                "max_tokens": 900,
            },
            {"Authorization": "Bearer " + cle},
        )
        return jsonify(ok=True, answer=r["choices"][0]["message"]["content"])
    except Exception as e:
        return jsonify(ok=False, error="IA indisponible : %s" % e), 502


@app.route("/api/ai/search", methods=["POST"])
@login_required
def api_ai_search():
    data = request.get_json(silent=True) or {}
    query = (data.get("query") or "").strip()[:300]
    if not query:
        return jsonify(ok=False, error="Requête vide."), 400
    cle = _env("TAVILY_API_KEY")
    if not cle:
        return jsonify(ok=False, error="Clé Tavily non configurée."), 503
    try:
        r = _post_json(
            "https://api.tavily.com/search",
            {"api_key": cle, "query": query, "max_results": 5},
        )
        return jsonify(ok=True, results=r.get("results", []))
    except Exception as e:
        return jsonify(ok=False, error="Recherche indisponible : %s" % e), 502



def _image_cloudflare(prompt):
    """Génère une image via Cloudflare Workers AI (FLUX.1 schnell) — gratuit."""
    acc = _env("CF_ACCOUNT_ID")
    tokens = [t for t in (_env("CF_API_TOKEN"), _env("CF_API_TOKEN_2")) if t]
    if not (acc and tokens):
        return None
    import base64
    global _CF_ROTATION
    url = ("https://api.cloudflare.com/client/v4/accounts/"
           + acc + "/ai/run/@cf/black-forest-labs/flux-1-schnell")
    # Rotation équitable + repli sur l'autre clé en cas d'échec (garde-fou)
    n = len(tokens)
    for essai in range(n):
        tok = tokens[(_CF_ROTATION + essai) % n]
        try:
            req = _ur.Request(
                url,
                data=_json.dumps({"prompt": prompt, "steps": 4}).encode(),
                headers={"Authorization": "Bearer " + tok,
                         "Content-Type": "application/json"},
                method="POST")
            with _ur.urlopen(req, timeout=90) as r:
                rep = _json.loads(r.read().decode("utf-8", "replace"))
            b64 = (rep.get("result") or {}).get("image")
            if b64:
                _CF_ROTATION = (_CF_ROTATION + essai + 1) % n
                return "data:image/jpeg;base64," + b64
        except Exception:
            continue
    return None



def _sauver_et_url(empreinte, chemin, b64, source):
    """Sauvegarde l'image sur disque et renvoie une URL légère (cache navigateur)."""
    import base64 as _b64
    octets = _b64.b64decode(b64)
    try:
        if not os.path.exists(chemin):
            with open(chemin, "wb") as f:
                f.write(octets)
    except Exception:
        pass
    media_put("img:" + empreinte + ".jpg", "image/jpeg", octets)
    return jsonify(ok=True, source=source,
                   url="/img/" + empreinte + ".jpg",
                   image="data:image/jpeg;base64," + b64)


@app.route("/img/<path:nom>")
@login_required
def img_cache(nom):
    # 1) PostgreSQL (persistant)
    m = media_get("img:" + nom)
    if m:
        mime, data = m
        return Response(data, mimetype=mime)
    # 2) disque (local)
    return send_from_directory(os.path.join(BASE, "images"), nom)


@app.route("/api/ai/image", methods=["POST"])
@login_required
def api_ai_image():
    """Génération d'images GRATUITE via Pollinations.ai (aucune clé requise),
    avec cache local pour éviter la limite (1 image / 45 s)."""
    data = request.get_json(silent=True) or {}
    prompt = (data.get("prompt") or "").strip()[:500]
    if not prompt:
        return jsonify(ok=False, error="Prompt vide."), 400

    style = (
        "photoréaliste, cinématographique, lumière dorée, décor réel de Côte "
        "d'Ivoire (port d'Abidjan, aéroport FHB, rails SITARAIL, entrepôts), "
        "aucun texte, aucun logo, aucun filigrane, format 16:9, "
    )
    complet = style + prompt

    import base64
    import hashlib
    import urllib.parse as _up
    import urllib.error as _ue

    dossier = os.path.join(BASE, "images")
    os.makedirs(dossier, exist_ok=True)
    empreinte = hashlib.sha256(complet.encode()).hexdigest()[:24]
    chemin = os.path.join(dossier, empreinte + ".jpg")

    # 1) Cache local
    if os.path.exists(chemin):
        with open(chemin, "rb") as f:
            octets = f.read()
        return _sauver_et_url(empreinte, chemin, base64.b64encode(octets).decode(), "cache")

    # 1bis) Cloudflare Workers AI (gratuit, rapide) si configuré
    try:
        img_cf = _image_cloudflare(complet)
        if img_cf:
            b64 = img_cf.split(",", 1)[-1]
            return _sauver_et_url(empreinte, chemin, b64, "cloudflare")
    except Exception:
        pass

    # 2) Tentative Gemini (si le quota le permet)
    cle = _env("GEMINI_API_KEY")
    if cle:
        try:
            r = _post_json(
                "https://generativelanguage.googleapis.com/v1beta/models/"
                "gemini-3.1-flash-image:generateContent?key=" + cle,
                {
                    "contents": [{"parts": [{"text": complet}]}],
                    "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
                },
                timeout=90,
            )
            parties = r.get("candidates", [{}])[0].get("content", {}).get("parts", [])
            for p in parties:
                inline = p.get("inlineData") or p.get("inline_data")
                if inline and inline.get("data"):
                    mime = inline.get("mimeType", "image/png")
                    return _sauver_et_url(empreinte, chemin, inline["data"], "gemini")
        except Exception:
            pass

    # 3) Pollinations.ai — gratuit
    url = ("https://image.pollinations.ai/prompt/" + _up.quote(complet)
           + "?width=1024&height=576&seed=" + str(int(time.time())))
    try:
        with _ur.urlopen(url, timeout=90) as r:
            octets = r.read()
    except _ue.HTTPError as e:
        if e.code == 402:
            return jsonify(ok=False,
                           error="Limite gratuite atteinte (1 image / 45 s). Réessaie dans un instant."), 429
        return jsonify(ok=False, error="Génération indisponible : HTTP %s" % e.code), 502
    except Exception as e:
        return jsonify(ok=False, error="Génération indisponible : %s" % e), 502

    try:
        with open(chemin, "wb") as f:
            f.write(octets)
    except Exception:
        pass

    return _sauver_et_url(empreinte, chemin, base64.b64encode(octets).decode(), "pollinations")


# --------------------------------------------------------------------------
# Fiche « À retenir » générée par DeepSeek
# --------------------------------------------------------------------------
PROMPT_FICHE = (
    "Tu es un professeur expert en Transport Logistique Transit (TLT). "
    "À partir du COURS ci-dessous, produis une fiche « À RETENIR » compacte. "
    "Réponds UNIQUEMENT en JSON valide (sans texte autour, sans markdown, sans ```), "
    "avec exactement ces clés : "
    '"points" (tableau de 5 points essentiels, phrases courtes et précises), '
    '"formules" (tableau de max 4 formules ou définitions clés), '
    '"sigles" (tableau de max 6 chaînes "SIGLE : signification"), '
    '"pieges" (tableau de max 3 pièges ou confusions fréquentes à l\'examen), '
    '"mnemo" (une chaîne : 1 moyen mnémotechnique en une phrase). '
    "COURS :\n"
)


def _extraire_json(texte):
    """Récupère l'objet JSON dans une réponse qui peut contenir du texte parasite."""
    debut = texte.find("{")
    fin = texte.rfind("}")
    if debut == -1 or fin == -1 or fin <= debut:
        return None
    try:
        return _json.loads(texte[debut:fin + 1])
    except Exception:
        # tentative de réparation : dernier } valide
        for f in range(fin, debut, -1):
            if texte[f] == "}":
                try:
                    return _json.loads(texte[debut:f + 1])
                except Exception:
                    continue
        return None


@app.route("/api/ai/fiche", methods=["POST"])
@login_required
def api_ai_fiche():
    data = request.get_json(silent=True) or {}
    texte = (data.get("texte") or "").strip()
    titre = (data.get("titre") or "").strip()[:120]
    if len(texte) < 80:
        return jsonify(ok=False, error="Cours trop court pour générer une fiche."), 400
    cle = _env("DEEPSEEK_API_KEY")
    if not cle:
        return jsonify(ok=False, error="Clé DeepSeek non configurée."), 503

    morceau = texte[:12000]
    try:
        r = _post_json(
            "https://api.deepseek.com/chat/completions",
            {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": "Tu réponds toujours en JSON strict."},
                    {"role": "user", "content": PROMPT_FICHE + titre + "\n" + morceau},
                ],
                "max_tokens": 1100,
                "temperature": 0.3,
            },
            {"Authorization": "Bearer " + cle},
            timeout=120,
        )
        contenu = r["choices"][0]["message"]["content"]
        fiche = _extraire_json(contenu)
        if not fiche:
            return jsonify(ok=False, error="L'IA n'a pas renvoyé un JSON valide."), 502
        return jsonify(ok=True, fiche=fiche)
    except Exception as e:
        return jsonify(ok=False, error="Génération indisponible : %s" % e), 502


# --------------------------------------------------------------------------
# Voix off — Piper (vraie voix française, locale, gratuite)
# --------------------------------------------------------------------------
_CF_ROTATION = 0
PIPER_BIN = os.path.join(os.path.expanduser("~"), "piper", "piper", "piper")
PIPER_MODEL = os.path.join(os.path.expanduser("~"), "piper", "fr_FR-siwis-medium.onnx")
PIPER_MODEL_EN = os.path.join(os.path.expanduser("~"), "piper", "en_US-lessac-medium.onnx")


@app.route("/api/tts", methods=["POST"])
@login_required
def api_tts():
    data = request.get_json(silent=True) or {}
    texte = (data.get("text") or "").strip()[:1200]
    if not texte:
        return jsonify(ok=False, error="Texte vide."), 400
    try:
        vitesse = float(data.get("speed") or 1.0)
    except Exception:
        vitesse = 1.0
    vitesse = max(0.25, min(4.0, vitesse))
    lang = (data.get("lang") or "fr").strip().lower()

    import base64

    # 0) ElevenLabs (voix principale, cachee pour economiser les credits)
    if ELEVEN_API_KEY:
        try:
            cache_dir = os.path.join(BASE, "tts_cache")
            os.makedirs(cache_dir, exist_ok=True)
            import hashlib
            h = hashlib.md5((ELEVEN_VOICE_ID + "|" + texte + "|" + str(vitesse)).encode()).hexdigest()
            f_cache = os.path.join(cache_dir, h + ".mp3")
            if os.path.exists(f_cache):
                with open(f_cache, "rb") as f:
                    audio = f.read()
            else:
                req = _ur.Request(
                    "https://api.elevenlabs.io/v1/text-to-speech/" + ELEVEN_VOICE_ID,
                    data=_json.dumps({"text": texte, "model_id": "eleven_multilingual_v2"}).encode(),
                    headers={"xi-api-key": ELEVEN_API_KEY, "Content-Type": "application/json"},
                    method="POST")
                with _ur.urlopen(req, timeout=60) as r:
                    audio = r.read()
                if audio:
                    try:
                        with open(f_cache, "wb") as f:
                            f.write(audio)
                    except Exception:
                        pass
            if audio:
                return jsonify(ok=True, source="elevenlabs",
                               audio="data:audio/mpeg;base64," + base64.b64encode(audio).decode())
        except Exception:
            pass

    # 1) Edge TTS — repli gratuit (aucune cle)
    try:
        import asyncio
        import tempfile
        import edge_tts

        voix = "en-US-AriaNeural" if lang.startswith("en") else "fr-FR-DeniseNeural"
        pct = int(round((vitesse - 1.0) * 100))
        pct = max(-50, min(100, pct))
        rate = ("+%d%%" % pct) if pct >= 0 else ("%d%%" % pct)

        fd, chemin = tempfile.mkstemp(suffix=".mp3")
        os.close(fd)
        try:
            async def _gen():
                c = edge_tts.Communicate(texte, voix, rate=rate)
                await c.save(chemin)
            asyncio.run(_gen())
            with open(chemin, "rb") as f:
                audio = f.read()
            if audio:
                return jsonify(ok=True, audio="data:audio/mpeg;base64," + base64.b64encode(audio).decode())
        finally:
            try:
                os.unlink(chemin)
            except Exception:
                pass
    except Exception:
        pass

    # 2) Repli Piper (si installe localement)
    length_scale = round(1.0 / vitesse, 2)
    modele = PIPER_MODEL_EN if lang.startswith("en") else PIPER_MODEL
    if os.path.exists(PIPER_BIN) and os.path.exists(modele):
        import subprocess
        import tempfile
        fd, chemin = tempfile.mkstemp(suffix=".wav")
        os.close(fd)
        try:
            proc = subprocess.run(
                [PIPER_BIN, "--model", modele, "--length_scale", str(length_scale),
                 "--output_file", chemin],
                input=texte.encode("utf-8"), capture_output=True, timeout=120,
            )
            if proc.returncode == 0:
                with open(chemin, "rb") as f:
                    audio = f.read()
                return jsonify(ok=True, audio="data:audio/wav;base64," + base64.b64encode(audio).decode())
        finally:
            try:
                os.unlink(chemin)
            except Exception:
                pass

    return jsonify(ok=False, error="Voix indisponible."), 502


@app.route("/api/tts/status")
@login_required
def api_tts_status():
    try:
        import edge_tts  # noqa
        return jsonify(ok=True, voice="Edge TTS (fr-FR-DeniseNeural)")
    except Exception:
        ok = os.path.exists(PIPER_BIN) and os.path.exists(PIPER_MODEL)
        return jsonify(ok=ok, voice="fr_FR-siwis-medium" if ok else None)


# --------------------------------------------------------------------------
# Cours importés (DOcuments extraits et classés)
# --------------------------------------------------------------------------
@app.route("/api/cours")
@login_required
def api_cours():
    chemin = os.path.join(BASE, "cours_data.json")
    if not os.path.exists(chemin):
        return jsonify(ok=False, error="Aucun cours importé."), 404
    with open(chemin, encoding="utf-8") as f:
        data = _json.load(f)
    return jsonify(ok=True, total=len(data), cours=data)


# --------------------------------------------------------------------------
# Fichiers statiques protégés
# --------------------------------------------------------------------------
@app.route("/")
@login_required
def index():
    return send_from_directory(BASE, "index.html")


FICHIERS_AUTORISES = {"index.html", "style.css", "app.js", "manifest.json", "icon.svg", "sw.js"}


@app.route("/<path:nom>")
def statique(nom):
    """N'expose QUE les fichiers de l'application (jamais server.py, la base,
    ni la clé de session). Les fichiers PWA sont publics (nécessaires à
    l'installation avant connexion)."""
    if nom == "index.html":
        return redirect("/")
    if nom not in FICHIERS_AUTORISES:
        abort(404)
    if nom in ("manifest.json", "icon.svg", "sw.js"):
        return send_from_directory(BASE, nom)
    if not utilisateur_connecte():
        return redirect("/login")
    return send_from_directory(BASE, nom)


if __name__ == "__main__":
    os.chmod(SECRET_FILE, 0o600) if os.path.exists(SECRET_FILE) else None
    init_db()
    print("LPCC Companion sécurisé — http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=False)
