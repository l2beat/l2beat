import { Logger } from '@l2beat/backend-tools'
import { CelestiaApiClient, celestiaTools, HttpClient } from '@l2beat/shared'

export async function findCelestiaNamespace(url: string, commitment: string) {
  const client = new CelestiaApiClient({
    url,
    http: new HttpClient(),
    logger: Logger.INFO,
    sourceName: 'celestia-api',
    callsPerMinute: 300,
    retryStrategy: 'SCRIPT',
  })

  const { blockHeight, blobCommitment, byteDerivationVersion } =
    celestiaTools.decodeCommitment(commitment)

  console.log(`
  Decoded commitment:
  Block height: ${blockHeight}
  Blob commitment: ${blobCommitment}
  Byte derivation version: ${byteDerivationVersion}
  `)

  const events = await client.getBlockResultEvents(blockHeight)

  const possibleNamespaces = celestiaTools.extractNamespacesFromEvents(events)

  console.log(`
  Possible namespaces:
  ${possibleNamespaces.join('\n  ')}
  `)

  for (const namespace of possibleNamespaces) {
    const blobExists = await client.blobExists(
      blockHeight,
      namespace,
      blobCommitment,
    )

    if (blobExists) {
      console.log(`Namespace has been found: ${namespace} 🎉 🎊 ✨`)
      return
    }
  }

  console.log('No namespace found - is the commitment correct?', commitment)
}
