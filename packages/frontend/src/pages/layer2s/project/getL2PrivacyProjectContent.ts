import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { addPrivacyToL2Entry } from '~/server/features/privacy/project/addPrivacyToL2Entry'
import { getPrivacySummary } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getPrivacySummaryMarkdown } from '../../privacy/project/renderPrivacyProjectMarkdown'
import type {
  ProjectPageContent,
  ProjectPageContext,
  ProjectPageDefinition,
} from '../../project/projectPageDefinition'
import { getL2ProjectContent } from './getL2ProjectContent'
import { renderL2ProjectMarkdown } from './renderL2ProjectMarkdown'

/** The page of a scaling project that is also a privacy protocol, like Payy. */
export const l2PrivacyProjectPage: ProjectPageDefinition<'L2ProjectPage'> = {
  component: 'L2ProjectPage',
  getContent: getL2PrivacyProjectContent,
  renderMarkdown: ({ projectEntry, privacy }) =>
    renderL2ProjectMarkdown(
      projectEntry,
      privacy && getPrivacySummaryMarkdown(privacy, projectEntry.sections),
    ),
}

async function getL2PrivacyProjectContent(
  slug: string,
  context: ProjectPageContext,
): Promise<ProjectPageContent<'L2ProjectPage'> | undefined> {
  const [content, privacy] = await Promise.all([
    getL2ProjectContent(slug, context),
    getPrivacyProjectDetails(slug),
  ])
  if (!content || !privacy) return undefined

  return {
    ...content,
    props: {
      projectEntry: addPrivacyToL2Entry(content.props.projectEntry, privacy),
      privacy: getPrivacySummary(privacy),
    },
  }
}
