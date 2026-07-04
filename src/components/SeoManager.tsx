import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type SeoMeta = {
  title: string
  description: string
  robots?: string
}

const DEFAULT_META: SeoMeta = {
  title: 'Facilities Management Services Ireland | QualFM',
  description:
    'QualFM provides integrated facilities management and maintenance services across Ireland — electrical, mechanical, fitout projects, soft services, and compliance auditing.',
  robots: 'index, follow'
}

const ROUTE_META: Record<string, SeoMeta> = {
  '/': DEFAULT_META,
  '/about': {
    title: 'About QualFM | Facilities Management Company Ireland',
    description:
      'QualFM is a compliance-led facilities management company based in Dublin, serving commercial, pharmaceutical and healthcare clients across Ireland.',
    robots: 'index, follow'
  },
  '/services': {
    title: 'FM & Maintenance Services Ireland | Electrical, Mechanical, Fitout | QualFM',
    description:
      'QualFM services: integrated FM, planned and reactive maintenance, electrical and mechanical services, fitout projects up to €1.5m, soft services, and compliance auditing across Ireland.',
    robots: 'index, follow'
  },
  '/contact': {
    title: 'Contact QualFM | Facilities Management Enquiries Ireland',
    description:
      'Get in touch with QualFM for facilities management, planned maintenance, reactive works, and fitout project enquiries anywhere in Ireland.',
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
