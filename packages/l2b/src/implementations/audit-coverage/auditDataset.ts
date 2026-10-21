import { assert } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import { fetchGithub, getGithubRepository } from '../common/github'

export interface AuditDatasetFiles {
  index: string
  objects: Buffer
  repository: string
  commit: string
}

const INDEX_FILE = 'audit-index.json'
const OBJECTS_FILE = 'audit-objects.json.zst'
const BRANCH = 'main'

export function readAuditDataset(
  repositoryUrl: string,
  indexPath: string,
  objectsPath: string,
  commit: string,
): AuditDatasetFiles {
  return {
    index: readFileSync(indexPath, 'utf8'),
    objects: readFileSync(objectsPath),
    repository: getGithubRepository(repositoryUrl),
    commit,
  }
}

export async function fetchAuditDataset(
  repositoryUrl: string,
): Promise<AuditDatasetFiles> {
  const repository = getGithubRepository(repositoryUrl)
  const head = await fetchGithub(
    `https://api.github.com/repos/${repository}/commits/${BRANCH}`,
    { Accept: 'application/vnd.github.sha' },
  )
  const commit = await head.text()
  assert(commit.length === 40, `Unexpected commit of ${repository}: ${commit}`)
  const rawUrl = (file: string) =>
    `https://raw.githubusercontent.com/${repository}/${commit}/${file}`
  const [index, objects] = await Promise.all([
    fetchGithub(rawUrl(INDEX_FILE), {}).then((response) => response.text()),
    fetchGithub(rawUrl(OBJECTS_FILE), {}).then((response) =>
      response.arrayBuffer(),
    ),
  ])
  return { index, objects: Buffer.from(objects), repository, commit }
}
