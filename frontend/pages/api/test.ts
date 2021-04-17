import { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'chrome-aws-lambda'
import memoize from 'lodash/memoize'

import { join } from 'path'
import { readFile } from 'fs'
import { promisify } from 'util'
import { getProjectsNames } from '../../utils/getProjectsPaths'


const APP_URL = process.env.VERCEL_URL || 'http://localhost:3000'
const projects = getProjectsNames()

async function generateImage_(project: string = '') {
    const imagePath = join(process.cwd(), 'public', 'og', `${project}.png`)
    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 630,
    });
    await page.goto(`${APP_URL}/og/${project}`);
    await page.screenshot({ path: imagePath });
    await browser.close()
    return imagePath
}

async function getImageBuffer_(path: string) {
    return promisify(readFile)(path)
}

const generateImage = memoize(generateImage_)
const getImageBuffer = memoize(getImageBuffer_)

async function getOgImage_(project: string = '') {
    const imagePath = await generateImage(project);
    return getImageBuffer(imagePath)
}

const getOgImage = memoize(getOgImage_)
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const project = req.query.project

    if (Array.isArray(project) || !projects.includes(project) || project === undefined) {
        res.status(400).send({ error: 'Invalid parameters' })
        return
    }

    try {
        const buffer = await getOgImage(project)
        res.setHeader('Content-Type', 'image/png')
        res.send(buffer)
    } catch (e) {
        res.send(e.toString())
    }
}