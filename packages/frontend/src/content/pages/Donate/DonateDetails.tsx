import React from 'react'

import { OutLink } from '../../common'
import { DonationDetailsProps } from './getProps'

export function DonateDetails(props: DonationDetailsProps) {
  return (
    <div className="DonateDetails">
      <div className="DonateDetails-QrCode">
        <img src={props.qrLightURL} />
        <img src={props.qrDarkURL} />
      </div>
      <div className="DonateDetails-Text">
        <p className="DonateDetails-Address">
          {props.ethereumAddress.substring(0, 21)}
          {props.ethereumAddress.substring(21)}
        </p>
        <ul className="DonateDetails-Networks">
          {props.networks.map((network, i) => (
            <li key={i}>
              <OutLink href={network.linkURL}>{network.name}</OutLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
