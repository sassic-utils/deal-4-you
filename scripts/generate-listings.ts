import { Octokit } from '@octokit/rest'
import sharp from 'sharp'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import type { Listing } from '../src/models/listing'
import { parseImagesSection } from '../src/services/listingsService'

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const MAX_IMAGE_WIDTH = 1600

async function optimizeImage(buffer: Buffer, extension: string): Promise<Buffer> {
  if (extension === '.gif') {
    return buffer
  }

  try {
    const image = sharp(buffer)
      .rotate()
      .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })

    if (extension === '.png') {
      return await image.png({ compressionLevel: 9 }).toBuffer()
    }

    if (extension === '.webp') {
      return await image.webp({ quality: 82 }).toBuffer()
    }

    if (extension === '.avif') {
      return await image.avif({ quality: 60 }).toBuffer()
    }

    return await image.jpeg({ quality: 82, mozjpeg: true }).toBuffer()
  } catch (error) {
    console.warn(`Failed to optimize image, keeping original: ${error}`)
    return buffer
  }
}

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
}

function guessExtensionFromUrl(url: string) {
  const pathname = new URL(url).pathname
  const ext = path.extname(pathname).toLowerCase()

  return /^\.(jpe?g|png|webp|gif|avif)$/.test(ext) ? ext.replace('jpeg', 'jpg') : ''
}

async function localizeIssueImages(issueNumber: number, body: string) {
  const imageEntries = parseImagesSection(body)
  const remoteImages = imageEntries.filter((entry) => entry.startsWith('http'))

  if (remoteImages.length === 0) {
    return body
  }

  await fs.mkdir(IMAGES_DIR, { recursive: true })

  let updatedBody = body

  for (let index = 0; index < remoteImages.length; index += 1) {
    const url = remoteImages[index]
    const paddedIssue = String(issueNumber).padStart(5, '0')
    const paddedIndex = String(index + 1).padStart(2, '0')
    const baseName = `${paddedIssue}-image-${paddedIndex}`

    const existingFile = existsSync(IMAGES_DIR)
      ? (await fs.readdir(IMAGES_DIR)).find((file) => file.startsWith(`${baseName}.`))
      : undefined

    if (existingFile) {
      updatedBody = updatedBody.split(url).join(existingFile)
      continue
    }

    const response = await fetch(url)

    if (!response.ok) {
      console.warn(`Failed to download image ${url}: ${response.status}`)
      continue
    }

    const contentType = response.headers.get('content-type') ?? ''
    const extension =
      EXTENSION_BY_CONTENT_TYPE[contentType] || guessExtensionFromUrl(url) || '.jpg'
    const fileName = `${baseName}${extension}`
    const filePath = path.join(IMAGES_DIR, fileName)

    const rawBuffer = Buffer.from(await response.arrayBuffer())
    const buffer = await optimizeImage(rawBuffer, extension)
    await fs.writeFile(filePath, buffer)

    console.log(
      `Saved image: ${fileName} (${rawBuffer.length} -> ${buffer.length} bytes)`,
    )

    updatedBody = updatedBody.split(url).join(fileName)
  }

  return updatedBody
}

const token = process.env.GITHUB_TOKEN
const repository = process.env.GITHUB_REPOSITORY

if (!token) {
  throw new Error('GITHUB_TOKEN is required')
}

if (!repository) {
  throw new Error('GITHUB_REPOSITORY is required')
}

const [owner, repo] = repository.split('/')

if (!owner || !repo) {
  throw new Error(`Invalid GITHUB_REPOSITORY: ${repository}`)
}

const octokit = new Octokit({
  auth: token,
})

async function main() {
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
    per_page: 100,
  })

  const openIssues = issues.filter((issue) => !issue.pull_request)
  const listings: Listing[] = []

  for (const issue of openIssues) {
    const body = await localizeIssueImages(issue.number, issue.body ?? '')

    listings.push({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body,
      state: issue.state,
      labels: issue.labels.map((label) => {
        if (typeof label === 'string') {
          return label
        }

        return label.name ?? ''
      }).filter(Boolean),
      url: issue.html_url,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
    })
  }

  const outputPath = path.join(
    process.cwd(),
    'public',
    'data',
    'listings.json',
  )

  await fs.mkdir(path.dirname(outputPath), {
    recursive: true,
  })

  await fs.writeFile(
    outputPath,
    JSON.stringify(listings, null, 2) + '\n',
    'utf8',
  )

  console.log(`Generated ${listings.length} listings`)
  console.log(`Output: ${outputPath}`)

  const siteUrl = `https://${owner}.github.io/${repo}/`
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
  const sitemapEntries = [
    { loc: siteUrl, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}donate`, changefreq: 'monthly', priority: '0.3' },
    ...listings.map((listing) => ({
      loc: `${siteUrl}listing/${listing.number}`,
      changefreq: 'weekly',
      priority: '0.6',
    })),
  ]

  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapEntries.map(
      (entry) =>
        `  <url>\n    <loc>${entry.loc}</loc>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`,
    ),
    '</urlset>',
    '',
  ].join('\n')

  await fs.writeFile(sitemapPath, sitemapXml, 'utf8')

  console.log(`Generated sitemap with ${sitemapEntries.length} URLs`)
  console.log(`Output: ${sitemapPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})