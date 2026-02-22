import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type SeoMeta = {
  title: string
  description: string
  robots?: string
}

const DEFAULT_META: SeoMeta = {
  title: 'QualFM | Facilities & Maintenance Services Ireland',
  description:
    'QualFM delivers integrated facilities and maintenance services across Ireland, including fitout projects, electrical and mechanical maintenance, soft services, and compliance auditing.',
  robots: 'index, follow'
}

const ROUTE_META: Record<string, SeoMeta> = {
  '/': DEFAULT_META,
  '/about': {
    title: 'About QualFM | Quality, Compliance, Value',
    description:
      'Learn about QualFM, founded in December 2024 by Richard Seaver, and our compliance-led approach to facilities and maintenance services.',
    robots: 'index, follow'
  },
  '/services': {
    title: 'Facilities Services | QualFM Ireland',
    description:
      'Explore QualFM services: integrated FM, fitout projects up to EUR 1.5m, electrical and mechanical maintenance, soft services, and compliance auditing.',
    robots: 'index, follow'
  },
  '/contact': {
    title: 'Contact QualFM | Facilities & Maintenance Enquiries',
    description:
      'Contact QualFM for facilities and maintenance support, planned works, and project enquiries across Ireland.',
    robots: 'index, follow'
  },
  '/privacy-policy': {
    title: 'Privacy Policy | QualFM',
    description: 'Read the QualFM privacy policy and how we handle website enquiry information.',
    robots: 'index, follow'
  },
  '/terms-conditions': {
    title: 'Terms & Conditions | QualFM',
    description: 'Read the terms and conditions for using the QualFM website.',
    robots: 'index, follow'
  },
  '/terms': {
    title: 'Terms & Conditions | QualFM',
    description: 'Read the terms and conditions for using the QualFM website.',
    robots: 'index, follow'
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | QualFM',
    description: 'Read the terms and conditions for using the QualFM website.',
    robots: 'index, follow'
  },
  '/admin': {
    title: 'Admin Portal | QualFM',
    description: 'Admin portal resources for QualFM site administration.',
    robots: 'noindex, nofollow'
  },
  '/access': {
    title: 'Portal Access | QualFM',
    description: 'Choose Admin or Client Admin workspace for secure QualFM portal access.',
    robots: 'noindex, nofollow'
  },
  '/client-admin': {
    title: 'Client Admin Portal | QualFM',
    description: 'Client admin portal for submitting and tracking QualFM content updates.',
    robots: 'noindex, nofollow'
  },
  '/portal': {
    title: 'Client Admin Portal | QualFM',
    description: 'Legacy route for the client admin portal.',
    robots: 'noindex, nofollow'
  }
}

function setMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function SeoManager() {
  const location = useLocation()

  useEffect(() => {
    const normalizedPath = location.pathname.replace(/\/+$/, '') || '/'
    const meta = ROUTE_META[normalizedPath] ?? DEFAULT_META
    const origin = window.location.origin
    const canonicalUrl = `${origin}${normalizedPath}`
    const ogImage = `${origin}/images/qualfm-mainlogo.png`

    document.title = meta.title
    setMetaTag('name', 'description', meta.description)
    setMetaTag('name', 'robots', meta.robots ?? 'index, follow')
    setMetaTag('property', 'og:title', meta.title)
    setMetaTag('property', 'og:description', meta.description)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:url', canonicalUrl)
    setMetaTag('property', 'og:image', ogImage)
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', meta.title)
    setMetaTag('name', 'twitter:description', meta.description)
    setMetaTag('name', 'twitter:image', ogImage)
    setCanonical(canonicalUrl)
  }, [location.pathname])

  return null
}

export default SeoManager
