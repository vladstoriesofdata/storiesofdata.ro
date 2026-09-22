import type { Locale } from "../lib/site";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  email: string;
  photo: "vlad" | "irinel" | "attila";
}

export interface TeamCopy {
  heading: string;
  members: TeamMember[];
}

const en: TeamCopy = {
  heading: "Our Team",
  members: [
    {
      name: "Vlad Mihanta",
      role: "CEO AND FOUNDER",
      bio: "Coming from an entrepreneurial family, I’ve always wanted to have my own business. Stories of Data started out of my fascination with data. The fact that facets of the world can be represented and understood through data still amazes me, after 8 years in the industry.\n\nWith Stories of Data I strive to understand and express my understanding of the data we analyze in an accurate and beautiful way for everyone we work with.",
      email: "vlad@storiesofdata.com",
      photo: "vlad",
    },
    {
      name: "Irinel Cristea",
      role: "DATA ANALYST",
      bio: "My journey with data began during my studies in statistics and over the past years, I’ve turned that passion into a career. I’ve worked on everything from building reports, planning targets, forecasting sales using machine learning techniques to building data pipelines and BI solutions. Now, I’m focused on BI development and data engineering and while I’m skilled with several BI tools, now Power BI is my go-to. I enjoy doing the dirty work: taking raw, messy data, shaping it into clean pipelines, and delivering beautiful, insightful views - with a strong focus on user experience.",
      email: "irinel@storiesofdata.com",
      photo: "irinel",
    },
    {
      name: "Attila Csukás",
      role: "DATA ANALYST",
      bio: "I’ve always been interested in data. During my studies, statistics was my favourite subject because it showed me how patterns can be uncovered, assumptions tested, and conclusions grounded in evidence. With a background in marketing, I’ve worked in a variety of roles, applying my skills and creativity in different situations. Throughout that journey, my curiosity about data has remained a constant. At Stories of Data, I now bring these interests together. Using Microsoft Fabric, I collect and process data to turn it into practical, useful information.",
      email: "attila@storiesofdata.com",
      photo: "attila",
    },
  ],
};

const ro: TeamCopy = {
  heading: "Echipa noastră",
  members: [
    {
      name: "Vlad Mihanta",
      role: "CEO ȘI FONDATOR",
      bio: "Provin dintr-o familie de antreprenori și mi-am dorit dintotdeauna propria afacere. Stories of Data s-a născut din fascinația mea pentru date. Chiar și după 8 ani în industrie, mă uimește în continuare faptul că putem reprezenta și înțelege aspecte ale lumii prin intermediul datelor.\n\nPrin Stories of Data, îmi propun să înțeleg datele pe care le analizăm și să exprim această înțelegere cu precizie și într-o formă atrăgătoare pentru fiecare client alături de care lucrăm.",
      email: "vlad@storiesofdata.com",
      photo: "vlad",
    },
    {
      name: "Irinel Cristea",
      role: "ANALIST DE DATE",
      bio: "Parcursul meu în lumea datelor a început în timpul studiilor de statistică, iar în ultimii ani mi-am transformat pasiunea într-o carieră. Am lucrat la proiecte diverse: de la construirea rapoartelor, planificarea obiectivelor și prognozarea vânzărilor cu tehnici de machine learning până la construirea de data pipelines și soluții BI. Acum mă concentrez pe dezvoltare BI și data engineering și, deși lucrez cu mai multe instrumente BI, Power BI este alegerea mea principală. Îmi place munca din culise: să preiau date brute și dezordonate, să le transform în data pipelines curate și să livrez perspective clare și valoroase, acordând o atenție deosebită experienței utilizatorului.",
      email: "irinel@storiesofdata.com",
      photo: "irinel",
    },
    {
      name: "Attila Csukás",
      role: "ANALIST DE DATE",
      bio: "Datele m-au interesat dintotdeauna. În timpul studiilor, statistica a fost materia mea preferată, deoarece mi-a arătat cum putem descoperi tipare, testa ipoteze și formula concluzii bazate pe dovezi. Cu o pregătire în marketing, am lucrat în diverse roluri, folosindu-mi abilitățile și creativitatea în situații variate. Pe tot acest parcurs, curiozitatea mea față de date a rămas o constantă. La Stories of Data, îmbin acum aceste interese. Folosesc Microsoft Fabric pentru a colecta și prelucra date, transformându-le în informații utile, cu aplicabilitate practică.",
      email: "attila@storiesofdata.com",
      photo: "attila",
    },
  ],
};

export const team: Record<Locale, TeamCopy> = {
  en,
  ro,
};
