#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrait le texte de tous les cours (DOCX, ODT, PDF) de la clé USB et du disque."""
import os
import re
import json
import html
import zipfile
import subprocess

SORTIE = os.path.expanduser("~/lpcc-app-aider/cours_json")
os.makedirs(SORTIE, exist_ok=True)

SOURCES = [
    "/media/mrnocky/LINUX MINT1",
    os.path.expanduser("~/Documents"),
]

# Dossiers à ignorer (installation Linux Mint, etc.)
IGNORES = ("dists", "pool", "System Volume Information", ".Trash", "autorun.inf")


def texte_docx(chemin):
    with zipfile.ZipFile(chemin) as z:
        xml = z.read("word/document.xml").decode("utf-8", "replace")
    xml = xml.replace("</w:p>", "\n").replace("</w:tr>", "\n")
    texte = re.sub(r"<[^>]+>", "", xml)
    return html.unescape(texte)


def texte_odt(chemin):
    with zipfile.ZipFile(chemin) as z:
        xml = z.read("content.xml").decode("utf-8", "replace")
    xml = xml.replace("</text:p>", "\n").replace("</text:h>", "\n")
    texte = re.sub(r"<[^>]+>", "", xml)
    return html.unescape(texte)


def texte_pdf(chemin):
    try:
        r = subprocess.run(["pdftotext", "-layout", chemin, "-"],
                           capture_output=True, timeout=60)
        return r.stdout.decode("utf-8", "replace")
    except Exception as e:
        return "[erreur PDF: %s]" % e


def extraire(chemin):
    ext = chemin.lower().rsplit(".", 1)[-1]
    try:
        if ext == "docx":
            return texte_docx(chemin)
        if ext == "odt":
            return texte_odt(chemin)
        if ext == "pdf":
            return texte_pdf(chemin)
    except Exception as e:
        return "[erreur: %s]" % e
    return ""


def ignorer(chemin):
    base = os.path.basename(chemin)
    if base.startswith("~$") or base.startswith("."):
        return True
    for d in IGNORES:
        if ("/" + d + "/") in chemin:
            return True
    return False


def main():
    trouves = []
    for src in SOURCES:
        if not os.path.isdir(src):
            continue
        for racine, dossiers, fichiers in os.walk(src):
            for f in fichiers:
                if f.lower().endswith((".docx", ".odt", ".pdf")):
                    chemin = os.path.join(racine, f)
                    if ignorer(chemin):
                        continue
                    trouves.append(chemin)

    index = []
    for i, chemin in enumerate(sorted(trouves), 1):
        texte = extraire(chemin)
        texte = re.sub(r"[ \t]+", " ", texte)
        texte = re.sub(r"\n{3,}", "\n\n", texte).strip()

        rel = chemin.replace("/media/mrnocky/LINUX MINT1/", "").replace(
            os.path.expanduser("~/Documents/"), "Documents/")
        dossier = os.path.dirname(rel) or "."

        fichier = "%03d.json" % i
        with open(os.path.join(SORTIE, fichier), "w", encoding="utf-8") as f:
            json.dump({"fichier": rel, "dossier": dossier,
                       "caracteres": len(texte), "texte": texte},
                      f, ensure_ascii=False, indent=1)

        index.append({"fichier": rel, "dossier": dossier,
                      "caracteres": len(texte), "json": fichier})
        print("  %3d. %-6d car.  %s" % (i, len(texte), rel))

    with open(os.path.join(SORTIE, "_index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=1)

    print("\n  TOTAL : %d documents extraits" % len(index))
    print("  Dossier : %s" % SORTIE)


if __name__ == "__main__":
    main()
