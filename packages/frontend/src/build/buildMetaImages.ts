import { bridges, layer2s } from '@l2beat/config'
import express from 'express'
import { mkdirpSync } from 'fs-extra'
import { Server } from 'http'
import puppeteer from 'puppeteer'

import { getConfig } from './config'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const env = process.env.DEPLOYMENT_ENV ?? 'production'
  console.log(`Using config for ${env}`)
  const config = getConfig(env)

  // ensure that meta-images directory exists
  mkdirpSync('build/meta-images')

  const app = express()
  app.use(express.static('build'))
  const server = await new Promise<Server>((resolve) => {
    const server = app.listen(1234, () => resolve(server))
  })

  const slugs = [...layer2s, ...bridges]
    .map((x) => x.display.slug)
    .concat('overview-scaling', 'overview-bridges')

  if (config.features.activity) {
    slugs.concat('overview-scaling-activity')
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  })
  await Promise.all(slugs.map(screenshot))

  async function screenshot(slug: string) {
    const page = await browser.newPage()
    await page.setViewport({
      width: 600,
      height: 314,
      deviceScaleFactor: 2,
    })
    const imagePath = `build/meta-images/${slug}.png`
    const urlPath = `meta-images/${slug}`
    const url = `http://localhost:1234/${urlPath}`
    await page.goto(url, { waitUntil: 'networkidle0' })

    if (await is404(page, urlPath)) {
      const string = `Meta image for ${slug} did not build properly!`
      throw new Error(string)
    }

    await page.screenshot({ path: imagePath })
    console.log(`Captured ${imagePath}`)
  }

  await browser.close()
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  )
}

async function is404(page: puppeteer.Page, urlPath: string) {
  const body = await page.$('body')
  const innerHTML = await body?.getProperty('innerHTML')
  const value = await innerHTML?.jsonValue()

  if (typeof value !== 'string') {
    throw new Error('Value should be string!')
  }

  return value.includes(`Cannot GET /${urlPath}`)
}
