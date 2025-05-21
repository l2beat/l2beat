import type {
  DecodedResult,
  DecodedValue,
  Value,
} from '@l2beat/tools-api/types'
import clsx from 'clsx'
import React, { Fragment, type ReactNode, useState } from 'react'
import { formatUnits } from 'viem'

interface Props {
  decoded: DecodedResult
  onBack: () => void
}

export function DecodedView({ decoded, onBack }: Props) {
  return (
    <main className="mx-auto max-w-[900px] p-4 pb-20">
      <button
        className="mb-8 rounded-sm border-zinc-900 border-b-4 bg-zinc-800 px-2 py-1 active:mt-1 active:border-b-0"
        onClick={onBack}
      >
        Back
      </button>
      {decoded.transaction && (
        <div className="mb-2">
          <DecodedLabel name="hash" type="bytes32" />
          <div>
            <ExplorerLink href={decoded.transaction.explorerLink}>
              {decoded.transaction.hash}
            </ExplorerLink>
          </div>
        </div>
      )}
      {decoded.to && (
        <div className="mb-2">
          <DecodedLabel name="to" type="address" />
          <DecodedValueDisplay decoded={decoded.to} />
        </div>
      )}
      <DecodedDisplay value={decoded.data} index={0} />
    </main>
  )
}

interface ExplorerLinkProps {
  href: string
  children: ReactNode
}

function ExplorerLink(props: ExplorerLinkProps) {
  return (
    <a
      className="font-mono text-blue-400"
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  )
}

interface DecodedLabelProps {
  name: string
  type: string
  options?: string[]
  option?: string
  onChange?: (option: string) => void
}

function DecodedLabel(props: DecodedLabelProps) {
  return (
    <p className="flex items-baseline gap-2 leading-[20px]">
      <span className="text-yellow-100">{props.name}</span>
      <span className="font-mono text-orange-500 text-sm">{props.type}</span>
      {props.options && props.options.length > 0 && (
        <span className="inline-flex items-baseline gap-0.5 text-green-700 text-sm">
          [
          {props.options?.map((option, i, os) => (
            <Fragment key={option}>
              <button
                className={clsx(
                  option === props.option && 'text-green-500 underline',
                )}
                key={option}
                onClick={() => props.onChange?.(option)}
              >
                {option}
              </button>
              {i !== os.length - 1 && '|'}
            </Fragment>
          ))}
          ]
        </span>
      )}
    </p>
  )
}

interface DecodedValueDisplayProps {
  decoded: DecodedValue
  option?: string
}

