import React from 'react'

import { Link } from '../../components/Link'

export interface DonationDetailsProps {
  ethereumAddress: string
  qrLightURL: string
  qrDarkURL: string
  networks: {
    name: string
    linkURL: string
  }[]
}

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
              <Link href={network.linkURL}>{network.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
