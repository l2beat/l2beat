import { type ApiData, verifyAccess } from '@vercel/flags'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'))
  if (!access) return NextResponse.json(null, { status: 401 })

  return NextResponse.json<ApiData>({
    definitions: {
      activity: {
        description: 'Controls whether the activity feature is enabled.',
        origin: '/scaling/activity',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      'asset-risks': {
        description: 'Controls whether the asset risks feature is enabled.',
        origin: '/asset-risks',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      costs: {
        description: 'Controls whether the costs feature is enabled.',
        origin: '/scaling/costs',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      finality: {
        description: 'Controls whether the finality feature is enabled.',
        origin: '/scaling/finality',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      glossary: {
        description: 'Controls whether the glossary feature is enabled.',
        origin: '/glossary',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      governance: {
        description: 'Controls whether the governance feature is enabled.',
        origin: '/governance',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      hiring: {
        description: 'Controls whether the hiring feature is enabled.',
        origin: '/hiring',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      liveness: {
        description: 'Controls whether the liveness feature is enabled.',
        origin: '/scaling/liveness',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
      'zk-catalog': {
        description: 'Controls whether the zk-catalog feature is enabled.',
        origin: '/zk-catalog',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
    },
  })
}
