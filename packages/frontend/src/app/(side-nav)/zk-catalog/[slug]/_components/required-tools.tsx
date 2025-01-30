import { CustomLink } from '~/components/link/custom-link'
import { EM_DASH } from '~/consts/characters'
import type { ZkCatalogProjectDetails } from '../_utils/get-zk-catalog-project-details'

interface Props {
  items: ZkCatalogProjectDetails['requiredTools']
}

export function RequiredTools(props: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-divider align-bottom text-xs font-medium uppercase text-secondary">
          <th className="px-4 py-2 text-start">Tool name</th>
          <th className="py-2 pr-4 text-start">Version</th>
          <th className="py-2 pr-4 text-start">Tool docs</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <tr
            className="h-14 border-b border-divider last:border-none"
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
