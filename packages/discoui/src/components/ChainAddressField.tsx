import { ChainSpecificAddress } from '@l2beat/shared-pure'
import clsx from 'clsx'
import { useState } from 'react'
import { splitChainPrefix } from '../utils/splitChainPrefix'
import { ChainPicker } from './ChainPicker'

export interface ChainAddress {
  chain: string
  address: string
}

export function parseChainAddress(
  value: ChainAddress,
): ChainSpecificAddress | undefined {
  return ChainSpecificAddress.tryParse(`${value.chain}:${value.address.trim()}`)
}

export function ChainAddressField(props: {
  id: string
  label: string
  value: ChainAddress
  submitted: boolean
  autoFocus?: boolean
  onChange: (value: ChainAddress) => void
}) {
  const [focused, setFocused] = useState(props.autoFocus ?? false)
  const address = props.value.address.trim()
  const invalid = parseChainAddress(props.value) === undefined
  const errorVisible =
    invalid && (props.submitted || (!focused && address !== ''))

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
        <ChainPicker
          label={props.label}
          value={props.value.chain}
          onChange={(chain) => props.onChange({ ...props.value, chain })}
          onPicked={() => document.getElementById(props.id)?.focus()}
        />
        <input
          id={props.id}
          type="text"
          autoFocus={props.autoFocus}
          autoComplete="off"
          spellCheck={false}
          placeholder="0x… or eth:0x…"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm placeholder:font-sans placeholder:text-coffee-400/60 focus:outline-hidden"
          value={props.value.address}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) =>
            props.onChange(withChainFromInput(props.value, e.target.value))
          }
        />
      </div>
      {errorVisible && (
        <p className="text-aux-red text-xs">
          {address === ''
            ? 'Enter an address'
            : 'Not a valid address, check for typos'}
        </p>
      )}
    </div>
  )
}

function withChainFromInput(current: ChainAddress, input: string) {
  const parsed = splitChainPrefix(input)
  if (parsed.chain === undefined) {
    return { chain: current.chain, address: input }
  }
  return { chain: parsed.chain, address: parsed.address }
}
