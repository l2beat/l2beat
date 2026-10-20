import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { HttpClient } from '@l2beat/shared'

const DEPLOYED_KEY = 'cropsApiAttestationUid'
const WORKFLOW_DISPATCH_URL =
  'https://api.github.com/repos/l2beat/l2beat/actions/workflows/deploy-crops-api.yml/dispatches'

/**
 * Redeploys the CROPS API until it carries the current attestation, by running
 * its deploy workflow, which reads the attestation from the chain. The one it
 * was last deployed with is kept in the database, so a deploy that failed or
 * was cut short by a restart runs again on the next call.
 */
export class CropsApiDeployer {
  private readonly logger: Logger

  constructor(
    private readonly db: Database,
    private readonly http: HttpClient,
    private readonly githubToken: string,
    logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async ensureDeployed(uid: string | undefined) {
    const deployed = await this.db.appState.findByKey(DEPLOYED_KEY)
    if (deployed?.value === uid) {
      return
    }
    await this.deploy()
    if (uid === undefined) {
      await this.db.appState.deleteByKey(DEPLOYED_KEY)
    } else {
      await this.db.appState.insert({
        key: DEPLOYED_KEY,
        value: uid,
        updatedBy: 'CropsApiDeployer',
      })
    }
    this.logger.info('Deploy triggered', { uid })
  }

  private async deploy() {
    const res = await this.http.fetchRaw(WORKFLOW_DISPATCH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.githubToken}`,
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
}
