import React from 'react'

import { RollupCodesIcon } from './products/RollupCodesIcon'
import { AppsIcon } from './symbols/AppsIcon'
import { CodeIcon } from './symbols/CodeIcon'
import { DocumentIcon } from './symbols/DocumentIcon'
import { GlobeIcon } from './symbols/GlobeIcon'
import { SearchIcon } from './symbols/SearchIcon'
import { UserIcon } from './symbols/UserIcon'

export interface LinkNameIconProps {
  name: string
}

export function ProjectLinkIcon({ name }: LinkNameIconProps) {
  switch (name) {
    case 'Website':
      return <GlobeIcon />
    case 'App':
      return <AppsIcon />
    case 'Docs':
      return <DocumentIcon />
    case 'Explorer':
      return <SearchIcon />
    case 'Repository':
      return <CodeIcon />
    case 'Social':
      return <UserIcon />
    case 'rollup.codes':
      return <RollupCodesIcon />
    default:
      return null
  }
}
