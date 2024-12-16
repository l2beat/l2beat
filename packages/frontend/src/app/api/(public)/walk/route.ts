import { readdirSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') ?? '/'
  const response = readdirSync(path, { withFileTypes: true }).map((x) => ({
    name: x.name,
    url: `/api/walk?path=${join(path, x.name)}`,
    type: x.isFile() ? 'file' : x.isDirectory() ? 'dir' : '?',
  }))
  return NextResponse.json(response)
}
