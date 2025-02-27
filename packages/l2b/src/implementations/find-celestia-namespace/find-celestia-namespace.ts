import { CelestiaClient } from './client'
import { decodeCommitment } from './decode-commitment'
import { extractNamespaces } from './extract-namespaces'

export async function findCelestiaNamespace(url: string, commitment: string) {
  const client = new CelestiaClient(url)

  const { blockHeight, blobCommitment, byteDerivationVersion } =
    decodeCommitment(commitment)

  console.log(`
  Decoded commitment:
  Block height: ${blockHeight}
  Blob commitment: ${blobCommitment}
  Byte derivation version: ${byteDerivationVersion}
  `)

  const txs = await client.getDecodedTransactions(blockHeight)

  const possibleNamespaces = extractNamespaces(txs)

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