function DecodedValueDisplay({ decoded, option }: DecodedValueDisplayProps) {
  if (decoded.type === 'address') {
    return (
      <div className="flex items-center gap-2">
        <ExplorerLink href={decoded.explorerLink}>
          {decoded.name} {decoded.value}
        </ExplorerLink>
        {decoded.discovered && <Badge>DISCOVERED</Badge>}
      </div>
    )
  }
  if (decoded.type === 'boolean') {
    return <div>{decoded.value ? 'true' : 'false'}</div>
  }
  if (decoded.type === 'bytes') {
    return <BytesDisplay value={decoded.value} inline={!decoded.dynamic} />
  }
  if (decoded.type === 'string') {
    return (
      <div className="flex items-start gap-2 italic">
        <span className="relative top-[12px] inline-block select-none font-serif text-4xl text-zinc-500 leading-[10px]">
          ”
        </span>
        <span
          className="font-mono"
          style={{ whiteSpace: 'pre-wrap', lineBreak: 'anywhere' }}
        >
          {decoded.value}
        </span>
      </div>
    )
  }
  if (decoded.type === 'call') {
    return (
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono">{functionName(decoded.abi)}</span>
          {decoded.interface && <Badge>{decoded.interface}</Badge>}
          <span className="font-mono text-sm text-yellow-500">
            {decoded.selector}
          </span>
          <span className="font-mono text-orange-500 text-sm">
            {decoded.abi}
          </span>
        </div>
        {decoded.arguments.length > 0 && (
          <Collapsible>
            {decoded.arguments.map((x, i) => (
              <DecodedDisplay key={i} index={i} value={x} />
            ))}
          </Collapsible>
        )}
      </div>
    )
  }
  if (decoded.type === 'array') {
    return (
      <div>
        <p className="font-mono">{decoded.values.length} elements</p>
        {decoded.values.length > 0 && (
          <Collapsible>
            {decoded.values.map((x, i) => (
              <DecodedDisplay key={i} index={i} value={x} />
            ))}
          </Collapsible>
        )}
      </div>
    )
  }
  if (decoded.type === 'number') {
    return (
      <div className="font-mono" style={{ lineBreak: 'anywhere' }}>
        {formatNumber(decoded.value, option)}
      </div>
    )
  }
  if (decoded.type === 'amount') {
    if (option === 'e0') {
      return (
        <div className="font-mono" style={{ lineBreak: 'anywhere' }}>
          {formatNumber(decoded.value)}
        </div>
      )
    }
    return (
      <div className="flex gap-2 font-mono" style={{ lineBreak: 'anywhere' }}>
        <span>{formatDecimals(decoded.value, decoded.decimals)}</span>
        {decoded.currencyLink ? (
          <ExplorerLink href={decoded.currencyLink}>
            {decoded.currency}
          </ExplorerLink>
        ) : (
          <span>{decoded.currency}</span>
        )}
      </div>
    )
  }
  // This shouldn't happen
  return (
    <pre>
      <code>{JSON.stringify(decoded, null, 2)}</code>
    </pre>
  )
}

function Collapsible({
  children,
  forBytes,
}: { children: ReactNode; forBytes?: boolean }) {
  const [open, setOpen] = useState(true)
  return (
    <div
      className={clsx(
        'relative',
        open && 'border-zinc-700 border-l-2 pl-4',
        open && !forBytes && 'pt-2',
      )}
    >
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="-left-px absolute top-0 h-full w-1 bg-zinc-300 opacity-0 transition-opacity hover:opacity-100"
        />
      )}
      {!open && (
        <button
          className="font-mono text-sm text-zinc-500"
          onClick={() => setOpen(true)}
        >
          &lt;Collapsed. Click to Expand&gt;
        </button>
      )}
      <div className={open ? 'block' : 'hidden'}>{children}</div>
    </div>
  )
}

interface DecodedDisplayProps {
  value: Value
  index: number
}

function DecodedDisplay({ value, index }: DecodedDisplayProps) {
  const options = getOptions(value)
  const hint = value.decoded?.type === 'number' ? value.decoded.hint : undefined
  const [option, setOption] = useState<string | undefined>(hint ?? options[0])
  return (
    <div className="mb-2">
      <DecodedLabel
        name={value.name || `#${index}`}
        type={value.abi}
        options={options}
        option={option}
        onChange={setOption}
      />
      {!value.decoded || option === 'raw' ? (
        <BytesDisplay value={value.encoded} />
      ) : (
        <DecodedValueDisplay decoded={value.decoded} option={option} />
      )}
    </div>
  )
}

function getOptions(value: Value): string[] {
  if (!value.decoded) {
    return ['raw']
  }
  switch (value.decoded.type) {
    case 'amount':
      return ['amount', 'e0', 'raw']
    case 'number':
      return ['number', 'e6', 'e8', 'e18', 'date', 'seconds', 'raw']
    case 'address':
    case 'boolean':
    case 'bytes':
    case 'call':
    case 'array':
    case 'string':
      return ['decoded', 'raw']
  }
}

interface BytesDisplayProps {
  value: `0x${string}`
  inline?: boolean
}

function BytesDisplay(props: BytesDisplayProps) {
  if (props.inline) {
    const parts = toLine(props.value.slice(2))
    return (
      <div className="font-mono">
        <span className="text-zinc-500">0x</span>
        <Line parts={parts} />
      </div>
    )
  }
  const lines = toLines(props.value.slice(2))
  return (
    <Collapsible forBytes>
      <div className="flex items-baseline font-mono">
        <span className="text-zinc-500">0x</span>
        <div>
          {lines.map((parts, i) => (
            <div key={i}>
              <Line parts={parts} />
            </div>
          ))}
        </div>
      </div>
    </Collapsible>
  )
}

