import clsx from 'clsx'
import { useState } from 'react'
import { AVAILABLE_CHAINS } from '../config/chains'
import { IconChevronDown } from '../icons/IconChevronDown'
import { isValidEthereumAddress } from '../utils/isValidEthereumAddress'

export interface ChainAddress {
  chain: string
  address: string
}

const CHAINS_BY_NAME = AVAILABLE_CHAINS.toSorted((a, b) =>
  a.name.localeCompare(b.name),
)

export function ChainAddressField(props: {
  id: string
  label: string
  value: ChainAddress
  submitted: boolean
  autoFocus?: boolean
  onChange: (value: ChainAddress) => void
}) {
  const [blurred, setBlurred] = useState(false)
  const address = props.value.address.trim()
  const invalid = !isValidEthereumAddress(address)
  const errorVisible =
    invalid && (props.submitted || (blurred && address !== ''))

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={props.id}
        className="font-medium text-coffee-400 text-xs uppercase tracking-wider"
      >
        {props.label}
      </label>
      <div
        className={clsx(
          'flex border bg-coffee-900 transition-colors',
          errorVisible
            ? 'border-aux-red'
            : 'border-coffee-600 focus-within:border-coffee-400',
        )}
      >
        <div className="relative shrink-0 border-coffee-600 border-r">
          <select
            aria-label={`${props.label} chain`}
            className="h-full w-28 cursor-pointer appearance-none bg-transparent py-2 pr-7 pl-3 text-sm focus:outline-none sm:w-36"
            value={props.value.chain}
            onChange={(e) =>
              props.onChange({ ...props.value, chain: e.target.value })
            }
          >
            {CHAINS_BY_NAME.map((c) => (
              <option key={c.chainId} value={c.shortName}>
                {c.name}
              </option>
            ))}
          </select>
          <IconChevronDown className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 text-coffee-400" />
        </div>
        <input
          id={props.id}
          type="text"
          autoFocus={props.autoFocus}
          autoComplete="off"
          spellCheck={false}
          placeholder="0x…"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm placeholder:font-sans placeholder:text-coffee-400/60 focus:outline-none"
          value={props.value.address}
          onBlur={() => setBlurred(true)}
          onChange={(e) => {
            setBlurred(false)
            props.onChange({ ...props.value, address: e.target.value })
          }}
        />
      </div>
      {errorVisible && (
        <p className="text-aux-red text-xs">
          {address === ''
            ? 'Enter an address'
            : 'Not a valid address, expected 0x followed by 40 hex characters'}
        </p>
      )}
    </div>
  )
}
