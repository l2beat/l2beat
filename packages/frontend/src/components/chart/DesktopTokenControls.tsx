import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { ChevronDownIcon } from '../icons'
import { VerticalSeparator } from '../VerticalSeparator'
import {
  getParts,
  SelectedTokenButton,
  TokenCell,
  TokenControl,
} from './CommonTokenControls'

export interface DesktopTokenControlsProps {
  tokens?: TokenControl[]
}

export function DesktopTokenControls({ tokens }: DesktopTokenControlsProps) {
  if (!tokens || tokens.length === 0) {
    return null
  }

  return (
    <div className="hidden h-full gap-6 md:flex">
      <div />
      <VerticalSeparator />
      <div className="flex flex-wrap items-baseline justify-start gap-x-4">
        <span>View another token</span>
        <div className="Dropdown">
          <div className="rounded-lg bg-gray-200 px-1 py-1 dark:bg-gray-750">
            <SelectButton />
            <SelectedTokenButton />
          </div>
          <TokenModal tokens={tokens} />
        </div>
      </div>
    </div>
  )
}

function SelectButton() {
  return (
    <label
      className="flex cursor-pointer items-center justify-between gap-1.5 px-2 text-base transition-all"
      data-role="chart-token-toggle"
    >
      <input
        type="checkbox"
        autoComplete="off"
        className="Dropdown-Button peer hidden"
      />
      Select
      <ChevronDownIcon className="h-3 w-3 transition-transform duration-300 peer-checked:-rotate-180" />
    </label>
  )
}

function TokenModal({ tokens }: { tokens: TokenControl[] }) {
  const parts = getParts(tokens)

  return (
    <div
      className="Dropdown-Transparent-Item pointer-events-none absolute z-60 opacity-0 transition-opacity duration-300"
      data-role="chart-token-modal"
    >
      <hr className="h-1.5 border-t-0" />
      <div className="rounded-lg bg-gray-200 p-6 dark:bg-gray-750">
        <div className="flex flex-col gap-3">
          {parts.map((p, i) => (
            <div key={i}>
              <div className={`text-sm font-bold ${p.titleColor}`}>
                {p.title}
              </div>
              <HorizontalSeparator className="mb-4 border-gray-400 dark:border-gray-650" />
              <div
                className="grid grid-cols-3 gap-y-3 gap-x-6"
                data-role="chart-token-controls"
              >
                {p.tokens.map((token, j) => (
                  <TokenCell token={token} key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
