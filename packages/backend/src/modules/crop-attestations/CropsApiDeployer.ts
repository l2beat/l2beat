import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

const DISPATCHED_KEY = 'cropsApiDispatchedUid'
const WORKFLOW_DISPATCH_URL =
  'https://api.github.com/repos/l2beat/l2beat/actions/workflows/deploy-crops-api.yml/dispatches'
const LIVE_CROPS_URL = 'https://crops.l2beat.com/v1/crops.json'
/** A run times out after 15 minutes; one that has not deployed by then failed. */
const REDISPATCH_AFTER_SECONDS = 30 * 60

const LiveCrops = v.object({
  attestations: v.object({
    current: v.union([v.object({ uid: v.string() }), v.null()]),
  }),
})

/**
 * Redeploys the CROPS API until it serves the current attestation, by running
 * its deploy workflow, which reads the attestation from the chain. It checks
 * the live API rather than trusting a dispatch, so a run that fails after
 * GitHub accepts it is dispatched again. The last dispatch is kept in the
 * database, so a run still going, even across a restart, is not doubled.
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
    if ((await this.readLiveUid()) === (uid ?? null)) {
      return
    }
    const dispatched = await this.db.appState.findByKey(DISPATCHED_KEY)
    if (
      dispatched?.value === (uid ?? '') &&
      UnixTime.now() - dispatched.updatedAt < REDISPATCH_AFTER_SECONDS
    ) {
      return
    }
    await this.deploy()
    await this.db.appState.insert({
      key: DISPATCHED_KEY,
      value: uid ?? '',
      updatedBy: 'CropsApiDeployer',
    })
    this.logger.info('Deploy triggered', { uid })
  }

  /** Null when the live API names no attestation, undefined when unreadable. */
  private async readLiveUid(): Promise<string | null | undefined> {
    try {
      const body = LiveCrops.parse(await this.http.fetch(LIVE_CROPS_URL, {}))
      return body.attestations.current?.uid ?? null
    } catch (error) {
      this.logger.warn('Cannot read the live CROPS API', { error })
      return undefined
    }
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
