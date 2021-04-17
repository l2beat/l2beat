import { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer'
import { join } from 'path'

const APP_URL = process.env.VERCEL_URL || 'http://localhost:3000'
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const project = req.query.project

    if (Array.isArray(project)) {
        res.status(400).send({ error: 'Invalid parameters' })
        return
    }

    try {

        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 620,
            deviceScaleFactor: 1,
        });
        await page.goto(`${APP_URL}/og/${project}`);
        await page.screenshot({ path: join(process.cwd(), 'public', 'og', `${project}.png`) });
        res.send("WORKS")
    } catch (e) {
        res.send(e.toString())
    }
}