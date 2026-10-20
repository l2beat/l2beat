import type { HttpClient } from '@l2beat/shared'

const WORKFLOW_DISPATCH_URL =
  'https://api.github.com/repos/l2beat/l2beat/actions/workflows/deploy-crops-api.yml/dispatches'

/**
 * Runs the crops-api deploy workflow, which reads the attestation from the
 * chain and republishes the API.
 */
export async function triggerCropsApiDeploy(
  http: HttpClient,
  token: string,
): Promise<void> {
  const res = await http.fetchRaw(WORKFLOW_DISPATCH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: { environment: 'production', force: 'true' },
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error('crops-api deploy dispatch failed', {
      cause: { status: res.status, body },
    })
  }
}
