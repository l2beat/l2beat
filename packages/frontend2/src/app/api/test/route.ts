import { NextResponse } from 'next/server'
import { getLiveness } from '~/server/features/liveness/get-liveness'

export async function GET() {
  const liveness = await getLiveness()
  return NextResponse.json(liveness)
}
