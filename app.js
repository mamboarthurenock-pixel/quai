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

  // Escales (bandeau défilant sous le cinéma)
  // Conseils (bandeau défilant)
  const TICKER_CONSEILS = [
    "Révise 15 min par jour, pas 3 h la veille",
    "Le BT en TLT se prépare dès maintenant",
    "Utilise les cartes du jour dans Étude",
    "Un cours importé = des questions en plus",
    "Le Coach IA t'explique quand tu bloques",
    "UNION · DISCIPLINE · MARASSE"
  ];

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

  // Vocabulaire visuel TLT (anglais)
  const VOCAB = {
    "PORT": [
      {en:"port", fr:"port", ex:"The ship arrives at the port of Abidjan."},
      {en:"crane", fr:"grue", ex:"The crane lifts the containers."},
      {en:"container", fr:"conteneur", ex:"A container is loaded on the ship."},
      {en:"dock", fr:"quai", ex:"The truck waits on the dock."},
      {en:"ship", fr:"navire", ex:"The ship leaves the harbour."},
      {en:"cargo", fr:"cargaison", ex:"The cargo is heavy."},
      {en:"berth", fr:"poste d'amarrage", ex:"The vessel is at its berth."},
      {en:"stevedore", fr:"docker", ex:"The stevedore unloads the cargo."}
    ],
    "TRANSPORT": [
      {en:"truck", fr:"camion", ex:"The truck carries goods to the warehouse."},
      {en:"train", fr:"train", ex:"The train transports freight inland."},
      {en:"plane", fr:"avion", ex:"The plane carries urgent cargo."},
      {en:"warehouse", fr:"entrepôt", ex:"Goods are stored in the warehouse."},
      {en:"freight", fr:"fret", ex:"Freight costs are included in the price."},
      {en:"route", fr:"itinéraire", ex:"The driver chooses the best route."},
      {en:"driver", fr:"chauffeur", ex:"The driver checks the documents."},
      {en:"loading", fr:"chargement", ex:"Loading starts at eight o'clock."}
    ],
    "DOUANE": [
      {en:"customs", fr:"douane", ex:"Customs officers check the goods."},
      {en:"duty", fr:"droit", ex:"Import duty is paid at the border."},
      {en:"tariff", fr:"tarif", ex:"The tariff depends on the product."},
      {en:"declaration", fr:"déclaration", ex:"The declaration must be accurate."},
      {en:"invoice", fr:"facture", ex:"The invoice shows the value of the goods."},
      {en:"clearance", fr:"dédouanement", ex:"Customs clearance takes two days."},
      {en:"inspection", fr:"inspection", ex:"The inspection is done at the port."},
      {en:"value", fr:"valeur", ex:"The customs value is based on CIF."}
    ],
    "ENTREPRISE": [
      {en:"order", fr:"commande", ex:"The client places an order."},
      {en:"client", fr:"client", ex:"The client pays the invoice."},
      {en:"supplier", fr:"fournisseur", ex:"The supplier delivers the goods."},
      {en:"price", fr:"prix", ex:"The price includes transport."},
      {en:"contract", fr:"contrat", ex:"Both parties sign the contract."},
      {en:"stock", fr:"stock", ex:"The stock is stored in the warehouse."},
      {en:"profit", fr:"bénéfice", ex:"The profit is calculated at the end of the year."},
      {en:"budget", fr:"budget", ex:"The budget covers all expenses."}
    ]
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
     GARDE-FOU ANTI-RÉPÉTITION (questions déjà vues)
     ============================================================ */

  const SEEN_KEY = "seen";
  const SEEN_TTL = 24 * 60 * 60 * 1000; // 1 jour

  function questionId(q){
    // Hash simple (djb2) sur matiere + "|" + q
    const s = String(q.matiere || "") + "|" + String(q.q || "");
    let h = 5381;
    for(let i = 0; i < s.length; i++){
      h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    }
    return "q" + (h >>> 0).toString(36);
  }

  function loadSeen(){
    try{
      const raw = localStorage.getItem(SEEN_KEY);
      if(!raw) return {};
      const obj = JSON.parse(raw);
      return (obj && typeof obj === "object") ? obj : {};
    }catch(e){ return {}; }
  }

  function saveSeen(obj){
    try{ localStorage.setItem(SEEN_KEY, JSON.stringify(obj)); }catch(e){}
  }

  let seenStore = loadSeen();

  function questionVue(id){
    const t = seenStore[id];
    if(!t) return false;
    return (Date.now() - t) < SEEN_TTL;
  }

  function marquerVue(id){
    seenStore[id] = Date.now();
    saveSeen(seenStore);
  }

  function questionsNonVues(pool){
    return pool.filter(q => !questionVue(questionId(q)));
  }

  // Mélange (Fisher-Yates)
  function shuffle(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Priorise les questions non vues ; s'il n'y en a plus, autorise toutes.
  function pickQuestion(pool){
    if(!pool || !pool.length) return null;
    const fresh = questionsNonVues(pool);
    const source = fresh.length ? fresh : pool;
    return source[Math.floor(Math.random() * source.length)];
  }

  // Ordonne un pool : non vues d'abord (mélangées), puis les autres (mélangées).
  function orderByFreshness(pool){
    const fresh = shuffle(questionsNonVues(pool));
    const rest = shuffle(pool.filter(q => questionVue(questionId(q))));
    return fresh.concat(rest);
  }

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

  // Date locale au format AAAAMMJJ (seed déterministe)
  function dateSeed(d){
    const dt = d || new Date();
    return String(dt.getFullYear()) + pad(dt.getMonth()+1) + pad(dt.getDate());
  }

  // PRNG déterministe (mulberry32) à partir d'une seed entière
  function seededRandom(seed){
    let a = seed >>> 0;
    return function(){
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(s){
    let h = 5381;
    for(let i = 0; i < s.length; i++){
      h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    }
    return h >>> 0;
  }

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
     SUIVI : maîtrise par matière + carnet d'erreurs
     ============================================================ */

  const PROGRESS_KEY = "progress";
  const ERRORS_KEY = "errors";
  const ERRORS_MAX = 100;

  function loadProgress(){
    try{
      const raw = localStorage.getItem(PROGRESS_KEY);
      if(!raw) return {};
      const obj = JSON.parse(raw);
      return (obj && typeof obj === "object") ? obj : {};
    }catch(e){ return {}; }
  }

  function saveProgress(obj){
    try{ localStorage.setItem(PROGRESS_KEY, JSON.stringify(obj)); }catch(e){}
  }

  function loadErrors(){
    try{
      const raw = localStorage.getItem(ERRORS_KEY);
      if(!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }catch(e){ return []; }
  }

  function saveErrors(arr){
    try{ localStorage.setItem(ERRORS_KEY, JSON.stringify(arr)); }catch(e){}
  }

  let progressStore = loadProgress();
  let errorsStore = loadErrors();

  function progressFor(matiere){
    const p = progressStore[matiere];
    if(!p) return {vues:0, bonnes:0, mauvaises:0};
    return {
      vues: Number(p.vues) || 0,
      bonnes: Number(p.bonnes) || 0,
      mauvaises: Number(p.mauvaises) || 0
    };
  }

  function recordAnswer(matiere, correct, q){
    const p = progressFor(matiere);
    p.vues++;
    if(correct) p.bonnes++;
    else p.mauvaises++;
    progressStore[matiere] = p;
    saveProgress(progressStore);

    if(!correct && q){
      // Sans doublon sur q : on retire l'ancienne occurrence puis on ajoute en tête
      errorsStore = errorsStore.filter(e => e.q !== q.q);
      errorsStore.unshift({
        matiere: q.matiere,
        q: q.q,
        options: q.options.slice(),
        bonne: q.bonne,
        explication: q.explication,
        date: Date.now()
      });
      if(errorsStore.length > ERRORS_MAX) errorsStore = errorsStore.slice(0, ERRORS_MAX);
      saveErrors(errorsStore);
    }
  }

  function pctMaitrise(matiere){
    const p = progressFor(matiere);
    if(!p.vues) return null;
    return Math.round((p.bonnes / p.vues) * 100);
  }

  function badgeMaitrise(pct){
    if(pct === null) return {cls:"badge-debutant", label:"Débutant"};
    if(pct < 40) return {cls:"badge-debutant", label:"Débutant"};
    if(pct <= 70) return {cls:"badge-progres", label:"En progrès"};
    return {cls:"badge-solide", label:"Solide"};
  }

  function notePredite(){
    // Moyenne pondérée par le nombre de vues
    let sumPct = 0, sumVues = 0;
    Object.keys(progressStore).forEach(m => {
      const p = progressFor(m);
      if(p.vues > 0){
        sumPct += (p.bonnes / p.vues) * p.vues;
        sumVues += p.vues;
      }
    });
    if(!sumVues) return null;
    const pct = sumPct / sumVues;
    return Math.round((pct / 100) * 20 * 10) / 10;
  }

  function messageNote(note){
    if(note === null) return "Réponds à quelques questions pour voir ta note prédite.";
    if(note < 8) return "Courage, chaque révision compte. Tu vas y arriver 💪";
    if(note < 12) return "Tu progresses, continue sur cette lancée 🌱";
    if(note < 16) return "Solide ! Encore un petit effort pour viser l'excellence ✨";
    return "Excellent travail, tu maîtrises ton sujet ! 🏆";
  }

  function renderSuivi(){
    const zone = $("#suiviZone");
    if(!zone) return;

    const matieres = QUIZ_MATIERES.slice();
    // Ajoute les matières présentes dans progress mais pas dans QUIZ_MATIERES
    Object.keys(progressStore).forEach(m => {
      if(!matieres.includes(m)) matieres.push(m);
    });

    let html = "";

    // Note prédite
    const note = notePredite();
    const noteTxt = note === null ? "—" : note.toFixed(1);
    html += `
      <div class="card note-card">
        <div class="note-card-label">Note prédite</div>
        <div class="note-card-value">${noteTxt}<span>/20</span></div>
        <div class="note-card-msg">${escapeHtml(messageNote(note))}</div>
      </div>
    `;

    // Maîtrise par matière
    html += `<div class="card"><div class="section-title" style="margin-bottom:14px">Maîtrise par matière</div><div class="suivi-list">`;
    matieres.forEach(m => {
      const p = progressFor(m);
      const pct = pctMaitrise(m);
      const badge = badgeMaitrise(pct);
      const width = pct === null ? 0 : pct;
      html += `
        <div class="suivi-item">
          <div class="suivi-item-head">
            <span class="suivi-mat">${escapeHtml(m)}</span>
            <span class="suivi-badge ${badge.cls}">${badge.label}</span>
          </div>
          <div class="suivi-bar"><div class="suivi-bar-fill" style="width:${width}%"></div></div>
          <div class="suivi-meta">
            <span>${pct === null ? "Pas encore de données" : pct + " % de réussite"}</span>
            <span>${p.vues} vue${p.vues > 1 ? "s" : ""}</span>
          </div>
        </div>`;
    });
    html += `</div></div>`;

    // Carnet d'erreurs
    html += `<div class="card"><div class="section-title" style="margin-bottom:14px">Carnet d'erreurs</div>`;
    if(!errorsStore.length){
      html += `<div class="suivi-empty">Aucune erreur enregistrée — continue comme ça ✨</div>`;
    } else {
      html += `<div class="errors-list">`;
      errorsStore.forEach((e, i) => {
        const d = new Date(e.date);
        const dateStr = d.toLocaleDateString("fr-FR", {day:"2-digit", month:"2-digit"});
        html += `
          <div class="error-item">
            <div class="error-item-head">
              <span class="error-mat">${escapeHtml(e.matiere)}</span>
              <span class="error-date">${dateStr}</span>
            </div>
            <div class="error-q">${escapeHtml(e.q)}</div>
            <div class="error-good">✅ ${escapeHtml(e.options[e.bonne])}</div>
            <button class="btn error-revoir" data-idx="${i}">Revoir</button>
          </div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;

    // Bouton vider
    html += `<button class="btn ghost" id="suiviClearBtn" style="margin-top:4px">🗑️ Vider mes données</button>`;

    zone.innerHTML = html;

    $$(".error-revoir").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const e = errorsStore[idx];
        if(e) revoirErreur(e);
      });
    });

    const clear = $("#suiviClearBtn");
    if(clear) clear.addEventListener("click", () => {
      if(!confirm("Vider toutes tes données de suivi (maîtrise + carnet d'erreurs) ?")) return;
      progressStore = {};
      errorsStore = [];
      saveProgress(progressStore);
      saveErrors(errorsStore);
      renderSuivi();
    });
  }

  function revoirErreur(e){
    // Lance un quiz d'une seule question à partir de l'erreur
    const q = {
      matiere: e.matiere,
      q: e.q,
      options: e.options.slice(),
      bonne: e.bonne,
      explication: e.explication
    };
    quizState = {
      matiere: e.matiere,
      questions: [q],
      index: 0,
      score: 0,
      answered: false
    };
    switchTab("quiz");
    renderQuizQuestion();
  }

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
     ESCALES + CONSEILS (onglet Aujourd'hui)
     ============================================================ */

  const TRAILERS = [
    {titre:"Le Port d'Abidjan", texte:"Le cœur logistique de la Côte d'Ivoire"},
    {titre:"SITARAIL", texte:"Le rail qui relie Ouaga à Abidjan"},
    {titre:"L'aérien FHB", texte:"Vite, loin, précieux"},
    {titre:"La route", texte:"Le dernier kilomètre"},
    {titre:"Les entrepôts", texte:"Là où tout commence"}
  ];

  const CONSEILS = [
    "Révise 15 min par jour, pas 3 h la veille",
    "Le BT en TLT se prépare dès maintenant",
    "Utilise les cartes du jour dans Étude",
    "Un cours importé = des questions en plus",
    "Le Coach IA t'explique quand tu bloques",
    "UNION · DISCIPLINE · MARASSE"
  ];

  function trailerKey(i){
    return "trailer:" + i;
  }

  function getTrailerCache(i){
    try{ return localStorage.getItem(trailerKey(i)); }catch(e){ return null; }
  }

  function setTrailerCache(i, url){
    try{ localStorage.setItem(trailerKey(i), url); }catch(e){}
  }

  let _trailerQueue1 = Promise.resolve();

  function renderTrailers(){
    const track = $("#trailersTrack");
    if(!track) return;

    // On duplique la liste pour une boucle infinie fluide
    const items = TRAILERS.concat(TRAILERS);

    track.innerHTML = items.map((t, idx) => {
      const i = idx % TRAILERS.length;
      const cached = getTrailerCache(i);
      return `
        <div class="trailer-card" data-trailer="${i}">
          ${cached
            ? `<img src="${escapeHtml(cached)}" alt="${escapeHtml(t.titre)}" class="loaded">`
            : `<div class="trailer-loading">🎬</div>`}
          <div class="trailer-overlay">
            <div class="trailer-title">${escapeHtml(t.titre)}</div>
            <div class="trailer-sub">${escapeHtml(t.texte || t.sub)}</div>
          </div>
        </div>`;
    }).join("");

    // Chargement en file d'attente (1 à la fois) des images manquantes
    TRAILERS.forEach((t, i) => {
      if(getTrailerCache(i)) return;
      _trailerQueue1 = _trailerQueue1
        .then(() => genererTrailer(i, t.titre))
        .catch(() => {});
    });
  }

  async function genererTrailer(i, titre){
    const prompt = "photo réaliste, " + titre + ", Côte d'Ivoire, logistique, 16:9";
    try{
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify({prompt})
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(!res.ok || !data || !data.ok || !(data.url || data.image)) return;
      setTrailerCache(i, (data.url || data.image));
      // Met à jour toutes les cartes correspondantes (dupliquées)
      $$(`.trailer-card[data-trailer="${i}"]`).forEach(card => {
        const loading = card.querySelector(".trailer-loading");
        if(loading) loading.remove();
        if(!card.querySelector("img")){
          const img = document.createElement("img");
          img.alt = titre;
          img.addEventListener("load", () => img.classList.add("loaded"));
          img.src = (data.url || data.image);
          card.insertBefore(img, card.firstChild);
        }
      });
    }catch(e){}
  }

  function renderTicker(){
    const track = $("#tickerTrack");
    if(!track) return;
    const items = CONSEILS.concat(CONSEILS);
    track.innerHTML = items.map(c => `<span class="ticker-item">${escapeHtml(c)}</span>`).join("");
  }

  /* ============================================================
     ONGLET AUJOURD'HUI
     ============================================================ */

  /* ---------- DÉFI DU JOUR ---------- */

  const DEFI_KEY_PREFIX = "defi:";

  function defiKey(){
    return DEFI_KEY_PREFIX + dateSeed();
  }

  function defiDejaFait(){
    try{ return localStorage.getItem(defiKey()) !== null; }catch(e){ return false; }
  }

  function defiResultat(){
    try{
      const raw = localStorage.getItem(defiKey());
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }

  function defiSauver(res){
    try{ localStorage.setItem(defiKey(), JSON.stringify(res)); }catch(e){}
  }

  // Sélectionne 3 questions déterministes pour la date, non vues en priorité
  function defiQuestions(){
    const seed = hashString("defi-" + dateSeed());
    const rnd = seededRandom(seed);
    const pool = QUIZ_BANK.slice();
    // Mélange déterministe
    for(let i = pool.length - 1; i > 0; i--){
      const j = Math.floor(rnd() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const fresh = pool.filter(q => !questionVue(questionId(q)));
    const rest = pool.filter(q => questionVue(questionId(q)));
    return fresh.concat(rest).slice(0, 3);
  }

  let defiState = null;

  function renderDefi(){
    const zone = $("#defiZone");
    if(!zone) return;

    if(defiDejaFait()){
      const res = defiResultat();
      const score = res && typeof res.score === "number" ? res.score : 0;
      const total = res && typeof res.total === "number" ? res.total : 3;
      zone.innerHTML = `
        <div class="card defi-card defi-done">
          <div class="defi-head">
            <span class="defi-title">🎯 Défi du jour</span>
            <span class="defi-badge">Déjà relevé aujourd'hui ✅</span>
          </div>
          <div class="defi-done-score">${score} / ${total}</div>
          <div class="defi-done-msg">${escapeHtml(messageNote(Math.round((score/total)*20)))}</div>
        </div>`;
      return;
    }

    if(defiState && defiState.finished){
      const score = defiState.score;
      const total = defiState.questions.length;
      zone.innerHTML = `
        <div class="card defi-card defi-done">
          <div class="defi-head">
            <span class="defi-title">🎯 Défi du jour</span>
            <span class="defi-badge">Terminé ✅</span>
          </div>
          <div class="defi-done-score">${score} / ${total}</div>
          <div class="defi-done-msg">${escapeHtml(messageNote(Math.round((score/total)*20)))}</div>
        </div>`;
      return;
    }

    if(defiState && defiState.started){
      renderDefiQuestion();
      return;
    }

    zone.innerHTML = `
      <div class="card defi-card">
        <div class="defi-head">
          <span class="defi-title">🎯 Défi du jour</span>
          <span class="defi-badge">3 questions</span>
        </div>
        <div class="defi-desc">Relève le défi du jour : 3 questions choisies pour toi. Prêt ?</div>
        <button class="btn" id="defiStartBtn">Relever le défi</button>
      </div>`;
    const btn = $("#defiStartBtn");
    if(btn) btn.addEventListener("click", startDefi);
  }

  function startDefi(){
    const questions = defiQuestions();
    if(!questions.length) return;
    defiState = {questions, index:0, score:0, answered:false, started:true, finished:false};
    renderDefiQuestion();
  }

  function renderDefiQuestion(){
    const zone = $("#defiZone");
    const st = defiState;
    const total = st.questions.length;
    const q = st.questions[st.index];
    const progress = Math.round((st.index / total) * 100);

    zone.innerHTML = `
      <div class="card defi-card">
        <div class="defi-head">
          <span class="defi-title">🎯 Défi du jour</span>
          <span class="defi-badge">${st.index + 1} / ${total}</span>
        </div>
        <div class="defi-progress"><div class="defi-progress-bar" style="width:${progress}%"></div></div>
        <div class="quiz-qnum">${escapeHtml(q.matiere)}</div>
        <div class="quiz-question">${escapeHtml(q.q)}</div>
        <div class="quiz-options">
          ${q.options.map((opt,i) => `<button class="quiz-opt" data-idx="${i}">${escapeHtml(opt)}</button>`).join("")}
        </div>
        <div class="quiz-feedback" id="defiFeedback"></div>
      </div>`;

    $$("#defiZone .quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => answerDefi(parseInt(btn.dataset.idx, 10)));
    });
  }

  function answerDefi(idx){
    const st = defiState;
    if(!st || st.answered) return;
    st.answered = true;
    const q = st.questions[st.index];
    const correct = idx === q.bonne;
    if(correct) st.score++;
    marquerVue(questionId(q));
    recordAnswer(q.matiere, correct, q);

    $$("#defiZone .quiz-opt").forEach(btn => {
      const i = parseInt(btn.dataset.idx, 10);
      btn.disabled = true;
      if(i === q.bonne) btn.classList.add("good");
      else if(i === idx) btn.classList.add("bad");
    });

    const fb = $("#defiFeedback");
    fb.classList.add("show");
    fb.innerHTML = `
      <div class="quiz-fb-title ${correct ? "ok" : "ko"}">${correct ? "✅ Bonne réponse !" : "❌ Raté"}</div>
      <div class="quiz-fb-exp">${escapeHtml(q.explication)}</div>
      <button class="btn quiz-next" id="defiNextBtn">${st.index + 1 < st.questions.length ? "Question suivante" : "Voir le résultat"}</button>
    `;
    $("#defiNextBtn").addEventListener("click", () => {
      st.answered = false;
      st.index++;
      if(st.index >= st.questions.length){
        st.finished = true;
        defiSauver({score: st.score, total: st.questions.length, date: dateSeed()});
        renderDefi();
      } else {
        renderDefiQuestion();
      }
    });
  }

  /* ---------- ESCALES (marquee) ---------- */

  const trailerCache = {};     // i -> url (mémoire)
  const trailerPending = {};   // i -> true
  let trailerQueue = Promise.resolve();

  function trailerKey(i){
    return "trailer:" + i;
  }

  function getTrailerCache(i){
    if(trailerCache[i]) return trailerCache[i];
    try{
      const v = localStorage.getItem(trailerKey(i));
      if(v){ trailerCache[i] = v; return v; }
    }catch(e){}
    return null;
  }

  function setTrailerCache(i, url){
    trailerCache[i] = url;
    try{ localStorage.setItem(trailerKey(i), url); }catch(e){}
  }

  function renderTrailers(){
    const track = $("#trailersTrack");
    if(!track) return;

    // On duplique la liste pour une boucle infinie sans coupure
    const items = TRAILERS.concat(TRAILERS);

    track.innerHTML = items.map((t, k) => {
      const i = k % TRAILERS.length;
      const cached = getTrailerCache(i);
      return `
        <div class="trailer-card" data-idx="${i}">
          <div class="trailer-img-wrap">
            ${cached
              ? `<img class="trailer-img" src="${escapeHtml(cached)}" alt="${escapeHtml(t.titre)}">`
              : `<div class="trailer-img trailer-img-loading">⏳</div>`}
          </div>
          <div class="trailer-overlay">
            <div class="trailer-title">${escapeHtml(t.titre)}</div>
            <div class="trailer-text">${escapeHtml(t.texte)}</div>
          </div>
        </div>`;
    }).join("");

    // Chargement en arrière-plan, une image à la fois
    TRAILERS.forEach((t, i) => {
      if(getTrailerCache(i)) return;
      if(trailerPending[i]) return;
      trailerPending[i] = true;
      trailerQueue = trailerQueue.then(() => genererTrailer(i, t))
        .catch(() => {})
        .finally(() => { trailerPending[i] = false; });
    });
  }

  async function genererTrailer(i, t){
    try{
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify({
          prompt: "photo réaliste, " + t.titre + ", Côte d'Ivoire, logistique, 16:9"
        })
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(!res.ok || !data || !data.ok || !(data.url || data.image)) return;
      setTrailerCache(i, (data.url || data.image));
      // Remplace les placeholders de cette escale (2 occurrences)
      $$(`.trailer-card[data-idx="${i}"] .trailer-img-wrap`).forEach(wrap => {
        wrap.innerHTML = `<img class="trailer-img" src="${escapeHtml((data.url || data.image))}" alt="${escapeHtml(t.titre)}">`;
      });
    }catch(e){}
  }

  /* ---------- CONSEILS (ticker) ---------- */

  function renderTicker(){
    const track = $("#tickerTrack");
    if(!track) return;
    const items = TICKER_CONSEILS.concat(TICKER_CONSEILS);
    track.innerHTML = items.map(c => `
      <span class="ticker-item">${escapeHtml(c)}</span>
      <span class="ticker-sep" aria-hidden="true">•</span>
    `).join("");
  }

  function renderToday(){
    const d = new Date();
    const dayIdx = d.getDay(); // 0 = dimanche
    const courses = SCHEDULE[dayIdx];
    const container = $("#todayContent");

    renderDefi();
    renderEscales();
    renderConseil();
    renderModes();

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

  // État des cours importés
  let coursState = {
    loaded: false,
    loading: false,
    error: null,
    items: [],
    filter: "",
    open: null // cours actuellement ouvert dans le lecteur
  };

  function levelClass(niveau){
    const n = String(niveau || "").toUpperCase();
    if(n === "3BT") return "lvl-3";
    if(n === "2BT") return "lvl-2";
    if(n === "1BT") return "lvl-1";
    return "lvl-3";
  }

  function cleanFileName(f){
    return String(f || "").replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  }

  function fmtChars(n){
    const v = Number(n) || 0;
    return new Intl.NumberFormat("fr-FR").format(v) + " car.";
  }

  async function loadCours(){
    if(coursState.loading) return;
    coursState.loading = true;
    coursState.error = null;
    renderCourses(coursState.filter);
    try{
      const res = await fetch("/api/cours", {credentials:"same-origin"});
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(!res.ok || !data || !data.ok){
        coursState.error = (data && data.error) || ("Erreur serveur (" + res.status + ")");
        coursState.items = [];
      } else {
        coursState.items = Array.isArray(data.cours) ? data.cours : [];
      }
    }catch(e){
      coursState.error = "Impossible de charger les cours.";
      coursState.items = [];
    }finally{
      coursState.loading = false;
      coursState.loaded = true;
      renderCourses(coursState.filter);
    }
  }

  function renderCourses(filter){
    coursState.filter = filter || "";
    const q = coursState.filter.trim().toLowerCase();
    const container = $("#coursesContent");
    if(!container) return;

    // Si un cours est ouvert, on affiche le lecteur
    if(coursState.open){
      renderCoursReader(coursState.open);
      return;
    }

    if(coursState.loading && !coursState.loaded){
      container.innerHTML = `<div class="empty"><div class="big">⏳</div><div>Chargement des cours…</div></div>`;
      return;
    }

    if(coursState.error){
      container.innerHTML = `<div class="empty"><div class="big">⚠️</div><div>${escapeHtml(coursState.error)}</div></div>`;
      return;
    }

    if(!coursState.items.length){
      container.innerHTML = `<div class="empty"><div class="big">📚</div><div>Aucun cours importé — ajoute tes fichiers.</div></div>`;
      return;
    }

    // Filtrage
    const filtered = coursState.items.filter(c => {
      if(!q) return true;
      const hay = [
        c.matiere, c.fichier, c.niveau, c.texte
      ].map(v => String(v || "").toLowerCase()).join(" ");
      return hay.includes(q);
    });

    if(!filtered.length){
      container.innerHTML = `<div class="empty"><div class="big">🔍</div><div>Aucun résultat pour « ${escapeHtml(coursState.filter)} ».</div></div>`;
      return;
    }

    // Groupement par matière
    const byMatiere = new Map();
    filtered.forEach(c => {
      const m = c.matiere || "Sans matière";
      if(!byMatiere.has(m)) byMatiere.set(m, []);
      byMatiere.get(m).push(c);
    });

    const matieres = Array.from(byMatiere.keys()).sort((a,b) => a.localeCompare(b, "fr"));

    let html = "";
    matieres.forEach(m => {
      const items = byMatiere.get(m).slice().sort((a,b) => {
        const na = String(a.niveau || "").localeCompare(String(b.niveau || ""), "fr");
        if(na !== 0) return na;
        return String(a.fichier || "").localeCompare(String(b.fichier || ""), "fr");
      });
      html += `
        <div class="cours-group">
          <div class="cours-group-head">
            <span class="cours-group-ico">${iconFor(m)}</span>
            <span class="cours-group-title">${escapeHtml(m)}</span>
            <span class="cours-group-count">${items.length}</span>
          </div>
          <div class="cours-list">
            ${items.map((c, i) => {
              const idx = coursState.items.indexOf(c);
              return `
                <button class="cours-card" data-idx="${idx}">
                  <div class="cours-card-top">
                    <span class="cours-file">${escapeHtml(cleanFileName(c.fichier))}</span>
                    <span class="level-pill ${levelClass(c.niveau)}">${escapeHtml(c.niveau || "—")}</span>
                  </div>
                  <div class="cours-card-meta">
                    <span class="cours-matiere">${escapeHtml(c.matiere || "—")}</span>
                    <span class="cours-size">${fmtChars(c.caracteres)}</span>
                  </div>
                </button>`;
            }).join("")}
          </div>
        </div>`;
    });

    container.innerHTML = html;

    $$(".cours-card").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const c = coursState.items[idx];
        if(c){
          coursState.open = c;
          renderCourses(coursState.filter);
          window.scrollTo({top:0, behavior:"smooth"});
        }
      });
    });
  }

  function renderCoursReader(c){
    const container = $("#coursesContent");
    if(!container) return;
    const texte = String(c.texte || "");
    container.innerHTML = `
      <div class="cours-reader">
        <div class="cours-reader-head">
          <button class="btn ghost cours-back" id="coursBackBtn">← Retour</button>
          <button class="btn cours-listen" id="coursListenBtn">🔊 Écouter</button>
        </div>
        <div class="cours-reader-title">
          <span class="level-pill ${levelClass(c.niveau)}">${escapeHtml(c.niveau || "—")}</span>
          <h2>${escapeHtml(cleanFileName(c.fichier))}</h2>
          <div class="cours-reader-meta">${escapeHtml(c.matiere || "—")} · ${fmtChars(c.caracteres)}</div>
        </div>
        <pre class="cours-reader-text">${escapeHtml(texte)}</pre>
      </div>
    `;

    const back = $("#coursBackBtn");
    if(back) back.addEventListener("click", () => {
      coursState.open = null;
      renderCourses(coursState.filter);
      window.scrollTo({top:0, behavior:"smooth"});
    });

    const listen = $("#coursListenBtn");
    if(listen) listen.addEventListener("click", () => {
      if(typeof window.lireTexte === "function"){
        window.lireTexte(texte);
      }
    });
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
    const total = QUIZ_BANK.length;
    const nonVues = questionsNonVues(QUIZ_BANK).length;
    let html = `
      <div class="quiz-seen-line">
        <span>🆕 Jamais vues</span>
        <span><b>${nonVues}</b> / ${total}</span>
      </div>
      <button class="btn exam-launch" id="examStartBtn">🎓 Mode examen — 30 questions · 20 min</button>
      <div class="quiz-selector">`;
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

    const examBtn = $("#examStartBtn");
    if(examBtn) examBtn.addEventListener("click", startExam);
  }

  /* ---------- MODE EXAMEN ---------- */

  const EXAM_COUNT = 30;
  const EXAM_DURATION = 20 * 60; // 20 minutes en secondes

  let examState = null;

  function startExam(){
    const pool = orderByFreshness(QUIZ_BANK);
    const questions = pool.slice(0, Math.min(EXAM_COUNT, pool.length));
    examState = {
      questions,
      index: 0,
      score: 0,
      answered: false,
      timeLeft: EXAM_DURATION,
      timer: null,
      over: false
    };
    renderExamQuestion();
    examState.timer = setInterval(() => {
      if(!examState || examState.over) return;
      examState.timeLeft--;
      const el = $("#examTimer");
      if(el) el.textContent = fmtTime(examState.timeLeft);
      if(examState.timeLeft <= 0){
        endExam();
      }
    }, 1000);
  }

  function fmtTime(sec){
    const s = Math.max(0, sec);
    return pad(Math.floor(s / 60)) + ":" + pad(s % 60);
  }

  function renderExamQuestion(){
    const zone = $("#quizZone");
    const st = examState;
    const total = st.questions.length;
    const q = st.questions[st.index];
    const progress = Math.round((st.index / total) * 100);

    zone.innerHTML = `
      <div class="exam-head">
        <span class="exam-title">🎓 Mode examen</span>
        <span class="exam-timer" id="examTimer">${fmtTime(st.timeLeft)}</span>
      </div>
      <div class="exam-progress"><div class="exam-progress-bar" style="width:${progress}%"></div></div>
      <div class="quiz-card">
        <div class="quiz-qnum">Question ${st.index + 1} / ${total} · ${escapeHtml(q.matiere)}</div>
        <div class="quiz-question">${escapeHtml(q.q)}</div>
        <div class="quiz-options">
          ${q.options.map((opt,i) => `<button class="quiz-opt" data-idx="${i}">${escapeHtml(opt)}</button>`).join("")}
        </div>
        <div class="quiz-feedback" id="examFeedback"></div>
      </div>
      <button class="btn ghost" id="examQuitBtn" style="margin-top:12px">Abandonner l'examen</button>
    `;

    $$("#quizZone .quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => answerExam(parseInt(btn.dataset.idx, 10)));
    });
    const quit = $("#examQuitBtn");
    if(quit) quit.addEventListener("click", () => {
      if(confirm("Abandonner l'examen en cours ?")) endExam();
    });
  }

  function answerExam(idx){
    const st = examState;
    if(!st || st.answered || st.over) return;
    st.answered = true;
    const q = st.questions[st.index];
    const correct = idx === q.bonne;
    if(correct) st.score++;
    marquerVue(questionId(q));
    recordAnswer(q.matiere, correct, q);

    $$("#quizZone .quiz-opt").forEach(btn => {
      const i = parseInt(btn.dataset.idx, 10);
      btn.disabled = true;
      if(i === q.bonne) btn.classList.add("good");
      else if(i === idx) btn.classList.add("bad");
    });

    const fb = $("#examFeedback");
    fb.classList.add("show");
    fb.innerHTML = `
      <div class="quiz-fb-title ${correct ? "ok" : "ko"}">${correct ? "✅ Bonne réponse !" : "❌ Raté"}</div>
      <div class="quiz-fb-exp">${escapeHtml(q.explication)}</div>
      <button class="btn quiz-next" id="examNextBtn">${st.index + 1 < st.questions.length ? "Question suivante" : "Terminer l'examen"}</button>
    `;
    $("#examNextBtn").addEventListener("click", () => {
      st.answered = false;
      st.index++;
      if(st.index >= st.questions.length){
        endExam();
      } else {
        renderExamQuestion();
      }
    });
  }

  function endExam(){
    const st = examState;
    if(!st || st.over) return;
    st.over = true;
    if(st.timer) clearInterval(st.timer);

    const total = st.questions.length;
    const answered = st.index + (st.answered ? 1 : 0);
    const bonnes = st.score;
    const mauvaises = Math.max(0, answered - bonnes);
    const note = total ? Math.round((bonnes / total) * 20 * 10) / 10 : 0;

    $("#quizZone").innerHTML = `
      <div class="quiz-result exam-result">
        <div class="quiz-result-mat">Mode examen</div>
        <div class="quiz-result-note">${note}<span>/20</span></div>
        <div class="exam-stats">
          <div class="exam-stat"><span class="exam-stat-k">Bonnes</span><span class="exam-stat-v ok">${bonnes}</span></div>
          <div class="exam-stat"><span class="exam-stat-k">Mauvaises</span><span class="exam-stat-v ko">${mauvaises}</span></div>
          <div class="exam-stat"><span class="exam-stat-k">Temps restant</span><span class="exam-stat-v">${fmtTime(st.timeLeft)}</span></div>
        </div>
        <div class="quiz-result-msg">${escapeHtml(messageNote(note))}</div>
        <button class="btn" id="examReplayBtn">Rejouer</button>
        <button class="btn ghost" id="examBackBtn">Retour au quiz</button>
      </div>
    `;
    $("#examReplayBtn").addEventListener("click", startExam);
    $("#examBackBtn").addEventListener("click", () => {
      examState = null;
      renderQuizSelector();
    });
  }

  function startQuiz(matiere){
    const pool = QUIZ_BANK.filter(q => q.matiere === matiere);
    if(pool.length === 0){
      renderQuizSelector();
      return;
    }
    // Priorité aux questions non vues
    const questions = prioriserQuestions(pool);
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

  // Message d'encouragement selon la note /20
  function encouragement(note){
    if(note < 8) return "Courage, on révise ensemble 💪";
    if(note <= 14) return "Tu progresses, continue comme ça 🌱";
    return "Bravo ! 🏆";
  }

  // Cherche le texte d'un cours lié à la matière (si disponible)
  function coursPourMatiere(matiere){
    try{
      if(!coursState || !Array.isArray(coursState.items)) return "";
      const m = String(matiere || "").toLowerCase();
      const found = coursState.items.find(c =>
        String(c.matiere || "").toLowerCase().includes(m) ||
        m.includes(String(c.matiere || "").toLowerCase())
      );
      if(!found) return "";
      return String(found.texte || "").slice(0, 1200);
    }catch(e){ return ""; }
  }

  // Construit le prompt selon le niveau demandé
  function promptExplication(niveau, q, mauvaise, coursTxt){
    const bonne = q.options[q.bonne];
    const base =
      "Question : " + q.q + "\n" +
      "Mauvaise réponse de l'élève : " + mauvaise + "\n" +
      "Bonne réponse : " + bonne + "\n" +
      (coursTxt ? "Extrait du cours : " + coursTxt + "\n" : "") +
      "Explication officielle : " + q.explication + "\n\n";
    if(niveau === "simple"){
      return base + "Explique en 2 phrases très simples, avec bienveillance, pourquoi la bonne réponse est correcte.";
    }
    if(niveau === "detaille"){
      return base + "Explique en détail, étape par étape, en t'appuyant sur le cours. Sois pédagogue et encourageant.";
    }
    return base + "Donne un exemple concret du port d'Abidjan pour illustrer la bonne réponse.";
  }

  // Affiche la réponse du coach dans la carte quiz
  function afficheExplication(texte){
    const box = $("#quizExplainOut");
    if(!box) return;
    box.innerHTML = `<div class="correction-douce">💡 ${escapeHtml(texte)}</div>`;
  }

  async function expliquerQuestion(niveau){
    const st = quizState;
    if(!st) return;
    const q = st.questions[st.index];
    const mauvaise = st.lastWrong || "";
    const coursTxt = coursPourMatiere(q.matiere);
    const box = $("#quizExplainOut");
    if(box) box.innerHTML = `<div class="correction-douce">⏳ Le coach réfléchit…</div>`;

    try{
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify({message: promptExplication(niveau, q, mauvaise, coursTxt)})
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(!res.ok){
        const msg = (data && (data.error || data.message)) || ("Erreur serveur (" + res.status + ")");
        afficheExplication("⚠️ " + msg);
        return;
      }
      const reply = (data && (data.answer || data.reply || data.response || data.message || data.content)) || "";
      afficheExplication(reply || "Pas de réponse du coach.");
    }catch(e){
      afficheExplication("⚠️ Impossible de contacter le coach.");
    }
  }

  function answerQuiz(idx){
    const st = quizState;
    if(!st || st.answered) return;
    st.answered = true;

    const q = st.questions[st.index];
    const correct = idx === q.bonne;
    if(correct) st.score++;
    else st.lastWrong = q.options[idx];
    marquerVue(questionId(q));
    recordAnswer(q.matiere, correct, q);

    $$(".quiz-opt").forEach(btn => {
      const i = parseInt(btn.dataset.idx, 10);
      btn.disabled = true;
      if(i === q.bonne) btn.classList.add("good");
      else if(i === idx) btn.classList.add("bad");
    });

    const fb = $("#quizFeedback");
    const bonne = q.options[q.bonne];
    const titre = correct
      ? "✅ Bonne réponse !"
      : (Math.random() < 0.5
          ? "Presque ! La bonne réponse est : " + escapeHtml(bonne)
          : "Pas encore, mais tu progresses. La bonne réponse : " + escapeHtml(bonne));

    fb.innerHTML = `
      <div class="${correct ? "quiz-fb-title ok" : "correction-douce"}">${titre}</div>
      <div class="quiz-fb-exp">${escapeHtml(q.explication)}</div>
      ${correct ? "" : `
        <button class="btn explique-btn" id="quizExplainBtn">💡 Explique-moi</button>
        <div class="explique-niveaux" id="quizExplainNiveaux" style="display:none">
          <button class="explique-niveau" data-niveau="simple">Simple</button>
          <button class="explique-niveau" data-niveau="detaille">Détaillé</button>
          <button class="explique-niveau" data-niveau="exemple">Exemple</button>
        </div>
        <div id="quizExplainOut"></div>
      `}
      <button class="btn quiz-next" id="quizNextBtn">
        ${st.index + 1 < st.questions.length ? "Question suivante" : "Voir le résultat"}
      </button>
    `;
    fb.classList.add("show");

    if(!correct){
      const exBtn = $("#quizExplainBtn");
      const niveaux = $("#quizExplainNiveaux");
      if(exBtn) exBtn.addEventListener("click", () => {
        if(niveaux) niveaux.style.display = "flex";
        expliquerQuestion("simple");
      });
      $$(".explique-niveau").forEach(b => {
        b.addEventListener("click", () => expliquerQuestion(b.dataset.niveau));
      });
    }

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

    const msg = encouragement(note);
    const encClass = note > 14 ? "enc-bravo" : (note >= 8 ? "enc-progres" : "enc-courage");

    $("#quizZone").innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-mat">${escapeHtml(st.matiere)}</div>
        <div class="quiz-result-note">${note}<span>/20</span></div>
        <div class="quiz-result-detail">${st.score} bonne${st.score>1?"s":""} réponse${st.score>1?"s":""} sur ${total}</div>
        <div class="encouragement ${encClass}">${escapeHtml(msg)}</div>
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

  /* ---------- Données des nouveaux jeux ---------- */

  // 1. Match des taux
  const TAUX_PAIRS = [
    {taxe:"DD",  taux:"10 %"},
    {taxe:"RSTA",taux:"1 %"},
    {taxe:"TVA", taux:"18 %"},
    {taxe:"PCS", taux:"0,5 %"},
    {taxe:"PCC", taux:"0,8 %"}
  ];

  // 2. Classer les incoterms
  const INCOTERMS = [
    {code:"EXW", tas:"peu"},
    {code:"FCA", tas:"peu"},
    {code:"FOB", tas:"peu"},
    {code:"CIF", tas:"tout"},
    {code:"DAP", tas:"tout"},
    {code:"DDP", tas:"tout"}
  ];

  // 3. Qui veut gagner (difficulté croissante)
  const QVG_QUESTIONS = [
    {q:"Que signifie DD en douane ?",
     options:["Droit de Douane","Déclaration Directe","Document Douanier","Droit Divers"], bonne:0,
     explication:"DD = Droit de Douane, taxe perçue à l'importation."},
    {q:"La valeur en douane est calculée sur la base :",
     options:["FOB","CIF (FOB + fret + assurance)","Prix de détail","La TVA"], bonne:1,
     explication:"La valeur en douane est la valeur CIF."},
    {q:"Quel est le taux de la TVA à l'importation en Côte d'Ivoire ?",
     options:["10 %","1 %","18 %","0,5 %"], bonne:2,
     explication:"La TVA à l'importation est de 18 %."},
    {q:"Quel sigle désigne le système de dédouanement automatisé ?",
     options:["GUCE","SYDAM","PAA","BSC"], bonne:1,
     explication:"SYDAM = Système de Dédouanement Automatisé des Marchandises."},
    {q:"Dans un incoterm DDP, qui paie les droits de douane à l'importation ?",
     options:["L'acheteur","Le vendeur","Le transporteur","Le transitaire"], bonne:1,
     explication:"En DDP, le vendeur paie tout, y compris les droits de douane."}
  ];

  // 5. Memory : paires sigle <-> signification
  const MEMORY_PAIRS = [
    {sigle:"GDOD", def:"Gestion Documentaire et Organisation Douanière"},
    {sigle:"TEC",  def:"Tarif Extérieur Commun"},
    {sigle:"DAU",  def:"Déclaration en Détail des Marchandises"},
    {sigle:"RSTA", def:"Redevance Statistique et d'Assistance Technique"},
    {sigle:"CIF",  def:"Coût, Assurance et Fret"},
    {sigle:"FOB",  def:"Free On Board (Franco à Bord)"}
  ];

  // Couleurs de la roue (cohérentes avec le design)
  const WHEEL_COLORS = [
    "#22d3ee","#a78bfa","#f472b6","#fbbf24",
    "#34d399","#60a5fa","#f87171","#c084fc"
  ];

  // Sigles pour le pendu
  const PENDU_SIGLES = ["GDOD","TEC","DAU","RSTA","TVA","PCS","PCC","PUA","CIF","FOB","SYDAM","GUCE","PAA","SITARAIL","GESTOCI","DEX","FHB","CMR"];

  const GAMES_KEY = "lpcc_games_v1";

  function loadGames(){
    const def = {wheelScore:0, penduScore:0, courseBest:0,
                 matchBest:0, incotermBest:0, qvgBest:0, duelBest:0, memoryBest:0};
    try{
      const raw = localStorage.getItem(GAMES_KEY);
      if(!raw) return def;
      return Object.assign(def, JSON.parse(raw));
    }catch(e){
      return def;
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
  let matchState = null;
  let incotermState = null;
  let qvgState = null;
  let duelState = null;
  let memoryState = null;

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
        <button class="game-card" data-game="match">
          <div class="game-ico">🧩</div>
          <div class="game-info">
            <div class="game-name">Match des taux</div>
            <div class="game-desc">Relie chaque taxe à son taux.</div>
            <div class="game-best">Record : <b>${gamesStore.matchBest || 0}</b></div>
          </div>
        </button>
        <button class="game-card" data-game="incoterm">
          <div class="game-ico">📦</div>
          <div class="game-info">
            <div class="game-name">Classer les incoterms</div>
            <div class="game-desc">Qui paie quoi ? Range les 6 incoterms.</div>
            <div class="game-best">Record : <b>${gamesStore.incotermBest || 0}</b></div>
          </div>
        </button>
        <button class="game-card" data-game="qvg">
          <div class="game-ico">🎯</div>
          <div class="game-info">
            <div class="game-name">Qui veut gagner</div>
            <div class="game-desc">5 questions, 3 jokers, grimpe les paliers.</div>
            <div class="game-best">Record : <b>${gamesStore.qvgBest || 0}</b></div>
          </div>
        </button>
        <button class="game-card" data-game="duel">
          <div class="game-ico">⚔️</div>
          <div class="game-info">
            <div class="game-name">Duel contre l'IA</div>
            <div class="game-desc">5 questions, toi contre le coach.</div>
            <div class="game-best">Record : <b>${gamesStore.duelBest || 0}</b></div>
          </div>
        </button>
        <button class="game-card" data-game="memory">
          <div class="game-ico">🃏</div>
          <div class="game-info">
            <div class="game-name">Memory des sigles</div>
            <div class="game-desc">Retrouve les paires sigle / signification.</div>
            <div class="game-best">Record : <b>${gamesStore.memoryBest || 0}</b></div>
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
        else if(g === "match") startMatch();
        else if(g === "incoterm") startIncoterm();
        else if(g === "qvg") startQvg();
        else if(g === "duel") startDuel();
        else if(g === "memory") startMemory();
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
    const candidates = prioriserQuestions(pool);
    const q = candidates[Math.floor(Math.random() * candidates.length)];
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
    marquerVue(questionId(q));
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
    const candidates = prioriserQuestions(QUIZ_BANK);
    const q = candidates[Math.floor(Math.random() * candidates.length)];
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
    marquerVue(questionId(q));

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

  /* ---------- JEU 4 : MATCH DES TAUX ---------- */

  function startMatch(){
    matchState = {
      taxes: shuffle(TAUX_PAIRS.map(p => p.taxe)),
      taux: shuffle(TAUX_PAIRS.map(p => p.taux)),
      selectedTaxe: null,
      matched: new Set(),
      score: 0,
      errors: 0,
      over: false
    };
    renderMatch();
  }

  function renderMatch(){
    const st = matchState;
    const zone = $("#gamesContent");
    zone.innerHTML = `
      <div class="game-head">
        <span class="game-title">🧩 Match des taux</span>
        <span class="game-score">Score : <b>${st.score}</b> / ${TAUX_PAIRS.length}</span>
      </div>
      <div class="match-grid">
        <div class="match-col">
          ${st.taxes.map(t => {
            const done = st.matched.has(t);
            const sel = st.selectedTaxe === t;
            return `<button class="match-item ${done ? "done" : ""} ${sel ? "sel" : ""}" data-type="taxe" data-val="${escapeHtml(t)}" ${done ? "disabled" : ""}>${escapeHtml(t)}</button>`;
          }).join("")}
        </div>
        <div class="match-col">
          ${st.taux.map(t => {
            const done = TAUX_PAIRS.some(p => p.taux === t && st.matched.has(p.taxe));
            return `<button class="match-item ${done ? "done" : ""}" data-type="taux" data-val="${escapeHtml(t)}" ${done ? "disabled" : ""}>${escapeHtml(t)}</button>`;
          }).join("")}
        </div>
      </div>
      <div id="matchFeedback"></div>
      <button class="btn ghost" id="gamesBackBtn" style="margin-top:16px">← Retour au menu</button>
    `;

    $$(".match-item").forEach(btn => {
      btn.addEventListener("click", () => clickMatch(btn.dataset.type, btn.dataset.val));
    });
    $("#gamesBackBtn").addEventListener("click", renderGamesMenu);
  }

  function clickMatch(type, val){
    const st = matchState;
    if(st.over) return;
    if(type === "taxe"){
      st.selectedTaxe = val;
      renderMatch();
      return;
    }
    if(!st.selectedTaxe) return;
    const pair = TAUX_PAIRS.find(p => p.taxe === st.selectedTaxe);
    const fb = $("#matchFeedback");
    if(pair && pair.taux === val){
      st.matched.add(st.selectedTaxe);
      st.score++;
      st.selectedTaxe = null;
      if(fb) fb.innerHTML = `<div class="quiz-fb-title ok">✅ Bonne paire !</div>`;
      if(st.matched.size === TAUX_PAIRS.length){
        st.over = true;
        if(st.score > (gamesStore.matchBest || 0)){
          gamesStore.matchBest = st.score;
          saveGames(gamesStore);
        }
        renderMatch();
        $("#matchFeedback").innerHTML = `
          <div class="quiz-result" style="margin-top:16px">
            <div class="quiz-result-mat">Match des taux</div>
            <div class="quiz-result-note">${st.score}<span>/${TAUX_PAIRS.length}</span></div>
            <div class="quiz-result-detail">${st.errors} erreur${st.errors > 1 ? "s" : ""}</div>
            <button class="btn" id="matchReplayBtn">Rejouer</button>
          </div>`;
        $("#matchReplayBtn").addEventListener("click", startMatch);
        return;
      }
      renderMatch();
      $("#matchFeedback").innerHTML = `<div class="quiz-fb-title ok">✅ Bonne paire !</div>`;
    } else {
      st.errors++;
      st.selectedTaxe = null;
      renderMatch();
      $("#matchFeedback").innerHTML = `<div class="correction-douce">Presque ! Réessaie, tu vas trouver 🤔</div>`;
    }
  }

  /* ---------- JEU 5 : CLASSER LES INCOTERMS ---------- */

  function startIncoterm(){
    incotermState = {
      cards: shuffle(INCOTERMS.map(i => i.code)),
      placed: {}, // code -> tas
      selected: null,
      score: 0,
      errors: 0,
      over: false
    };
    renderIncoterm();
  }

  function renderIncoterm(){
    const st = incotermState;
    const zone = $("#gamesContent");
    const remaining = st.cards.filter(c => !st.placed[c]);
    zone.innerHTML = `
      <div class="game-head">
        <span class="game-title">📦 Classer les incoterms</span>
        <span class="game-score">Score : <b>${st.score}</b> / ${INCOTERMS.length}</span>
      </div>
      <div class="incoterm-cards">
        ${remaining.map(c => `
          <button class="incoterm-card ${st.selected === c ? "sel" : ""}" data-code="${escapeHtml(c)}">${escapeHtml(c)}</button>
        `).join("") || '<div class="suivi-empty">Toutes les cartes sont placées.</div>'}
      </div>
      <div class="incoterm-bins">
        <button class="incoterm-bin" data-tas="peu">
          <div class="bin-title">Vendeur paie peu</div>
          <div class="bin-items">${Object.keys(st.placed).filter(c => st.placed[c] === "peu").map(c => `<span class="bin-chip">${escapeHtml(c)}</span>`).join("")}</div>
        </button>
        <button class="incoterm-bin" data-tas="tout">
          <div class="bin-title">Vendeur paie tout</div>
          <div class="bin-items">${Object.keys(st.placed).filter(c => st.placed[c] === "tout").map(c => `<span class="bin-chip">${escapeHtml(c)}</span>`).join("")}</div>
        </button>
      </div>
      <div id="incotermFeedback"></div>
      <button class="btn ghost" id="gamesBackBtn" style="margin-top:16px">← Retour au menu</button>
    `;

    $$(".incoterm-card").forEach(btn => {
      btn.addEventListener("click", () => {
        incotermState.selected = btn.dataset.code;
        renderIncoterm();
      });
    });
    $$(".incoterm-bin").forEach(btn => {
      btn.addEventListener("click", () => placeIncoterm(btn.dataset.tas));
    });
    $("#gamesBackBtn").addEventListener("click", renderGamesMenu);
  }

  function placeIncoterm(tas){
    const st = incotermState;
    if(!st.selected || st.over) return;
    const code = st.selected;
    const ref = INCOTERMS.find(i => i.code === code);
    const fb = $("#incotermFeedback");
    if(ref && ref.tas === tas){
      st.placed[code] = tas;
      st.score++;
      st.selected = null;
      if(Object.keys(st.placed).length === INCOTERMS.length){
        st.over = true;
        if(st.score > (gamesStore.incotermBest || 0)){
          gamesStore.incotermBest = st.score;
          saveGames(gamesStore);
        }
        renderIncoterm();
        $("#incotermFeedback").innerHTML = `
          <div class="quiz-result" style="margin-top:16px">
            <div class="quiz-result-mat">Classer les incoterms</div>
            <div class="quiz-result-note">${st.score}<span>/${INCOTERMS.length}</span></div>
            <div class="quiz-result-detail">${st.errors} erreur${st.errors > 1 ? "s" : ""}</div>
            <button class="btn" id="incotermReplayBtn">Rejouer</button>
          </div>`;
        $("#incotermReplayBtn").addEventListener("click", startIncoterm);
        return;
      }
      renderIncoterm();
      $("#incotermFeedback").innerHTML = `<div class="quiz-fb-title ok">✅ Bien placé !</div>`;
    } else {
      st.errors++;
      st.selected = null;
      renderIncoterm();
      $("#incotermFeedback").innerHTML = `<div class="correction-douce">Pas tout à fait… Réfléchis à qui paie quoi 🤔</div>`;
    }
  }

  /* ---------- JEU 6 : QUI VEUT GAGNER ---------- */

  function startQvg(){
    qvgState = {
      index: 0,
      score: 0,
      answered: false,
      jokers: {fifty: true, friend: true, public: true},
      hidden: [],
      over: false
    };
    renderQvg();
  }

  function renderQvg(){
    const st = qvgState;
    const zone = $("#gamesContent");
    if(st.index >= QVG_QUESTIONS.length){
      st.over = true;
      if(st.score > (gamesStore.qvgBest || 0)){
        gamesStore.qvgBest = st.score;
        saveGames(gamesStore);
      }
      zone.innerHTML = `
        <div class="quiz-result">
          <div class="quiz-result-mat">Qui veut gagner</div>
          <div class="quiz-result-note">${st.score}<span>/${QVG_QUESTIONS.length}</span></div>
          <div class="quiz-result-detail">${st.score === QVG_QUESTIONS.length ? "Sans faute, bravo ! 🏆" : "Continue à réviser 💪"}</div>
          <button class="btn" id="qvgReplayBtn">Rejouer</button>
          <button class="btn ghost" id="gamesBackBtn">← Retour au menu</button>
        </div>`;
      $("#qvgReplayBtn").addEventListener("click", startQvg);
      $("#gamesBackBtn").addEventListener("click", renderGamesMenu);
      return;
    }

    const q = QVG_QUESTIONS[st.index];
    zone.innerHTML = `
      <div class="game-head">
        <span class="game-title">🎯 Qui veut gagner</span>
        <span class="game-score">Question <b>${st.index + 1}</b> / ${QVG_QUESTIONS.length}</span>
      </div>
      <div class="qvg-jokers">
        <button class="qvg-joker" id="jokerFifty" ${st.jokers.fifty ? "" : "disabled"}>50/50</button>
        <button class="qvg-joker" id="jokerFriend" ${st.jokers.friend ? "" : "disabled"}>📞 Un ami</button>
        <button class="qvg-joker" id="jokerPublic" ${st.jokers.public ? "" : "disabled"}>👥 Public</button>
      </div>
      <div class="quiz-card">
        <div class="quiz-qnum">Difficulté ${st.index + 1} / ${QVG_QUESTIONS.length}</div>
        <div class="quiz-question">${escapeHtml(q.q)}</div>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt ${st.hidden.includes(i) ? "hidden-opt" : ""}" data-idx="${i}" ${st.hidden.includes(i) || st.answered ? "disabled" : ""}>${escapeHtml(opt)}</button>
          `).join("")}
        </div>
        <div class="quiz-feedback" id="qvgFeedback"></div>
      </div>
      <button class="btn ghost" id="gamesBackBtn" style="margin-top:16px">← Retour au menu</button>
    `;

    $$("#gamesContent .quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => answerQvg(parseInt(btn.dataset.idx, 10)));
    });
    $("#jokerFifty").addEventListener("click", useFifty);
    $("#jokerFriend").addEventListener("click", useFriend);
    $("#jokerPublic").addEventListener("click", usePublic);
    $("#gamesBackBtn").addEventListener("click", renderGamesMenu);
  }

  function useFifty(){
    const st = qvgState;
    if(!st.jokers.fifty || st.answered) return;
    st.jokers.fifty = false;
    const q = QVG_QUESTIONS[st.index];
    const wrong = q.options.map((_, i) => i).filter(i => i !== q.bonne);
    st.hidden = shuffle(wrong).slice(0, 2);
    renderQvg();
  }

  async function useFriend(){
    const st = qvgState;
    if(!st.jokers.friend || st.answered) return;
    st.jokers.friend = false;
    const q = QVG_QUESTIONS[st.index];
    const fb = $("#qvgFeedback");
    if(fb){
      fb.classList.add("show");
      fb.innerHTML = `<div class="correction-douce">📞 Ton ami réfléchit…</div>`;
    }
    try{
      const res = await fetch("/api/ai/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:"same-origin",
        body: JSON.stringify({message: "Question de quiz : " + q.q + "\nOptions : " + q.options.join(" / ") + "\nDonne seulement la bonne réponse parmi les options, en une phrase courte."})
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      const reply = (data && (data.answer || data.reply || data.response || data.message || data.content)) || "Je ne suis pas sûr…";
      if(fb) fb.innerHTML = `<div class="correction-douce">📞 Ton ami : ${escapeHtml(reply)}</div>`;
    }catch(e){
      if(fb) fb.innerHTML = `<div class="correction-douce">📞 Ton ami ne répond pas…</div>`;
    }
    renderQvg();
    const fb2 = $("#qvgFeedback");
    if(fb2) fb2.innerHTML = `<div class="correction-douce">📞 Ton ami a donné son avis.</div>`;
  }

  function usePublic(){
    const st = qvgState;
    if(!st.jokers.public || st.answered) return;
    st.jokers.public = false;
    const q = QVG_QUESTIONS[st.index];
    const fb = $("#qvgFeedback");
    if(fb){
      fb.classList.add("show");
      fb.innerHTML = `<div class="correction-douce">👥 Le public murmure : « ${escapeHtml(q.explication)} »</div>`;
    }
    renderQvg();
    const fb2 = $("#qvgFeedback");
    if(fb2) fb2.innerHTML = `<div class="correction-douce">👥 Le public murmure : « ${escapeHtml(q.explication)} »</div>`;
  }

  function answerQvg(idx){
    const st = qvgState;
    if(st.answered) return;
    st.answered = true;
    const q = QVG_QUESTIONS[st.index];
    const correct = idx === q.bonne;
    if(correct) st.score++;

    $$("#gamesContent .quiz-opt").forEach(btn => {
      const i = parseInt(btn.dataset.idx, 10);
      btn.disabled = true;
      if(i === q.bonne) btn.classList.add("good");
      else if(i === idx) btn.classList.add("bad");
    });

    const fb = $("#qvgFeedback");
    fb.classList.add("show");
    fb.innerHTML = `
      <div class="quiz-fb-title ${correct ? "ok" : "ko"}">${correct ? "✅ Bonne réponse !" : "❌ Raté"}</div>
      <div class="quiz-fb-exp">${escapeHtml(q.explication)}</div>
      <button class="btn quiz-next" id="qvgNextBtn">${st.index + 1 < QVG_QUESTIONS.length ? "Question suivante" : "Voir le résultat"}</button>
    `;
    $("#qvgNextBtn").addEventListener("click", () => {
      st.index++;
      st.answered = false;
      st.hidden = [];
      renderQvg();
    });
  }

  /* ---------- JEU 7 : DUEL CONTRE L'IA ---------- */

  function startDuel(){
    duelState = {
      index: 0,
      playerScore: 0,
      aiScore: 0,
      answered: false,
      questions: shuffle(QUIZ_BANK).slice(0, 5),
      over: false
    };
    renderDuel();
  }

  function renderDuel(){
    const st = duelState;
    const zone = $("#gamesContent");
    if(st.index >= st.questions.length){
      st.over = true;
      const win = st.playerScore > st.aiScore;
      const draw = st.playerScore === st.aiScore;
      if(st.playerScore > (gamesStore.duelBest || 0)){
        gamesStore.duelBest = st.playerScore;
        saveGames(gamesStore);
      }
      zone.innerHTML = `
        <div class="quiz-result">
          <div class="quiz-result-mat">Duel contre l'IA</div>
          <div class="duel-scores">
            <div class="duel-side"><div class="duel-label">Toi</div><div class="duel-val">${st.playerScore}</div></div>
            <div class="duel-vs">VS</div>
            <div class="duel-side"><div class="duel-label">Coach IA</div><div class="duel-val">${st.aiScore}</div></div>
          </div>
          <div class="quiz-result-detail">${win ? "🏆 Tu gagnes le duel !" : draw ? "🤝 Match nul !" : "😅 L'IA gagne cette fois…"}</div>
          <button class="btn" id="duelReplayBtn">Rejouer</button>
          <button class="btn ghost" id="gamesBackBtn">← Retour au menu</button>
        </div>`;
      $("#duelReplayBtn").addEventListener("click", startDuel);
      $("#gamesBackBtn").addEventListener("click", renderGamesMenu);
      return;
    }

    const q = st.questions[st.index];
    zone.innerHTML = `
      <div class="game-head">
        <span class="game-title">⚔️ Duel contre l'IA</span>
        <span class="game-score">Question <b>${st.index + 1}</b> / ${st.questions.length}</span>
      </div>
      <div class="duel-scores">
        <div class="duel-side"><div class="duel-label">Toi</div><div class="duel-val">${st.playerScore}</div></div>
        <div class="duel-vs">VS</div>
        <div class="duel-side"><div class="duel-label">Coach IA</div><div class="duel-val">${st.aiScore}</div></div>
      </div>
      <div class="quiz-card">
        <div class="quiz-qnum">${escapeHtml(q.matiere)}</div>
        <div class="quiz-question">${escapeHtml(q.q)}</div>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `<button class="quiz-opt" data-idx="${i}">${escapeHtml(opt)}</button>`).join("")}
        </div>
        <div class="quiz-feedback" id="duelFeedback"></div>
      </div>
      <button class="btn ghost" id="gamesBackBtn" style="margin-top:16px">← Retour au menu</button>
    `;

    $$("#gamesContent .quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => answerDuel(parseInt(btn.dataset.idx, 10)));
    });
    $("#gamesBackBtn").addEventListener("click", renderGamesMenu);
  }

  function answerDuel(idx){
    const st = duelState;
    if(st.answered) return;
    st.answered = true;
    const q = st.questions[st.index];
    const correct = idx === q.bonne;
    if(correct) st.playerScore++;

    // L'IA répond correctement 70 % du temps
    const aiCorrect = Math.random() < 0.7;
    if(aiCorrect) st.aiScore++;

    $$("#gamesContent .quiz-opt").forEach(btn => {
      const i = parseInt(btn.dataset.idx, 10);
      btn.disabled = true;
      if(i === q.bonne) btn.classList.add("good");
      else if(i === idx) btn.classList.add("bad");
    });

    const fb = $("#duelFeedback");
    fb.classList.add("show");
    fb.innerHTML = `
      <div class="quiz-fb-title ${correct ? "ok" : "ko"}">${correct ? "✅ Bonne réponse !" : "❌ Raté"}</div>
      <div class="quiz-fb-exp">${escapeHtml(q.explication)}</div>
      <div class="duel-ai-line">${aiCorrect ? "🤖 Le coach IA a trouvé." : "🤖 Le coach IA s'est trompé !"}</div>
      <button class="btn quiz-next" id="duelNextBtn">${st.index + 1 < st.questions.length ? "Question suivante" : "Voir le résultat"}</button>
    `;
    $("#duelNextBtn").addEventListener("click", () => {
      st.index++;
      st.answered = false;
      renderDuel();
    });
  }

  /* ---------- JEU 8 : MEMORY DES SIGLES ---------- */

  function startMemory(){
    const cards = [];
    MEMORY_PAIRS.forEach((p, i) => {
      cards.push({pairId:i, face:"sigle", text:p.sigle});
      cards.push({pairId:i, face:"def", text:p.def});
    });
    memoryState = {
      cards: shuffle(cards),
      flipped: [],
      matched: new Set(),
      tries: 0,
      lock: false,
      over: false
    };
    renderMemory();
  }

  function renderMemory(){
    const st = memoryState;
    const zone = $("#gamesContent");
    zone.innerHTML = `
      <div class="game-head">
        <span class="game-title">🃏 Memory des sigles</span>
        <span class="game-score">Essais : <b>${st.tries}</b></span>
      </div>
      <div class="memory-grid">
        ${st.cards.map((c, i) => {
          const isFlipped = st.flipped.includes(i) || st.matched.has(c.pairId);
          const isMatched = st.matched.has(c.pairId);
          return `
            <button class="memory-card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""}" data-idx="${i}" ${isFlipped || st.lock ? "disabled" : ""}>
              <span class="memory-front">?</span>
              <span class="memory-back ${c.face}">${escapeHtml(c.text)}</span>
            </button>`;
        }).join("")}
      </div>
      <div id="memoryFeedback"></div>
      <button class="btn ghost" id="gamesBackBtn" style="margin-top:16px">← Retour au menu</button>
    `;

    $$(".memory-card").forEach(btn => {
      btn.addEventListener("click", () => flipMemory(parseInt(btn.dataset.idx, 10)));
    });
    $("#gamesBackBtn").addEventListener("click", renderGamesMenu);
  }

  function flipMemory(idx){
    const st = memoryState;
    if(st.lock || st.flipped.includes(idx) || st.matched.has(st.cards[idx].pairId)) return;
    st.flipped.push(idx);
    if(st.flipped.length === 2){
      st.tries++;
      const [a, b] = st.flipped;
      const ca = st.cards[a], cb = st.cards[b];
      if(ca.pairId === cb.pairId && ca.face !== cb.face){
        st.matched.add(ca.pairId);
        st.flipped = [];
        renderMemory();
        if(st.matched.size === MEMORY_PAIRS.length){
          st.over = true;
          if(st.tries < (gamesStore.memoryBest || Infinity) || !gamesStore.memoryBest){
            gamesStore.memoryBest = st.tries;
            saveGames(gamesStore);
          }
          $("#memoryFeedback").innerHTML = `
            <div class="quiz-result" style="margin-top:16px">
              <div class="quiz-result-mat">Memory des sigles</div>
              <div class="quiz-result-note">${st.tries}<span> essais</span></div>
              <div class="quiz-result-detail">Toutes les paires trouvées !</div>
              <button class="btn" id="memoryReplayBtn">Rejouer</button>
            </div>`;
          $("#memoryReplayBtn").addEventListener("click", startMemory);
        }
      } else {
        st.lock = true;
        renderMemory();
        setTimeout(() => {
          st.flipped = [];
          st.lock = false;
          renderMemory();
        }, 900);
      }
    } else {
      renderMemory();
    }
  }

  /* ============================================================
     ÉTUDE — Fiches « À retenir »
     ============================================================ */

  let etudeState = {
    loaded: false,
    loading: false,
    error: null,
    items: [],
    matiere: "",
    fichier: "",
    fiche: null,
    generating: false
  };

  function etudeCacheKey(fichier){
    return "fiche:" + fichier;
  }

  function getFicheCache(fichier){
    try{
      const raw = localStorage.getItem(etudeCacheKey(fichier));
      if(!raw) return null;
      return JSON.parse(raw);
    }catch(e){ return null; }
  }

  function setFicheCache(fichier, fiche){
    try{ localStorage.setItem(etudeCacheKey(fichier), JSON.stringify(fiche)); }catch(e){}
  }

  /* ---------- Illustration de fiche (cache + génération) ---------- */

  function imgCacheKey(titre){
    return "img:" + titre;
  }

  function getImgCache(titre){
    try{ return localStorage.getItem(imgCacheKey(titre)) || null; }catch(e){ return null; }
  }

  function setImgCache(titre, dataUrl){
    try{ localStorage.setItem(imgCacheKey(titre), dataUrl); }catch(e){}
  }

  async function genererImageFiche(matiere, titre){
    const cached = getImgCache(titre);
    if(cached) return cached;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try{
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        signal: controller.signal,
        body: JSON.stringify({
          prompt: "illustration pédagogique, " + (matiere || "") + " : " + titre
        })
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(!res.ok || !data || !data.ok){
        const msg = (data && (data.error || data.message)) || ("Erreur serveur (" + res.status + ")");
        throw new Error(msg);
      }
      const img = data.image || data.dataUrl || data.url || "";
      if(!img) throw new Error("Image vide");
      setImgCache(titre, img);
      return img;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function initEtude(){
    const selMat = $("#etudeMatiere");
    const selCours = $("#etudeCours");
    if(!selMat || !selCours) return;

    if(etudeState.loading) return;
    etudeState.loading = true;

    try{
      const res = await fetch("/api/cours", {credentials:"same-origin"});
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(!res.ok || !data || !data.ok){
        etudeState.error = (data && data.error) || ("Erreur serveur (" + res.status + ")");
        etudeState.items = [];
      } else {
        etudeState.items = Array.isArray(data.cours) ? data.cours : [];
      }
    }catch(e){
      etudeState.error = "Impossible de charger les cours.";
      etudeState.items = [];
    }finally{
      etudeState.loading = false;
      etudeState.loaded = true;
    }

    // Remplir les matières uniques
    const matieres = Array.from(new Set(
      etudeState.items.map(c => c.matiere).filter(Boolean)
    )).sort((a,b) => a.localeCompare(b, "fr"));

    selMat.innerHTML = '<option value="">— Matière —</option>' +
      matieres.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("");

    selCours.innerHTML = '<option value="">— Choisis un cours —</option>';

    selMat.addEventListener("change", () => {
      etudeState.matiere = selMat.value;
      etudeState.fichier = "";
      etudeState.fiche = null;
      const list = etudeState.items
        .filter(c => c.matiere === etudeState.matiere)
        .sort((a,b) => String(a.fichier || "").localeCompare(String(b.fichier || ""), "fr"));
      selCours.innerHTML = '<option value="">— Choisis un cours —</option>' +
        list.map(c => `<option value="${escapeHtml(c.fichier || "")}">${escapeHtml(cleanFileName(c.fichier))}</option>`).join("");
      $("#etudeContent").innerHTML = "";
    });

    selCours.addEventListener("change", () => {
      etudeState.fichier = selCours.value;
      etudeState.fiche = null;
      renderEtudeSelection();
    });
  }

  function renderEtudeSelection(){
    const zone = $("#etudeContent");
    if(!zone) return;
    if(!etudeState.fichier){
      zone.innerHTML = "";
      return;
    }
    const cours = etudeState.items.find(c => c.fichier === etudeState.fichier);
    const titre = cours ? cleanFileName(cours.fichier) : etudeState.fichier;

    zone.innerHTML = `
      <div class="card etude-card">
        <h3 class="etude-title">${escapeHtml(titre)}</h3>
        <div class="etude-meta">${escapeHtml((cours && cours.matiere) || "")}</div>
        <button class="btn btn-ai" id="etudeGen">✨ Générer la fiche À retenir</button>
        <div id="etudeGenState"></div>
      </div>
    `;

    const btn = $("#etudeGen");
    if(btn) btn.addEventListener("click", genererFiche);
  }

  async function genererFiche(){
    if(etudeState.generating) return;
    const cours = etudeState.items.find(c => c.fichier === etudeState.fichier);
    if(!cours) return;

    const cached = getFicheCache(cours.fichier);
    if(cached){
      etudeState.fiche = cached;
      afficheFiche(cached);
      return;
    }

    etudeState.generating = true;
    const btn = $("#etudeGen");
    const state = $("#etudeGenState");
    if(btn) btn.disabled = true;
    if(state) state.innerHTML = '<div class="etude-loading">⏳ Génération de la fiche…</div>';

    try{
      const res = await fetch("/api/ai/fiche", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify({
          texte: cours.texte || "",
          titre: cleanFileName(cours.fichier)
        })
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }

      if(!res.ok || !data || !data.ok){
        const msg = (data && (data.error || data.message)) || ("Erreur serveur (" + res.status + ")");
        if(state) state.innerHTML = `<div class="etude-error">⚠️ ${escapeHtml(msg)}</div>`;
        return;
      }

      const fiche = data.fiche || data;
      etudeState.fiche = fiche;
      setFicheCache(cours.fichier, fiche);
      afficheFiche(fiche);
    }catch(e){
      if(state) state.innerHTML = '<div class="etude-error">⚠️ Impossible de générer la fiche.</div>';
    }finally{
      etudeState.generating = false;
      if(btn) btn.disabled = false;
    }
  }

  function afficheFiche(fiche){
    const zone = $("#etudeContent");
    if(!zone) return;

    const points = Array.isArray(fiche.points) ? fiche.points : [];
    const formules = Array.isArray(fiche.formules) ? fiche.formules : [];
    const sigles = Array.isArray(fiche.sigles) ? fiche.sigles : [];
    const pieges = Array.isArray(fiche.pieges) ? fiche.pieges : [];
    const mnemo = fiche.mnemo || "";

    const cours = etudeState.items.find(c => c.fichier === etudeState.fichier);
    const titre = cours ? cleanFileName(cours.fichier) : etudeState.fichier;

    const matiere = (cours && cours.matiere) || "";
    const imgCached = getImgCache(titre);

    let html = `
      <div class="card etude-card">
        <h3 class="etude-title">${escapeHtml(titre)}</h3>
        <div class="etude-meta">${escapeHtml(matiere)}</div>
        <button class="btn btn-ai" id="etudeListen">🔊 Écouter la fiche</button>
    `;

    if(points.length){
      html += `<div class="fiche-section">
        <div class="fiche-section-title">À retenir</div>
        <ol class="fiche-points">
          ${points.map(p => `<li>${escapeHtml(p)}</li>`).join("")}
        </ol>
      </div>`;
    }

    if(formules.length){
      html += `<div class="fiche-section">
        <div class="fiche-section-title">Formules</div>
        <div class="fiche-formules">
          ${formules.map(f => `<div class="fiche-formule">${escapeHtml(f)}</div>`).join("")}
        </div>
      </div>`;
    }

    if(sigles.length){
      html += `<div class="fiche-section">
        <div class="fiche-section-title">Sigles</div>
        <div class="fiche-sigles">
          ${sigles.map(s => {
            if(typeof s === "string") return `<span class="fiche-sigle">${escapeHtml(s)}</span>`;
            const code = s.sigle || s.code || "";
            const def = s.definition || s.def || "";
            return `<span class="fiche-sigle"><b>${escapeHtml(code)}</b>${def ? " — " + escapeHtml(def) : ""}</span>`;
          }).join("")}
        </div>
      </div>`;
    }

    if(pieges.length){
      html += `<div class="fiche-section">
        <div class="fiche-section-title">Pièges à éviter</div>
        <div class="fiche-pieges">
          ${pieges.map(p => `<div class="fiche-piege">⚠️ ${escapeHtml(p)}</div>`).join("")}
        </div>
      </div>`;
    }

    if(mnemo){
      html += `<div class="fiche-section">
        <div class="fiche-section-title">Mnémo</div>
        <div class="fiche-mnemo">💡 ${escapeHtml(mnemo)}</div>
      </div>`;
    }

    html += `<div class="fiche-section">
      <div class="fiche-section-title">Illustration</div>
      <div class="fiche-image-wrap">
        <button class="btn btn-img" id="etudeImgBtn">🎨 Illustration</button>
        <div id="etudeImgOut">${
          imgCached
            ? `<img class="fiche-image" src="${escapeHtml(imgCached)}" alt="Illustration de la fiche">`
            : ""
        }</div>
      </div>
    </div>`;

    html += `</div>`;
    zone.innerHTML = html;

    const listen = $("#etudeListen");
    if(listen) listen.addEventListener("click", () => {
      const texte = points.join(". ") + (mnemo ? ". " + mnemo : "");
      if(typeof window.lireTexte === "function") window.lireTexte(texte);
    });

    const imgBtn = $("#etudeImgBtn");
    if(imgBtn) imgBtn.addEventListener("click", async () => {
      const out = $("#etudeImgOut");
      if(!out) return;
      const cached = getImgCache(titre);
      if(cached){
        out.innerHTML = `<img class="fiche-image" src="${escapeHtml(cached)}" alt="Illustration de la fiche">`;
        return;
      }
      imgBtn.disabled = true;
      out.innerHTML = `<div class="fiche-image-msg">⏳ Génération…</div>`;
      try{
        const img = await genererImageFiche(matiere, titre);
        out.innerHTML = `<img class="fiche-image" src="${escapeHtml(img)}" alt="Illustration de la fiche">`;
      }catch(e){
        out.innerHTML = `<div class="fiche-image-msg err">🎨 Illustration indisponible pour l'instant. Réessaie dans un instant.</div>`;
      }finally{
        imgBtn.disabled = false;
      }
    });
  }

  /* ---- Génération d'image pour une fiche (via serveur Pollinations) ---- */
  async function genererImageFiche(matiere, titre){
    const cacheKey = "img:" + titre;
    try{
      const cache = localStorage.getItem(cacheKey);
      if(cache) return cache;
    }catch(e){}
    const res = await fetch("/api/ai/image", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "same-origin",
      body: JSON.stringify({prompt: "illustration pédagogique, " + (matiere || "") + " : " + titre})
    });
    let data = null;
    try{ data = await res.json(); }catch(e){ data = null; }
    if(!res.ok || !data || !data.ok || !(data.url || data.image)){
      throw new Error((data && data.error) || "Image indisponible");
    }
    try{ localStorage.setItem(cacheKey, (data.url || data.image)); }catch(e){}
    return (data.url || data.image);
  }

  /* ============================================================
     FLASHCARDS — Répétition espacée (SM-2)
     ============================================================ */

  const SM2_KEY = "sm2";
  const DAY_MS = 24 * 60 * 60 * 1000;

  function loadSM2(){
    try{
      const raw = localStorage.getItem(SM2_KEY);
      if(!raw) return {};
      const obj = JSON.parse(raw);
      return (obj && typeof obj === "object") ? obj : {};
    }catch(e){ return {}; }
  }

  function saveSM2(obj){
    try{ localStorage.setItem(SM2_KEY, JSON.stringify(obj)); }catch(e){}
  }

  let sm2Store = loadSM2();

  function sm2Get(id){
    const c = sm2Store[id];
    if(!c) return {interval:1, ease:2.5, due:0};
    return {
      interval: Number(c.interval) || 1,
      ease: Number(c.ease) || 2.5,
      due: Number(c.due) || 0
    };
  }

  function sm2Set(id, card){
    sm2Store[id] = card;
    saveSM2(sm2Store);
  }

  function sm2Due(id){
    const c = sm2Get(id);
    return c.due <= Date.now();
  }

  // SM-2 simplifié
  function sm2Review(id, savait){
    const c = sm2Get(id);
    let interval, ease;
    if(savait){
      interval = Math.max(1, Math.round(c.interval * c.ease));
      ease = Math.min(2.8, c.ease + 0.1);
    } else {
      interval = 1;
      ease = Math.max(1.3, c.ease - 0.2);
    }
    const card = {
      interval,
      ease: Math.round(ease * 100) / 100,
      due: Date.now() + interval * DAY_MS
    };
    sm2Set(id, card);
    marquerVue(id);
    return card;
  }

  // Cartes dues : non vues OU dues selon SM-2
  function cartesDuJour(){
    return QUIZ_BANK.filter(q => {
      const id = questionId(q);
      if(!questionVue(id)) return true;
      return sm2Due(id);
    });
  }

  let flashState = null;

  function updateFlashDueCount(){
    const el = $("#flashDueCount");
    if(!el) return;
    const due = cartesDuJour().length;
    const total = QUIZ_BANK.length;
    el.innerHTML = due > 0
      ? `<b>${due}</b> carte${due > 1 ? "s" : ""} à réviser sur ${total}`
      : `Aucune carte due — reviens plus tard ✨`;
    const btn = $("#flashStartBtn");
    if(btn) btn.disabled = due === 0;
  }

  function startFlashcards(){
    const cartes = cartesDuJour();
    if(!cartes.length){
      updateFlashDueCount();
      return;
    }
    // Mélange
    for(let i = cartes.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }
    flashState = {
      cartes,
      index: 0,
      flipped: false,
      done: 0
    };
    renderFlashcard();
  }

  function renderFlashcard(){
    const zone = $("#flashcardsZone");
    if(!zone) return;
    const st = flashState;
    if(!st || st.index >= st.cartes.length){
      renderFlashDone();
      return;
    }
    const q = st.cartes[st.index];
    const total = st.cartes.length;
    const progress = Math.round((st.index / total) * 100);

    zone.innerHTML = `
      <div class="flash-progress">
        <div class="flash-progress-bar" style="width:${progress}%"></div>
      </div>
      <div class="flash-counter">Carte ${st.index + 1} / ${total}</div>
      <div class="flash-scene">
        <div class="flash-card ${st.flipped ? "flipped" : ""}" id="flashCard">
          <div class="flash-face flash-front">
            <div class="flash-mat">${escapeHtml(q.matiere)}</div>
            <div class="flash-question">${escapeHtml(q.q)}</div>
            <button class="btn flash-flip-btn" id="flashFlipBtn">Retourner</button>
          </div>
          <div class="flash-face flash-back">
            <div class="flash-mat">${escapeHtml(q.matiere)}</div>
            <div class="flash-answer">✅ ${escapeHtml(q.options[q.bonne])}</div>
            <div class="flash-exp">${escapeHtml(q.explication)}</div>
            <div class="flash-actions">
              <button class="flash-btn flash-btn-good" id="flashGoodBtn">😊 Je savais</button>
              <button class="flash-btn flash-btn-bad" id="flashBadBtn">🤔 À revoir</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const flip = $("#flashFlipBtn");
    if(flip) flip.addEventListener("click", () => {
      st.flipped = true;
      const card = $("#flashCard");
      if(card) card.classList.add("flipped");
    });

    const good = $("#flashGoodBtn");
    if(good) good.addEventListener("click", () => answerFlashcard(true));
    const bad = $("#flashBadBtn");
    if(bad) bad.addEventListener("click", () => answerFlashcard(false));
  }

  function answerFlashcard(savait){
    const st = flashState;
    if(!st || st.index >= st.cartes.length) return;
    const q = st.cartes[st.index];
    const id = questionId(q);
    sm2Review(id, savait);
    marquerVue(id);
    st.done++;
    st.index++;
    st.flipped = false;
    updateFlashDueCount();
    renderFlashcard();
  }

  function renderFlashDone(){
    const zone = $("#flashcardsZone");
    if(!zone) return;
    const done = flashState ? flashState.done : 0;
    zone.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-mat">Cartes du jour</div>
        <div class="quiz-result-note">${done}<span> carte${done > 1 ? "s" : ""}</span></div>
        <div class="quiz-result-detail">Session terminée</div>
        <div class="quiz-result-msg">${done > 0 ? "Bien joué, ta mémoire te remercie ! 🧠" : "Aucune carte à réviser."}</div>
        <button class="btn" id="flashRestartBtn">Nouvelle session</button>
      </div>
    `;
    const btn = $("#flashRestartBtn");
    if(btn) btn.addEventListener("click", () => {
      flashState = null;
      startFlashcards();
    });
    updateFlashDueCount();
  }

  function initFlashcards(){
    const btn = $("#flashStartBtn");
    if(btn) btn.addEventListener("click", startFlashcards);
    updateFlashDueCount();
  }

  /* ============================================================
     ANGLAIS — Vocabulaire visuel TLT
     ============================================================ */

  let vocabState = {
    theme: "PORT",
    exo: null,
    score: 0,
    total: 0
  };

  function vocabImgKey(en){
    return "vocab:" + en;
  }

  function getVocabImg(en){
    try{ return localStorage.getItem(vocabImgKey(en)); }catch(e){ return null; }
  }

  function setVocabImg(en, url){
    try{ localStorage.setItem(vocabImgKey(en), url); }catch(e){}
  }

  async function fetchVocabImg(en){
    const cached = getVocabImg(en);
    if(cached) return cached;
    const res = await fetch("/api/ai/image", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "same-origin",
      body: JSON.stringify({prompt: "photo réaliste, " + en + ", port d'Abidjan"})
    });
    let data = null;
    try{ data = await res.json(); }catch(e){ data = null; }
    if(!res.ok || !data || !data.ok || !(data.url || data.image)){
      throw new Error((data && data.error) || "Image indisponible");
    }
    setVocabImg(en, (data.url || data.image));
    return (data.url || data.image);
  }

  async function playVocabAudio(en){
    try{
      if(_audioEnCours){ try{ _audioEnCours.pause(); }catch(e){} _audioEnCours = null; }
      if(speechAvailable()) window.speechSynthesis.cancel();
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify({text: en, lang: "en", speed: 1})
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(res.ok && data && data.ok && data.audio){
        _audioEnCours = new Audio(data.audio);
        _audioEnCours.play().catch(()=>{});
        return;
      }
      // Repli navigateur en anglais
      if(speechAvailable()){
        const u = new SpeechSynthesisUtterance(en);
        u.lang = "en-US";
        u.rate = 1;
        window.speechSynthesis.speak(u);
      }
    }catch(e){
      if(speechAvailable()){
        const u = new SpeechSynthesisUtterance(en);
        u.lang = "en-US";
        window.speechSynthesis.speak(u);
      }
    }
  }

  function renderVocabThemes(){
    const zone = $("#vocabThemes");
    if(!zone) return;
    zone.innerHTML = Object.keys(VOCAB).map(t => `
      <button class="vocab-theme ${vocabState.theme === t ? "active" : ""}" data-theme="${escapeHtml(t)}">${escapeHtml(t)}</button>
    `).join("");
    $$(".vocab-theme").forEach(btn => {
      btn.addEventListener("click", () => {
        vocabState.theme = btn.dataset.theme;
        vocabState.exo = null;
        renderVocabThemes();
        renderVocabGrid();
        const exoZone = $("#vocabExoZone");
        if(exoZone) exoZone.innerHTML = "";
      });
    });
  }

  function renderVocabGrid(){
    const zone = $("#vocabGrid");
    if(!zone) return;
    const mots = VOCAB[vocabState.theme] || [];
    zone.innerHTML = mots.map(m => {
      const img = getVocabImg(m.en);
      return `
        <div class="vocab-card">
          <div class="vocab-img-wrap">
            ${img
              ? `<img class="vocab-img" src="${escapeHtml(img)}" alt="${escapeHtml(m.en)}">`
              : `<div class="vocab-img vocab-img-loading" data-en="${escapeHtml(m.en)}">⏳</div>`}
          </div>
          <div class="vocab-body">
            <div class="vocab-en-row">
              <span class="vocab-en">${escapeHtml(m.en)}</span>
              <button class="vocab-audio" data-en="${escapeHtml(m.en)}" title="Écouter" aria-label="Écouter ${escapeHtml(m.en)}">🔊</button>
            </div>
            <div class="vocab-fr">${escapeHtml(m.fr)}</div>
            <div class="vocab-ex">${escapeHtml(m.ex)}</div>
          </div>
        </div>`;
    }).join("");

    $$(".vocab-audio").forEach(btn => {
      btn.addEventListener("click", () => playVocabAudio(btn.dataset.en));
    });

    // Chargement paresseux des images manquantes
    $$(".vocab-img-loading").forEach(el => {
      const en = el.dataset.en;
      fetchVocabImg(en).then(url => {
        const parent = el.parentNode;
        if(parent){
          parent.innerHTML = `<img class="vocab-img" src="${escapeHtml(url)}" alt="${escapeHtml(en)}">`;
        }
      }).catch(() => {
        el.textContent = "🖼️";
        el.classList.remove("vocab-img-loading");
      });
    });
  }

  function updateVocabScore(){
    const el = $("#vocabScore");
    if(!el) return;
    el.innerHTML = `Score : <b>${vocabState.score}</b> / ${vocabState.total}`;
  }

  function startVocabExo(){
    const mots = VOCAB[vocabState.theme] || [];
    if(mots.length < 4) return;
    const mode = Math.random() < 0.5 ? "photo-mot" : "mot-photo";
    const pool = shuffle(mots);
    const bonne = pool[0];
    const options = pool.slice(0, 4);
    vocabState.exo = {
      mode,
      bonne,
      options: shuffle(options),
      answered: false
    };
    renderVocabExo();
  }

  function renderVocabExo(){
    const zone = $("#vocabExoZone");
    if(!zone) return;
    const exo = vocabState.exo;
    if(!exo){
      zone.innerHTML = "";
      return;
    }

    if(exo.mode === "photo-mot"){
      const img = getVocabImg(exo.bonne.en);
      zone.innerHTML = `
        <div class="vocab-exo card">
          <div class="vocab-exo-title">📸 Photo → Mot</div>
          <div class="vocab-exo-img-wrap">
            ${img
              ? `<img class="vocab-exo-img" src="${escapeHtml(img)}" alt="Photo">`
              : `<div class="vocab-exo-img vocab-img-loading" data-en="${escapeHtml(exo.bonne.en)}">⏳</div>`}
          </div>
          <div class="vocab-exo-options">
            ${exo.options.map(o => `<button class="vocab-exo-opt" data-en="${escapeHtml(o.en)}">${escapeHtml(o.en)}</button>`).join("")}
          </div>
          <div class="vocab-exo-feedback" id="vocabExoFeedback"></div>
        </div>`;
    } else {
      zone.innerHTML = `
        <div class="vocab-exo card">
          <div class="vocab-exo-title">🔤 Mot → Photo</div>
          <div class="vocab-exo-word">${escapeHtml(exo.bonne.en)}</div>
          <div class="vocab-exo-options vocab-exo-options-img">
            ${exo.options.map(o => {
              const img = getVocabImg(o.en);
              return `<button class="vocab-exo-opt vocab-exo-opt-img" data-en="${escapeHtml(o.en)}">
                ${img
                  ? `<img class="vocab-exo-thumb" src="${escapeHtml(img)}" alt="${escapeHtml(o.en)}">`
                  : `<div class="vocab-exo-thumb vocab-img-loading" data-en="${escapeHtml(o.en)}">⏳</div>`}
              </button>`;
            }).join("")}
          </div>
          <div class="vocab-exo-feedback" id="vocabExoFeedback"></div>
        </div>`;
    }

    // Chargement des images manquantes
    $$("#vocabExoZone .vocab-img-loading").forEach(el => {
      const en = el.dataset.en;
      fetchVocabImg(en).then(url => {
        const parent = el.parentNode;
        if(parent){
          const cls = el.classList.contains("vocab-exo-thumb") ? "vocab-exo-thumb" : "vocab-exo-img";
          parent.innerHTML = `<img class="${cls}" src="${escapeHtml(url)}" alt="${escapeHtml(en)}">`;
        }
      }).catch(() => {
        el.textContent = "🖼️";
        el.classList.remove("vocab-img-loading");
      });
    });

    $$("#vocabExoZone .vocab-exo-opt").forEach(btn => {
      btn.addEventListener("click", () => answerVocabExo(btn.dataset.en));
    });
  }

  function answerVocabExo(en){
    const exo = vocabState.exo;
    if(!exo || exo.answered) return;
    exo.answered = true;
    const correct = en === exo.bonne.en;
    vocabState.total++;
    if(correct) vocabState.score++;
    updateVocabScore();

    $$("#vocabExoZone .vocab-exo-opt").forEach(btn => {
      btn.disabled = true;
      if(btn.dataset.en === exo.bonne.en) btn.classList.add("good");
      else if(btn.dataset.en === en) btn.classList.add("bad");
    });

    const fb = $("#vocabExoFeedback");
    if(fb){
      fb.innerHTML = `
        <div class="quiz-fb-title ${correct ? "ok" : "ko"}">${correct ? "✅ Well done !" : "❌ Presque !"}</div>
        <div class="quiz-fb-exp">${escapeHtml(exo.bonne.en)} = ${escapeHtml(exo.bonne.fr)} — ${escapeHtml(exo.bonne.ex)}</div>
        <button class="btn quiz-next" id="vocabExoNextBtn">Question suivante</button>
      `;
      const next = $("#vocabExoNextBtn");
      if(next) next.addEventListener("click", startVocabExo);
    }
  }

  function initAnglais(){
    renderVocabThemes();
    renderVocabGrid();
    updateVocabScore();
    const btn = $("#vocabExoBtn");
    if(btn) btn.addEventListener("click", startVocabExo);
  }

  /* ============================================================
     ASSISTANT — Coach IA + Voix off
     ============================================================ */

  let vitesseLecture = 1;
  let chatBusy = false;

  function speechAvailable(){
    return typeof window !== "undefined" &&
           "speechSynthesis" in window &&
           typeof window.SpeechSynthesisUtterance === "function";
  }

  let _audioEnCours = null;

  function _voixNavigateur(texte){
    if(!speechAvailable()) return false;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texte);
      u.lang = "fr-FR";
      u.rate = vitesseLecture;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
      return true;
    }catch(e){ return false; }
  }

  /* Voix off : Piper (vraie voix française côté serveur), repli navigateur. */
  async function lireTexte(texte){
    if(!texte || !texte.trim()) return;
    try{
      if(_audioEnCours){ try{ _audioEnCours.pause(); }catch(e){} _audioEnCours = null; }
      if(speechAvailable()) window.speechSynthesis.cancel();

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify({text: texte, speed: vitesseLecture})
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }

      if(res.ok && data && data.ok && data.audio){
        _audioEnCours = new Audio(data.audio);
        _audioEnCours.play().catch(()=>{});
        return;
      }
      if(!_voixNavigateur(texte)){
        alert((data && data.error) || "Voix indisponible.");
      }
    }catch(e){
      if(!_voixNavigateur(texte)) alert("Impossible de lancer la lecture vocale.");
    }
  }

  function stopVoix(){
    if(_audioEnCours){ try{ _audioEnCours.pause(); }catch(e){} _audioEnCours = null; }
    if(speechAvailable()) window.speechSynthesis.cancel();
  }

  function scrollChatBottom(){
    const box = $("#chatMessages");
    if(box) box.scrollTop = box.scrollHeight;
  }

  function addChatMessage(role, texte){
    const box = $("#chatMessages");
    if(!box) return null;
    const wrap = document.createElement("div");
    wrap.className = "chat-msg " + (role === "user" ? "user" : "coach");

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = texte;
    wrap.appendChild(bubble);

    if(role === "coach"){
      const actions = document.createElement("div");
      actions.className = "chat-actions";
      const listen = document.createElement("button");
      listen.className = "listen-btn";
      listen.type = "button";
      listen.innerHTML = "🔊 Écouter";
      listen.addEventListener("click", () => lireTexte(texte));
      actions.appendChild(listen);
      wrap.appendChild(actions);
    }

    box.appendChild(wrap);
    scrollChatBottom();
    return wrap;
  }

  function addThinking(){
    const box = $("#chatMessages");
    if(!box) return null;
    const wrap = document.createElement("div");
    wrap.className = "chat-msg coach thinking";
    wrap.innerHTML = '<div class="chat-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span> Coach réfléchit…</div>';
    box.appendChild(wrap);
    scrollChatBottom();
    return wrap;
  }

  function setChatBusy(v){
    chatBusy = v;
    const btn = $("#chatSend");
    if(btn) btn.disabled = v;
  }

  async function envoyerMessage(){
    if(chatBusy) return;
    const input = $("#chatInput");
    if(!input) return;
    const message = input.value.trim();
    if(!message) return;

    addChatMessage("user", message);
    input.value = "";
    setChatBusy(true);
    const thinking = addThinking();

    try{
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify({message})
      });

      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }

      if(thinking && thinking.parentNode) thinking.parentNode.removeChild(thinking);

      if(!res.ok){
        const errMsg = (data && (data.error || data.message)) || ("Erreur serveur (" + res.status + ")");
        addChatMessage("coach", "⚠️ " + errMsg);
        return;
      }

      const reply = (data && (data.answer || data.reply || data.response || data.message || data.content)) || "";
      if(!reply){
        addChatMessage("coach", "⚠️ Réponse vide du serveur.");
        return;
      }
      addChatMessage("coach", reply);
    }catch(err){
      if(thinking && thinking.parentNode) thinking.parentNode.removeChild(thinking);
      addChatMessage("coach", "⚠️ Impossible de contacter le coach. Vérifie ta connexion.");
    }finally{
      setChatBusy(false);
    }
  }

  function initAssistant(){
    const input = $("#chatInput");
    const send = $("#chatSend");
    const stop = $("#chatStop");

    if(send) send.addEventListener("click", envoyerMessage);

    if(input){
      input.addEventListener("keydown", (e) => {
        if(e.key === "Enter" && !e.shiftKey){
          e.preventDefault();
          envoyerMessage();
        }
      });
    }

    $$(".vitesse-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const v = parseFloat(btn.dataset.vitesse);
        if(!isNaN(v)) vitesseLecture = v;
        $$(".vitesse-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    if(stop){
      stop.addEventListener("click", () => { stopVoix(); });
    }

    if(!speechAvailable()){
      const box = $("#chatMessages");
      if(box){
        const warn = document.createElement("div");
        warn.className = "chat-msg coach";
        warn.innerHTML = '<div class="chat-bubble">ℹ️ La synthèse vocale n\'est pas disponible sur ce navigateur. Le chat fonctionne, mais le bouton « Écouter » sera inactif.</div>';
        box.appendChild(warn);
      }
    }
  }

  /* ============================================================
     BIENVENUE / GUIDE
     ============================================================ */

  const WELCOME_KEY = "bienvenue";

  function welcomeDejaVue(){
    try{ return localStorage.getItem(WELCOME_KEY) === "1"; }catch(e){ return false; }
  }

  function marquerBienvenueVue(){
    try{ localStorage.setItem(WELCOME_KEY, "1"); }catch(e){}
  }

  function ouvrirBienvenue(){
    const overlay = $("#welcomeOverlay");
    if(!overlay) return;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function fermerBienvenue(){
    const overlay = $("#welcomeOverlay");
    if(!overlay) return;
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    marquerBienvenueVue();
  }

  function initBienvenue(){
    const overlay = $("#welcomeOverlay");
    const start = $("#welcomeStartBtn");
    const help = $("#helpBtn");

    if(start) start.addEventListener("click", fermerBienvenue);
    if(overlay){
      overlay.addEventListener("click", (e) => {
        if(e.target === overlay) fermerBienvenue();
      });
    }
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape" && overlay && overlay.classList.contains("show")){
        fermerBienvenue();
      }
    });
    if(help) help.addEventListener("click", ouvrirBienvenue);

    // if(!welcomeDejaVue()) ouvrirBienvenue(); // désactivé : l'intro accueille déjà
  }

  /* ============================================================
     BANNIÈRES D'ONGLET (image générée, cache, file d'attente)
     ============================================================ */

  const BANNER_PROMPTS = {
    today:     "photo réaliste, port d'Abidjan, grues, conteneurs, lumière dorée, 16:9",
    evening:   "entrepôt logistique au coucher du soleil, 16:9",
    courses:   "bibliothèque, livres, transport logistique, 16:9",
    etude:     "étudiant révisant, cahiers, transport, 16:9",
    quiz:      "salle de classe, concentration, quiz, 16:9",
    games:     "jeu, défi, énergie, 16:9",
    anglais:   "Londres, transport, drapeau anglais, 16:9",
    assistant: "intelligence artificielle, coach, 16:9"
  };

  const bannerCache = {};      // tab -> url (mémoire)
  const bannerPending = {};    // tab -> true (en cours / déjà demandé)
  let bannerQueue = Promise.resolve();

  function bannerKey(tab){
    return "banner:" + tab;
  }

  function getBannerCache(tab){
    if(bannerCache[tab]) return bannerCache[tab];
    try{
      const v = localStorage.getItem(bannerKey(tab));
      if(v){ bannerCache[tab] = v; return v; }
    }catch(e){}
    return null;
  }

  function setBannerCache(tab, url){
    bannerCache[tab] = url;
    try{ localStorage.setItem(bannerKey(tab), url); }catch(e){}
  }

  function ensureBanner(tab){
    const section = $("#tab-" + tab);
    if(!section) return;
    let banner = section.querySelector(".tab-banner");
    if(!banner){
      banner = document.createElement("div");
      banner.className = "tab-banner";
      section.insertBefore(banner, section.firstChild);
    }
    if(banner.querySelector("img")) return;

    const cached = getBannerCache(tab);
    if(cached){
      afficherBanner(banner, cached);
      return;
    }
    if(bannerPending[tab]) return;
    bannerPending[tab] = true;

    const prompt = BANNER_PROMPTS[tab];
    if(!prompt){ bannerPending[tab] = false; return; }

    bannerQueue = bannerQueue.then(() => genererBanner(tab, prompt, banner))
      .catch(() => {})
      .finally(() => { bannerPending[tab] = false; });
  }

  function afficherBanner(banner, url){
    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.addEventListener("load", () => img.classList.add("loaded"));
    img.src = url;
    banner.innerHTML = "";
    banner.appendChild(img);
  }

  async function genererBanner(tab, prompt, banner){
    try{
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify({prompt})
      });
      let data = null;
      try{ data = await res.json(); }catch(e){ data = null; }
      if(!res.ok || !data || !data.ok || !(data.url || data.image)) return;
      setBannerCache(tab, (data.url || data.image));
      if(banner && banner.isConnected) afficherBanner(banner, (data.url || data.image));
    }catch(e){}
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
    ensureBanner(name);
    window.scrollTo({top:0, behavior:"smooth"});
  }

  /* ============================================================
     INIT
     ============================================================ */

  function safe(fn, nom){
    try{ fn(); }catch(e){ if(window.console) console.warn("init " + nom + ":", e); }
  }
  function on(sel, ev, fn){
    var el = $(sel); if(el) el.addEventListener(ev, fn);
  }

  function init(){
    /* 1) NAVIGATION EN PREMIER — toujours fonctionnelle */
    $$(".nav-btn").forEach(function(btn){
      btn.addEventListener("click", function(){ switchTab(btn.dataset.tab); });
    });

    /* 2) Contrôles (protégés) */
    safe(updateHeader, "header");
    setInterval(function(){ safe(updateHeader, "header-tick"); }, 1000);
    on("#searchInput", "input", function(e){ renderCourses(e.target.value); });
    on("#calcBtn", "click", computeDuty);
    on("#resetBtn", "click", resetDuty);
    on("#convEurBtn", "click", function(){ convert(RATES.EUR, "EUR"); });
    on("#convUsdBtn", "click", function(){ convert(RATES.USD, "USD"); });

    /* 3) Rendu de chaque partie (chacun protégé : une erreur ne bloque pas le reste) */
    safe(renderEscales, "escales");
    safe(renderConseil, "conseil");
    safe(renderToday, "today");
    safe(renderEvening, "evening");
    safe(function(){ renderCourses(""); }, "courses");
    safe(loadCours, "loadCours");
    safe(renderQuizSelector, "quiz");
    safe(renderGamesMenu, "games");
    safe(initEtude, "etude");
    safe(initFlashcards, "flashcards");
    safe(initAnglais, "anglais");
    safe(initAssistant, "assistant");
    safe(initBienvenue, "bienvenue");
    safe(renderSuivi, "suivi");

    var cc = $("#calcCount");
    if(cc) cc.textContent = (store && store.calcCount) || 0;

    setInterval(function(){ safe(renderToday, "today-tick"); }, 30000);

    var activeTab = document.querySelector(".tab.active");
    if(activeTab && activeTab.id && activeTab.id.indexOf("tab-") === 0){
      safe(function(){ ensureBanner(activeTab.id.slice(4)); }, "banner");
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Exposer la voix off pour le bouton flottant global
  window.lireTexte = lireTexte;
  window.stopVoix = stopVoix;
})();

