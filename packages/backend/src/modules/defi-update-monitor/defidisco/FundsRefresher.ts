import type { Logger } from '@l2beat/backend-tools'
import type { DiscoveryPaths } from '@l2beat/discovery'
import { fetchAllFundsForProject } from '@l2beat/l2b/dist/implementations/discovery-ui/defidisco/fundsData'

/**
 * Refreshes live funds data (token balances, DeFi positions) for a project.
 * Wraps the existing fetchAllFundsForProject from l2b, routing through
 * defiscan-endpoints (DeBank API).
 */
export class FundsRefresher {
  constructor(
    private readonly paths: DiscoveryPaths,
    private readonly defiscanEndpointsUrl: string,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async refreshFundsForProject(project: string): Promise<void> {
    this.logger.info('Refreshing funds data', { project })

    // Set the env var that fetchAllFundsForProject reads
    process.env.DEFISCAN_ENDPOINTS_URL = this.defiscanEndpointsUrl

    try {
      await fetchAllFundsForProject(
        this.paths,
        project,
        (message) => this.logger.info(message, { project }),
        true, // forceRefresh — always get fresh data in monitor
      )
      this.logger.info('Funds data refreshed successfully', { project })
    } catch (error) {
      this.logger.error(
        { project },
        error instanceof Error ? error : new Error(String(error)),
      )
      // Don't throw — funds errors shouldn't stop the monitoring loop
    }
  }
}
