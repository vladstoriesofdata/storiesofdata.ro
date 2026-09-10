import type { Locale } from "../lib/site";

export interface HeroChapter {
  heading: string;
  subheading: string;
  paragraphs: string[];
}

export interface HomeCopy {
  title: string;
  description: string;
  hero: {
    heading: string;
    lede: string;
    chapters: HeroChapter[];
  };
  portfolio: {
    heading: string;
    viewAll: string;
  };
  contact: {
    heading: string;
    subheading: string;
    body: string;
    email: string;
    phone: string;
    phoneHref: string;
  };
  form: {
    name: string;
    email: string;
    message: string;
    messagePlaceholder: string;
    privacy: string;
    privacyLink: string;
    submit: string;
    unconfigured: string;
  };
}

const en: HomeCopy = {
  title: "Microsoft Fabric and Power BI Consultancy Romania",
  description:
    "Stories of Data is a Microsoft Fabric and Power BI consultancy agency in Romania who have helped over 30 customers bring clarity to their data.",
  hero: {
    heading: "The specialized data analytics team",
    lede: "Bringing clarity to your Microsoft Fabric projects",
    chapters: [
      {
        heading: "Make your data work for you:",
        subheading: "we build data-driven applications",
        paragraphs: [
          "We have the necessary tools and processes to <strong>turn your data into valuable products</strong>, such as platforms to track investments, monetize datasets, and transform Excel models into user-friendly apps.",
          "<strong>Our data-driven solutions make data a part of the business logic</strong>, allowing for deeper analysis and insights. We help productize your services, particularly those with large amounts of data like financial, accounting, and analytical services.",
        ],
      },
      {
        heading: "Increase your SaaS value with data that is actually used by your users",
        subheading:
          "We Build Contextual Analytics That Makes Reporting Useful and Customers Turning Back For Insights",
        paragraphs: [
          "We help you<strong> unlock the power of data in existing third party platforms and startup products. </strong>By embedding customized data visualizations into these platforms, we empower users to make sense of complex data and make informed decisions.",
          'Our contextual analytics solution makes data readily available and interpretable without requiring users to export their data, therefore<strong> increasing the overall value of the platform.</strong><br/>Check out our demo platform that uses contextual analytics - <a href="https://embedsy.io/" target="_blank" rel="noreferrer"><strong>embedsy.io</strong></a>',
        ],
      },
      {
        heading: "Visualize what you couldn’t before",
        subheading: "We Build Custom-Made Visualizations That Help You Tell Your Story In A Unique Way",
        paragraphs: [
          "We design custom data visualizations that provide <strong>new and innovative ways to analyze and interpret your data.</strong> We help our clients gain valuable insights into their business operations, allowing them to make more informed decisions.",
          "Whether you need a dashboard that provides real-time performance metrics or a custom data visualization that highlights key trends and patterns, we have the expertise to help you <strong>unlock the full potential of your data</strong> and use it to drive business outcomes.",
        ],
      },
      {
        heading: "Become a data-driven and data-augmented organization with Power BI",
        subheading: "We Help Organizations Build Their Power BI. <em>Everything </em>there is in Power BI.",
        paragraphs: [
          "We are experts in Power BI, one of the most powerful business intelligence tools available. We develop intuitive and user-friendly data models tailored to your exact business needs, allowing you to gain deeper insights into your data and make more informed business decisions.",
          "We are experts at designing and developing custom visuals, building semantic models and managing Power BI tenants, ensuring that your data is secure and properly managed. Whether you are looking to improve your reporting, gain better insights or analyze trends, we have the experience and processes to help you achieve your goals using Power BI.",
        ],
      },
    ],
  },
  portfolio: {
    heading: "Portfolio",
    viewAll: "See all portfolio",
  },
  contact: {
    heading: "Get in touch",
    subheading: "Let’s talk about what you’re hoping Fabric can do for you.",
    body: "Bring us your situation. We will tell you honestly whether Fabric fits, what it will take, and what you can expect from working with us.",
    email: "info@storiesofdata.com",
    phone: "+40 741 234 567",
    phoneHref: "+40741234567",
  },
  form: {
    name: "Name",
    email: "Email",
    message: "What are you hoping fabric can do?",
    messagePlaceholder: "Describe your data situation. No need to have all the answers.",
    privacy: "By submitting this form you agree to our",
    privacyLink: "Privacy Policy",
    submit: "Send message",
    unconfigured: "Contact form is not configured in this environment.",
  },
};

