import type { Logger } from '@l2beat/backend-tools'
import { chromium } from 'playwright'
import type { BridgeComparePlugin, BridgeExternalItem } from './types'

export class AcrossComparePlugin implements BridgeComparePlugin {
  name = 'across'
  type = 'transfer' as const

  constructor(private logger: Logger) {}

  async getExternalItems(): Promise<BridgeExternalItem[]> {
    // TODO: probably there will be a need to install chrome on backend build
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(
      'https://explorer.range.org/transactions?max=100000000&b=across&sn=eth,base,arb1,oeth&dn=eth,arb1,base,oeth&tt=CROSSCHAIN&l=100',
    )

    await page.waitForSelector(
      'a[class*="hover:underline"][class*="cursor-pointer"]',
      {
        timeout: 10000,
      },
    )

    const divs = page.locator(
      'a[class*="hover:underline"][class*="uppercase"][class*="cursor-pointer"]',
    )

    const urls = await divs.evaluateAll((links) =>
      // @ts-ignore Try changing the 'lib' compiler option to include 'dom'.
      links.map((link) => link.href),
    )

    const result: BridgeExternalItem[] = []

    for (let i = 0; i < 10; i++) {
      await page.goto(urls[i])
      await page.waitForLoadState('networkidle')

      let srcTxHash = undefined

      try {
        await page.waitForSelector('div:has-text("Source Tx")', {
          timeout: 5000,
        })

        const sourceContainer = page
          .locator('div.flex.gap-5xl.items-center')
          .filter({ hasText: 'Source Tx' })

        const sourceTx = await sourceContainer
          .locator('div.absolute.opacity-0.-z-10')
          .innerText()

        if (sourceTx.length === 66) {
          srcTxHash = sourceTx
        }
      } catch (e) {
        this.logger.debug('Error during sourceTx scraping', e)
      }

      let dstTxHash = undefined

      try {
        await page.waitForSelector('div:has-text("Destination Tx")', {
          timeout: 5000,
        })

        const destContainer = page
          .locator('div.flex.gap-5xl.items-center')
          .filter({ hasText: 'Destination Tx' })

        const destinationTx = await destContainer
          .locator('div.absolute.opacity-0.-z-10')
          .innerText()

        if (destinationTx.length === 66) {
          dstTxHash = destinationTx
        }
      } catch (e) {
        this.logger.debug('Error during destinationTx scraping', e)
      }

      if (srcTxHash && dstTxHash) {
        result.push({ srcTxHash, dstTxHash })
      }
    }

    await browser.close()

    return result
  }
}
