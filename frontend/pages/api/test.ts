import { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer'

const APP_URL = process.env.VERCEL_URL || 'https://localhost:3000'
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 620,
        deviceScaleFactor: 1,
    });
    await page.goto('https://buddy.works');
    await page.screenshot({ path: 'buddy-screenshot.png' });
    return
}