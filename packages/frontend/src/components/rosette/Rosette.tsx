import cx from 'classnames'
import React from 'react'

import {
  sentimentToFillColor,
  sentimentToTextColor,
} from '../../utils/risks/color'
import { RiskSentiments, RiskValue, RiskValues } from '../../utils/risks/types'
import { getRiskSentiments } from '../../utils/risks/values'
import { UpcomingBadge } from '../badge/UpcomingBadge'
import { Icon } from '../icons/Icon'

export interface RosetteProps {
  risks: RiskSentiments
  isUpcoming?: boolean
  className?: string
}

export function SmallRosette({ risks, className, isUpcoming }: RosetteProps) {
  if (isUpcoming) {
    return <UpcomingBadge className={className} isShort={true} />
  }
  return (
    <Icon
      width="31"
      height="30"
      viewBox="0 0 31 30"
      alt-text="Rosette showing risk summary"
      className={className}
    >
      <path
        d="M14.6497 17.3247C14.6511 16.8162 14.1568 16.4537 13.6722 16.608L2.30605 20.2267C1.88435 20.361 1.67416 20.8259 1.87579 21.2199C2.55689 22.5506 4.19904 25.3713 6.67017 27.1831C9.35855 29.1542 12.4233 29.7938 13.8318 29.993C14.2569 30.0531 14.6157 29.7182 14.6169 29.2888L14.6497 17.3247Z"
        className={sentimentToFillColor(risks.sequencerFailure)}
      />
      <path
        d="M13.1685 14.9842C13.6503 14.8214 13.8338 14.2365 13.5313 13.8277L6.43759 4.23791C6.17441 3.88221 5.66652 3.83331 5.35874 4.15131C4.31906 5.22551 2.1794 7.69021 1.26219 10.6138C0.264338 13.7945 0.648156 16.9017 0.914237 18.2991C0.994558 18.7209 1.42739 18.9524 1.83417 18.8149L13.1685 14.9842Z"
        className={sentimentToFillColor(risks.stateValidation)}
      />
      <path
        d="M14.8938 12.7651C15.1933 13.176 15.8064 13.176 16.1059 12.7651L23.1325 3.12611C23.3932 2.76851 23.2879 2.26921 22.8923 2.07071C21.5562 1.40031 18.564 0.096509 15.4998 0.096509C12.1663 0.096509 9.31644 1.39281 8.06283 2.06501C7.68441 2.26791 7.5931 2.75011 7.84604 3.09711L14.8938 12.7651Z"
        className={sentimentToFillColor(risks.dataAvailability)}
      />

      <path
        d="M17.5115 13.7855C17.2106 14.1953 17.3961 14.7796 17.8784 14.9407L29.192 18.7205C29.6118 18.8607 30.0557 18.6092 30.1252 18.1721C30.3598 16.6957 30.6968 13.4493 29.7694 10.5289C28.7605 7.35161 26.6625 5.02781 25.6424 4.03641C25.3345 3.73711 24.8472 3.79611 24.5931 4.14221L17.5115 13.7855Z"
        className={sentimentToFillColor(risks.upgradeability)}
      />
      <path
        d="M17.3002 16.6253C16.8151 16.4727 16.322 16.8369 16.3251 17.3454L16.3994 29.2735C16.4022 29.716 16.7835 30.055 17.2196 29.9796C18.6927 29.7252 21.8742 28.9963 24.339 27.1759C27.0205 25.1954 28.5428 22.4596 29.1518 21.1742C29.3357 20.7862 29.1226 20.344 28.713 20.2151L17.3002 16.6253Z"
        className={sentimentToFillColor(risks.validatorFailure)}
      />
    </Icon>
  )
}

export function MediumRosette({ risks }: RosetteProps) {
  return (
    <div className="relative w-[201px] p-8">
      <BigRosetteIcon risks={risks} className="h-[136px] w-[137px]" />
      <span className="absolute bottom-[18px] left-[22px] w-[10ch] rotate-[36deg] text-center text-[10px] font-medium uppercase leading-tight">
        Sequencer failure
      </span>
      <span className="absolute top-[59px] -left-2 w-[10ch] -rotate-[68deg] text-center text-[10px] font-medium uppercase leading-tight">
        State validation
      </span>
      <span className="absolute top-0.5 left-1/2 w-[10ch] -translate-x-1/2 text-center text-[10px] font-medium uppercase leading-tight">
        Data availability
      </span>
      <span className="absolute top-[69px] left-[138px] rotate-[68deg] text-[10px] font-medium uppercase leading-tight">
        Upgradeability
      </span>
      <span className="absolute bottom-[20px] right-[19px] w-[10ch] -rotate-[36deg] text-center text-[10px] font-medium uppercase leading-tight">
        Validator failure
      </span>
    </div>
  )
}

interface BigRosetteProps {
  risks: RiskValues
  isUpcoming?: boolean
  className?: string
}