/* ---------- Voix off flottante (globale) ---------- */
(function(){
  var btn = document.getElementById("voixFlottante");
  if(!btn) return;

  var enLecture = false;

  function setEtat(actif){
    enLecture = actif;
    btn.textContent = actif ? "⏹️" : "🔊";
    btn.classList.toggle("actif", actif);
    btn.title = actif ? "Arrêter la lecture" : "Écouter cette page";
  }

  btn.addEventListener("click", function(){
    if(enLecture){
      if(typeof window.stopVoix === "function") window.stopVoix();
      setEtat(false);
      return;
    }

    var tab = document.querySelector(".tab.active");
    if(!tab) return;

    var texte = (tab.textContent || "").replace(/\s+/g, " ").trim();
    if(!texte) return;
    if(texte.length > 1500) texte = texte.slice(0, 1500);

    if(typeof window.lireTexte === "function"){
      window.lireTexte(texte);
      setEtat(true);
    }
  });
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

/* Salutation cinéma selon l'heure */
(function(){
  var el = document.getElementById("cineHello");
  if(!el) return;
  var h = new Date().getHours();
  el.textContent = (h >= 18 || h < 5) ? "Bonsoir" : "Bonjour";
})();


  /* ===== ESCALES : carrousel vertical, une par une ===== */
  let _escaleIdx = 0, _escaleTimer = null, _escaleQueue = Promise.resolve();

  function escaleAfficher(i){
    const view = $("#escalesView");
    const dots = $("#escalesDots");
    if(!view || !TRAILERS.length) return;
    const t = TRAILERS[i];
    const total = TRAILERS.length;
    const cached = getTrailerCache(i);
    view.innerHTML = `
      <div class="escale-card">
        <div class="escale-img" id="escaleImg">
          ${cached ? `<img src="${escapeHtml(cached)}" alt="${escapeHtml(t.titre)}">`
                   : `<div class="escale-loading"><div class="escale-spin"></div><span>Image ${i+1}/${total}…</span></div>`}
        </div>
        <div class="escale-body">
          <div class="escale-num">ESCALE ${String(i+1).padStart(2,"0")} / ${String(total).padStart(2,"0")}</div>
          <div class="escale-title">${escapeHtml(t.titre)}</div>
          <div class="escale-text">${escapeHtml(t.texte)}</div>
        </div>
      </div>`;
    if(dots){
      dots.innerHTML = TRAILERS.map((_,k)=>`<button class="escale-dot ${k===i?"active":""}" data-i="${k}" aria-label="Escale ${k+1}"></button>`).join("");
      dots.querySelectorAll(".escale-dot").forEach(b=>{
        b.addEventListener("click", ()=>{ _escaleIdx=+b.dataset.i; escaleAfficher(_escaleIdx); escaleTimer(); });
      });
    }
    if(!cached) escaleCharger(i);
  }

  function escaleTimer(){
    if(_escaleTimer) clearInterval(_escaleTimer);
    _escaleTimer = setInterval(()=>{
      _escaleIdx = (_escaleIdx + 1) % TRAILERS.length;
      escaleAfficher(_escaleIdx);
    }, 6500);
  }

  function escaleCharger(i){
    const t = TRAILERS[i];
    _escaleQueue = _escaleQueue.then(async ()=>{
      if(getTrailerCache(i)) return;
      try{
        const res = await fetch("/api/ai/image", {
          method:"POST", headers:{"Content-Type":"application/json"},
          credentials:"same-origin",
          body: JSON.stringify({prompt:"photo réaliste, " + t.titre + ", Côte d'Ivoire, logistique, 16:9"})
        });
        const data = await res.json();
        if(!data || !data.ok || !(data.url || data.image)) return;
        setTrailerCache(i, (data.url || data.image));
        const box = $("#escaleImg");
        if(box && _escaleIdx === i){
          box.innerHTML = `<img src="${escapeHtml((data.url || data.image))}" alt="${escapeHtml(t.titre)}">`;
        }
      }catch(e){}
    }).catch(()=>{});
  }

  function renderEscales(){
    _escaleIdx = 0;
    escaleAfficher(0);
    escaleTimer();
  }

  /* ===== CONSEIL DU MOMENT (un par un) ===== */
  let _conseilIdx = 0, _conseilTimer = null;

  function renderConseil(){
    const el = $("#conseilCard");
    if(!el) return;
    const items = (typeof TICKER_CONSEILS !== "undefined" && TICKER_CONSEILS.length)
      ? TICKER_CONSEILS : CONSEILS;
    if(!items || !items.length) return;
    function afficher(i){
      el.innerHTML = `<span class="conseil-ico">💡</span><span class="conseil-txt">${escapeHtml(items[i])}</span>`;
      el.classList.remove("fade");
      void el.offsetWidth;
      el.classList.add("fade");
    }
    afficher(0);
    if(_conseilTimer) clearInterval(_conseilTimer);
    _conseilTimer = setInterval(()=>{
      _conseilIdx = (_conseilIdx + 1) % items.length;
      afficher(_conseilIdx);
    }, 6000);
  }


  /* ===== LES MODES DE TRANSPORT (images qui s'actualisent) ===== */
  const MODES = [
    {id:"routier", titre:"Transport routier", desc:"Le dernier kilomètre, partout en Côte d'Ivoire.",
     prompts:["photo réaliste, camion semi-remorque sur route ivoirienne, port d'Abidjan","photo réaliste, convoi de camions citernes, autoroute, Côte d'Ivoire"]},
    {id:"ferroviaire", titre:"Transport ferroviaire", desc:"SITARAIL — le rail qui relie Ouaga à Abidjan.",
     prompts:["photo réaliste, train de marchandises SITARAIL, rails, gare","photo réaliste, locomotive diesel, wagons, campagne ivoirienne"]},
    {id:"maritime", titre:"Transport maritime", desc:"Le port autonome d'Abidjan, porte de l'Afrique de l'Ouest.",
     prompts:["photo réaliste, porte-conteneurs au port d'Abidjan","photo réaliste, grues portuaires, conteneurs, terminal TC1 Abidjan"]},
    {id:"aerien", titre:"Transport aérien", desc:"L'aéroport FHB — vite, loin, précieux.",
     prompts:["photo réaliste, avion cargo à l'aéroport FHB Abidjan","photo réaliste, avion de fret, piste, marchandises"]},
    {id:"entrepots", titre:"Gestion des Opérations Logistiques", desc:"Les grands entrepôts où tout commence.",
     prompts:["photo réaliste, grand entrepôt logistique, racks, palettes","photo réaliste, entrepôt moderne, chariots élévateurs, conteneurs"]}
  ];

  let _modesQueue = Promise.resolve();
  function modeCle(m, k){ return "mode:" + m.id + ":" + k; }
  function modeCache(m, k){ try{ return localStorage.getItem(modeCle(m, k)); }catch(e){ return null; } }

  async function modeGenerer(m, k){
    try{
      const res = await fetch("/api/ai/image", {
        method:"POST", headers:{"Content-Type":"application/json"},
        credentials:"same-origin",
        body: JSON.stringify({prompt: m.prompts[k]})
      });
      const data = await res.json();
      if(!data || !data.ok || !(data.url || data.image)) return null;
      try{ localStorage.setItem(modeCle(m, k), (data.url || data.image)); }catch(e){}
      return (data.url || data.image);
    }catch(e){ return null; }
  }

  function renderModes(){
    const zone = $("#modesZone");
    if(!zone) return;
    zone.innerHTML = MODES.map(m => `
      <div class="mode-card" data-mode="${m.id}">
        <div class="mode-badge">${m.id === "entrepots" ? "GDE" : "MODE"}</div>
        <div class="mode-img" id="modeImg-${m.id}">
          ${modeCache(m,0) ? `<img src="${escapeHtml(modeCache(m,0))}" alt="${escapeHtml(m.titre)}">` : `<div class="mode-loading">🎬</div>`}
        </div>
        <div class="mode-body">
          <div class="mode-title">${escapeHtml(m.titre)}</div>
          <div class="mode-desc">${escapeHtml(m.desc)}</div>
        </div>
      </div>`).join("");

    MODES.forEach(m => {
      _modesQueue = _modesQueue.then(async () => {
        if(modeCache(m,0)) return;
        const img = await modeGenerer(m, 0);
        if(img){
          const box = $("#modeImg-" + m.id);
          if(box) box.innerHTML = `<img src="${escapeHtml(img)}" alt="${escapeHtml(m.titre)}">`;
        }
      }).catch(()=>{});
    });

    if(window._modesTimer) clearInterval(window._modesTimer);
    let idx = 0;
    window._modesTimer = setInterval(async () => {
      const m = MODES[idx % MODES.length];
      idx++;
      const k = idx % 2;
      let img = modeCache(m, k) || await modeGenerer(m, k);
      if(img){
        const box = $("#modeImg-" + m.id);
        if(box) box.innerHTML = `<img src="${escapeHtml(img)}" alt="${escapeHtml(m.titre)}">`;
      }
    }, 9000);
  }

/* ===== INTRO CINÉMATIQUE ===== */
(function(){
  var intro = document.getElementById("intro");
  if(!intro) return;
  // Narration de l'intro (ElevenLabs, générée une seule fois côté serveur)
  try{
    if(!localStorage.getItem("introVu")){
      var _audioIntro = new Audio("/api/intro-audio");
      _audioIntro.volume = 0.95;
      _audioIntro.play().catch(function(){});
      window._audioIntro = _audioIntro;
    }
  }catch(e){}

  function fermer(){
    try{ if(window._audioIntro){ window._audioIntro.pause(); } }catch(e){}
    intro.classList.add("sortie");
    try{ localStorage.setItem("introVu","1"); }catch(e){}
    setTimeout(function(){ intro.style.display = "none"; }, 900);
  }
  var skip = document.getElementById("introSkip");
  if(skip) skip.addEventListener("click", fermer);
  // Fermer au moindre tap n'importe où (mobile inclus)
  intro.addEventListener("click", fermer);
  intro.addEventListener("touchstart", fermer, {passive:true});
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") fermer(); });
  setTimeout(fermer, 90500);
  try{
    if(localStorage.getItem("introVu") === "1"){
      intro.style.display = "none";
    }
  }catch(e){}
  window.revoirIntro = function(){
    var parent = intro.parentNode;
    if(!parent) return;
    var clone = intro.cloneNode(true);
    clone.style.display = "grid";
    clone.classList.remove("sortie");
    parent.replaceChild(clone, intro);
    intro = clone;
    var sk = clone.querySelector("#introSkip");
    if(sk) sk.addEventListener("click", fermer);
    setTimeout(fermer, 90500);
  };
})();


/* Nettoyage : supprime les anciennes images base64 du localStorage (quota) */
(function(){
  try{
    var prefixes = ["trailer:","mode:","vocab:","banner:","img:"];
    Object.keys(localStorage).forEach(function(k){
      if(!prefixes.some(function(p){ return k.indexOf(p) === 0; })) return;
      try{
        var v = localStorage.getItem(k);
        if(v && v.length > 100000) localStorage.removeItem(k);
      }catch(e){}
    });
  }catch(e){}
})();


/* PWA : service worker (installation Android) */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("/sw.js").catch(function(){});
  });
}
