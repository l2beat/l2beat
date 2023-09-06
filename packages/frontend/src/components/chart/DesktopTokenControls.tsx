import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { ArrowRightIcon, ChevronDownIcon } from '../icons'
import { TogglableDropdown } from '../TogglableDropdown'
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
    <div
      className="hidden h-full gap-6 md:flex"
      data-role="chart-token-desktop-element"
    >
      <div />
      <VerticalSeparator />
      <div className="flex flex-wrap items-baseline justify-start gap-x-4">
        <span>View tokens</span>

        <TogglableDropdown
          button={
            <>
              <SelectButton />
              <SelectedTokenButton />
            </>
          }
          role="chart-token-modal"
          centered={true}
        >
          <TokenList tokens={tokens} />
          <div className="mt-6 flex items-center justify-center gap-1">
            <p className="text-sm font-medium text-black dark:text-white/80">
              Can't find a token?
            </p>
            <a
              href="https://forms.gle/fQFsC5g1LgG5z12T7"
              target="_blank"
              className="flex flex-wrap items-center gap-1 text-sm font-bold text-blue-700 underline dark:text-blue-500"
            >
              Request it here
              <ArrowRightIcon className="fill-current" />
            </a>
          </div>
        </TogglableDropdown>
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

function TokenList({ tokens }: { tokens: TokenControl[] }) {
  const parts = getParts(tokens)

  return (
    <div className="flex flex-col gap-3">
      {parts.map(
        (p, i) =>
          p.tokens.length > 0 && (
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
          ),
      )}
    </div>
  )
}
