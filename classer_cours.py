#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Classe les cours extraits par niveau (1BT/2BT/3BT) et par matière."""
import os
import json
import unicodedata

DOSSIER = os.path.expanduser("~/lpcc-app-aider/cours_json")
INDEX = os.path.join(DOSSIER, "_index.json")


def sans_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn").lower()


# Règles matière (l'ordre compte : le premier qui matche gagne)
REGLES = [
    (["tfmv", "transport ferroviaire", "sitara", "contraintes reglementaires"], "TFMV"),
    (["gde", "entrepot", "emplacement", "pictogramme", "magasinage"], "GDE"),
    (["cmc", "monde contemporain"], "CMC"),
    (["transport aerien", "plan de transport aerien", "tma"], "TAM"),
    (["revisions calcul", "calcul", "mathematique", "maths"], "Maths"),
    (["informatique", "d info", "clavier", "traitement de texte"], "Informatique Appliquée"),
    (["tef", "terme d articulation", "participe", "expression ecrite"], "TEF"),
    (["amtt", "affectation", "silhouette", "securite au travail",
      "moyens de transport terrestre", "enonce de competence"], "AMTT"),
    (["agent economique", "les besoins et les biens", "economie generale",
      "activite economique", "relations entre les differents agent"], "Économie Générale"),
    (["politique commerciale", "financement", "approvisionnement",
      "fonction technique", "economie d entreprise", "fonction de l entreprise",
      "eclo"], "Économie d'Entreprise"),
    (["donneur d ordre", "accueil", "communication"], "Communication"),
    (["itineraire", "grands ports", "les ports", "port autonome",
      "ec 10", "ec11", "ec 13"], "Itinéraires & Exploitation"),
    (["introduction"], "TFMV"),
]


def matiere(dossier, fichier, texte):
    # Corrections manuelles (fichiers ambigus vérifiés un par un)
    overrides = {
        "CHAPITRE II LES AGENT ECONOMIQUES ET LEUR OPERATIONS.pdf": "Économie Générale",
        "2BT TLT/CHAPITRE 2 LE FINANCEMENT.pdf": "Économie d'Entreprise",
        "Documents/untitled_1.odt": "TEF",
        "Chapitre 3 Les fonctions de l.pdf": "Économie d'Entreprise",
    }
    if fichier in overrides:
        return overrides[fichier]

    cible = sans_accents(dossier + " " + fichier + " " + texte[:900])
    dossier_n = sans_accents(dossier)
    for mots, mat in REGLES:
        for m in mots:
            if m in cible:
                return mat
    if "2bt tlt" in dossier_n:
        return "Économie d'Entreprise"
    if "amtt" in dossier_n:
        return "AMTT"
    if "gde" in dossier_n:
        return "GDE"
    return "À classer"


def niveau(dossier):
    d = sans_accents(dossier)
    if d.startswith("documents/"):
        return "3BT"
    if "1bt" in d and "2bt" in d:
        return "1BT + 2BT"
    if "2bt" in d:
        return "2BT"
    if "1bt" in d:
        return "1BT"
    if "tef" in d:
        return "2BT"
    if "economie d entreprise" in d:
        return "2BT"
    return "3BT"


def main():
    index = json.load(open(INDEX, encoding="utf-8"))
    classes = []
    for item in index:
        data = json.load(open(os.path.join(DOSSIER, item["json"]), encoding="utf-8"))
        texte = data.get("texte", "")
        # Fichiers vides / trop courts -> ignorés
        if len(texte.strip()) < 80:
            continue
        m = matiere(item["dossier"], item["fichier"], texte)
        n = niveau(item["dossier"])
        classes.append({
            "fichier": item["fichier"],
            "dossier": item["dossier"],
            "niveau": n,
            "matiere": m,
            "caracteres": item["caracteres"],
            "texte": texte[:20000],
        })

    classes.sort(key=lambda c: (c["niveau"], c["matiere"], c["fichier"]))
    with open(os.path.join(DOSSIER, "cours_classes.json"), "w", encoding="utf-8") as f:
        json.dump(classes, f, ensure_ascii=False, indent=1)

    print("  %d cours classés\n" % len(classes))
    from collections import Counter
    for niv in ["3BT", "2BT", "1BT", "1BT + 2BT", "?"]:
        sous = [c for c in classes if c["niveau"] == niv]
        if not sous:
            continue
        print("=== %s (%d) ===" % (niv, len(sous)))
        for c in sous:
            print("   [%-22s] %s" % (c["matiere"], c["fichier"]))
        print()


if __name__ == "__main__":
    main()
