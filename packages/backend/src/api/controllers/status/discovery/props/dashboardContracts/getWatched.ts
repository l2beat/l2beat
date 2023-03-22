import { ContractParameters, ProjectParameters } from '@l2beat/shared'

import { DashboardContractField, getValues } from '../utils/getValues'

export function getWatched(
  contract: ContractParameters,
  discovery: ProjectParameters,
  ignoreInWatchMode: DashboardContractField[] | undefined,
) {
  const values =
    discovery.contracts.find((c) => c.address === contract.address)?.values ??
    undefined

  let watched: DashboardContractField[] | undefined = undefined
  if (values) {
    watched = Object.keys(values)
      .filter((key) => {
        if (ignoreInWatchMode === undefined) {
          return true
        }
        return !ignoreInWatchMode.map((i) => i.name).includes(key)
      })
      .map((field) => {
        return {
          name: field,
          values: getValues(discovery, contract, field),
        }
      })
  }
  return watched
}
