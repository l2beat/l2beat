import { UPDATE_MONITOR_URL } from './const'
import { UpdateMessagesResponse } from './model'

export async function fetchData(): Promise<UpdateMessagesResponse> {
  const req = await fetch(UPDATE_MONITOR_URL)
  const result = await req.json()

  if (!req.ok) {
    throw new Error('Failed to fetch data')
  }

  const safeParse = UpdateMessagesResponse.safeParse(result)

  if (!safeParse.success) {
    console.error(safeParse.message)
    throw new Error('Failed to parse data')
  }

  return safeParse.data
}
