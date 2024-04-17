import { bridges, layer2s } from '@l2beat/config'
import express from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'
import puppeteer from 'puppeteer'

void main()
async function main() {
  const slug = process.argv[2]
  const projects = [...bridges, ...layer2s]
  const project = projects.find((p) => p.display.slug === slug)

  if (!project) {
    console.error(`Project with slug ${slug} not found`)
    process.exit(1)
  }

  const staticDirectory = join(__dirname, '../../src/static')
  const outputDirectory = join(staticDirectory, 'meta-images/projects')
  const iconDirectory = join(staticDirectory, 'icons')
  const fontDirectory = join(staticDirectory, 'fonts')

  const app = express()

  const template = readFileSync(join(__dirname, 'template.html'), 'utf-8')
  const html = template.replace(/__NAME__/g, project.display.name)
  app.get('/', (req, res) => res.send(html))
  app.use('/fonts', express.static(fontDirectory))
  app.get('/template.png', (req, res) =>
    res.sendFile(join(outputDirectory, 'template.png')),
  )
  app.get('/icon.png', (req, res) =>
    res.sendFile(join(iconDirectory, `${slug}.png`)),
  )

  const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
    const server = app.listen(1234, () => resolve(server))
  })

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 1,
  })
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle0' })

  const path = join(outputDirectory, `${slug}.png`)
  await page.screenshot({ path })
  console.log(`Captured ${path}`)

  await browser.close()
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  )
}
