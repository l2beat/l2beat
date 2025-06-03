import { assertUnreachable } from '@l2beat/shared-pure'
import { AppIcon } from '~/icons/App'
import { CodeIcon } from '~/icons/Code'
import { DocumentIcon } from '~/icons/Document'
import { GlobeIcon } from '~/icons/Globe'
import { RollupCodesIcon } from '~/icons/products/RollupCodes'
import { SearchIcon } from '~/icons/Search'
import { UserIcon } from '~/icons/User'
import { cn } from '~/utils/cn'
import type { LinkName } from './types'

export interface LinkNameIconProps {
  name: LinkName
  className?: string
}

export function ProjectLinkIcon(props: LinkNameIconProps) {
  const className = cn('size-4', props.className)
  switch (props.name) {
    case 'Website':
      return <GlobeIcon className={className} />
    case 'App':
      return <AppIcon className={className} />
    case 'Docs':
      return <DocumentIcon className={className} />
    case 'Explorer':
      return <SearchIcon className={className} />
    case 'Repository':
      return <CodeIcon className={className} />
    case 'Social':
      return <UserIcon className={className} />
    case 'rollup.codes':
      return <RollupCodesIcon className={className} />
    default:
      assertUnreachable(props.name)
  }
}
