import type { DecodedResult, Value } from '@l2beat/tools-api/types'
import { formatDecimals, formatNumber } from './ExpandedView'

interface CondensedViewProps {
  decoded: DecodedResult
}

export function CondensedView({ decoded }: CondensedViewProps) {
  return (
    <div className="font-mono">
      <CondensedValue value={decoded.data} />
    </div>
  )
}

function CondensedValue({ value }: { value: Value }) {
  const decoded = value.decoded ?? {
    type: 'bytes',
    dynamic: true,
    value: value.encoded,
  }
  if (decoded.type === 'address') {
    const suffix = decoded.value.split(':')[1] ?? ''
    const x = `${suffix.slice(0, 6)}…${suffix.slice(-4)}`
    return <Named name={value.name} value={x} />
  }
  if (decoded.type === 'boolean') {
    return <Named name={value.name} value={decoded.value ? 'true' : 'false'} />
  }
  if (decoded.type === 'bytes') {
    const x =
      decoded.value.length < 20
        ? decoded.value
        : `${decoded.value.slice(0, 10)}…`
    return <Named name={value.name} value={x} />
  }
  if (decoded.type === 'hash') {
    return <Named name={value.name} value={decoded.value} />
  }
  if (decoded.type === 'string') {
    const x =
      decoded.value.length < 20
        ? JSON.stringify(decoded.value)
        : `${JSON.stringify(decoded.value).slice(0, 20)}…"`
    return <Named name={value.name} value={x} />
  }
  if (decoded.type === 'call') {
    const name = decoded.abi.slice('function '.length, decoded.abi.indexOf('('))
    if (decoded.arguments.length === 0) {
      return <Named name={value.name} value={`.${name}()`} />
    }
    return (
      <div>
        <div>
          <Named name={value.name} value={`.${name}(`} />
        </div>
        {decoded.arguments.map((x, i) => (
          <div key={i} className="pl-[2ch]">
            <CondensedValue value={x} />
          </div>
        ))}
        <div>)</div>
      </div>
    )
  }
  if (decoded.type === 'array') {
    if (decoded.values.length === 0) {
      return <Named name={value.name} value="[]" />
    }
    return (
      <div>
        <div>
          <Named name={value.name} value="[" />
        </div>
        {decoded.values.map((x, i) => (
          <div key={i} className="pl-[2ch]">
            <CondensedValue value={x} />
          </div>
        ))}
        <div>]</div>
      </div>
    )
  }
  if (decoded.type === 'number') {
    const x = formatNumber(decoded.value, decoded.hint)
    return <Named name={value.name} value={x} />
  }
  if (decoded.type === 'amount') {
    const x = `${formatDecimals(decoded.value, decoded.decimals)} ${decoded.currency}`
    return <Named name={value.name} value={x} />
  }
  // This shouldn't happen
  return <Named name={value.name} value="???" />
}

function Named({ value, name }: { value: string; name?: string }) {
  if (!name) {
    return <span>{value}</span>
  }
  return (
    <>
      <span className="text-zinc-400">{name} = </span>
      <span>{value}</span>
    </>
  )
}
