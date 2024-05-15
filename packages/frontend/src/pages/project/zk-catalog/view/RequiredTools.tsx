import React from 'react'

import { Link } from '../../../../components/Link'
import { EM_DASH } from '../../../../utils/constants'
import { ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

interface Props {
  items: ZkCatalogProjectDetails['requiredTools']
}

export function RequiredTools(props: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-zinc-700 align-bottom text-xs font-semibold uppercase text-gray-500 dark:text-gray-50">
          <th className="px-4 py-2 text-start">Tool name</th>
          <th className="pr-4 py-2 text-start">Version</th>
          <th className="pr-4 py-2 text-start">Tool docs</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <tr
            className="h-14 border-b border-gray-200 dark:border-zinc-700"
            key={item.name}
          >
            <td className="px-4 text-base md:text-lg font-medium text-balance">
              {item.name}
            </td>
            <td className="pr-4 text-sm md:text-base">{item.version}</td>
            <td className="pr-4">
              {item.link ? (
                <Link href={item.link} textClassName="text-sm md:text-base">
                  <span className="hidden md:block">More information</span>
                  <span className="md:hidden">More info</span>
                </Link>
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
