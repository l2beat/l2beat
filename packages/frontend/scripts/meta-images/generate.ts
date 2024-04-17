import { bridges, layer2s, layer3s } from '@l2beat/config'
import express from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'
import tinify from 'tinify'
import puppeteer from 'puppeteer'

const STATIC_DIR = join(__dirname, '../../src/static')
const OUTPUT_DIR = join(STATIC_DIR, 'meta-images/projects')
const ICON_DIR = join(STATIC_DIR, 'icons')
const FONT_DIR = join(STATIC_DIR, 'fonts')

void main()
async function main() {
  const slug = process.argv[2]
  const projects = [...bridges, ...layer2s, ...layer3s]
  const project = projects.find((p) => p.display.slug === slug)

  if (!project) {
    console.error(`Project with slug ${slug} not found`)
    process.exit(1)
  }

  await screenshot(project.display.slug, project.display.name)
  await optimize(project.display.slug)
}

async function screenshot(slug: string, name: string) {
  const template = readFileSync(join(__dirname, 'template.html'), 'utf-8')
  const html = template.replace(/__NAME__/g, name)

  const app = express()
  app.get('/', (req, res) => res.send(html))
  app.use('/fonts', express.static(FONT_DIR))
  app.get('/template.png', (req, res) =>
    res.sendFile(join(OUTPUT_DIR, 'template.png')),
  )
  app.get('/icon.png', (req, res) =>
    res.sendFile(join(ICON_DIR, `${slug}.png`)),
  )
  const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
    const server = app.listen(1234, () => resolve(server))
  })

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle0' })

  const path = join(OUTPUT_DIR, `${slug}.png`)
  await page.screenshot({ path })
  console.log(`Captured ${path}`)

  await browser.close()
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  )
}

async function optimize(slug: string) {
  /*
    Default API key is associated with burner email.
    If the limit is reached (500 contributions), create a new one for yourself at https://tinypng.com/developers.
  */
  const apiKey =
    process.env.TINIFY_API_KEY ?? 'yVNSp71vjB7Hn0zmCpRVTl2Z1dznT1Gw'

  if (!apiKey) {
    throw new Error('Missing TINIFY_API_KEY')
  }
  tinify.key = apiKey

  const path = join(OUTPUT_DIR, `${slug}.png`)
  await tinify.fromFile(path).toFile(path)
}
