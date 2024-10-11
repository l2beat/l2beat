import { CustomLink } from '~/components/link/custom-link'
import { EM_DASH } from '~/consts/characters'
import { type ZkCatalogProjectDetails } from './zk-catalog-project-page'

interface Props {
  items: ZkCatalogProjectDetails['requiredTools']
}

export function RequiredTools(props: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 align-bottom text-xs font-medium uppercase text-gray-500 dark:border-zinc-700 dark:text-gray-50">
          <th className="px-4 py-2 text-start">Tool name</th>
          <th className="py-2 pr-4 text-start">Version</th>
          <th className="py-2 pr-4 text-start">Tool docs</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <tr
            className="h-14 border-b border-gray-200 dark:border-zinc-700"
            key={item.name}
          >
            <td className="text-balance px-4 text-base font-medium md:text-lg">
              {item.name}
            </td>
            <td className="pr-4 text-sm md:text-base">{item.version}</td>
            <td className="pr-4">
              {item.link ? (
                <CustomLink href={item.link} className="text-sm md:text-base">
                  <span className="hidden md:block">More information</span>
                  <span className="md:hidden">More info</span>
                </CustomLink>
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