export function BigRosette({ risks, className, isUpcoming }: BigRosetteProps) {
  const riskSentiments = getRiskSentiments(risks)
  return (
    <div
      className={cx('Rosette relative w-[272px] py-12 px-12', className)}
      data-rosette-hover-disabled={isUpcoming ?? false}
    >
      <BigRosetteIcon risks={riskSentiments} isUpcoming={isUpcoming} />
      <span
        className="Rosette-Text absolute bottom-[30px] left-[31px] w-[10ch] rotate-[36deg] text-center text-xs font-medium uppercase leading-tight"
        data-rosette="sequencer-failure"
      >
        Sequencer failure
      </span>
      <span
        className="Rosette-Text absolute top-[77px] -left-1 w-[10ch] -rotate-[64deg] text-center text-xs font-medium uppercase leading-tight"
        data-rosette="state-validation"
      >
        State validation
      </span>
      <span
        className="Rosette-Text absolute top-[10px] left-1/2 w-[10ch] -translate-x-1/2 text-center text-xs font-medium uppercase leading-tight"
        data-rosette="data-availability"
      >
        Data availability
      </span>
      <span
        className="Rosette-Text absolute top-[94px] left-[184px] rotate-[68deg] text-xs font-medium uppercase leading-tight"
        data-rosette="upgradeability"
      >
        Upgradeability
      </span>
      <span
        className="Rosette-Text absolute bottom-[32px] right-[23px] w-[10ch] -rotate-[36deg] text-center text-xs font-medium uppercase leading-tight"
        data-rosette="validator-failure"
      >
        Validator failure
      </span>
      <OverlayBox
        className="absolute bottom-40 left-0"
        data-rosette="sequencer-failure"
        risk={risks.sequencerFailure}
      />
      <OverlayBox
        className="absolute bottom-40 left-0"
        data-rosette="validator-failure"
        risk={risks.validatorFailure}
      />
      <OverlayBox
        className="absolute top-44 left-0"
        data-rosette="state-validation"
        risk={risks.stateValidation}
      />
      <OverlayBox
        className="absolute top-44 left-0"
        data-rosette="upgradeability"
        risk={risks.upgradeability}
      />
      <OverlayBox
        className="absolute top-44 left-0"
        data-rosette="data-availability"
        risk={risks.dataAvailability}
      />
    </div>
  )
}

function BigRosetteIcon({ risks, className, isUpcoming }: RosetteProps) {
  return (
    <>
      <Icon
        width="181"
        height="180"
        viewBox="0 0 181 180"
        className={cx(className, isUpcoming && 'opacity-20')}
        alt-text="Rosette showing risk summary"
      >
        <circle
          cx="90.8408"
          cy="90"
          r="90"
          className="fill-gray-100 dark:fill-neutral-700"
        />
        <path
          d="M80.8589 98.2024C83.4853 97.3765 86.1548 99.3485 86.1374 102.102L85.7291 166.681C85.7139 169.077 83.649 170.912 81.288 170.504C73.3126 169.126 56.0884 165.178 42.7447 155.321C28.2279 144.597 19.9876 129.784 16.6906 122.825C15.6954 120.724 16.8492 118.33 19.0669 117.632L80.8589 98.2024Z"
          className={cx(
            sentimentToFillColor(risks.sequencerFailure),
            'Rosette-Slice focus:outline-none',
          )}
          data-rosette="sequencer-failure"
        />
        <path
          d="M80.4851 82.9885C82.0593 85.2473 80.9768 88.3846 78.3447 89.1921L16.604 108.133C14.3134 108.836 11.9444 107.415 11.6271 105.04C10.555 97.018 9.16596 79.4018 14.5768 63.7194C20.4634 46.6582 32.1303 34.3618 37.7841 29.1327C39.4908 27.5543 42.1203 27.9386 43.4495 29.8458L80.4851 82.9885Z"
          className={cx(
            sentimentToFillColor(risks.stateValidation),
            'Rosette-Slice focus:outline-none',
          )}
          data-rosette="state-validation"
        />
        <path
          d="M94.4599 77.5583C92.8302 79.7773 89.5113 79.7654 87.8975 77.5349L50.0417 25.2126C48.6372 23.2713 49.2175 20.5705 51.3629 19.5036C58.6097 15.8996 74.8347 8.89881 91.4242 8.95819C109.472 9.02278 124.876 16.0963 131.65 19.7596C133.695 20.8655 134.18 23.4783 132.804 25.352L94.4599 77.5583Z"
          className={cx(
            sentimentToFillColor(risks.dataAvailability),
            'Rosette-Slice focus:outline-none',
          )}
          data-rosette="data-availability"
        />
        <path
          d="M103.756 89.1339C101.153 88.2379 100.177 85.0657 101.827 82.8615L140.521 31.1566C141.957 29.2382 144.708 28.9889 146.365 30.7199C151.961 36.5668 163.471 49.9752 168.349 65.8316C173.655 83.082 171.483 99.8928 170.001 107.45C169.553 109.731 167.203 110.971 165.005 110.215L103.756 89.1339Z"
          className={cx(
            sentimentToFillColor(risks.upgradeability),
            'Rosette-Slice focus:outline-none',
          )}
          data-rosette="upgradeability"
        />
        <path
          d="M95.5409 102.181C95.5486 99.428 98.2361 97.4805 100.855 98.3304L162.282 118.265C164.561 119.005 165.685 121.528 164.581 123.655C160.854 130.839 151.878 146.061 138.445 155.795C123.83 166.385 107.218 169.756 99.5872 170.792C97.2836 171.105 95.3511 169.28 95.3577 166.956L95.5409 102.181Z"
          className={cx(
            sentimentToFillColor(risks.validatorFailure),
            'Rosette-Slice focus:outline-none',
          )}
          data-rosette="validator-failure"
        />
      </Icon>
      {isUpcoming && (
        <UpcomingBadge className="absolute top-[130px] left-[90px]" />
      )}
    </>
  )
}

function OverlayBox({
  className,
  risk,
  ...props
}: {
  risk: RiskValue
  className: string
  'data-rosette': string
}) {
  return (
    <div
      {...props}
      className={cx(
        'Rosette-Description hidden rounded-md bg-white px-4 py-3 text-left text-sm leading-tight text-gray-700 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.55)] dark:bg-neutral-700 dark:text-white',
        className,
      )}
    >
      <span
        className={cx(
          'mb-2 block font-medium',
          sentimentToTextColor(risk.sentiment),
        )}
      >
        {risk.value}
      </span>
      <span className="text-xs">{risk.description}</span>
    </div>
  )
}
