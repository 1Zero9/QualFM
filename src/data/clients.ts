import { siteContent } from '../content/siteContent'

export type ClientEntry = {
  name: string
  websiteUrl: string
  logoSrc: string
  logoAlt: string
}

// Add or edit clients in content/site-content.json under the top-level clients list.
export const clients: ClientEntry[] = siteContent.clients.map((client) => ({
  name: client.name,
  websiteUrl: client.websiteUrl,
  logoSrc: client.logoSrc,
  logoAlt: client.logoAlt
}))
