import React from 'react'

import { Link } from '../../../components/Link'

export interface DonationDetailsProps {
  ethereumAddress: string
  qrCodeUrl: string
  networks: {
    name: string
    linkURL: string
  }[]
}

export function DonateDetails(props: DonationDetailsProps) {
  return (
    <div className="mt-8 text-center md:flex md:items-center md:justify-center md:text-left">
      <div>
        <img src={props.qrCodeUrl} />
      </div>
      <div className="md:ml-8">
        <p className="my-4 inline-block w-[21ch] max-w-[21ch] break-all font-mono">
          {props.ethereumAddress.substring(0, 21)}
          {props.ethereumAddress.substring(21)}
        </p>
        <ul className="my-4">
          {props.networks.map((network, i) => (
            <li key={i} className="mt-2 first:mt-0">
              <Link href={network.linkURL}>{network.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
