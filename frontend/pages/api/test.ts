import { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer'
import chromium from 'chrome-aws-lambda';

import { join } from 'path'
import { getProjectsNames } from '../../utils/getProjectsPaths'


const APP_URL = process.env.VERCEL_URL || 'http://localhost:3000'
const projects = getProjectsNames()

function generateImage(project: string = '') {

}
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const project = req.query.project

    if (Array.isArray(project) || !projects.includes(project)) {
        res.status(400).send({ error: 'Invalid parameters' })
        return
    }

    try {
        const browser = chromium.puppeteer().launch({
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        })
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 630,
            deviceScaleFactor: 1,
        });
        await page.goto(`${APP_URL}/og/${project}`);
        await page.screenshot({ path: join(process.cwd(), 'public', 'og', `${project}.png`) });
        await browser.close()
        res.send("WORKS")
    } catch (e) {
        res.send(e.toString())
    }
}