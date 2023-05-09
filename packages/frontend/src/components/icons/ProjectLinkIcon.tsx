import React from 'react'

import { AppsIcon } from './symbols/AppsIcon'
import { CodeIcon } from './symbols/CodeIcon'
import { DocumentIcon } from './symbols/DocumentIcon'
import { GlobeIcon } from './symbols/GlobeIcon'
import { SearchIcon } from './symbols/SearchIcon'
import { UserIcon } from './symbols/UserIcon'

interface LinkNameIconProps {
  name: ProjectLink['name']
}

export interface ProjectLink {
  name:
    | 'Website'
    | 'App'
    | 'Documentation'
    | 'Explorer'
    | 'Repository'
    | 'Social'
  links: string[]
}

export function ProjectLinkIcon({ name }: LinkNameIconProps) {
  switch (name) {
    case 'Website':
      return <GlobeIcon />
    case 'App':
      return <AppsIcon />
    case 'Documentation':
      return <DocumentIcon />
    case 'Explorer':
      return <SearchIcon />
    case 'Repository':
      return <CodeIcon />
    case 'Social':
      return <UserIcon />
    default:
      throw Error('Invalid link name')
  }
}
