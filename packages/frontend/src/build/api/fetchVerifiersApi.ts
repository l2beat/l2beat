import { layer2s, zkCatalogProjects } from '@l2beat/config'
import {
  EthereumAddress,
  UnixTime,
  VerifiersApiResponse,
} from '@l2beat/shared-pure'
import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchVerifiersApi(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<VerifiersApiResponse> {
  if (backend.mock) {
    return getMockVerifiersApiResponse()
  }

  const url = backend.apiUrl + '/api/verifiers'
  const json = await http.fetchJson(url)
  return VerifiersApiResponse.parse(json)
}

function getMockVerifiersApiResponse(): VerifiersApiResponse {
  const now = UnixTime.now().add(-400, 'days')
  const verifierAddress: EthereumAddress[] = []

  layer2s.forEach((l2) => {
    if (l2.stateValidation?.proofVerification) {
      const adresses = l2.stateValidation.proofVerification.verifiers.map(
        (v) => v.contractAddress,
      )
      verifierAddress.push(...adresses)
    }
  })

  zkCatalogProjects.forEach((zk) => {
    const adresses = zk.proofVerification.verifiers.map(
      (v) => v.contractAddress,
    )
    verifierAddress.push(...adresses)
  })

  const uniqueAddresses = [...new Set(verifierAddress)]

  return uniqueAddresses.map((address) => ({
    address: address.toString(),
    timestamp: now,
  }))
}
