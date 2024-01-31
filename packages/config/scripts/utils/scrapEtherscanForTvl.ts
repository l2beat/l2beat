import { load } from 'cheerio'
import fetch from 'node-fetch'

export async function scrapEtherscanForTvl(
  address: string,
): Promise<{ tvl: string; ethValue: string }> {
  const result = { tvl: '0', ethValue: '0' }

  const etherscanPage = await fetch(`https://etherscan.io/address/${address}`)

  const $ = load(await etherscanPage.text())

  const button = $('#dropdownMenuBalance')
  if (button.text().length > 0) {
    result.tvl = button.text().slice(2).split('\n')[0]
  }

  // FIXME: throwing when trimming, value cannot be found
  try {
    const ethValue = $('div:contains("Eth Value")')
      .last()
      .text()
      .split('$')[1]
      .trim()
      .split(' ')[0]

    if (ethValue) {
      result.ethValue = ethValue
    }
  } catch (err) {
    console.log('could not fetch ethValue while scraping etherscan', err)
  }

  return result
}
