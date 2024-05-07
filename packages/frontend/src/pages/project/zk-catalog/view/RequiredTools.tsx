import { ProofVerification } from '@l2beat/config/build/src/projects/types'
import React from 'react'

import { Link } from '../../../../components/Link'
import { EM_DASH } from '../../../../utils/constants'

interface Props {
  items: ProofVerification['requiredTools']
}

export function RequiredTools(props: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="h-8 border-b border-gray-200">
          <th className="pl-5 text-start text-xs font-semibold uppercase text-zinc-500">
            Tool name
          </th>
          <th className="text-start text-xs font-semibold uppercase text-zinc-500">
            Version
          </th>
          <th className="text-start text-xs font-semibold uppercase text-zinc-500">
            Tool docs
          </th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <tr className="h-14 border-b border-gray-200" key={item.name}>
            <td className="pl-5 text-lg font-medium">{item.name}</td>
            <td>{item.version}</td>
            <td>
              {item.link ? (
                <Link href={item.link}>More information</Link>
              ) : (
                EM_DASH
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
