import { useApiProject } from './useApiProject'

export function ListPanel() {
  const response = useApiProject()
  if (response.isLoading) {
    return <div>Loading</div>
  }
  if (response.isError) {
    return <div>Error</div>
  }
  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-scroll border-black border-x border-b-2">
      {response.data.chains.map((chain) => (
        <>
          <div key={chain.chain}>{chain.chain}</div>
          {chain.initialContracts.length > 0 && (
            <>
              <div>Initial contracts</div>
              {chain.initialContracts.map((contract) => (
                <div>{contract.address}</div>
              ))}
            </>
          )}
          {chain.discoveredContracts.length > 0 && (
            <>
              <div>Initial contracts</div>
              {chain.discoveredContracts.map((contract) => (
                <div>{contract.address}</div>
              ))}
            </>
          )}
          {chain.ignoredContracts.length > 0 && (
            <>
              <div>Initial contracts</div>
              {chain.ignoredContracts.map((contract) => (
                <div>{contract.address}</div>
              ))}
            </>
          )}
          {chain.eoas.length > 0 && (
            <>
              <div>Initial contracts</div>
              {chain.eoas.map((eoa) => (
                <div>{eoa.address}</div>
              ))}
            </>
          )}
        </>
      ))}
    </div>
  )
}
