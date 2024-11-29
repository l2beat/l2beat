import { Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  BlobClient,
  BlobProvider,
  HttpClient2,
  RetryHandler,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { Config } from '../config'

export class BlobProviders {
  private readonly blobProvider: BlobProvider
  constructor(private readonly blobClient: BlobClient) {
    this.blobProvider = new BlobProvider(blobClient)
  }

  getBlobProvider() {
    return this.blobProvider
  }
}

export function initBlobProviders(
  finalityConfig: Config['finality'],
): BlobProviders {
  assert(finalityConfig, 'Finality config is required')

  const logger = Logger.SILENT
  const http = new HttpClient2()
  const blobClient = new BlobClient({
    beaconApiUrl: finalityConfig.beaconApiUrl,
    rpcUrl: finalityConfig.ethereumProviderUrl,
    logger,
    http,
    rateLimiter: new RateLimiter({
      callsPerMinute: finalityConfig.beaconApiCPM,
    }),
    timeout: finalityConfig.beaconApiTimeout,
    retryHandler: RetryHandler.RELIABLE_API(logger),
  })
  return new BlobProviders(blobClient)
}
