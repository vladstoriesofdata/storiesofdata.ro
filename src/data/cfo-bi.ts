import type { Locale } from "../lib/site";

const en = {
  title: "CFO & BI at a fraction of the cost for your business.",
  intro: "Our team of financial experts and data analysts helps you gain clarity on your company’s finances and make the most of the data you work with every day.",
  back: "← All services", nav: ["Client stories", "AI data assistant", "Process", "Contact"],
  cards: [
    { title: "Financial clarity: CFO & BI", options: [
      ["Metrics", "We calculate the financial metrics that matter to your company."],
      ["Models", "We provide the 3 basic financial models. You can use them from day one to see your financial history, your current position and to project your next 10 financial years."],
      ["Specialised calculations", "We build specialised calculation models together with you."],
    ] },
    { title: "Financial advice: CFO", options: [
      ["Fractional CFO", "Whether you need one day or one day every week for the next two years, we offer a CFO just a phone call away."],
      ["Hard questions", "The time spent with the CFO may challenge you and sometimes even frustrate you, but you will always have options for resolving the problems and challenges you analyse."],
      ["Internal support", "Often the CFO knows what needs to be done but does not have the time or people with the expertise needed to implement financial decisions. We bring the time and expertise that supplement the efforts of your internal CFO."],
    ] },
    { title: "Data clarity: BI & CFO", options: [
      ["Data cleaning", "We clean up the inputs you work with."],
      ["Data enrichment", "We carry out data enrichment."],
      ["System integration", "We bring together data from systems that did not communicate before."],
    ] },
    { title: "Intelligent data platform: BI", options: [
      ["Single source", "We build the “primary source of truth” for your data."],
      ["Data flows", "We build flows that move your data automatically."],
      ["Semantic models", "We build the semantic models needed to define and track the KPIs that drive your business."],
      ["Integrated system", "We build the system that integrates all your data and keeps it fresh and accurate."],
    ] },
  ],
  software: "Financial, ERP and CRM software we can integrate",
  clients: "Companies we have delivered CFO & BI solutions for",
  stories: [
    { name: "Avi Air Fresh", title: "Real-time logistics, around the world", body: "Avi Air Fresh is an Amsterdam company transporting hundreds of tonnes of fresh produce by air around the world each year. Together, we built an intelligent data platform to track operations in real time, consolidate revenue and expenses, and strengthen customer relationships." },
    { name: "BTR Construction Group", title: "Connecting construction sites and finances, in real time", body: "BTR is a US developer with over $100M in projects underway. Together with a fractional CFO and the BI team, we consolidated the financial reporting for individual construction sites and the group, connected to a system that tracks construction milestones." },
  ],
  visit: "Visit website ↗", ai: "AI data assistant", aiTitle: "Let us show you what we do.",
  aiIntro: "Let’s look at an example dashboard with 8K+ publicly listed US companies. You can ask our trained AI about the data. Try it yourself!",
  howItWorks: "How it works", liveDemo: "Live demo",
  video: "How to use the AI data assistant", process: "Our process",
  steps: [
    ["1–2h", "A free meeting with a fractional CFO and an analyst", "Our first meeting is about understanding your business’s challenges and ambitions, and how we can help you specifically. This page already explains what we offer."],
    ["8–24h", "Working sessions", "We explore your data, processes and business priorities in depth, step by step."],
    ["2–6 months", "Technical implementation", "Financial models, a BI system, a data platform and automated data flows."],
    ["8–16h", "Monthly or quarterly retrospectives", "We evaluate the effectiveness of decisions, revisit priorities and challenges for the next financial cycle, and keep developing your business."],
  ],
  contact: "Let’s talk", contactIntro: "Have a question about our data platform and financial reporting, want a demonstration, or would like to explore a partnership?",
  email: "Send us an email", book: "Book a discovery call", target: "vs 22% target", metricIntro: "Track your margin against your target, updated automatically.",
  source: "Single source of truth", outputs: "Reports · Dashboards · Decisions", clean: "Clean, consistent, complete", cfo: "A CFO just a phone call away",
};

