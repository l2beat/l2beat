import React from 'react'

import { assertUnreachable } from '@l2beat/shared-pure'
import AppIcon from '~/icons/app.svg'
import CodeIcon from '~/icons/code.svg'
import DocumentIcon from '~/icons/document.svg'
import GlobeIcon from '~/icons/globe.svg'
import RollupCodesIcon from '~/icons/products/rollup-codes.svg'
import SearchIcon from '~/icons/search.svg'
import UserIcon from '~/icons/user.svg'
import { type LinkName } from './types'

export interface LinkNameIconProps {
  name: LinkName
}

export function ProjectLinkIcon({ name }: LinkNameIconProps) {
  switch (name) {
    case 'Website':
      return <GlobeIcon />
    case 'App':
      return <AppIcon />
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
      assertUnreachable(name)
  }
}
