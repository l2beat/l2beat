import type { LinearSnapshot } from './types.js'

const ISSUE_ID = /\bL2B-\d+\b/i

/** PR body wins over the branch name: branches get reused across issues. */
export function findLinearIssueId(...texts: (string | null | undefined)[]) {
  for (const text of texts) {
    const match = text?.match(ISSUE_ID)?.[0]
    if (match) return match.toUpperCase()
  }
  return undefined
}

export interface LinearSource {
  snapshot(issueId: string): Promise<LinearSnapshot | null>
}

/** Snapshots pre-resolved elsewhere (e.g. via the Linear MCP), keyed by issue identifier. */
export class FileLinearSource implements LinearSource {
  constructor(private readonly snapshots: Record<string, LinearSnapshot>) {}

  snapshot(issueId: string) {
    return Promise.resolve(this.snapshots[issueId] ?? null)
  }
}

const QUERY = `query($id: String!) {
  issue(id: $id) {
    identifier title description url
    state { name }
    labels { nodes { name } }
    project {
      name description content
      initiatives { nodes { name description } }
    }
  }
}`

interface QueryResult {
  data?: {
    issue: {
      identifier: string
      title: string
      description: string | null
      url: string
      state: { name: string }
      labels: { nodes: { name: string }[] }
      project: {
        name: string
        description: string
        content: string | null
        initiatives: { nodes: { name: string; description: string }[] }
      } | null
    } | null
  }
  errors?: { message: string }[]
}

export class ApiLinearSource implements LinearSource {
  constructor(private readonly apiKey: string) {}

  async snapshot(issueId: string): Promise<LinearSnapshot | null> {
    const res = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.apiKey,
      },
      body: JSON.stringify({ query: QUERY, variables: { id: issueId } }),
    })
    const json = (await res.json()) as QueryResult
    const issue = json.data?.issue
    if (!issue) return null
    return {
      snapshotAt: new Date().toISOString(),
      issue: {
        identifier: issue.identifier,
        title: issue.title,
        description: issue.description ?? '',
        status: issue.state.name,
        labels: issue.labels.nodes.map((l) => l.name),
        url: issue.url,
      },
      project: issue.project
        ? {
            name: issue.project.name,
            summary: issue.project.description,
            description: issue.project.content ?? '',
          }
        : undefined,
      initiatives: issue.project?.initiatives.nodes ?? [],
    }
  }
}