const ro: HomeCopy = {
  title: "Consultanță Microsoft Fabric și Power BI în România",
  description:
    "Stories of Data este o agenție de consultanță Microsoft Fabric și Power BI din România, care a ajutat peste 30 de clienți să obțină claritate din datele lor.",
  hero: {
    heading: "Echipa specializată în analiza datelor",
    lede: "Aducem claritate în proiectele tale Microsoft Fabric",
    chapters: [
      {
        heading: "Pune datele să lucreze pentru tine:",
        subheading: "construim aplicații bazate pe date",
        paragraphs: [
          "Avem instrumentele și procesele necesare pentru a-ți <strong>transforma datele în produse valoroase</strong>, precum platforme pentru urmărirea investițiilor, monetizarea seturilor de date și transformarea modelelor Excel în aplicații ușor de folosit.",
          "<strong>Soluțiile noastre bazate pe date integrează datele în logica de business</strong>, permițând analize și perspective mai aprofundate. Te ajutăm să-ți transformi serviciile în produse, mai ales pe cele care folosesc volume mari de date, cum ar fi serviciile financiare, contabile și de analiză.",
        ],
      },
      {
        heading: "Crește valoarea produsului tău SaaS cu date pe care utilizatorii chiar le folosesc",
        subheading:
          "Construim soluții de analiză contextuală care fac raportarea utilă și îi determină pe clienți să revină pentru noi perspective",
        paragraphs: [
          "Te ajutăm să<strong> valorifici puterea datelor din platforme terțe existente și produse ale startup-urilor. </strong>Prin integrarea unor vizualizări de date personalizate în aceste platforme, le oferim utilizatorilor posibilitatea de a înțelege date complexe și de a lua decizii informate.",
          'Soluția noastră de analiză contextuală face datele ușor accesibile și de interpretat, fără ca utilizatorii să fie nevoiți să le exporte, <strong>crescând astfel valoarea generală a platformei.</strong><br/>Descoperă platforma noastră demonstrativă care folosește analiza contextuală: <a href="https://embedsy.io/" target="_blank" rel="noreferrer"><strong>embedsy.io</strong></a>',
        ],
      },
      {
        heading: "Vizualizează ceea ce până acum nu puteai",
        subheading: "Creăm vizualizări personalizate care te ajută să-ți spui povestea într-un mod unic",
        paragraphs: [
          "Proiectăm vizualizări de date personalizate, care oferă <strong>modalități noi și inovatoare de a analiza și interpreta datele.</strong> Îi ajutăm pe clienții noștri să obțină perspective valoroase asupra activității lor, astfel încât să poată lua decizii mai bine fundamentate.",
          "Fie că ai nevoie de un dashboard cu indicatori de performanță în timp real sau de o vizualizare personalizată care evidențiază tendințe și tipare esențiale, avem experiența necesară pentru a te ajuta să <strong>valorifici întregul potențial al datelor tale</strong> și să obții rezultate concrete pentru afacere.",
        ],
      },
      {
        heading: "Transformă-ți organizația într-una bazată și potențată de date, cu Power BI",
        subheading: "Ajutăm organizațiile să construiască în Power BI. <em>Tot ceea ce se poate construi </em>în Power BI.",
        paragraphs: [
          "Suntem experți în Power BI, unul dintre cele mai puternice instrumente de business intelligence disponibile. Dezvoltăm modele de date intuitive și ușor de folosit, adaptate exact nevoilor afacerii tale, astfel încât să înțelegi mai bine datele și să iei decizii mai bine fundamentate.",
          "Avem experiență în proiectarea și dezvoltarea vizualizărilor personalizate, construirea unui semantic model și administrarea tenant-urilor Power BI, astfel încât datele tale să fie sigure și gestionate corect. Indiferent dacă vrei să îmbunătățești raportarea, să obții perspective mai bune sau să analizezi tendințe, avem experiența și procesele necesare pentru a te ajuta să-ți atingi obiectivele cu Power BI.",
        ],
      },
    ],
  },
  portfolio: {
    heading: "Portofoliu",
    viewAll: "Vezi întregul portofoliu",
  },
  contact: {
    heading: "Contactează-ne",
    subheading: "Hai să discutăm despre ce îți dorești să obții cu Microsoft Fabric.",
    body: "Spune-ne cu ce situație te confrunți. Îți vom spune sincer dacă Microsoft Fabric este potrivit, ce presupune proiectul și la ce te poți aștepta atunci când lucrezi cu noi.",
    email: "info@storiesofdata.com",
    phone: "+40 741 234 567",
    phoneHref: "+40741234567",
  },
  form: {
    name: "Nume",
    email: "Email",
    message: "Ce îți dorești să obții cu Microsoft Fabric?",
    messagePlaceholder: "Descrie-ne situația datelor tale. Nu trebuie să ai deja toate răspunsurile.",
    privacy: "Prin trimiterea formularului, ești de acord cu",
    privacyLink: "Politica de confidențialitate",
    submit: "Trimite mesajul",
    unconfigured: "Formularul de contact nu este configurat în acest mediu.",
  },
};

export const home: Record<Locale, HomeCopy> = {
  en,
  ro,
};
