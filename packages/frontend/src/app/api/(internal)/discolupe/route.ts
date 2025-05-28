import { NextResponse } from 'next/server'
import { getDiscolupeProjects } from '../_fns/getDiscolupeProjects'

export async function GET() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  const data = await getDiscolupeProjects()

  return NextResponse.json(
    {
      success: true,
      data,
    },
    { headers },
  )
}
