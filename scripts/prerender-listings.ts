import fs from 'node:fs/promises'
import path from 'node:path'
import { parseListings } from '../src/services/listingsService'
import { parsePriceAmount } from '../src/utils/parsePrice'
import type { Listing, ParsedListing } from '../src/models/listing'

const basePath = '/'
const siteUrl = 'https://www.deal4u.by/'

const distDir = path.join(process.cwd(), 'dist')

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function getImageUrl(image: string) {
  if (!image) {
    return ''
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  return `${siteUrl}images/${image}`
}

function parsePriceValue(priceText: string) {
  const amount = parsePriceAmount(priceText)

  if (amount === null) {
    return null
  }

  const currencySymbols: Record<string, string> = {
    '€': 'EUR',
    $: 'USD',
    '₽': 'RUB',
  }

  const symbolMatch = priceText.match(/[€$₽]/)
  const codeMatch = priceText.match(/\b(BYN|EUR|USD|RUB|PLN|GBP)\b/i)

  const currency = symbolMatch
    ? currencySymbols[symbolMatch[0]]
    : codeMatch?.[0].toUpperCase()

  return { amount, currency }
}

function buildDescription(listing: ParsedListing) {
  const source = listing.description || listing.title
  const singleLine = source.replace(/\s+/g, ' ').trim()
  const prefix = listing.state === 'open' ? '' : 'Продано. '

  const truncated =
    singleLine.length > 160 ? `${singleLine.slice(0, 157)}...` : singleLine

  return `${prefix}${truncated}`
}

function categoryLink(listing: ParsedListing) {
  const primaryCategory = listing.categories[0]

  return primaryCategory
    ? `${basePath}?category=${encodeURIComponent(primaryCategory)}`
    : basePath
}

function buildStaticContent(listing: ParsedListing) {
  const parts: string[] = []
  const isSold = listing.state !== 'open'
  const primaryCategory = listing.categories[0]

  parts.push(`<h1>${escapeHtml(listing.title)}</h1>`)

  if (isSold) {
    const linkText = primaryCategory
      ? `Похожие предложения в категории «${primaryCategory}»`
      : 'Все объявления'

    parts.push(
      `<p><strong>Товар продан.</strong> ` +
        `<a href="${categoryLink(listing)}">${escapeHtml(linkText)}</a></p>`,
    )
  }

  const meta: string[] = []
  if (listing.city) meta.push(escapeHtml(listing.city))
  if (listing.categories.length > 0) meta.push(escapeHtml(listing.categories.join(', ')))
  if (meta.length > 0) {
    parts.push(`<p>${meta.join(' · ')}</p>`)
  }

  if (listing.price) {
    parts.push(`<p><strong>${escapeHtml(listing.price)}</strong></p>`)
  }

  if (listing.image) {
    parts.push(
      `<img src="${escapeHtml(getImageUrl(listing.image))}" alt="${escapeHtml(listing.title)}" />`,
    )
  }

  if (listing.description) {
    parts.push(`<p>${escapeHtml(listing.description)}</p>`)
  }

  if (listing.contact) {
    parts.push(`<pre>${escapeHtml(listing.contact)}</pre>`)
  }

  parts.push(
    `<p><a href="${basePath}">← Все объявления на Free Board</a></p>`,
  )

  return parts.join('\n    ')
}

function buildJsonLd(listing: ParsedListing) {
  const price = listing.price ? parsePriceValue(listing.price) : null
  const image = listing.image ? getImageUrl(listing.image) : undefined

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description || listing.title,
    url: `${siteUrl}listing/${listing.number}`,
  }

  if (image) {
    jsonLd.image = image
  }

  if (price?.amount) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: price.amount,
      priceCurrency: price.currency ?? 'BYN',
      availability:
        listing.state === 'open'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${siteUrl}listing/${listing.number}`,
    }
  }

  return jsonLd
}

async function main() {
  const listingsPath = path.join(distDir, 'data', 'listings.json')
  const templatePath = path.join(distDir, 'index.html')

  const [listingsRaw, template] = await Promise.all([
    fs.readFile(listingsPath, 'utf8'),
    fs.readFile(templatePath, 'utf8'),
  ])

  const listings: Listing[] = JSON.parse(listingsRaw)
  const parsedListings = parseListings(listings)

  await Promise.all(
    parsedListings.map(async (listing) => {
      const pageTitle =
        listing.state === 'open'
          ? `${listing.title} — Free Board`
          : `${listing.title} (продано) — Free Board`
      const description = buildDescription(listing)
      const canonicalUrl = `${siteUrl}listing/${listing.number}`
      const image = listing.image ? getImageUrl(listing.image) : ''

      let html = template

      html = html.replace(
        /<title>.*?<\/title>/,
        `<title>${escapeHtml(pageTitle)}</title>`,
      )

      html = html.replace(
        /<meta\s+name="description"[^>]*\/>/,
        `<meta name="description" content="${escapeHtml(description)}" />`,
      )

      html = html.replace(
        /<link rel="canonical"[^>]*\/>/,
        `<link rel="canonical" href="${canonicalUrl}" />`,
      )

      html = html.replace(
        /<meta property="og:title"[^>]*\/>/,
        `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`,
      )

      html = html.replace(
        /<meta\s+property="og:description"[^>]*\/>/,
        `<meta property="og:description" content="${escapeHtml(description)}" />`,
      )

      html = html.replace(
        /<meta property="og:url"[^>]*\/>/,
        `<meta property="og:url" content="${canonicalUrl}" />`,
      )

      if (image) {
        html = html.replace(
          /<meta property="og:image"[^>]*\/>/,
          `<meta property="og:image" content="${escapeHtml(image)}" />`,
        )
      }

      html = html.replace(
        /<meta\s+name="twitter:title"[^>]*\/>/,
        `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`,
      )

      html = html.replace(
        /<meta\s+name="twitter:description"[^>]*\/>/,
        `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
      )

      if (image) {
        html = html.replace(
          /<meta name="twitter:image"[^>]*\/>/,
          `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
        )
      }

      const extraHead = [
        `<script type="application/ld+json">${escapeJsonLd(buildJsonLd(listing))}</script>`,
      ]
        .filter(Boolean)
        .join('\n  ')

      html = html.replace('</head>', `  ${extraHead}\n</head>`)

      html = html.replace(
        '<div id="root"></div>',
        `<div id="prerendered">\n    ${buildStaticContent(listing)}\n  </div>\n  <div id="root"></div>`,
      )

      const outputDir = path.join(distDir, 'listing', String(listing.number))
      await fs.mkdir(outputDir, { recursive: true })
      await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8')
    }),
  )

  console.log(`Prerendered ${parsedListings.length} listing pages`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
