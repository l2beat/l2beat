import { ApiProjectChain, ApiProjectContract } from '../api/types'
import { useApiProject } from '../api/useApiProject'
import { useStore } from '../store'
import { Field } from './Field'

export function ValuesPanel() {
  const response = useApiProject()
  const selectedAddress = useStore((state) => state.selected[0])

  if (response.isLoading) {
    return <div>Loading</div>
  }
  if (response.isError) {
    return <div>Error</div>
  }

  const selected = findSelected(response.data.chains, selectedAddress)

  return (
    <div className="h-full w-full overflow-x-hidden font-ui">
      {!selected && <div>Select a contract</div>}
      {selected && <ProjectContract contract={selected} />}
    </div>
  )
}

function findSelected(chains: ApiProjectChain[], address: string | undefined) {
  if (!address) {
    return
  }
  for (const chain of chains) {
    for (const contract of chain.initialContracts) {
      if (contract.address === address) {
        return contract
      }
    }
    for (const contract of chain.discoveredContracts) {
      if (contract.address === address) {
        return contract
      }
    }
  }
}

function ProjectContract({
  contract,
}: {
  contract: ApiProjectContract
}) {
  return (
    <div key={contract.address}>
      <div id={contract.address} className="font-mono text-lg">
        <strong>{contract.name}</strong>{' '}
        <a className="text-blue-700 text-sm" href={`#${contract.address}`}>
          {contract.address}
        </a>
      </div>
      <ol>
        {contract.fields.map((field, i) => (
          <Field key={i} name={field.name} value={field.value} level={0} />
        ))}
      </ol>
    </div>
  )
}
