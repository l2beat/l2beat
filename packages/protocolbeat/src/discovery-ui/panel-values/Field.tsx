import { clsx } from 'clsx'
import { ReactNode } from 'react'
import { FieldValue } from '../api/types'

export interface FieldProps {
  name: string
  value: FieldValue
  level: number
}

export function Field({ name, value, level }: FieldProps) {
  let inlineDisplay: ReactNode = null
  let blockDisplay: ReactNode = null

  if (value.type === 'address') {
    if (value.name && !value.name.startsWith('<')) {
      inlineDisplay = (
        <a
          className="font-mono text-blue-700 text-sm"
          href={`#${value.address}`}
        >
          <strong>{value.name}</strong> {value.address}
        </a>
      )
    } else {
      inlineDisplay = (
        <p className="font-mono text-gray-700 text-sm">
          <strong>{value.name ?? '???'}</strong> {value.address}
        </p>
      )
    }
  } else if (value.type === 'hex') {
    const parts: string[] = []
    for (let i = 2; i < value.value.length; i += 64) {
      parts.push(value.value.slice(i, i + 64))
    }
    inlineDisplay = (
      <div className="flex font-mono text-gray-700 text-sm">
        <span>0x</span>
        <div>
          {parts.map((part, i) => (
            <div key={i}>{part}</div>
          ))}
        </div>
      </div>
    )
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
      <p className="overflow-hidden break-words font-mono text-orange-800">
        {fmt.format(BigInt(value.value))}
      </p>
    )
  } else if (value.type === 'boolean') {
    inlineDisplay = (
      <p className="font-bold font-mono text-orange-800 text-sm uppercase">
        {value.value.toString()}
      </p>
    )
  } else if (value.type === 'array') {
    inlineDisplay = (
      <span className="text-sm">
        [ <span className="text-gray-700">length: </span>
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
      <span className="text-sm">
        {'{'} <span className="text-gray-700">members: </span>
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
    <li className={level === 0 ? 'pl-4' : 'pl-8'}>
      <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-2">
        <p
          className={clsx(
            'w-max min-w-[3ch] text-right font-mono',
            name.startsWith('$') && 'text-green-700',
            level > 0 && 'text-sm',
          )}
        >
          {name}:
        </p>
        {inlineDisplay}
      </div>
      {blockDisplay}
    </li>
  )
}
