import { ApiProjectChain, ApiProjectContract } from '../api/types'
import { Field } from './Field'
import { useApiProject } from './useApiProject'

export function ValuesPanel() {
  const response = useApiProject()
  if (response.isLoading) {
    return <div>Loading</div>
  }
  if (response.isError) {
    return <div>Error</div>
  }
  return (
    <div className="h-full w-full overflow-x-hidden font-ui">
      {response.data.chains.map((chain, i) => (
        <ChainContracts key={i} chain={chain} />
      ))}
    </div>
  )
}

function ChainContracts(props: { chain: ApiProjectChain }) {
  return (
    <>
      <div>{props.chain.name}</div>
      <>
        <ContractList
          title="Initial contracts"
          entries={props.chain.initialContracts}
        />
        <ContractList
          title="Discovered contracts"
          entries={props.chain.discoveredContracts}
        />
      </>
    </>
  )
}

function ContractList(props: {
  title: string
  entries: ApiProjectContract[]
}) {
  if (props.entries.length === 0) {
    return null
  }
  return (
    <>
      <div>{props.title}</div>
      <>
        {props.entries.map((entry) => (
          <div key={entry.address}>
            <div id={entry.address} className="font-mono text-lg">
              <strong>{entry.name}</strong>{' '}
              <a className="text-blue-700 text-sm" href={`#${entry.address}`}>
                {entry.address}
              </a>
            </div>
            <ol>
              {entry.fields.map((field, i) => (
                <Field
                  key={i}
                  name={field.name}
                  value={field.value}
                  level={0}
                />
              ))}
            </ol>
          </div>
        ))}
      </>
    </>
  )
}
