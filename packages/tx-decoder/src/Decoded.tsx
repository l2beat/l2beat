import { useQuery } from '@tanstack/react-query'
import { get4ByteSignatures } from './api/FourByte'
import { getOpenChainSignatures } from './api/OpenChain'
import { decode } from './decode'

interface DecodedProps {
  encoded: `0x${string}`
}

export function Decoded(props: DecodedProps) {
  const selector = props.encoded.slice(0, 10)

  const q1 = useQuery({
    queryKey: ['openchain', selector],
    queryFn: () => getOpenChainSignatures(selector),
  })

  const q2 = useQuery({
    queryKey: ['4byte', selector],
    queryFn: () => get4ByteSignatures(selector),
  })

  if (q1.isLoading || q2.isLoading) {
    return 'Loading...'
  }

  const signatures = []
  if (q1.data) {
    signatures.push(...q1.data.map((x) => `function ${x}`))
  }
  if (q2.data) {
    signatures.push(...q2.data.map((x) => `function ${x}`))
  }
  const decoded = decode(props.encoded, signatures)

  return (
    <div>
      {q1.isError && <div>Error {q1.error.message}</div>}
      {q2.isError && <div>Error {q2.error.message}</div>}
      {decoded?.abiItem && <div>Abi: {JSON.stringify(decoded.abiItem)}</div>}
      {decoded?.decoded && (
        <pre>
          Parsed:{' '}
          {JSON.stringify(
            decoded.decoded,
            (_, v) => (typeof v === 'bigint' ? `${v}n` : v),
            2,
          )}
        </pre>
      )}
      {decoded?.extradata && <pre>Extra: {decoded.extradata}</pre>}
    </div>
  )
}
