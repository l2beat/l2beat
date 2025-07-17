const ACCOUNT_SLUG = 'throwawayl2beat'
const PROJECT_SLUG = 'project'
// Yes I know this is leaking the key. It's free tier, worst that happens is
// we rotate. I really don't want to implement a backend
const ACCESS_TOKEN = 'sepln6zXZAxWV2DyG8LpDSbXhAgbiT0e'

export async function simulate(
  // biome-ignore lint/suspicious/noExplicitAny: We don't have good type info
  tx: any,
): Promise<{ link: string } | { data: unknown }> {
  // biome-ignore lint/suspicious/noExplicitAny: We don't have good type info
  const txPayload: any = {
    ...tx,
    save: true,
    save_if_fails: true,
    simulation_type: 'full',
    source: 'rabby-wallet',
    network_id: tx.chainId.toString(),
    gas: Number.parseInt(tx.gas, 16) || null,
    gas_price: Number.parseInt(tx.gasPrice, 16) || null,
    value: Number.parseInt(tx.value, 16) || null,
    input: tx.data,
  }

  const baseUrl = `https://api.tenderly.co/api/v1/account/${ACCOUNT_SLUG}/project/${PROJECT_SLUG}`
  try {
    const res = await fetch(`${baseUrl}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': ACCESS_TOKEN,
      },
      body: JSON.stringify(txPayload),
    })
    const data = await res.json()

    // Make the simulation publicly accessible
    const id: string = data?.simulation?.id
    if (id) {
      await fetch(`${baseUrl}/simulations/${id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': ACCESS_TOKEN,
        },
      })
      return { link: `https://tdly.co/shared/simulation/${id}` }
    }
    return { data }
  } catch (error) {
    console.error(error)
    return { data: error instanceof Error ? error.message : `${error}` }
  }
}