const ro: typeof en = {
  title: "CFO sau BI la o fracțiune din costuri pentru afacerea ta.",
  intro: "Echipa noastră de experți financiari și analiști de date te ajută să obții claritate asupra finanțelor companiei tale și să fructifici datele cu care operezi în fiecare zi.",
  back: "← Toate serviciile", nav: ["Testimoniale", "Asistent AI de date", "Proces", "Contact"],
  cards: [
    { title: "Claritate financiară: CFO & BI", options: [
      ["Metrici", "Calculăm metricile financiare relevante pentru compania ta."],
      ["Modele", "Îți oferim cele 3 modele financiare de bază. Le poți folosi din prima zi pentru a vedea istoricul financiar, situația actuală și pentru a-ți proiecta următorii 10 ani financiari."],
      ["Calcul specializat", "Construim modele de calcul specializate împreună cu tine."],
    ] },
    { title: "Consultanță financiară: CFO", options: [
      ["CFO fracționar", "Fie că ai nevoie de o zi sau o zi în fiecare săptămână pentru următorii 2 ani, noi îți oferim un CFO la un telefon distanță."],
      ["Întrebări grele", "Poate că timpul petrecut cu CFO te va provoca și uneori chiar frustra, dar vei avea mereu opțiuni de soluționare a problemelor și provocărilor analizate."],
      ["Asistență internă", "De multe ori CFO știe ce trebuie făcut dar nu are timpul sau oamenii cu expertiza necesară în a implementa deciziile financiare. Noi venim cu timpul și cu expertiza ce suplimentează eforturile CFO-ului intern."],
    ] },
    { title: "Claritate în date: BI & CFO", options: [
      ["Curățare date", "Curățăm input-urile cu care lucrezi."],
      ["Îmbogățire date", "Facem îmbogățire (enrichment) de date."],
      ["Integrare sisteme", "Punem date din sisteme ce nu comunicau înainte împreună."],
    ] },
    { title: "Platformă inteligentă de date: BI", options: [
      ["Sursă unică", "Construim “sursa primă de adevăr” a datelor."],
      ["Fluxuri de date", "Construim fluxurile de mișcare automată a datelor."],
      ["Modele semantice", "Construim modelele semantice necesare pentru definirea și urmărirea KPI-urilor ce îți conduc afacerea."],
      ["Sistem integrat", "Construim sistemul care integrează toate datele și le menține proaspete și corecte."],
    ] },
  ],
  software: "Software financiar, ERP și CRM pe care îl putem integra",
  clients: "Companii pentru care am livrat soluții CFO & BI",
  stories: [
    { name: "Avi Air Fresh", title: "Logistică în timp real, la nivel global", body: "Avi Air Fresh este o companie din Amsterdam care transportă sute de tone de produse proaspete anual pe cale aeriană în toată lumea. Am construit împreună cu Avi Air platforma inteligentă de date care le permite să-și urmărească operațiunile în timp real, să-și consolideze veniturile și cheltuielile și să-și consolideze relațiile cu clienții lor." },
    { name: "BTR Construction Group", title: "Corelăm șantierul cu finanțele, în timp real", body: "BTR este un dezvoltator american cu proiecte de peste $100M în desfășurare. Împreună cu un CFO fracționar și echipa de BI am consolidat toate rapoartele financiare necesare pentru operațiunile șantierelor individuale și a grupului, conectate la un sistem de urmărire a etapelor de construcție." },
  ],
  visit: "Vizitează ↗", ai: "Asistent AI de date", aiTitle: "Nu doar vorbim despre ce facem. Haide să îți și arătăm.",
  aiIntro: "Să ne uităm la un exemplu de dashboard cu 8K+ companii listate public din SUA. Poți întreba AI-ul nostru antrenat despre date. Încearcă și tu!",
  howItWorks: "Cum funcționează", liveDemo: "Demo live",
  video: "Cum să folosești Asistentul AI de date", process: "Proces",
  steps: [
    ["1–2h", "O întâlnire gratuită cu un CFO fracționar și un analist", "Nu pentru a ne prezenta oferta și serviciile. Această pagină prezintă deja ceea ce oferim. Prima întâlnire o facem pentru a înțelege problemele și ambițiile afacerii tale și cum te putem ajuta specific."],
    ["8–24h", "Întâlniri succesive de lucru", "Aprofundăm datele, procesele și prioritățile afacerii tale, pas cu pas."],
    ["2–6 luni", "Implementarea tehnică", "Modele financiare, sistem de BI, crearea platformei de date, automatizarea fluxurilor de date."],
    ["8–16h", "Retrospective lunare sau trimestriale", "Evaluăm eficacitatea deciziilor luate, reevaluăm prioritățile și problemele pentru următorul ciclu financiar și continuăm dezvoltarea companiei."],
  ],
  contact: "Hai să vorbim", contactIntro: "Ai o întrebare despre platforma noastră de date și rapoartele financiare, vrei o demonstrație sau vrei să explorezi o oportunitate de parteneriat?",
  email: "Scrie-ne un email", book: "Programează o discuție", target: "vs 22% target", metricIntro: "Urmărește marja față de target-ul pe care l-ai stabilit, actualizat automat.",
  source: "Sursă unică de adevăr", outputs: "Rapoarte · Dashboard-uri · Decizii", clean: "Date curate, consistente, complete", cfo: "Un CFO la un telefon distanță",
};

