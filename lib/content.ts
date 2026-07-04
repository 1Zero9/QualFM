import contentData from "@/content/site-content.json";

type TextItem = { id: string; text: string };
type ServiceGroup = {
  id: string;
  title: string;
  summary: string;
  points: TextItem[];
};

export type SiteContent = {
  home: {
    hero: {
      kicker: string;
      title: string;
      body: string;
      primaryCta: string;
      secondaryCta: string;
      whyTitle: string;
      whyPoints: TextItem[];
    };
    coreServices: { title: string; pillars: TextItem[] };
    sectors: { title: string; intro: string; tags: TextItem[] };
    feedback: { title: string; intro: string };
    trust: {
      title: string;
      points: TextItem[];
      closing: string;
      linkText: string;
    };
    clients: { title: string; intro: string };
  };
  about: {
    hero: { title: string; subtitle: string };
    intro: { title: string; paragraphs: TextItem[] };
    values: {
      title: string;
      cards: Array<{ id: string; title: string; text: string }>;
    };
    approach: { title: string; points: TextItem[] };
    scope: { title: string; paragraphs: TextItem[] };
    cta: { title: string; button: string };
  };
  services: {
    hero: { title: string; subtitle: string };
    intro: { title: string; body: string; note: string };
    groups: ServiceGroup[];
    credentials: { title: string; items: TextItem[]; flags: TextItem[] };
    faq: {
      title: string;
      items: Array<{ id: string; question: string; answer: string }>;
    };
    cta: { title: string; body: string; button: string };
  };
  contact: {
    hero: { title: string; subtitle: string };
    direct: {
      title: string;
      intro: string;
      name: string;
      phone: string;
      emailPrimary: string;
      emailSecondary: string;
      address: string;
    };
    form: {
      title: string;
      intro: string;
      nameLabel: string;
      emailLabel: string;
      messageLabel: string;
      button: string;
    };
  };
  privacyPolicy: {
    hero: { title: string; subtitle: string };
    sections: Array<{ id: string; title: string; body: string }>;
  };
  termsConditions: {
    hero: { title: string; subtitle: string };
    sections: Array<{ id: string; title: string; body: string }>;
  };
  clients: Array<{
    id: string;
    name: string;
    websiteUrl: string;
    logoSrc: string;
    logoAlt: string;
  }>;
};

export const siteContent = contentData as unknown as SiteContent;
