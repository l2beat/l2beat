import { getGovernancePublicationTemplate } from './_templates/governance-publication'

export const runtime = 'nodejs'

export const alt = 'Governance publication'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export async function GET(req: Request) {
  if (!req.url) return new Response(null, { status: 404 })
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  switch (type) {
    case 'governance':
      return getGovernancePublicationTemplate(req)
    default:
      return new Response('Unknown template type', { status: 404 })
  }
}
