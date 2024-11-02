import { clsx } from 'clsx'
import { ReactNode } from 'react'
import { FieldValue } from '../api/types'
import { AddressIcon } from '../common/AddressIcon'
import { toShortenedAddress } from '../common/toShortenedAddress'
import { usePanelStore } from '../store/store'

export interface FieldProps {
  name: string
  value: FieldValue
  level: number
}

export function Field({ name, value, level }: FieldProps) {
  let inlineDisplay: ReactNode = null
  let blockDisplay: ReactNode = null
  const select = usePanelStore((state) => state.select)

  if (value.type === 'address') {
    if (value.addressType !== 'Unknown') {
      inlineDisplay = (
        <button
          className="inline-block w-min whitespace-nowrap text-left font-mono text-blue-400 text-xs underline"
          onClick={() => select(value.address)}
        >
          <AddressIcon
            type={value.addressType}
            className="-top-px relative mr-1 inline-block"
          />
          <strong>
            {value.name ?? (value.addressType === 'EOA' ? 'EOA' : 'Unknown')}
          </strong>{' '}
          {toShortenedAddress(value.address)}
        </button>
      )
    } else {
      inlineDisplay = (
        <p className="whitespace-nowrap font-mono text-cream text-xs">
          <strong>{value.name ?? 'Unknown'}</strong>{' '}
          {toShortenedAddress(value.address)}
        </p>
      )
    }
  } else if (value.type === 'hex') {
    if (value.value.length <= 66) {
      inlineDisplay = (
        <div className="flex font-mono text-cream text-xs">{value.value}</div>
      )
    } else {
      const parts: string[] = []
      for (let i = 2; i < value.value.length; i += 64) {
        parts.push(value.value.slice(i, i + 64))
      }
      inlineDisplay = (
        <div className="flex font-mono text-cream text-xs">
          <span>0x</span>
          <div>
            {parts.map((part, i) => (
              <div key={i}>{part}</div>
            ))}
          </div>
        </div>
      )
    }
  } else if (value.type === 'string') {
    const QUOT_OPEN = '\u201C'
    const QUOT_CLOSE = '\u201D'
    inlineDisplay = (
      <p className="break-words font-serif">
        <strong className="select-none">{QUOT_OPEN}</strong>
        {value.value}
        <strong className="select-none">{QUOT_CLOSE}</strong>
      </p>
    )
  } else if (value.type === 'number') {
    const fmt = Intl.NumberFormat('en-US')
    inlineDisplay = (
      <p className="overflow-hidden break-words font-mono text-orange-400">
        {fmt.format(BigInt(value.value))}
      </p>
    )
  } else if (value.type === 'boolean') {
    inlineDisplay = (
      <p className="font-bold font-mono text-orange-400 text-xs uppercase">
        {value.value.toString()}
      </p>
    )
  } else if (value.type === 'array') {
    inlineDisplay = (
      <span>
        [ <span className="text-cream">length: </span>
        {value.values.length} ]
      </span>
    )
    blockDisplay = (
      <ol>
        {value.values.map((value, i) => (
          <Field key={i} name={i.toString()} value={value} level={level + 1} />
        ))}
      </ol>
    )
  } else if (value.type === 'object') {
    inlineDisplay = (
      <span>
        {'{'} <span className="text-cream">members: </span>
        {Object.keys(value.value).length} {'}'}
      </span>
    )
    blockDisplay = (
      <ol>
        {Object.entries(value.value).map(([key, value], i) => (
          <Field key={i} name={key} value={value} level={level + 1} />
        ))}
      </ol>
    )
  } else if (value.type === 'unknown') {
    inlineDisplay = value.value
  }

  return (
    <li className={clsx('text-sm', level !== 0 && 'pl-8')}>
      <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-2">
        <p className="w-max min-w-[3ch] text-right">{name}:</p>
        {inlineDisplay}
      </div>
      {blockDisplay}
    </li>
  )
}
