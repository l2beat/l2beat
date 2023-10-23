import { EthereumAddress } from '@l2beat/shared-pure'
import cx from 'classnames'
import React from 'react'

import { TVLProjectBreakdown } from '../../../pages/scaling/projects-tvl-breakdown/props/getTvlBreakdownView'
import { formatAddress } from '../../../utils/utils'
import { ChevronDownIcon, OutLinkIcon } from '../../icons'

interface EscrowsCellProps {
  escrows: TVLProjectBreakdown['canonical'][number]['escrows']
  explorer: string
  assetId: string
}
export function EscrowsCell(props: EscrowsCellProps) {
  return (
    <div>
      {props.escrows.length === 1 ? (
        <EscrowLink
          escrowAddress={props.escrows[0].escrowAddress}
          explorer={props.explorer}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <MultipleEscrows token={props.assetId} />
          {props.escrows.map((escrow) => (
            <EscrowLink
              key={escrow.escrowAddress.toString()}
              escrowAddress={escrow.escrowAddress}
              explorer={props.explorer}
              hidden
              assetId={props.assetId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface EscrowLinkProps {
  escrowAddress: EthereumAddress
  explorer: string
  hidden?: boolean
  assetId?: string
}

function EscrowLink(props: EscrowLinkProps) {
  return (
    <a
      href={`${props.explorer}/address/${props.escrowAddress.toString()}`}
      target="_blank"
      className={cx(
        'flex gap-1 text-xs font-medium text-blue-700 underline dark:text-blue-500',
        props.hidden && 'MultipleEscrowsHidden hidden',
      )}
      data-token={props.assetId}
    >
      {formatAddress(props.escrowAddress)}
      <OutLinkIcon className="fill-blue-700 dark:fill-blue-500" />
    </a>
  )
}

interface MultipleEscrowsProps {
  token: string
}

function MultipleEscrows(props: MultipleEscrowsProps) {
  return (
    <div
      className="MultipleEscrows flex cursor-pointer select-none items-center gap-1 pr-4"
      data-token={props.token}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.57723 0.59783C8.52931 0.600832 8.482 0.610292 8.43661 0.625955L0.969943 3.03533C0.862415 3.06998 0.768665 3.13788 0.702206 3.22923C0.635748 3.32059 0.600012 3.43069 0.600151 3.54366V9.66658C0.599152 9.73725 0.612208 9.80742 0.638562 9.873C0.664916 9.93859 0.704042 9.99828 0.753666 10.0486C0.803289 10.0989 0.862421 10.1389 0.927625 10.1662C0.992829 10.1935 1.0628 10.2075 1.13348 10.2075C1.20416 10.2075 1.27414 10.1935 1.33934 10.1662C1.40455 10.1389 1.46368 10.0989 1.5133 10.0486C1.56293 9.99828 1.60205 9.93859 1.62841 9.873C1.65476 9.80742 1.66782 9.73725 1.66682 9.66658V3.93116L8.76369 1.64054C8.88386 1.60359 8.98711 1.52539 9.05524 1.41973C9.12336 1.31407 9.15197 1.18775 9.13603 1.06305C9.12008 0.938347 9.0606 0.823286 8.96808 0.738168C8.87556 0.653051 8.75595 0.603348 8.63036 0.59783C8.61266 0.596947 8.59493 0.596947 8.57723 0.59783ZM10.7106 2.19783C10.6626 2.20083 10.6153 2.21029 10.5699 2.22595L3.10328 4.63533C2.99575 4.66998 2.902 4.73788 2.83554 4.82923C2.76908 4.92059 2.73335 5.03069 2.73348 5.14366V11.2666C2.73248 11.3373 2.74554 11.4074 2.7719 11.473C2.79825 11.5386 2.83738 11.5983 2.887 11.6486C2.93662 11.6989 2.99575 11.7389 3.06096 11.7662C3.12616 11.7935 3.19614 11.8075 3.26682 11.8075C3.3375 11.8075 3.40747 11.7935 3.47268 11.7662C3.53788 11.7389 3.59701 11.6989 3.64664 11.6486C3.69626 11.5983 3.73539 11.5386 3.76174 11.473C3.78809 11.4074 3.80115 11.3373 3.80015 11.2666V5.53116L10.897 3.24054C11.0172 3.20359 11.1204 3.12539 11.1886 3.01973C11.2567 2.91407 11.2853 2.78775 11.2694 2.66305C11.2534 2.53835 11.1939 2.42329 11.1014 2.33817C11.0089 2.25305 10.8893 2.20335 10.7637 2.19783C10.746 2.19695 10.7283 2.19695 10.7106 2.19783ZM12.8262 3.80095C12.7845 3.80411 12.7429 3.81275 12.7022 3.82595L5.23557 6.23533C5.01583 6.3068 4.86682 6.5122 4.86682 6.74366V12.8666C4.86682 13.0399 4.95099 13.2023 5.09286 13.302C5.18406 13.3665 5.29135 13.3999 5.40015 13.3999C5.46042 13.3999 5.52118 13.3895 5.57932 13.3687L13.046 10.702C13.2583 10.6268 13.4001 10.4255 13.4001 10.1999V4.33325C13.4001 4.16311 13.3185 4.0028 13.1804 3.902C13.0772 3.8268 12.9512 3.79148 12.8262 3.80095Z"
          fill="#FFC107"
        />
      </svg>
      <span className="text-xs font-medium">Multiple escrows</span>
      <ChevronDownIcon
        className="MultipleEscrowsArrow w-[10px] transition-transform duration-300 "
        data-token={props.token}
      />
    </div>
  )
}
