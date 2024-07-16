import Link from 'next/link'
import { EM_DASH } from '~/app/_components/nav/consts'
import { type ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

interface Props {
  items: ZkCatalogProjectDetails['requiredTools']
}

export function RequiredTools(props: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-gray-200 border-b align-bottom font-semibold text-gray-500 text-xs uppercase dark:border-zinc-700 dark:text-gray-50">
          <th className="px-4 py-2 text-start">Tool name</th>
          <th className="py-2 pr-4 text-start">Version</th>
          <th className="py-2 pr-4 text-start">Tool docs</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <tr
            className="h-14 border-gray-200 border-b dark:border-zinc-700"
            key={item.name}
          >
            <td className="text-balance px-4 font-medium text-base md:text-lg">
              {item.name}
            </td>
            <td className="pr-4 text-sm md:text-base">{item.version}</td>
            <td className="pr-4">
              {item.link ? (
                <Link href={item.link} className="text-sm md:text-base">
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
