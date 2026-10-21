import {
  type ProjectPrivacyReferenceClient,
  ProjectService,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, optional, positional, string } from 'cmd-ts'

// Paths whose changes can move a network or insider cell: endpoints,
// requests, relayers, Tor, telemetry and key handling. A reading order, not
// a filter: anything else can matter too.
const READ_FIRST =
  /(^|[/._-])(rpc|egress|fetch|requests?|relay\w*|tor|proxy|sentry|telemetry|analytics|endpoints?|network|providers?|config|env|keys?|signer|auth)([/._-]|$)/i
const NOISE =
  /(^|\/)(tests?|__tests__|fixtures?|docs?|stories)\/|(^|[/_.])(tests?|spec|stories)\.\w+$|\.(test|spec|stories)\.|\.md$/i

const MAX_LISTED = 20

interface Repository {
  default_branch: string
}

interface Comparison {
  ahead_by: number
  files?: { filename: string }[]
}

export const ClientDrift = command({
  name: 'client-drift',
  description:
    "Lists what changed in a privacy project's reference client since the commit its ratings were reviewed against, or in every project's when none is given. Set GITHUB_TOKEN to lift GitHub's anonymous rate limit. Rebuild packages/config first.",
  args: {
    project: positional({
      type: optional(string),
      displayName: 'project',
    }),
  },
  handler: async (args) => {
    const ps = new ProjectService()
    const clients: { id: string; client: ProjectPrivacyReferenceClient }[] = []
    if (args.project) {
      // `select` would drop a project without privacyInfo, so it would read
      // as unknown.
      const project = await ps.getProject({
        id: ProjectId(args.project),
        optional: ['privacyInfo'],
      })
      if (!project) {
        console.log(chalk.red(`Unknown project ${args.project}`))
        process.exitCode = 1
        return
      }
      const client = project.privacyInfo?.referenceClient
      if (!client) {
        console.log(`${project.id} has no reference client`)
        return
      }
      clients.push({ id: project.id, client })
    } else {
      const projects = await ps.getProjects({ select: ['privacyInfo'] })
      for (const project of projects) {
        const client = project.privacyInfo.referenceClient
        if (client) clients.push({ id: project.id, client })
      }
    }

    const headers: Record<string, string> = {
      accept: 'application/vnd.github+json',
    }
    if (process.env.GITHUB_TOKEN) {
      headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    for (const { id, client } of clients) {
      const repo = getGithubRepository(client.repository)
      const { default_branch } = await getJson<Repository>(
        `https://api.github.com/repos/${repo}`,
        headers,
      )
      const comparison = await getJson<Comparison>(
        `https://api.github.com/repos/${repo}/compare/${client.commit}...${default_branch}`,
        headers,
      )

      if (comparison.ahead_by === 0) {
        console.log(`${id} (${client.name}): up to date`)
        continue
      }
      const files = (comparison.files ?? []).map((file) => file.filename)
      const readFirst = files.filter(
        (file) => READ_FIRST.test(file) && !NOISE.test(file),
      )
      console.log(
        `${id} (${client.name}): ${comparison.ahead_by} commit${comparison.ahead_by === 1 ? '' : 's'} ahead on ${default_branch}, ${files.length} files changed, ${readFirst.length} to read first`,
      )
      console.log(
        `  ${client.repository}/compare/${client.commit}...${default_branch}`,
      )
      for (const file of readFirst.slice(0, MAX_LISTED)) {
        console.log(`  - ${file}`)
      }
      if (readFirst.length > MAX_LISTED) {
        console.log(`  - … ${readFirst.length - MAX_LISTED} more`)
      }
    }
  },
})

/** `owner/repo` of a https://github.com/owner/repo URL. */
function getGithubRepository(url: string): string {
  const parsed = URL.parse(url)
  const segments = parsed?.pathname.split('/').filter((s) => s.length > 0)
  if (parsed?.hostname !== 'github.com' || segments?.length !== 2) {
    throw new Error('Reference client repository is not a GitHub repository', {
      cause: { url },
    })
  }
  return segments.join('/')
}

async function getJson<T>(url: string, headers: Record<string, string>) {
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error('GitHub request failed', {
      cause: { url, status: response.status },
    })
  }
  return (await response.json()) as T
}
