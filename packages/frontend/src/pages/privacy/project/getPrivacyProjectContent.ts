import {
  getPrivacyProjectDetails,
  type PrivacyProjectDetails,
} from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacyProjectEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getPrivacyMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import { getWebPageStructuredData } from '~/ssr/head/structured-data/getWebPageStructuredData'
import type {
  ProjectPageContent,
  ProjectPageContext,
  ProjectPageDefinition,
} from '../../project/projectPageDefinition'
import { renderPrivacyProjectMarkdown } from './renderPrivacyProjectMarkdown'

export const privacyProjectPage: ProjectPageDefinition<'PrivacyProjectPage'> = {
  component: 'PrivacyProjectPage',
  getContent: async (slug, context) => {
    const details = await getPrivacyProjectDetails(slug)
    return details && getPrivacyProjectContent(details, context)
  },
  renderMarkdown: ({ entry }) => renderPrivacyProjectMarkdown(entry),
}

/** Takes the details, as a page that adds to this one needs them too. */
export async function getPrivacyProjectContent(
  details: PrivacyProjectDetails,
  { helpers }: ProjectPageContext,
): Promise<ProjectPageContent<'PrivacyProjectPage'>> {
  return {
    props: { entry: await getPrivacyProjectEntry(details, helpers) },
    metadata: {
      name: details.name,
      title: `${details.name} Privacy Review & Risks - ETHBEAT`,
      description: getPrivacyMetadataDescription({
        name: details.name,
        category: details.category.label,
        description: details.display.description,
        promise: details.adversaries.promise.text,
      }),
      structuredData: (webPage) => [
        getWebPageStructuredData(webPage, {
          name: `${details.name} privacy review`,
          about: details.name,
        }),
      ],
    },
  }
}
