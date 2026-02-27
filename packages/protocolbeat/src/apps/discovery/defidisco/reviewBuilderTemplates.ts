import type { ReviewConfig, ReviewProjectType } from '../../../api/types'

const STABLECOIN_TEMPLATE: ReviewConfig = {
  version: '1.0',
  lastModified: '',
  protocolSlug: '',
  protocolName: '',
  tokenName: '',
  chain: 'Ethereum',
  projectType: 'stablecoin',
  description: '',
  admins: {},
  dependencies: {},
  funds: {},
  sections: {
    codeAndAudits: {
      title: 'Code & Audits',
      description: 'Smart contract analysis and audit history',
      subsections: [
        {
          title: 'Contracts',
          content: [
            {
              type: 'dataTable',
              dataSource: 'project.contracts',
              columns: [
                { field: 'name', header: 'Name' },
                { field: 'address', header: 'Address', format: 'address' },
                { field: 'proxyType', header: 'Proxy Type', format: 'badge' },
              ],
            },
          ],
        },
        {
          title: 'Audits',
          content: [{ type: 'text', content: '' }],
        },
      ],
    },
  },
  dataKeys: {},
}

const TEMPLATES: Partial<Record<ReviewProjectType, ReviewConfig>> = {
  stablecoin: STABLECOIN_TEMPLATE,
}

export function getReviewTemplate(
  projectType: ReviewProjectType,
): ReviewConfig {
  const template = TEMPLATES[projectType]
  if (!template) {
    throw new Error(`No template available for project type: ${projectType}`)
  }
  return JSON.parse(JSON.stringify(template)) as ReviewConfig
}

export const AVAILABLE_PROJECT_TYPES: ReviewProjectType[] = ['stablecoin']
