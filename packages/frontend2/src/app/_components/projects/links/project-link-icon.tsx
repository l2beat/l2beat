import React from 'react'

import CodeIcon from '~/icons/code.svg'
import DocumentIcon from '~/icons/document.svg'
import GlobeIcon from '~/icons/globe.svg'

export interface LinkNameIconProps {
  name: string
}

export function ProjectLinkIcon({ name }: LinkNameIconProps) {
  switch (name) {
    case 'Website':
      return <GlobeIcon className="stroke-black dark:stroke-white" />
    case 'Docs':
      return <DocumentIcon className="fill-black dark:fill-white" />
    case 'Repository':
      return <CodeIcon className="stroke-black dark:stroke-white" />
    default:
      return null
  }
}
