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
      return <GlobeIcon className="size-4" />
    case 'App':
      return <AppIcon className="size-4" />
    case 'Docs':
      return <DocumentIcon className="size-4" />
    case 'Explorer':
      return <SearchIcon className="size-4" />
    case 'Repository':
      return <CodeIcon className="size-4" />
    case 'Social':
      return <UserIcon className="size-4" />
    case 'rollup.codes':
      return <RollupCodesIcon className="size-4" />
    default:
      assertUnreachable(name)
  }
}
