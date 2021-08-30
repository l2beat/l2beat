import { projects } from '@l2beat/config'
import express from 'express'
import { Server } from 'http'
import puppeteer from 'puppeteer'

main()
async function main() {
  const app = express()
  app.use(express.static('build'))
  const server = await new Promise<Server>((resolve) => {
    const server = app.listen(1234, () => resolve(server))
  })

  const slugs = projects.map((x) => x.slug).concat('overview')

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: 600,
    height: 314,
    deviceScaleFactor: 2,
  })
  for (const slug of slugs) {
    const path = `build/meta-images/${slug}.png`
    const url = `http://localhost:1234/meta-images/${slug}`
    await page.goto(url, { waitUntil: 'networkidle0' })
    await page.screenshot({ path })
    console.log(`Captured ${path}`)
  }

  await browser.close()
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve()))
  )
}
