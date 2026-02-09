import contentData from '../../content/site-content.json'

type TextItem = { id: string; text: string }
type GroupPoint = { id: string; text: string }
type ServiceGroup = {
  id: string
  title: string
  summary: string
  points: GroupPoint[]
}

type PageRegistryEntry = {
  id: string
  route: string
  menuLabel: string
  status: 'active' | 'planned' | 'removed'
  owner: string
  notes: string
  lastUpdated: string
}

export type SiteContent = {
  home: {
    hero: {
      kicker: string
      title: string
      body: string
      primaryCta: string
      secondaryCta: string
      whyTitle: string
      whyPoints: TextItem[]
    }
    coreServices: { title: string; pillars: TextItem[] }
    sectors: { title: string; intro: string; tags: TextItem[] }
    feedback: {
      title: string
      intro: string
      testimonials: Array<{ id: string; quote: string; author: string; company: string }>
    }
    trust: {
      title: string
      points: TextItem[]
      closing: string
      linkText: string
    }
    clients: { title: string; intro: string }
  }
  about: {
    hero: { title: string; subtitle: string }
    intro: { title: string; paragraphs: TextItem[] }
    values: { title: string; cards: Array<{ id: string; title: string; text: string }> }
    approach: { title: string; points: TextItem[] }
    scope: { title: string; paragraphs: TextItem[] }
    cta: { title: string; button: string }
  }
  services: {
    hero: { title: string; subtitle: string }
    intro: { title: string; body: string; note: string }
    groups: ServiceGroup[]
    credentials: { title: string; items: TextItem[]; flags: TextItem[] }
    cta: { title: string; body: string; button: string }
  }
  contact: {
    hero: { title: string; subtitle: string }
    direct: {
      title: string
      intro: string
      name: string
      phone: string
      emailPrimary: string
      emailSecondary: string
      address: string
    }
    form: {
      title: string
      intro: string
      nameLabel: string
      emailLabel: string
      messageLabel: string
      button: string
      subjectTemplate: string
      subjectFallback: string
    }
  }
  privacyPolicy: {
    hero: { title: string; subtitle: string }
    sections: Array<{ id: string; title: string; body: string }>
  }
  termsConditions: {
    hero: { title: string; subtitle: string }
    sections: Array<{ id: string; title: string; body: string }>
  }
  clients: Array<{ id: string; name: string; websiteUrl: string; logoSrc: string; logoAlt: string }>
  pageRegistry: PageRegistryEntry[]
}

export const siteContent = contentData as SiteContent

export function cloneSiteContent(): SiteContent {
  return JSON.parse(JSON.stringify(siteContent)) as SiteContent
}
