import cx from 'classnames'
import React from 'react'

import { OutLink } from '../OutLink'

export function OtherSites() {
  return (
    <div
      className={cx(
        '-ml-4 mt-8 flex w-screen flex-col items-center justify-between md:-ml-0 md:w-full md:flex-row',
        'rounded-0 bg-gradient-to-r from-purple-100/40 md:rounded-xl',
        'via-pink-100/40',
        'to-red-200/40 px-10',
        'py-6 md:flex-row',
      )}
    >
      <span
        className={cx(
          'flex flex-col text-center font-semibold',
          'md:hidden md:text-left',
        )}
      >
        <span
          className={cx(
            'self-center text-pink-900 dark:text-pink-200',
            'text-sm font-semibold tracking-wider',
          )}
        >
          ETHEREUM LAYER 1 IS EXPENSIVE
        </span>
        <span className="mt-1 text-lg font-bold">
          How much does it cost to use Layer 2?
        </span>
      </span>
      <span className="hidden text-lg font-semibold md:block">
        Ethereum Layer 1 is expensive. How much does it cost to use Layer 2? 💸
      </span>
      <OutLink
        className={cx(
          'mt-3 ml-0 text-center',
          'text-lg font-bold',
          'underline md:mt-0 md:ml-2',
        )}
        allowReferrer
        href="https://l2fees.info/"
      >
        Find out on L2 Fees
      </OutLink>
    </div>
  )
}
