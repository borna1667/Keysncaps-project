import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getAllProducts } from '../data/products.ts';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// You can import your actual products data here
// For now, using mock data - replace with actual product fetching
// const mockProducts = [
//   { id: 'mechanical-keyboard-1', slug: 'corsair-k95-rgb', lastModified: '2024-01-15' },
//   { id: 'mechanical-keyboard-2', slug: 'logitech-g915', lastModified: '2024-01-20' },
//   { id: 'keycaps-1', slug: 'artisan-keycaps-set', lastModified: '2024-01-25' },
//   // Add more products as needed
// ]

const staticPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: 'about', priority: '0.8', changefreq: 'monthly' },
  { url: 'contact', priority: '0.7', changefreq: 'monthly' },
  { url: 'shipping-returns', priority: '0.6', changefreq: 'monthly' },
  { url: 'privacy', priority: '0.5', changefreq: 'yearly' },
  { url: 'terms', priority: '0.5', changefreq: 'yearly' },
  { url: 'products', priority: '0.9', changefreq: 'daily' },
  { url: 'new-arrivals', priority: '0.8', changefreq: 'daily' },
]

function generateSitemap() {
  const baseUrl = 'https://keysncaps.com'
  const currentDate = new Date().toISOString().split('T')[0]
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
  })

  // Add product pages - handle async getAllProducts
  getAllProducts().then(products => {
    products.forEach(product => {
      sitemap += `  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
    <lastmod>${product.lastModified || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
    })

    sitemap += `</urlset>`

    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
    fs.writeFileSync(sitemapPath, sitemap)
    console.log('Sitemap generated successfully at:', sitemapPath)
  }).catch(error => {
    console.error('Error generating sitemap:', error)
    // Generate sitemap with static pages only as fallback
    sitemap += `</urlset>`
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
    fs.writeFileSync(sitemapPath, sitemap)
    console.log('Sitemap generated with static pages only due to error:', sitemapPath)
  })
}

export { generateSitemap }

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap()
}
