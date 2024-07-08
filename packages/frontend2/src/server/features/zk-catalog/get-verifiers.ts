import {
  type OnchainVerifier,
  chains,
  layer2s,
  zkCatalogProjects,
} from '@l2beat/config'
import { BlockscoutV2Client, HttpClient } from '@l2beat/shared'
import {
  assert,
  type ChainId,
  UnixTime,
  type VerifierStatus,
  type VerifiersApiResponse,
} from '@l2beat/shared-pure'
import { db } from '~/server/database'

export function getVerifiers() {
  return getVerifierStatuses()
}

async function getVerifierStatuses(): Promise<VerifiersApiResponse> {
  const verifiers = getVerifiersFromConfig()
  assert(verifiers.length > 0, 'No verifier addresses found')

  const fetchOperations = verifiers.map(async (verifier) => {
    try {
      const blockscoutClient = getBlockscoutClient(verifier.chainId)
      const txs = await blockscoutClient.getInternalTransactions(
        verifier.contractAddress,
      )
      txs.sort((a, b) => b.timestamp.toNumber() - a.timestamp.toNumber())
      const lastUsed = txs[0]!.timestamp

      // TODO: Move it to the backend asap, stalling this will cause stale verifiers data
      // await db.verifierStatus.addOrUpdate({
      //   address: verifier.contractAddress.toString(),
      //   chainId: verifier.chainId,
      //   lastUsed: lastUsed,
      //   lastUpdated: UnixTime.now(),
      // })

      return {
        address: verifier.contractAddress.toString(),
        timestamp: lastUsed,
      }
    } catch {
      return handleError(verifier)
    }
  })

  return Promise.all(fetchOperations)
}

function getVerifiersFromConfig(): OnchainVerifier[] {
  const verifiers: OnchainVerifier[] = []

  layer2s.forEach((l2) => {
    if (l2.stateValidation?.proofVerification) {
      verifiers.push(...l2.stateValidation.proofVerification.verifiers)
    }
  })

  zkCatalogProjects.forEach((zk) => {
    verifiers.push(...zk.proofVerification.verifiers)
  })

  return verifiers
}

function getBlockscoutClient(chainId: ChainId): BlockscoutV2Client {
  const chain = chains.find((c) => c.chainId === chainId.valueOf())

  if (!chain?.blockscoutV2ApiUrl) {
    throw new Error(
      `Blockscout API URL is not configured for chain ${chainId.valueOf()}`,
    )
  }

  const httpClient = new HttpClient()
  return new BlockscoutV2Client(httpClient, chain.blockscoutV2ApiUrl)
}

async function handleError(verifier: OnchainVerifier): Promise<VerifierStatus> {
  const savedStatus = await db.verifierStatus.findVerifierStatus(
    verifier.contractAddress.toString(),
    verifier.chainId,
  )

  if (!savedStatus) {
    return {
      address: verifier.contractAddress.toString(),
      timestamp: null,
    }
  }

  const secondsInDay = 60 * 60 * 24
  const lastUpdatedDaysAgo = Math.floor(
    (UnixTime.now().toNumber() - savedStatus.lastUpdated.toNumber()) /
      secondsInDay,
  )

  if (lastUpdatedDaysAgo > 1) {
    return {
      address: verifier.contractAddress.toString(),
      timestamp: null,
    }
  }

  return {
    address: verifier.contractAddress.toString(),
    timestamp: savedStatus.lastUsed,
  }
}
