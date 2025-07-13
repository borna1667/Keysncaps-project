import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  siteName?: string
}

const defaultSEO = {
  title: "Keys 'n' Caps - Premium Mechanical Keyboards & Keycaps",
  description: "Discover premium mechanical keyboards, artisan keycaps, and custom accessories. Shop the finest collection of mechanical keyboards with worldwide shipping.",
  keywords: "mechanical keyboards, keycaps, artisan keycaps, custom keyboards, gaming keyboards, typing accessories",
  image: "https://keysncaps.com/Keys'n'Caps_logo_03.png",
  siteName: "Keys 'n' Caps",
  type: "website"
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = defaultSEO.siteName
}) => {
  const location = useLocation()
  
  const seoTitle = title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.title
  const seoDescription = description || defaultSEO.description
  const seoKeywords = keywords || defaultSEO.keywords
  const seoImage = image || defaultSEO.image
  const seoUrl = url || `https://keysncaps.com${location.pathname}`

  useEffect(() => {
    // Update title
    document.title = seoTitle

    // Update or create meta tags
    updateMetaTag('description', seoDescription)
    updateMetaTag('keywords', seoKeywords)
    
    // Open Graph tags
    updateMetaTag('og:title', seoTitle, 'property')
    updateMetaTag('og:description', seoDescription, 'property')
    updateMetaTag('og:image', seoImage, 'property')
    updateMetaTag('og:url', seoUrl, 'property')
    updateMetaTag('og:type', type, 'property')
    updateMetaTag('og:site_name', siteName, 'property')
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name')
    updateMetaTag('twitter:title', seoTitle, 'name')
    updateMetaTag('twitter:description', seoDescription, 'name')
    updateMetaTag('twitter:image', seoImage, 'name')
    
    // Additional SEO tags
    updateMetaTag('robots', 'index, follow', 'name')
    updateMetaTag('author', "Keys 'n' Caps", 'name')
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0', 'name')
    
    // Canonical URL
    updateLinkTag('canonical', seoUrl)
    
  }, [seoTitle, seoDescription, seoKeywords, seoImage, seoUrl, type, siteName])

  return null
}

function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
  
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, name)
    document.head.appendChild(meta)
  }
  
  meta.content = content
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
  
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  
  link.href = href
}

// Product-specific SEO helper
export const getProductSEO = (product: any): SEOProps => ({
  title: `${product.name} - Premium Mechanical Keyboard`,
  description: `${product.name} - ${product.description}. Shop premium mechanical keyboards with fast shipping. Price: $${product.price}`,
  keywords: `${product.name}, mechanical keyboard, ${product.brand}, gaming keyboard, ${product.switch_type}`,
  image: product.image,
  type: 'product'
})

// Category-specific SEO helper
export const getCategorySEO = (category: string): SEOProps => ({
  title: `${category} - Premium Mechanical Keyboards`,
  description: `Browse our collection of ${category.toLowerCase()} mechanical keyboards. Find the perfect keyboard for gaming, typing, and professional use.`,
  keywords: `${category}, mechanical keyboards, gaming keyboards, professional keyboards`,
  type: 'website'
})
