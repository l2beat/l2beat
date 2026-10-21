import { ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
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
    const projects = args.project
      ? [
          await ps.getProject({
            id: ProjectId(args.project),
            select: ['privacyInfo'],
          }),
        ]
      : await ps.getProjects({ select: ['privacyInfo'] })

    const headers: Record<string, string> = {
      accept: 'application/vnd.github+json',
    }
    if (process.env.GITHUB_TOKEN) {
      headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    for (const project of projects) {
      const client = project?.privacyInfo.referenceClient
      if (!project || !client) {
        if (args.project) {
          console.log(`${args.project} has no reference client`)
        }
        continue
      }

      const repo = client.repository.replace('https://github.com/', '')
      const { default_branch } = await getJson<Repository>(
        `https://api.github.com/repos/${repo}`,
        headers,
      )
      const comparison = await getJson<Comparison>(
        `https://api.github.com/repos/${repo}/compare/${client.commit}...${default_branch}`,
        headers,
      )

      if (comparison.ahead_by === 0) {
        console.log(`${project.id} (${client.name}): up to date`)
        continue
      }
      const files = (comparison.files ?? []).map((file) => file.filename)
      const readFirst = files.filter(
        (file) => READ_FIRST.test(file) && !NOISE.test(file),
      )
      console.log(
        `${project.id} (${client.name}): ${comparison.ahead_by} commit${comparison.ahead_by === 1 ? '' : 's'} ahead on ${default_branch}, ${files.length} files changed, ${readFirst.length} to read first`,
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

async function getJson<T>(url: string, headers: Record<string, string>) {
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error('GitHub request failed', {
      cause: { url, status: response.status },
    })
  }
  return (await response.json()) as T
}
