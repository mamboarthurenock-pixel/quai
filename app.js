(function(){
  "use strict";

  /* ============================================================
     DONNÉES
     ============================================================ */

  // Emploi du temps : jour 1 = lundi ... 5 = vendredi
  const SCHEDULE = {
    1: [
      {start:"07:30", end:"09:10", subject:"TRF", teacher:"Mme Kouacou"},
      {start:"09:10", end:"10:50", subject:"Droit", teacher:"Mme Kouassi"},
      {start:"10:50", end:"12:30", subject:"GOL", teacher:"M. Yao Kouassi"},
      {start:"13:20", end:"14:10", subject:"CMC", teacher:"Mme Koné"},
      {start:"14:10", end:"15:00", subject:"TEF", teacher:"M. Jean-Baptiste"}
    ],
    2: [
      {start:"07:30", end:"09:10", subject:"TEF", teacher:"M. Jean-Baptiste"},
      {start:"09:10", end:"10:50", subject:"TRM", teacher:"Mme Bamba"},
      {start:"10:50", end:"12:30", subject:"Éco Ent", teacher:"Mme Kaba"},
      {start:"13:20", end:"15:00", subject:"EPS", teacher:"M. Nahanonan"}
    ],
    3: [
      {start:"07:30", end:"10:50", subject:"TMM", teacher:"M. Yao Konan"},
      {start:"10:50", end:"12:30", subject:"Entrepreneuriat", teacher:"M. Kamaté"}
    ],
    4: [
      {start:"07:30", end:"09:10", subject:"GDOD", teacher:"M. Drouin"},
      {start:"09:10", end:"10:50", subject:"Maths", teacher:"Mme Toussea"},
      {start:"10:50", end:"12:30", subject:"TRV", teacher:"Mme Kouacou"},
      {start:"13:20", end:"15:00", subject:"Éco Gén", teacher:"M. Néné Bi"}
    ],
    5: [
      {start:"07:30", end:"10:50", subject:"TAM", teacher:"M. Esse"},
      {start:"10:50", end:"12:30", subject:"Anglais", teacher:"M. Kouassi Adjoumani"},
      {start:"13:20", end:"15:00", subject:"EPS", teacher:"M. Nahanonan"}
    ]
  };

  const DAY_NAMES = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

  // Matières par niveau
  const SUBJECTS = {
    "3BT": [
      ["ANGLAIS","🇬🇧"],["CMC","📦"],["DROIT","⚖️"],["ÉCO ENT","🏢"],["ÉCO GÉN","📈"],
      ["EDHC","🤝"],["EPS","🏃"],["ENTREPRENEURIAT","💡"],["GDOD","🗂️"],["INFORMATIQUE","💻"],
      ["MATHS","➗"],["TAM","🚢"],["TEF","🚆"],["TRANSPORT FERROVIAIRE","🚄"],
      ["TRANSPORT MARITIME","⚓"],["TRANSPORT ROUTIER SPÉCIFIQUES","🚚"],
      ["TRANSPORT ROUTIER MARCHANDISES ET VOYAGEURS","🚛"],
      ["TRANSPORT ROUTIER MARCHANDISES","📦"],["LOGISTIQUE","🔗"],
      ["TRANSPORT ROUTIER VOYAGEURS","🚌"]
    ],
    "2BT": [
      ["TEF","🚆"],["ANGLAIS","🇬🇧"],["MATHS GÉN","➗"],["MATHS APPLIQUÉES","📐"],
      ["DROIT COMMERCIAL","⚖️"],["ÉCO ENT","🏢"],["ÉCO GÉN","📈"],["INFORMATIQUE","💻"],
      ["EDHC","🤝"],["EPS","🏃"],["CONDUITE","🚗"],["GDOD","🗂️"],["TFMV","🚛"],
      ["GESTION DES ENTREPÔTS","🏭"]
    ],
    "1BT": [
      ["INFORMATIQUE","💻"],["EPS","🏃"],["EDHC","🤝"],["ÉCO ENT","🏢"],["DROIT","⚖️"],
      ["CMC","📦"],["ANGLAIS","🇬🇧"],["ENTREPRENEURIAT","💡"],["VIE FAMILIALE","🏠"],
      ["TEF","🚆"],["MATHS GÉN","➗"],["MATHS APPLIQUÉES","📐"],["CONDUITE","🚗"],
      ["ITINÉRAIRES","🗺️"],["PLANIFICATION TRANSPORT","📅"],["AFFECTATION MOYENS","🚐"],
      ["GESTION DES ENTREPÔTS","🏭"]
    ]
  };

  // Sigles TLT
  const SIGLES = {
    "GDOD":"Gestion Documentaire et Organisation Douanière",
    "TEC":"Tarif Extérieur Commun",
    "DAU":"Déclaration en Détail des Marchandises",
    "DD":"Droit de Douane",
    "RSTA":"Redevance Statistique et d'Assistance Technique",
    "TVA":"Taxe sur la Valeur Ajoutée",
    "PCS":"Prestation de Conditionnement et de Stockage",
    "PCC":"Prestation de Contrôle et de Constatation",
    "PUA":"Prélèvement Unique Additionnel",
    "CIF":"Coût, Assurance et Fret",
    "FOB":"Free On Board (Franco à Bord)",
    "FDI":"Fiche de Déclaration d'Importation",
    "BSC":"Bordereau de Suivi des Cargaisons",
    "SYDAM":"Système de Dédouanement Automatisé des Marchandises",
    "GUCE":"Guichet Unique du Commerce Extérieur",
    "PAA":"Port Autonome d'Abidjan",
    "TC1":"Terminal à Conteneurs 1",
    "TC2":"Terminal à Conteneurs 2",
    "SITARAIL":"Société Internationale de Transport Africain par Rail",
    "GESTOCI":"Société de Gestion des Stocks Pétroliers de Côte d'Ivoire",
    "TPAV":"Terminal à Conteneurs du Port Autonome de Vridi",
    "PCCC":"Programme de Contrôle des Conteneurs et Cargaisons",
    "DEX":"Déclaration d'Exportation",
    "FHB":"Fonds de l'Habitat et de la Banque",
    "CMR":"Convention relative au Contrat de Transport International de Marchandises par Route",
    "OHADA":"Organisation pour l'Harmonisation en Afrique du Droit des Affaires",
    "CNMCI":"Conseil National des Marchandises de Côte d'Ivoire",
    "CEPICI":"Centre de Promotion des Investissements en Côte d'Ivoire",
    "FIDEN":"Fonds d'Investissement et de Développement Économique National"
  };

  // Fiches de préparation par matière (pour l'onglet Soir)
  const FICHES = {
    "TRF":["Réviser les incoterms (FOB, CIF, CMR)","Relire le chapitre sur le transport ferroviaire","Préparer 3 questions pour Mme Kouacou"],
    "Droit":["Revoir les sources du droit","Fiche mémo : hiérarchie des normes","Exercices d'application"],
    "GOL":["Définir la logistique globale","Schéma des flux : approvisionnement → distribution","Relire les notes de M. Yao Kouassi"],
    "CMC":["Réviser la classification douanière","Exercices sur le TEC","Mémoriser les codes SH"],
    "TEF":["Vocabulaire ferroviaire","Relire le cours sur les wagons","Préparer un exposé court"],
    "TRM":["Réviser les types de marchandises","Fiche sur le transport routier marchandises","Exercices de calcul de tonnage"],
    "Éco Ent":["Revoir la notion d'entreprise","Fiche : les formes juridiques","Exercices sur le chiffre d'affaires"],
    "EPS":["Tenue de sport","Hydratation","Échauffement mental"],
    "TMM":["Réviser le transport maritime mondial","Fiche sur les types de navires","Relire les notes de M. Yao Konan"],
    "Entrepreneuriat":["Idée de projet : business model","Fiche sur le plan d'affaires","Préparer une présentation"],
    "GDOD":["Réviser la documentation douanière","Fiche sur le DAU","Relire les notes de M. Drouin"],
    "Maths":["Revoir les pourcentages","Exercices de calcul commercial","Fiche formules"],
    "TRV":["Réviser le transport routier voyageurs","Fiche sur les gares routières","Relire les notes de Mme Kouacou"],
    "Éco Gén":["Revoir les agents économiques","Fiche sur le circuit économique","Exercices d'application"],
    "TAM":["Réviser le transport aérien de marchandises","Fiche sur les types d'avions cargo","Relire les notes de M. Esse"],
    "Anglais":["Vocabulaire transport/logistique","Relire le texte étudié","Préparer 5 phrases d'expression"]
  };

  // Banque de questions du quiz
  const QUIZ_BANK = [
    // ---- GDOD (douanes) ----
    {matiere:"GDOD", q:"Quels sont les 3 éléments déclaratifs en douane ?",
     options:["Espèce, Origine, Valeur","Poids, Volume, Prix","FOB, CAF, CIF","DD, TVA, PCS"],
     bonne:0, explication:"Les 3 éléments déclaratifs sont l'espèce tarifaire, l'origine et la valeur en douane."},
    {matiere:"GDOD", q:"Valeur en douane =",
     options:["FOB seul","CIF = FOB + fret + assurance","Prix de détail","La TVA"],
     bonne:1, explication:"La valeur en douane est la valeur CIF : FOB + fret + assurance."},
    {matiere:"GDOD", q:"Séries de régimes IM :",
     options:["1000/2000/3000","4000/4070/4080/5000/7000/8000","A/B/C","1/2/3"],
     bonne:1, explication:"Les séries de régimes à l'importation sont 4000, 4070, 4080, 5000, 7000 et 8000."},

    // ---- TRF (ferroviaire) ----
    {matiere:"TRF", q:"Quelle est la voie utilisée par SITARAIL ?",
     options:["Voie large","Voie métrique","Voie normale","Voie étroite"],
     bonne:1, explication:"SITARAIL exploite une voie métrique (1,00 m) en Côte d'Ivoire."},
    {matiere:"TRF", q:"Quel type de traction utilise SITARAIL ?",
     options:["Électrique","Thermique diesel","Vapeur","Hybride"],
     bonne:1, explication:"La traction est thermique diesel sur le réseau SITARAIL."},
    {matiere:"TRF", q:"Combien de feuillets compte la liasse DEX ?",
     options:["3","5","7","9"],
     bonne:2, explication:"La liasse DEX (Déclaration d'Exportation) comporte 7 feuillets."},

    // ---- TAM (aérien) ----
    {matiere:"TAM", q:"Que signifie EC 21 ?",
     options:["Élaborer un plan de transport aérien","Évaluer le coût du fret","Envoyer un colis","Établir un contrat"],
     bonne:0, explication:"EC 21 correspond à « Élaborer un plan de transport aérien »."},
    {matiere:"TAM", q:"Quel document accompagne la marchandise en transport aérien ?",
     options:["Connaissement (B/L)","Lettre de transport aérien (LTA / AWB)","Lettre de voiture CMR","DAU"],
     bonne:1, explication:"En aérien, le document de transport est la LTA (Air Waybill)."},
    {matiere:"TAM", q:"Unité de charge typique en aérien :",
     options:["Conteneur 20 pieds","Palette / ULD","Wagon","Citerne"],
     bonne:1, explication:"Les ULD (Unit Load Devices) et palettes sont les unités de charge aériennes."},

    // ---- DROIT ----
    {matiere:"DROIT", q:"Quelle est la norme suprême dans la hiérarchie des normes ?",
     options:["La loi","Le décret","La Constitution","L'arrêté"],
     bonne:2, explication:"La Constitution est au sommet de la hiérarchie des normes."},
    {matiere:"DROIT", q:"Le droit commercial régit :",
     options:["Les relations entre particuliers","Les actes de commerce et commerçants","Le droit pénal","Le droit du travail uniquement"],
     bonne:1, explication:"Le droit commercial encadre les actes de commerce et les commerçants."},
    {matiere:"DROIT", q:"Un contrat est valable s'il réunit :",
     options:["Consentement, capacité, objet, cause","Signature et timbre","Prix et délai","Témoins et notaire"],
     bonne:0, explication:"Les conditions de validité : consentement, capacité, objet certain et cause licite."},

    // ---- TEF ----
    {matiere:"TEF", q:"Le transport ferroviaire est surtout adapté aux :",
     options:["Petits colis urgents","Marchandises lourdes et volumineuses","Voyageurs uniquement","Produits périssables uniquement"],
     bonne:1, explication:"Le ferroviaire est économique pour les charges lourdes sur longues distances."},
    {matiere:"TEF", q:"Un wagon-trémie sert à transporter :",
     options:["Des liquides","Des vracs solides (céréales, minerais)","Des conteneurs","Des voitures"],
     bonne:1, explication:"Le wagon-trémie transporte des vracs solides en vrac."},
    {matiere:"TEF", q:"La lettre de voiture ferroviaire s'appelle :",
     options:["CIM","CMR","B/L","AWB"],
     bonne:0, explication:"La CIM est la lettre de voiture du transport ferroviaire international."},

    // ---- ANG (anglais) ----
    {matiere:"ANG", q:"« Freight forwarder » signifie :",
     options:["Transporteur maritime","Transitaire","Douanier","Capitaine"],
     bonne:1, explication:"Le freight forwarder est le transitaire qui organise le transport."},
    {matiere:"ANG", q:"« Bill of lading » correspond à :",
     options:["Lettre de voiture","Connaissement maritime","Facture","Certificat d'origine"],
     bonne:1, explication:"Le Bill of Lading (B/L) est le connaissement maritime."},
    {matiere:"ANG", q:"« Customs clearance » veut dire :",
     options:["Dédouanement","Chargement","Assurance","Livraison"],
     bonne:0, explication:"Customs clearance = opération de dédouanement."},

    // ---- MATH ----
    {matiere:"MATH", q:"Un article coûte 50 000 FCFA, TVA 18 %. Prix TTC ?",
     options:["59 000 FCFA","58 000 FCFA","60 000 FCFA","55 000 FCFA"],
     bonne:0, explication:"50 000 × 1,18 = 59 000 FCFA."},
    {matiere:"MATH", q:"15 % de 2 000 =",
     options:["200","300","150","250"],
     bonne:1, explication:"2 000 × 0,15 = 300."},
    {matiere:"MATH", q:"Si le fret est 20 % du FOB de 100 000, le fret vaut :",
     options:["10 000","20 000","2 000","120 000"],
     bonne:1, explication:"100 000 × 0,20 = 20 000 FCFA."},

    // ---- ECO ENT ----
    {matiere:"ECO ENT", q:"Le chiffre d'affaires est :",
     options:["Le bénéfice net","Le total des ventes","Les charges","Le capital"],
     bonne:1, explication:"Le chiffre d'affaires représente le total des ventes réalisées."},
    {matiere:"ECO ENT", q:"Une SARL est une société :",
     options:["À responsabilité illimitée","À responsabilité limitée aux apports","Unipersonnelle obligatoire","Sans capital"],
     bonne:1, explication:"Dans une SARL, la responsabilité est limitée aux apports des associés."},
    {matiere:"ECO ENT", q:"Le bilan d'une entreprise comprend :",
     options:["Actif et passif","Recettes et dépenses","Ventes et achats","Salaires et impôts"],
     bonne:0, explication:"Le bilan se compose de l'actif et du passif."}
  ];

  /* ============================================================
     UTILITAIRES
     ============================================================ */

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /* ============================================================
     ICÔNES SVG (inline, hors-ligne)
     ============================================================ */

  const ICONS = {
    ship:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15l1.5-5h15L21 15"/><path d="M5 15v4h14v-4"/><path d="M12 10V4M9 4h6"/><path d="M2 21c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1"/></svg>',
    plane:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a1 1 0 0 0-.9 1.7l6 4.1-2.5 2.5-2.4-.5a1 1 0 0 0-.9 1.6l2.5 2.5 2.5 2.5a1 1 0 0 0 1.6-.9l-.5-2.4 2.5-2.5 4.1 6a1 1 0 0 0 1.7-.9z"/></svg>',
    train:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M8 21l2-4M16 21l-2-4"/></svg>',
    truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h11v9H2z"/><path d="M13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
    container:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M7 6v12M11 6v12M15 6v12M19 6v12"/></svg>',
    scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 21h10"/><path d="M5 7h14"/><path d="M5 7l-3 6a3 3 0 0 0 6 0z"/><path d="M19 7l-3 6a3 3 0 0 0 6 0z"/></svg>',
    stamp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21h14"/><path d="M6 17h12v-2a3 3 0 0 0-3-3h-1V8a2 2 0 1 0-4 0v4H9a3 3 0 0 0-3 3z"/></svg>',
    sigma:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4H6l6 8-6 8h12"/></svg>',
    feather:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-6 0-12 6-12 12v4h4c6 0 12-6 12-12z"/><path d="M4 20l8-8"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
    globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
    bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    cpu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
    run:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="4" r="2"/><path d="M9 21l2-5 3 2 1 3M6 12l3-3 3 1 3-3 3 2"/></svg>',
    handshake:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l4-4 5 5 5-5 4 4"/><path d="M7 8l-4 4 4 4M17 8l4 4-4 4"/></svg>',
    car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l2-5h14l2 5v5h-3M6 18H3v-5"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
    warehouse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-5 9 5v12"/><path d="M7 21v-7h10v7"/><path d="M7 17h10"/></svg>',
    map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4l6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v14M15 6v14"/></svg>',
    calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    bus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/></svg>',
    ruler:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17L17 3l4 4L7 21z"/><path d="M8 12l2 2M11 9l2 2M14 6l2 2"/></svg>',
    briefcase:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>'
  };

  // Associe un mot-clé de matière à une icône SVG
  function iconFor(name){
    const n = name.toLowerCase();
    if(n.includes("maritime") || n.includes("tmm")) return ICONS.ship;
    if(n.includes("aérien") || n.includes("tam")) return ICONS.plane;
    if(n.includes("ferroviaire") || n.includes("tef")) return ICONS.train;
    if(n.includes("routier") || n.includes("trm") || n.includes("trv") || n.includes("tfmv")) return ICONS.truck;
    if(n.includes("conteneur") || n.includes("cmc") || n.includes("logistique")) return ICONS.container;
    if(n.includes("droit")) return ICONS.scale;
    if(n.includes("douan") || n.includes("gdod")) return ICONS.stamp;
    if(n.includes("math")) return ICONS.sigma;
    if(n.includes("anglais")) return ICONS.globe;
    if(n.includes("éco") || n.includes("eco")) return ICONS.chart;
    if(n.includes("entrepreneur")) return ICONS.bulb;
    if(n.includes("informatique")) return ICONS.cpu;
    if(n.includes("eps")) return ICONS.run;
    if(n.includes("edhc") || n.includes("vie familiale")) return ICONS.handshake;
    if(n.includes("conduite")) return ICONS.car;
    if(n.includes("entrepôt") || n.includes("entrepot")) return ICONS.warehouse;
    if(n.includes("itinéraire") || n.includes("itineraire")) return ICONS.map;
    if(n.includes("planification")) return ICONS.calendar;
    if(n.includes("affectation")) return ICONS.bus;
    if(n.includes("gestion")) return ICONS.briefcase;
    return ICONS.book;
  }

  function pad(n){ return String(n).padStart(2,"0"); }

  function toMinutes(hhmm){
    const [h,m] = hhmm.split(":").map(Number);
    return h*60 + m;
  }

  function nowMinutes(d){
    return d.getHours()*60 + d.getMinutes();
  }

  function fmtFCFA(n){
    return new Intl.NumberFormat("fr-FR",{maximumFractionDigits:0}).format(Math.round(n)) + " FCFA";
  }

  function fmtNum(n){
    return new Intl.NumberFormat("fr-FR",{maximumFractionDigits:2}).format(n);
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  /* ============================================================
     STORAGE
     ============================================================ */

  const STORE_KEY = "lpcc_companion_v1";

  function loadStore(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      if(!raw) return {calcCount:0, lastCalc:null, quiz:{}};
      const obj = JSON.parse(raw);
      return Object.assign({calcCount:0, lastCalc:null, quiz:{}}, obj);
    }catch(e){
      return {calcCount:0, lastCalc:null, quiz:{}};
    }
  }

  function saveStore(s){
    try{ localStorage.setItem(STORE_KEY, JSON.stringify(s)); }catch(e){}
  }

  let store = loadStore();

  /* ============================================================
     HEADER : date + horloge
     ============================================================ */

  function updateHeader(){
    const d = new Date();
    const dateStr = d.toLocaleDateString("fr-FR",{
      weekday:"long", day:"numeric", month:"long", year:"numeric"
    });
    $("#todayDate").textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    $("#clock").textContent = pad(d.getHours())+":"+pad(d.getMinutes())+":"+pad(d.getSeconds());
  }

  /* ============================================================
     ONGLET AUJOURD'HUI
     ============================================================ */

  function renderToday(){
    const d = new Date();
    const dayIdx = d.getDay(); // 0 = dimanche
    const courses = SCHEDULE[dayIdx];
    const container = $("#todayContent");

    if(!courses || courses.length === 0){
      container.innerHTML = `
        <div class="empty">
          <div class="big">🌙</div>
          <div>Pas de cours aujourd'hui — ${DAY_NAMES[dayIdx]}.</div>
          <div style="margin-top:6px;font-size:13px">Profite pour préparer la suite dans l'onglet Soir.</div>
        </div>`;
      return;
    }

    const now = nowMinutes(d);
    let currentIdx = -1;
    courses.forEach((c,i) => {
      const s = toMinutes(c.start), e = toMinutes(c.end);
      if(now >= s && now < e) currentIdx = i;
    });

    let html = '<div class="metro"><div class="metro-rail"></div>';
    courses.forEach((c,i) => {
      const s = toMinutes(c.start), e = toMinutes(c.end);
      let cls = "stop";
      if(now >= e) cls += " past";
      else if(now >= s && now < e) cls += " current";

      let badge = "";
      if(cls.includes("current")) badge = '<span class="badge">EN COURS</span>';
      else if(now < s && (currentIdx === -1 || i === currentIdx + 1)) badge = '<span class="badge">À SUIVRE</span>';

      html += `
        <div class="${cls}">
          <div class="time">${c.start}<span class="end">${c.end}</span></div>
          <div class="node"><div class="ring"></div></div>
          <div class="body">
            <div class="subject">${iconFor(c.subject)}${escapeHtml(c.subject)}</div>
            <div class="teacher">${escapeHtml(c.teacher)}</div>
            ${badge}
          </div>
        </div>`;
    });
    html += "</div>";
    container.innerHTML = html;
  }

  /* ============================================================
     ONGLET SOIR
     ============================================================ */

  function renderEvening(){
    const d = new Date();
    const tomorrowIdx = (d.getDay() + 1) % 7;
    const courses = SCHEDULE[tomorrowIdx];
    const container = $("#eveningContent");

    $("#tomorrowDay").innerHTML = "Demain — <b>" + DAY_NAMES[tomorrowIdx] + "</b>";

    if(!courses || courses.length === 0){
      container.innerHTML = `
        <div class="empty">
          <div class="big">☕</div>
          <div>Pas de cours demain (${DAY_NAMES[tomorrowIdx]}).</div>
          <div style="margin-top:6px;font-size:13px">Repose-toi bien.</div>
        </div>`;
      return;
    }

    let html = "";
    courses.forEach(c => {
      const key = c.subject;
      const bullets = FICHES[key] || [
        "Relire le cours et les notes",
        "Préparer les questions à poser",
        "Faire une fiche mémo de 5 lignes"
      ];
      html += `
        <div class="card fiche">
          <h3>${iconFor(c.subject)}${escapeHtml(c.subject)}</h3>
          <div class="meta">${c.start} – ${c.end} · ${escapeHtml(c.teacher)}</div>
          <ul>
            ${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
          </ul>
        </div>`;
    });
    container.innerHTML = html;
  }

  /* ============================================================
     ONGLET COURS
     ============================================================ */

  function renderCourses(filter){
    const q = (filter || "").trim().toLowerCase();
    const container = $("#coursesContent");
    let html = "";

    const levels = [
      {key:"3BT", cls:"lvl-3"},
      {key:"2BT", cls:"lvl-2"},
      {key:"1BT", cls:"lvl-1"}
    ];

    levels.forEach(lv => {
      const items = SUBJECTS[lv.key].filter(([name]) =>
        !q || name.toLowerCase().includes(q)
      );
      if(items.length === 0) return;
      html += `
        <div class="level-group">
          <div class="level-head">
            <span class="level-pill ${lv.cls}">${lv.key}</span>
            <span class="count">${items.length} matière${items.length>1?"s":""}</span>
          </div>
          <div class="subject-list">
            ${items.map(([name]) => `
              <div class="subject-item">
                <span class="ico">${iconFor(name)}</span>
                <span class="name">${escapeHtml(name)}</span>
              </div>`).join("")}
          </div>
        </div>`;
    });

    // Sigles
    const sigleEntries = Object.entries(SIGLES).filter(([code,def]) =>
      !q || code.toLowerCase().includes(q) || def.toLowerCase().includes(q)
    );
    if(sigleEntries.length > 0){
      html += `
        <div class="level-group">
          <div class="level-head">
            <span class="level-pill lvl-3">SIGLES TLT</span>
            <span class="count">${sigleEntries.length} entrée${sigleEntries.length>1?"s":""}</span>
          </div>
          <div class="sigles-grid">
            ${sigleEntries.map(([code,def]) => `
              <div class="sigle">
                <div class="code">${escapeHtml(code)}</div>
                <div class="def">${escapeHtml(def)}</div>
              </div>`).join("")}
          </div>
        </div>`;
    }

    if(!html){
      html = `<div class="empty"><div class="big">🔍</div><div>Aucun résultat pour « ${escapeHtml(filter)} ».</div></div>`;
    }

    container.innerHTML = html;
  }

  /* ============================================================
     ONGLET COACH — Simulateur douanier
     ============================================================ */

  function computeDuty(){
    const fob = parseFloat($("#fob").value) || 0;
    const fret = parseFloat($("#fret").value) || 0;
    const assurance = parseFloat($("#assurance").value) || 0;

    if(fob <= 0){
      alert("Veuillez saisir une valeur FOB supérieure à 0.");
      return;
    }

    const cif = fob + fret + assurance;
    const dd = cif * 0.10;
    const rsta = cif * 0.01;
    const baseTva = cif + dd + rsta;
    const tva = baseTva * 0.18;
    const total = dd + rsta + tva;
    const totalGeneral = cif + total;

    const result = {fob, fret, assurance, cif, dd, rsta, tva, total, totalGeneral};

    const box = $("#dutyResult");
    box.innerHTML = `
      <div class="result-row"><span class="k">Valeur FOB</span><span class="v">${fmtFCFA(fob)}</span></div>
      <div class="result-row"><span class="k">+ Fret</span><span class="v">${fmtFCFA(fret)}</span></div>
      <div class="result-row"><span class="k">+ Assurance</span><span class="v">${fmtFCFA(assurance)}</span></div>
      <div class="result-row"><span class="k"><b>Valeur CIF</b></span><span class="v amber">${fmtFCFA(cif)}</span></div>
      <div class="result-row"><span class="k">Droit de Douane (10 %)</span><span class="v">${fmtFCFA(dd)}</span></div>
      <div class="result-row"><span class="k">RSTA (1 %)</span><span class="v">${fmtFCFA(rsta)}</span></div>
      <div class="result-row"><span class="k">Base TVA (CIF + DD + RSTA)</span><span class="v">${fmtFCFA(baseTva)}</span></div>
      <div class="result-row"><span class="k">TVA (18 %)</span><span class="v">${fmtFCFA(tva)}</span></div>
      <div class="result-row"><span class="k">Total taxes</span><span class="v rose">${fmtFCFA(total)}</span></div>
      <div class="result-row total"><span class="k">Coût total (CIF + taxes)</span><span class="v">${fmtFCFA(totalGeneral)}</span></div>
    `;
    box.classList.add("show");

    store.calcCount = (store.calcCount || 0) + 1;
    store.lastCalc = result;
    saveStore(store);
    $("#calcCount").textContent = store.calcCount;
  }

  function resetDuty(){
    $("#fob").value = "";
    $("#fret").value = "";
    $("#assurance").value = "";
    $("#dutyResult").classList.remove("show");
    $("#dutyResult").innerHTML = "";
  }

  /* ============================================================
     CONVERTISSEUR
     ============================================================ */

  const RATES = {EUR: 656, USD: 605};

  function convert(rate, label){
    const amount = parseFloat($("#convAmount").value) || 0;
    if(amount <= 0){
      alert("Veuillez saisir un montant supérieur à 0.");
      return;
    }
    const result = amount * rate;
    $("#convOut").style.display = "block";
    $("#convBig").textContent = fmtFCFA(result);
    $("#convSmall").textContent = `${fmtNum(amount)} ${label} × ${rate} FCFA`;
  }

  /* ============================================================
     QUIZ
     ============================================================ */

  const QUIZ_MATIERES = ["GDOD","TRF","TAM","DROIT","TEF","ANG","MATH","ECO ENT"];

  let quizState = null;

  function bestKey(matiere){
    return "lpcc_quiz_best_" + matiere;
  }

  function getBest(matiere){
    try{
      const v = localStorage.getItem(bestKey(matiere));
      return v === null ? null : parseInt(v, 10);
    }catch(e){ return null; }
  }

  function setBest(matiere, score){
    try{
      const prev = getBest(matiere);
      if(prev === null || score > prev){
        localStorage.setItem(bestKey(matiere), String(score));
      }
    }catch(e){}
  }

  function renderQuizSelector(){
    const zone = $("#quizZone");
    let html = '<div class="quiz-selector">';
    QUIZ_MATIERES.forEach(m => {
      const best = getBest(m);
      const bestTxt = best === null ? "—" : best + "/20";
      html += `
        <button class="quiz-mat-btn" data-matiere="${escapeHtml(m)}">
          <span class="qm-name">${escapeHtml(m)}</span>
          <span class="qm-best">Record : ${bestTxt}</span>
        </button>`;
    });
    html += "</div>";
    zone.innerHTML = html;

    $$(".quiz-mat-btn").forEach(btn => {
      btn.addEventListener("click", () => startQuiz(btn.dataset.matiere));
    });
  }

  function startQuiz(matiere){
    const questions = QUIZ_BANK.filter(q => q.matiere === matiere);
    if(questions.length === 0){
      renderQuizSelector();
      return;
    }
    quizState = {
      matiere,
      questions,
      index: 0,
      score: 0,
      answered: false
    };
    renderQuizQuestion();
  }

  function renderQuizQuestion(){
    const zone = $("#quizZone");
    const st = quizState;
    const total = st.questions.length;
    const q = st.questions[st.index];
    const progress = Math.round((st.index / total) * 100);

    let html = `
      <div class="quiz-head">
        <span class="quiz-mat">${escapeHtml(st.matiere)}</span>
        <span class="quiz-score">Score : <b>${st.score}</b> / ${total}</span>
      </div>
      <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${progress}%"></div></div>
      <div class="quiz-card">
        <div class="quiz-qnum">Question ${st.index + 1} / ${total}</div>
        <div class="quiz-question">${escapeHtml(q.q)}</div>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt" data-idx="${i}">${escapeHtml(opt)}</button>
          `).join("")}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
      </div>
    `;
    zone.innerHTML = html;

    $$(".quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => answerQuiz(parseInt(btn.dataset.idx, 10)));
    });
  }

  function answerQuiz(idx){
    const st = quizState;
    if(!st || st.answered) return;
    st.answered = true;

    const q = st.questions[st.index];
    const correct = idx === q.bonne;
    if(correct) st.score++;

    $$(".quiz-opt").forEach(btn => {
      const i = parseInt(btn.dataset.idx, 10);
      btn.disabled = true;
      if(i === q.bonne) btn.classList.add("good");
      else if(i === idx) btn.classList.add("bad");
    });

    const fb = $("#quizFeedback");
    fb.innerHTML = `
      <div class="quiz-fb-title ${correct ? "ok" : "ko"}">
        ${correct ? "✅ Bonne réponse !" : "❌ Mauvaise réponse"}
      </div>
      <div class="quiz-fb-exp">${escapeHtml(q.explication)}</div>
      <button class="btn quiz-next" id="quizNextBtn">
        ${st.index + 1 < st.questions.length ? "Question suivante" : "Voir le résultat"}
      </button>
    `;
    fb.classList.add("show");

    $("#quizNextBtn").addEventListener("click", () => {
      st.answered = false;
      st.index++;
      if(st.index >= st.questions.length){
        renderQuizResult();
      } else {
        renderQuizQuestion();
      }
    });
  }

  function renderQuizResult(){
    const st = quizState;
    const total = st.questions.length;
    const note = Math.round((st.score / total) * 20);
    setBest(st.matiere, note);
    const best = getBest(st.matiere);

    let msg;
    if(note >= 16) msg = "Excellent ! Tu maîtrises la matière. 🏆";
    else if(note >= 12) msg = "Bien joué ! Continue comme ça. 👍";
    else if(note >= 8) msg = "Pas mal, mais il faut réviser. 📚";
    else msg = "Courage, révise et recommence ! 💪";

    $("#quizZone").innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-mat">${escapeHtml(st.matiere)}</div>
        <div class="quiz-result-note">${note}<span>/20</span></div>
        <div class="quiz-result-detail">${st.score} bonne${st.score>1?"s":""} réponse${st.score>1?"s":""} sur ${total}</div>
        <div class="quiz-result-msg">${msg}</div>
        <div class="quiz-result-best">Meilleur score : <b>${best}/20</b></div>
        <button class="btn" id="quizRestartBtn">Recommencer</button>
        <button class="btn ghost" id="quizBackBtn">Changer de matière</button>
      </div>
    `;

    $("#quizRestartBtn").addEventListener("click", () => startQuiz(st.matiere));
    $("#quizBackBtn").addEventListener("click", () => {
      quizState = null;
      renderQuizSelector();
    });
  }

  /* ============================================================
     JEUX
     ============================================================ */

  // Banque de questions pour la roue (matières + questions)
  const WHEEL_QUESTIONS = {
    "GDOD": [
      {q:"Quels sont les 3 éléments déclaratifs en douane ?",
       options:["Espèce, Origine, Valeur","Poids, Volume, Prix","FOB, CAF, CIF","DD, TVA, PCS"], bonne:0,
       explication:"Les 3 éléments déclaratifs sont l'espèce tarifaire, l'origine et la valeur en douane."},
      {q:"Valeur en douane =",
       options:["FOB seul","CIF = FOB + fret + assurance","Prix de détail","La TVA"], bonne:1,
       explication:"La valeur en douane est la valeur CIF : FOB + fret + assurance."}
    ],
    "TRF": [
      {q:"Quelle est la voie utilisée par SITARAIL ?",
       options:["Voie large","Voie métrique","Voie normale","Voie étroite"], bonne:1,
       explication:"SITARAIL exploite une voie métrique (1,00 m) en Côte d'Ivoire."},
      {q:"Combien de feuillets compte la liasse DEX ?",
       options:["3","5","7","9"], bonne:2,
       explication:"La liasse DEX (Déclaration d'Exportation) comporte 7 feuillets."}
    ],
    "TAM": [
      {q:"Que signifie EC 21 ?",
       options:["Élaborer un plan de transport aérien","Évaluer le coût du fret","Envoyer un colis","Établir un contrat"], bonne:0,
       explication:"EC 21 correspond à « Élaborer un plan de transport aérien »."},
      {q:"Quel document accompagne la marchandise en transport aérien ?",
       options:["Connaissement (B/L)","Lettre de transport aérien (LTA / AWB)","Lettre de voiture CMR","DAU"], bonne:1,
       explication:"En aérien, le document de transport est la LTA (Air Waybill)."}
    ],
    "DROIT": [
      {q:"Quelle est la norme suprême dans la hiérarchie des normes ?",
       options:["La loi","Le décret","La Constitution","L'arrêté"], bonne:2,
       explication:"La Constitution est au sommet de la hiérarchie des normes."},
      {q:"Un contrat est valable s'il réunit :",
       options:["Consentement, capacité, objet, cause","Signature et timbre","Prix et délai","Témoins et notaire"], bonne:0,
       explication:"Les conditions de validité : consentement, capacité, objet certain et cause licite."}
    ],
    "TEF": [
      {q:"Le transport ferroviaire est surtout adapté aux :",
       options:["Petits colis urgents","Marchandises lourdes et volumineuses","Voyageurs uniquement","Produits périssables uniquement"], bonne:1,
       explication:"Le ferroviaire est économique pour les charges lourdes sur longues distances."},
      {q:"La lettre de voiture ferroviaire s'appelle :",
       options:["CIM","CMR","B/L","AWB"], bonne:0,
       explication:"La CIM est la lettre de voiture du transport ferroviaire international."}
    ],
    "ANG": [
      {q:"« Freight forwarder » signifie :",
       options:["Transporteur maritime","Transitaire","Douanier","Capitaine"], bonne:1,
       explication:"Le freight forwarder est le transitaire qui organise le transport."},
      {q:"« Customs clearance » veut dire :",
       options:["Dédouanement","Chargement","Assurance","Livraison"], bonne:0,
       explication:"Customs clearance = opération de dédouanement."}
    ],
    "MATH": [
      {q:"Un article coûte 50 000 FCFA, TVA 18 %. Prix TTC ?",
       options:["59 000 FCFA","58 000 FCFA","60 000 FCFA","55 000 FCFA"], bonne:0,
       explication:"50 000 × 1,18 = 59 000 FCFA."},
      {q:"15 % de 2 000 =",
       options:["200","300","150","250"], bonne:1,
       explication:"2 000 × 0,15 = 300."}
    ],
    "ECO ENT": [
      {q:"Le chiffre d'affaires est :",
       options:["Le bénéfice net","Le total des ventes","Les charges","Le capital"], bonne:1,
       explication:"Le chiffre d'affaires représente le total des ventes réalisées."},
      {q:"Une SARL est une société :",
       options:["À responsabilité illimitée","À responsabilité limitée aux apports","Unipersonnelle obligatoire","Sans capital"], bonne:1,
       explication:"Dans une SARL, la responsabilité est limitée aux apports des associés."}
    ]
  };

  const WHEEL_MATIERES = Object.keys(WHEEL_QUESTIONS);

  // Couleurs de la roue (cohérentes avec le design)
  const WHEEL_COLORS = [
    "#22d3ee","#a78bfa","#f472b6","#fbbf24",
    "#34d399","#60a5fa","#f87171","#c084fc"
  ];

  // Sigles pour le pendu
  const PENDU_SIGLES = ["GDOD","TEC","DAU","RSTA","TVA","PCS","PCC","PUA","CIF","FOB","SYDAM","GUCE","PAA","SITARAIL","GESTOCI","DEX","FHB","CMR"];

  const GAMES_KEY = "lpcc_games_v1";

  function loadGames(){
    try{
      const raw = localStorage.getItem(GAMES_KEY);
      if(!raw) return {wheelScore:0, penduScore:0, courseBest:0};
      return Object.assign({wheelScore:0, penduScore:0, courseBest:0}, JSON.parse(raw));
    }catch(e){
      return {wheelScore:0, penduScore:0, courseBest:0};
    }
  }

  function saveGames(g){
    try{ localStorage.setItem(GAMES_KEY, JSON.stringify(g)); }catch(e){}
  }

  let gamesStore = loadGames();

  // État des jeux
  let wheelState = null;
  let penduState = null;
  let courseState = null;

  /* ---------- Menu des jeux ---------- */

  function renderGamesMenu(){
    const zone = $("#gamesContent");
    zone.innerHTML = `
      <div class="games-menu">
        <button class="game-card" data-game="wheel">
          <div class="game-ico">🎡</div>
          <div class="game-info">
            <div class="game-name">La Roue des matières</div>
            <div class="game-desc">Tourne la roue, réponds à la question.</div>
            <div class="game-best">Points : <b>${gamesStore.wheelScore}</b></div>
          </div>
        </button>
        <button class="game-card" data-game="pendu">
          <div class="game-ico">🔤</div>
          <div class="game-info">
            <div class="game-name">Le Pendu des sigles</div>
            <div class="game-desc">Devine le sigle TLT en 7 erreurs max.</div>
            <div class="game-best">Points : <b>${gamesStore.penduScore}</b></div>
          </div>
        </button>
        <button class="game-card" data-game="course">
          <div class="game-ico">⏱️</div>
          <div class="game-info">
            <div class="game-name">Course contre la montre</div>
            <div class="game-desc">60 secondes, un max de bonnes réponses.</div>
            <div class="game-best">Record : <b>${gamesStore.courseBest}</b></div>
          </div>
        </button>
      </div>
      <button class="btn ghost" id="gamesBackBtn" style="margin-top:16px">← Retour au menu</button>
    `;
    $$(".game-card").forEach(btn => {
      btn.addEventListener("click", () => {
        const g = btn.dataset.game;
        if(g === "wheel") startWheel();
        else if(g === "pendu") startPendu();
        else if(g === "course") startCourse();
      });
    });
    const back = $("#gamesBackBtn");
    if(back) back.addEventListener("click", renderGamesMenu);
  }

  /* ---------- JEU 1 : LA ROUE ---------- */

  function startWheel(){
    wheelState = {rotation:0, spinning:false, current:null, answered:false, score:gamesStore.wheelScore};
    renderWheel();
  }

  function renderWheel(){
    const zone = $("#gamesContent");
    const n = WHEEL_MATIERES.length;
    const seg = 360 / n;
    const stops = WHEEL_MATIERES.map((m,i) => {
      const c = WHEEL_COLORS[i % WHEEL_COLORS.length];
      return `${c} ${i*seg}deg ${(i+1)*seg}deg`;
    }).join(",");

    const labels = WHEEL_MATIERES.map((m,i) => {
      const angle = i*seg + seg/2;
      return `<span class="wheel-label" style="transform:rotate(${angle}deg) translateY(-38%)">${escapeHtml(m)}</span>`;
    }).join("");

    zone.innerHTML = `
      <div class="game-head">
        <span class="game-title">🎡 La Roue des matières</span>
        <span class="game-score">Points : <b>${wheelState.score}</b></span>
      </div>
      <div class="wheel-wrap">
        <div class="wheel-pointer"></div>
        <div class="wheel" id="wheelEl" style="background:conic-gradient(${stops});transform:rotate(${wheelState.rotation}deg)">
          ${labels}
        </div>
      </div>
      <button class="btn" id="wheelSpinBtn" ${wheelState.spinning ? "disabled" : ""}>Tourner</button>
      <div id="wheelQuestion"></div>
      <button class="btn ghost" id="gamesBackBtn" style="margin-top:16px">← Retour au menu</button>
    `;

    $("#wheelSpinBtn").addEventListener("click", spinWheel);
    $("#gamesBackBtn").addEventListener("click", renderGamesMenu);

    if(wheelState.current && wheelState.answered){
      renderWheelQuestion();
    }
  }

  function spinWheel(){
    if(wheelState.spinning) return;
    wheelState.spinning = true;
    wheelState.answered = false;
    wheelState.current = null;
    $("#wheelQuestion").innerHTML = "";
    $("#wheelSpinBtn").disabled = true;

    const n = WHEEL_MATIERES.length;
    const seg = 360 / n;
    const idx = Math.floor(Math.random() * n);
    // Le pointeur est en haut (0deg). On veut que le centre du segment idx arrive en haut.
    const targetAngle = 360 * 5 + (360 - (idx * seg + seg/2));
    wheelState.rotation = targetAngle;

    const wheel = $("#wheelEl");
    wheel.style.transition = "transform 3s cubic-bezier(.17,.67,.2,1)";
    wheel.style.transform = `rotate(${targetAngle}deg)`;

    setTimeout(() => {
      wheelState.spinning = false;
      wheelState.current = WHEEL_MATIERES[idx];
      renderWheelQuestion();
    }, 3100);
  }

  function renderWheelQuestion(){
    const matiere = wheelState.current;
    const pool = WHEEL_QUESTIONS[matiere];
    const q = pool[Math.floor(Math.random() * pool.length)];
    wheelState.question = q;

    const zone = $("#wheelQuestion");
    zone.innerHTML = `
      <div class="quiz-card" style="margin-top:16px">
        <div class="quiz-qnum">Matière : ${escapeHtml(matiere)}</div>
        <div class="quiz-question">${escapeHtml(q.q)}</div>
        <div class="quiz-options">
          ${q.options.map((opt,i) => `<button class="quiz-opt" data-idx="${i}">${escapeHtml(opt)}</button>`).join("")}
        </div>
        <div class="quiz-feedback" id="wheelFeedback"></div>
      </div>
    `;
    $$("#wheelQuestion .quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => answerWheel(parseInt(btn.dataset.idx,10)));
    });
  }

  function answerWheel(idx){
    if(wheelState.answered) return;
    wheelState.answered = true;
    const q = wheelState.question;
    const correct = idx === q.bonne;
    if(correct){
      wheelState.score += 10;
      gamesStore.wheelScore = wheelState.score;
      saveGames(gamesStore);
    }

    $$("#wheelQuestion .quiz-opt").forEach(btn => {
      const i = parseInt(btn.dataset.idx,10);
      btn.disabled = true;
      if(i === q.bonne) btn.classList.add("good");
      else if(i === idx) btn.classList.add("bad");
    });

    const fb = $("#wheelFeedback");
    fb.innerHTML = `
      <div class="quiz-fb-title ${correct ? "ok" : "ko"}">${correct ? "✅ +10 points !" : "❌ Mauvaise réponse"}</div>
      <div class="quiz-fb-exp">${escapeHtml(q.explication)}</div>
      <button class="btn quiz-next" id="wheelReplayBtn">Rejouer</button>
    `;
    fb.classList.add("show");
    $("#wheelReplayBtn").addEventListener("click", () => {
      wheelState.answered = false;
      wheelState.current = null;
      renderWheel();
    });
    // Mettre à jour le score affiché
    const scoreEl = document.querySelector(".game-score b");
    if(scoreEl) scoreEl.textContent = wheelState.score;
  }

  /* ---------- JEU 2 : LE PENDU ---------- */

  function startPendu(){
    const mot = PENDU_SIGLES[Math.floor(Math.random() * PENDU_SIGLES.length)];
    penduState = {
      mot,
      found: new Set(),
      errors: 0,
      maxErrors: 7,
      over: false,
      score: gamesStore.penduScore
    };
    renderPendu();
  }

  function renderPendu(){
    const st = penduState;
    const zone = $("#gamesContent");
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const wordHtml = st.mot.split("").map(ch => {
      const shown = st.found.has(ch);
      return `<span class="pendu-letter ${shown ? "shown" : ""}">${shown ? ch : "&nbsp;"}</span>`;
    }).join("");

    zone.innerHTML = `
      <div class="game-head">
        <span class="game-title">🔤 Le Pendu des sigles</span>
        <span class="game-score">Points : <b>${st.score}</b></span>
      </div>
      <div class="pendu-wrap">
        <div class="pendu-drawing">${penduSVG(st.errors)}</div>
        <div class="pendu-errors">Erreurs : <b>${st.errors}</b> / ${st.maxErrors}</div>
      </div>
      <div class="pendu-word">${wordHtml}</div>
      <div class="pendu-hint">Indice : ${escapeHtml(SIGLES[st.mot] || "Sigle TLT")}</div>
      <div class="pendu-keyboard">
        ${letters.map(l => {
          const used = st.found.has(l) || st.wrongLetters?.has(l);
          return `<button class="pendu-key ${used ? "used" : ""}" data-letter="${l}" ${used || st.over ? "disabled" : ""}>${l}</button>`;
        }).join("")}
      </div>
      <div id="penduFeedback"></div>
      <button class="btn ghost" id="gamesBackBtn" style="margin-top:16px">← Retour au menu</button>
    `;

    if(!st.wrongLetters) st.wrongLetters = new Set();

    $$(".pendu-key").forEach(btn => {
      btn.addEventListener("click", () => guessPendu(btn.dataset.letter));
    });
    $("#gamesBackBtn").addEventListener("click", renderGamesMenu);
  }

  function penduSVG(errors){
    // 7 étapes : potence, tête, corps, bras G, bras D, jambe G, jambe D
    const parts = [
      `<line x1="20" y1="180" x2="120" y2="180" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
      `<line x1="50" y1="180" x2="50" y2="30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
      `<line x1="50" y1="30" x2="120" y2="30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
      `<line x1="120" y1="30" x2="120" y2="55" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
      `<circle cx="120" cy="70" r="15" stroke="currentColor" stroke-width="3" fill="none"/>`,
      `<line x1="120" y1="85" x2="120" y2="130" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
      `<line x1="120" y1="100" x2="100" y2="120" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
      `<line x1="120" y1="100" x2="140" y2="120" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
      `<line x1="120" y1="130" x2="100" y2="155" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
      `<line x1="120" y1="130" x2="140" y2="155" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`
    ];
    // On affiche progressivement : potence (3) + 1 par erreur
    const visible = Math.min(parts.length, 3 + errors);
    return `<svg viewBox="0 0 160 200" class="pendu-svg">${parts.slice(0, visible).join("")}</svg>`;
  }

  function guessPendu(letter){
    const st = penduState;
    if(st.over) return;
    if(st.mot.includes(letter)){
      st.found.add(letter);
    } else {
      st.wrongLetters.add(letter);
      st.errors++;
    }

    const won = st.mot.split("").every(ch => st.found.has(ch));
    const lost = st.errors >= st.maxErrors;

    if(won){
      st.over = true;
      st.score += 20;
      gamesStore.penduScore = st.score;
      saveGames(gamesStore);
    } else if(lost){
      st.over = true;
    }

    renderPendu();

    if(won || lost){
      const fb = $("#penduFeedback");
      fb.innerHTML = `
        <div class="quiz-feedback show">
          <div class="quiz-fb-title ${won ? "ok" : "ko"}">${won ? "✅ Gagné ! +20 points" : "❌ Perdu !"}</div>
          <div class="quiz-fb-exp">Le sigle était : <b>${escapeHtml(st.mot)}</b> — ${escapeHtml(SIGLES[st.mot] || "")}</div>
          <button class="btn quiz-next" id="penduNextBtn">Nouvelle manche</button>
        </div>
      `;
      $("#penduNextBtn").addEventListener("click", startPendu);
    }
  }

  /* ---------- JEU 3 : COURSE CONTRE LA MONTRE ---------- */

  function startCourse(){
    courseState = {
      timeLeft: 60,
      score: 0,
      timer: null,
      current: null,
      answered: false,
      over: false
    };
    renderCourse();
    courseState.timer = setInterval(() => {
      courseState.timeLeft--;
      const el = $("#courseTimer");
      if(el) el.textContent = courseState.timeLeft;
      if(courseState.timeLeft <= 0){
        endCourse();
      }
    }, 1000);
    nextCourseQuestion();
  }

  function renderCourse(){
    const zone = $("#gamesContent");
    zone.innerHTML = `
      <div class="game-head">
        <span class="game-title">⏱️ Course contre la montre</span>
        <span class="game-score">Score : <b id="courseScore">${courseState.score}</b></span>
      </div>
      <div class="course-timer-wrap">
        <div class="course-timer" id="courseTimer">${courseState.timeLeft}</div>
        <div class="course-timer-label">secondes</div>
      </div>
      <div id="courseQuestion"></div>
      <button class="btn ghost" id="gamesBackBtn" style="margin-top:16px">← Retour au menu</button>
    `;
    $("#gamesBackBtn").addEventListener("click", () => {
      if(courseState.timer) clearInterval(courseState.timer);
      renderGamesMenu();
    });
  }

  function nextCourseQuestion(){
    if(courseState.over) return;
    const q = QUIZ_BANK[Math.floor(Math.random() * QUIZ_BANK.length)];
    courseState.current = q;
    courseState.answered = false;

    const zone = $("#courseQuestion");
    zone.innerHTML = `
      <div class="quiz-card" style="margin-top:16px">
        <div class="quiz-qnum">${escapeHtml(q.matiere)}</div>
        <div class="quiz-question">${escapeHtml(q.q)}</div>
        <div class="quiz-options">
          ${q.options.map((opt,i) => `<button class="quiz-opt" data-idx="${i}">${escapeHtml(opt)}</button>`).join("")}
        </div>
      </div>
    `;
    $$("#courseQuestion .quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => answerCourse(parseInt(btn.dataset.idx,10)));
    });
  }

  function answerCourse(idx){
    if(courseState.answered || courseState.over) return;
    courseState.answered = true;
    const q = courseState.current;
    const correct = idx === q.bonne;

    if(correct) courseState.score++;
    else courseState.score = Math.max(0, courseState.score - 1);

    const scoreEl = $("#courseScore");
    if(scoreEl) scoreEl.textContent = courseState.score;

    $$("#courseQuestion .quiz-opt").forEach(btn => {
      const i = parseInt(btn.dataset.idx,10);
      btn.disabled = true;
      if(i === q.bonne) btn.classList.add("good");
      else if(i === idx) btn.classList.add("bad");
    });

    setTimeout(() => {
      if(!courseState.over) nextCourseQuestion();
    }, 600);
  }

  function endCourse(){
    if(courseState.over) return;
    courseState.over = true;
    if(courseState.timer) clearInterval(courseState.timer);

    const isRecord = courseState.score > gamesStore.courseBest;
    if(isRecord){
      gamesStore.courseBest = courseState.score;
      saveGames(gamesStore);
    }

    $("#gamesContent").innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-mat">Course contre la montre</div>
        <div class="quiz-result-note">${courseState.score}<span> pts</span></div>
        <div class="quiz-result-detail">${isRecord ? "🏆 Nouveau record !" : "Record : " + gamesStore.courseBest + " pts"}</div>
        <div class="quiz-result-msg">${courseState.score >= 10 ? "Impressionnant ! 🚀" : courseState.score >= 5 ? "Bien joué ! 👍" : "Continue à t'entraîner ! 💪"}</div>
        <button class="btn" id="courseRestartBtn">Rejouer</button>
        <button class="btn ghost" id="gamesBackBtn">← Retour au menu</button>
      </div>
    `;
    $("#courseRestartBtn").addEventListener("click", startCourse);
    $("#gamesBackBtn").addEventListener("click", renderGamesMenu);
  }

  /* ============================================================
     NAVIGATION
     ============================================================ */

  function switchTab(name){
    $$(".tab").forEach(t => t.classList.remove("active"));
    $$(".nav-btn").forEach(b => b.classList.remove("active"));
    const tab = $("#tab-" + name);
    const btn = document.querySelector(`.nav-btn[data-tab="${name}"]`);
    if(tab) tab.classList.add("active");
    if(btn) btn.classList.add("active");
    window.scrollTo({top:0, behavior:"smooth"});
  }

  /* ============================================================
     INIT
     ============================================================ */

  function init(){
    updateHeader();
    setInterval(updateHeader, 1000);

    renderToday();
    renderEvening();
    renderCourses("");
    renderQuizSelector();
    renderGamesMenu();
    $("#calcCount").textContent = store.calcCount || 0;

    // Rafraîchir l'onglet Aujourd'hui toutes les 30 s
    setInterval(renderToday, 30000);

    // Navigation
    $$(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // Recherche
    $("#searchInput").addEventListener("input", (e) => {
      renderCourses(e.target.value);
    });

    // Simulateur
    $("#calcBtn").addEventListener("click", computeDuty);
    $("#resetBtn").addEventListener("click", resetDuty);

    // Convertisseur
    $("#convEurBtn").addEventListener("click", () => convert(RATES.EUR, "EUR"));
    $("#convUsdBtn").addEventListener("click", () => convert(RATES.USD, "USD"));
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ---------- Déconnexion ---------- */
(function(){
  var btn = document.getElementById("logoutBtn");
  if(!btn) return;
  btn.addEventListener("click", function(){
    if(btn.disabled) return;
    btn.disabled = true;
    btn.classList.add("loading");
    fetch("/api/logout", { method: "POST", credentials: "same-origin" })
      .catch(function(){})
      .finally(function(){ window.location.href = "/login"; });
  });
})();
