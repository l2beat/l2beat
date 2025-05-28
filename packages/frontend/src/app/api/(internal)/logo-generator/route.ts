import { NextResponse } from 'next/server'
import { getLogoGeneratorProjects } from '../_fns/getLogoGeneratorProjects'

export async function GET() {
  const data = await getLogoGeneratorProjects()

  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