function Line({ parts }: { parts: Part[] }) {
  return (
    <>
      {parts.map((p, j) => (
        <span className={clsx(p.isZero && 'text-zinc-500')} key={j}>
          {p.value}
        </span>
      ))}
    </>
  )
}

interface Part {
  value: string
  isZero: boolean
}

function toLines(value: string) {
  const lines: Part[][] = []
  if ((value.length - 8) % 64 === 0) {
    lines.push([{ value: value.slice(0, 8), isZero: false }])
    value = value.slice(8)
  }
  const length = Math.ceil(value.length / 64)
  for (let i = 0; i < length; i++) {
    const slice = value.slice(i * 64, (i + 1) * 64)
    lines.push(toLine(slice))
  }
  return lines
}

function toLine(value: string) {
  let part: Part = { value: '', isZero: false }
  const parts: Part[] = [part]
  for (let i = 0; i < value.length; i += 2) {
    const byte = value.slice(i, i + 2)
    const isZero = byte === '00'
    if (i === 0 || isZero === part.isZero) {
      part.value += byte
      part.isZero = isZero
    } else {
      part = { value: byte, isZero }
      parts.push(part)
    }
  }
  return parts
}

const MAX_UINT = (2n ** 256n - 1n).toString()

function formatNumber(value: string, transform?: string) {
  if (value === MAX_UINT) {
    return 'Infinity'
  }
  if (transform === 'e18') {
    return formatDecimals(value, 18)
  }
  if (transform === 'e8') {
    return formatDecimals(value, 8)
  }
  if (transform === 'e6') {
    return formatDecimals(value, 6)
  }
  if (transform === 'seconds') {
    return formatDuration(value)
  }
  if (transform === 'date') {
    try {
      const iso = new Date(Number(value) * 1000).toISOString()
      return `${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`
    } catch {
      return 'Invalid date'
    }
  }
  return formatDecimals(value, 0)
}

function formatDuration(value: string): string {
  let n = BigInt(value)

  if (n < 0) {
    return `- ${formatDuration(value)}`
  }
  const parts = []

  const days = n / 86_400n
  n -= days * 86_400n

  if (days > 0) {
    parts.push(`${formatDecimals(days.toString(), 0)} days`)
  }

  const hours = n / 3600n
  n -= hours * 3600n
  if (hours > 0) {
    parts.push(`${hours} hours`)
  }

  const minutes = n / 60n
  n -= minutes * 60n
  if (minutes > 0) {
    parts.push(`${minutes} minutes`)
  }

  const seconds = n
  if (seconds > 0) {
    parts.push(`${seconds} seconds`)
  }

  return parts.join(' ') || '0 seconds'
}

function formatDecimals(value: string, decimals: number) {
  if (value === MAX_UINT) {
    return 'Infinity'
  }
  const n = BigInt(value)

  const formatted = formatUnits(n, decimals)
  const [int, fraction] = formatted.split('.') as [string, string | undefined]
  const negative = int.startsWith('-')
  const uint = negative ? int.slice(1) : int
  const ending = decimals === 0 ? '' : `.${fraction ?? 0}`
  const thousands = []
  for (let i = 0; i < uint.length / 3; i++) {
    thousands.unshift(
      uint.slice(Math.max(0, uint.length - (i + 1) * 3), uint.length - i * 3),
    )
  }
  return `${negative ? '-' : ''}${thousands.join(',')}${ending}`
}

function functionName(abi: string) {
  const open = abi.indexOf('(')
  if (abi.startsWith('function ') && open !== -1) {
    return abi.slice('function '.length, open)
  }
  return 'unknown'
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm bg-pink-400 px-1 font-bold font-mono text-black text-xs">
      {children}
    </span>
  )
}
