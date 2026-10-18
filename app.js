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