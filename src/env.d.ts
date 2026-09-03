/// <reference types="astro/client" />

declare module "*.json?url" {
  const src: string;
  export default src;
}

interface Window {
  __homepageMoveTo?: (sectionName: string) => void;
}
