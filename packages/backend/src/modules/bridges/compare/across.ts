import type { Logger } from '@l2beat/backend-tools'
import { chromium, type Page } from 'playwright'
import type { BridgeComparePlugin, BridgeExternalItem } from './types'

export class AcrossComparePlugin implements BridgeComparePlugin {
  name = 'across'
  type = 'transfer' as const

  constructor(private logger: Logger) {}

  async getExternalItems(): Promise<BridgeExternalItem[]> {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(
      'https://explorer.range.org/transactions?max=100000000&b=across&sn=eth,base,arb1,oeth&dn=eth,arb1,base,oeth&tt=CROSSCHAIN&l=100',
    )

    await page.waitForSelector(
      'a[class*="hover:underline"][class*="cursor-pointer"]',
      { timeout: 10000 },
    )

    const divs = page.locator(
      'a[class*="hover:underline"][class*="uppercase"][class*="cursor-pointer"]',
    )

    const urls = await divs.evaluateAll((links: HTMLAnchorElement[]) =>
      // @ts-ignore Try changing the 'lib' compiler option to include 'dom'.
      links.map((link) => link.href),
    )
    const urlsToProcess = Math.min(urls.length, 50)

    // Process in batches to avoid overwhelming the server
    const batchSize = 5 // Adjust based on server capacity
    const results: BridgeExternalItem[] = []

    for (let i = 0; i < urlsToProcess; i += batchSize) {
      const batch = urls.slice(i, i + batchSize)

      const batchResults = await Promise.all(
        batch.map(async (url) => {
          const newPage = await context.newPage()
          const result = await this.scrapePage(newPage, url)
          await newPage.close()
          return result
        }),
      )

      results.push(...batchResults.filter((b) => b !== null))
    }

    await browser.close()
    return results
  }

  private async scrapePage(
    page: Page,
    url: string,
  ): Promise<BridgeExternalItem | null> {
    try {
      await page.goto(url)
      await page.waitForLoadState('networkidle')

      let srcTxHash: string | undefined
      let dstTxHash: string | undefined

      // Get source tx
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

      // Get destination tx
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
        return { srcTxHash, dstTxHash }
      }
      return null
    } catch (error) {
      this.logger.debug(`Error during scraping ${url}`, error)
      return null
    }
  }
}
