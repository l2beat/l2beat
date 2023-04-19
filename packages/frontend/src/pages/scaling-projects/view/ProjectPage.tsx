import React from 'react'

import {
  Chart,
  ChartProps,
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { PageContent } from '../../../components/PageContent'
import {
  SectionNavigation,
  SectionNavigationItem,
} from '../../../components/project/SectionNavigation'
import { ProjectDetails, ProjectDetailsProps } from './ProjectDetails'
import { ProjectHeader, ProjectHeaderProps } from './ProjectHeader'

export interface ProjectPageProps {
  navbar: NavbarProps
  header: HeaderProps
  projectHeader: ProjectHeaderProps
  chart: ChartProps
  projectDetails: ProjectDetailsProps
  footer: FooterProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent mobileFull>
        <ProjectHeader {...props.projectHeader} />
        <div className="mt-8 grid grid-cols-7 gap-x-12">
          <div className="col-span-2">
            <SectionNavigation
              title={props.projectHeader.title}
              icon={props.projectHeader.icon}
              sections={getProjectPageSections(props.projectDetails)}
            />
          </div>
          <div className="col-span-5">
            <Chart
              {...props.chart}
              mobileFull
              isUpcoming={props.projectDetails.isUpcoming}
            />
            <ProjectDetails {...props.projectDetails} />
          </div>
        </div>
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}

function getProjectPageSections(
  projectDetails: ProjectDetailsProps,
): SectionNavigationItem[] {
  const sections = [
    { title: 'Chart', id: 'chart' },
    ...(!projectDetails.isUpcoming
      ? [
          ...(projectDetails.milestones && projectDetails.milestones.length > 0
            ? [{ title: 'Milestones', id: 'milestones' }]
            : []),
          ...(projectDetails.knowledgeNuggets &&
          projectDetails.knowledgeNuggets.length > 0
            ? [{ title: 'Knowledge Nuggets', id: 'knowledge-nuggets' }]
            : []),
        ]
      : []),
    { title: 'Description', id: 'description' },
    ...(!projectDetails.isUpcoming
      ? [
          { title: 'Risk analysis', id: 'risks' },
          ...projectDetails.sections.map((section) => {
            return { title: section.title, id: section.id }
          }),
          ...(projectDetails.permissionsSection
            ? [{ title: 'Permissioned addresses', id: 'permissionedAddresses' }]
            : []),
          { title: 'Contracts', id: 'contracts' },
        ]
      : []),
  ]

  return sections
}
