import { bridges, layer2s } from '@l2beat/config'
import express from 'express'
import { existsSync } from 'fs'
import { mkdirpSync } from 'fs-extra'
import { Server } from 'http'
import path from 'path'
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
    .filter((slug) =>
      // only screenshot those that were actually generated
      existsSync(path.join('build/meta-images', slug, 'index.html')),
    )
    .concat('overview-scaling', 'overview-bridges')

  if (config.features.activity) {
    slugs.push('overview-scaling-activity')
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
    const path = `build/meta-images/${slug}.png`
    const url = `http://localhost:1234/meta-images/${slug}`
    await page.goto(url, { waitUntil: 'networkidle0' })

    await sanityCheck(page, slug)

    await page.screenshot({ path })
    console.log(`Captured ${path}`)
  }

  await browser.close()
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  )
}

async function sanityCheck(page: puppeteer.Page, slug: string): Promise<void> {
  const l2BeatLogo = await page.$('[aria-label="L2BEAT logo"]')
  if (!l2BeatLogo) {
    throw new Error(`Meta image for ${slug} did not build properly!`)
  }
}
