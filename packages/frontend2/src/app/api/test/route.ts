import { NextResponse } from 'next/server'

export async function GET() {
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  return NextResponse.json({ msg: 'dev' })
}
