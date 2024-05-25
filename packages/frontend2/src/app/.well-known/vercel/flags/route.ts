import { type ApiData, verifyAccess } from '@vercel/flags'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })

  return NextResponse.json<ApiData>({
    definitions: {
      'asset-risks': {
        description: 'Controls whether the asset risks feature is enabled.',
        origin: '/asset-risks',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
    },
  })
}
