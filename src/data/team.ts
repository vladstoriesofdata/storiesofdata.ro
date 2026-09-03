import type { Locale } from "../lib/site";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  email: string;
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
    },
    {
      name: "Irinel Cristea",
      role: "DATA ANALYST",
      bio: "My journey with data began during my studies in statistics and over the past years, I’ve turned that passion into a career. I’ve worked on everything from building reports, planning targets, forecasting sales using machine learning techniques to building data pipelines and BI solutions. Now, I’m focused on BI development and data engineering and while I’m skilled with several BI tools, now Power BI is my go-to. I enjoy doing the dirty work: taking raw, messy data, shaping it into clean pipelines, and delivering beautiful, insightful views - with a strong focus on user experience.",
      email: "irinel@storiesofdata.com",
    },
  ],
};

/** Romanian copy pending; English until translated. */
export const team: Record<Locale, TeamCopy> = {
  en,
  ro: en,
};
