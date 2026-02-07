export type ClientEntry = {
  name: string
  websiteUrl: string
  logoSrc: string
  logoAlt: string
}

// Add new clients here as needed. The homepage renders this list automatically.
export const clients: ClientEntry[] = [
  {
    name: 'Thérapie Clinic',
    websiteUrl: 'https://therapieclinic.com/ie',
    logoSrc: 'https://therapieclinic.com/_next/image?q=75&url=%2Fassets%2Ftherapie-logo-new.webp&w=1536',
    logoAlt: 'Thérapie Clinic logo'
  },
  {
    name: 'Optilase',
    websiteUrl: 'https://www.optilase.com/',
    logoSrc: '/images/clients/optilase-icon.png',
    logoAlt: 'Optilase logo'
  },
  {
    name: 'SurgiCube',
    websiteUrl: 'https://surgicube.com/',
    logoSrc: 'https://surgicube.com/wp-content/uploads/2015/08/geplakte-afbeelding-378-x-129.png',
    logoAlt: 'SurgiCube logo'
  },
  {
    name: 'Dental Medical Ireland',
    websiteUrl: 'https://www.dmi.ie/',
    logoSrc: 'https://s3-eu-west-1.amazonaws.com/webshop/data/thumbs/c2/c2bd5ed5f997a9cb853bd13f618d27a1ae79e800.png',
    logoAlt: 'Dental Medical Ireland logo'
  }
]
