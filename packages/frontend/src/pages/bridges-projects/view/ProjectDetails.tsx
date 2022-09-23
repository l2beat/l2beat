import React from 'react'

import {
  DescriptionSection,
  DescriptionSectionProps,
} from '../../../components/project/DescriptionSection'
import {
  LinkSection,
  LinkSectionProps,
} from '../../../components/project/links/LinkSection'
import {
  NewsSection,
  NewsSectionProps,
} from '../../../components/project/NewsSection'

export interface ProjectDetailsProps {
  linkSection: LinkSectionProps
  newsSection: NewsSectionProps
  descriptionSection: DescriptionSectionProps
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <main className="ProjectDetails">
      <LinkSection {...props.linkSection} />
      <NewsSection {...props.newsSection} />
      <div className="ProjectDetails-Content">
        <DescriptionSection {...props.descriptionSection} />
      </div>
    </main>
  )
}
