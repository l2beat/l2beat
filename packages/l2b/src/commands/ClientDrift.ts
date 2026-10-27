import {
  type ProjectPrivacyReferenceClient,
  ProjectService,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import chalk from 'chalk'
import { command, optional, positional, string } from 'cmd-ts'
import {
  fetchGithub,
  getGithubRepository,
} from '../implementations/common/github'

// Paths whose changes can move a network or insider cell: endpoints,
// requests, relayers, Tor, telemetry and key handling. A reading order, not
// a filter: anything else can matter too.
const READ_FIRST =
  /(^|[/._-])(rpc|egress|fetch|requests?|relay\w*|tor|proxy|sentry|telemetry|analytics|endpoints?|network|providers?|config|env|keys?|signer|auth)([/._-]|$)/i
const NOISE =
  /(^|\/)(tests?|__tests__|fixtures?|docs?|stories)\/|(^|[/_.])(tests?|spec|stories)\.\w+$|\.(test|spec|stories)\.|\.md$/i

const MAX_LISTED = 20

const HEADERS = { accept: 'application/vnd.github+json' }

const Repository = v.object({ default_branch: v.string() })

const Comparison = v.object({
  ahead_by: v.number(),
  files: v.array(v.object({ filename: v.string() })).optional(),
})

interface ProjectClient {
  id: string
  name: string
  source: NonNullable<ProjectPrivacyReferenceClient['source']>
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
    const clients = await getProjectClients(args.project)
    for (const projectClient of clients) {
      await printDrift(projectClient)
    }
  },
})

async function getProjectClients(
  projectId: string | undefined,
): Promise<ProjectClient[]> {
  const ps = new ProjectService()
  if (projectId === undefined) {
    const projects = await ps.getProjects({ select: ['privacyInfo'] })
    return projects.flatMap((project) => {
      const client = project.privacyInfo.referenceClient
      return client?.source
        ? [{ id: project.id, name: client.name, source: client.source }]
        : []
    })
  }

  // `select` would drop a project without privacyInfo, so it would read as
  // unknown.
  const project = await ps.getProject({
    id: ProjectId(projectId),
    optional: ['privacyInfo'],
  })
  if (!project) {
    console.log(chalk.red(`Unknown project ${projectId}`))
    process.exitCode = 1
    return []
  }
  const client = project.privacyInfo?.referenceClient
  if (!client?.source) {
    console.log(`${project.id} has no open-source reference client`)
    return []
  }
  return [{ id: project.id, name: client.name, source: client.source }]
}

async function printDrift({ id, name, source }: ProjectClient): Promise<void> {
  const api = `https://api.github.com/repos/${getGithubRepository(source.repository)}`
  const { default_branch } = Repository.validate(
    await fetchGithub(api, HEADERS).then((response) => response.json()),
  )
  const comparison = Comparison.validate(
    await fetchGithub(
      `${api}/compare/${source.commit}...${default_branch}`,
      HEADERS,
    ).then((response) => response.json()),
  )

  if (comparison.ahead_by === 0) {
    console.log(`${id} (${name}): up to date`)
    return
  }
  const files = (comparison.files ?? []).map((file) => file.filename)
  const readFirst = files.filter(
    (file) => READ_FIRST.test(file) && !NOISE.test(file),
  )
  console.log(
    `${id} (${name}): ${comparison.ahead_by} commit${comparison.ahead_by === 1 ? '' : 's'} ahead on ${default_branch}, ${files.length} files changed, ${readFirst.length} to read first`,
  )
  console.log(
    `  ${source.repository}/compare/${source.commit}...${default_branch}`,
  )
  for (const file of readFirst.slice(0, MAX_LISTED)) {
    console.log(`  - ${file}`)
  }
  if (readFirst.length > MAX_LISTED) {
    console.log(`  - … ${readFirst.length - MAX_LISTED} more`)
  }
}
