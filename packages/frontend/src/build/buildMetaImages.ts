import { projects } from '@l2beat/config'
import express from 'express'
import { Server } from 'http'
import puppeteer from 'puppeteer'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const app = express()
  app.use(express.static('build'))
  const server = await new Promise<Server>((resolve) => {
    const server = app.listen(1234, () => resolve(server))
  })

  const slugs = projects.map((x) => x.slug).concat('overview', 'jobs')

  const browser = await puppeteer.launch()
  await Promise.all(slugs.map(screenshot))

  async function screenshot(slug: string) {
    const page = await browser.newPage()
    await page.setViewport({
      width: 600,
      height: 314,
      deviceScaleFactor: 2,
    })
    const path = `build/meta-images/${slug}.png`
    const url = `http://localhost:1234/meta-images/${slug}`
    await page.goto(url, { waitUntil: 'networkidle0' })
    await page.screenshot({ path })
    console.log(`Captured ${path}`)
  }

  await browser.close()
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  )
}
