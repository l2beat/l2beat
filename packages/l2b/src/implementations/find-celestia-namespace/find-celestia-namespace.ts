import { Logger } from '@l2beat/backend-tools'
import { CelestiaApiClient, HttpClient, celestiaTools } from '@l2beat/shared'

export async function findCelestiaNamespace(url: string, commitment: string) {
  const client = new CelestiaApiClient({
    url,
    http: new HttpClient(),
    logger: Logger.SILENT,
    sourceName: 'celestia-api',
    callsPerMinute: 60,
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

  const txs = await client.getDecodedTransactions(blockHeight)

  const possibleNamespaces = celestiaTools.extractNamespacesFromLogs(
    txs.map((tx) => tx.log),
  )

  console.log(`
  Possible namespaces:
  ${possibleNamespaces.join('\n  ')}
  `)

  for (const namespace of possibleNamespaces) {
    const blob = await client.getBlob(blockHeight, namespace, blobCommitment)

    if (blob) {
      console.log(`Namespace has been found: ${namespace} 🎉 🎊 ✨`)
      return
    }
  }

  console.log('No namespace found - is the commitment correct?', commitment)
}
