import { Octokit } from '@octokit/rest'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Listing } from '../src/models/listing'

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

  const listings: Listing[] = issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body ?? '',
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
    }))

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
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})