export const cfoBi: Record<Locale, typeof en> = { en, ro };

export const integrations = [
  ["SAGA", "https://www.sagasoft.ro/"], ["WinMentor", "https://www.winmentor.ro/"],
  ["SmartBill", "https://www.smartbill.ro/"], ["Oblio", "https://www.oblio.eu/"],
  ["FGO", "https://www.fgo.ro/"], ["NextUp", "https://nextup.ro/"],
  ["Charisma", "https://www.charisma.ro/"], ["Senior Software", "https://seniorsoftware.ro/"],
  ["SoftOne", "https://www.softone.ro/"], ["TeamFirst", "https://www.teamfirstsoftware.ro/"],
  ["Nexus ERP", "https://www.nexuserp.ro/"], ["Sostenia", "https://www.sostenia.ro/"],
  ["Salesforce", "https://www.salesforce.com/"], ["SAP", "https://www.sap.com/"], ["HubSpot", "https://www.hubspot.com/"],
];
export const clients = [
  ["Veridion", "https://veridion.com"], ["FintechOS", "https://fintechos.com"],
  ["Ecosulis", "https://ecosulis.co.uk"], ["Flow Traders", "https://www.flowtraders.com"],
  ["Flex Academies", "https://flexacademies.com"], ["Counter Point HCM", "https://counterpointhcm.com"],
  ["Avi Air Fresh", "https://aviairfresh.com"], ["BTR Construction Group", "https://www.thebtr.group"],
];

// Logo sources used by the original CFO + BI page; names remain as fallbacks.
export const companyLogos: Record<string, string> = {
  SmartBill: "https://cdn.cookielaw.org/logos/80df487c-62ab-4978-b310-891309e09de5/8256719c-990a-4e5a-bbaf-94da03426ac4/447f9f6e-8d31-4a20-b31b-1bd91e5448b3/logo-general.png",
  NextUp: "https://nextup.ro/wp-content/themes/livedesign/images/logo-nextup.png",
  "Senior Software": "https://seniorsoftwarecdn.b-cdn.net/wp-content/uploads/2026/02/senior-software-logo_yoast.jpg",
  SoftOne: "https://www.softone.ro/wp-content/themes/Softone/images/ENTERSOFTONE-LOGO-C.png",
  TeamFirst: "https://www.teamfirstsoftware.ro/team-first-software.webp",
  Salesforce: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/960px-Salesforce.com_logo.svg.png",
  SAP: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/1280px-SAP_2011_logo.svg.png",
  Veridion: "https://veridion.com/wp-content/themes/soleadify/assets/images/graphical-elements/mobile-logo.png",
  FintechOS: "https://fintechos.com/wp-content/uploads/2026/03/Dark.png",
  "Flex Academies": "https://flexacademies.com/wp-content/uploads/FLEX_new-logo_transparent-bk.png",
  "Counter Point HCM": "https://counterpointhcm.com/wp-content/uploads/2023/05/counterpoint-icon.png",
  "Avi Air Fresh": "https://www.werkopschiphol.nl/Thumbs/2560/0/90/CmsData/Images/Werkgevers/Aviair/logocaviaair.png",
  "BTR Construction Group": "https://images.squarespace-cdn.com/content/v1/6196ab5d4084223f4cf8c791/6954033e-69db-4bdb-b98b-b608975f8b9b/newlogoblue.png?format=1500w",
};
