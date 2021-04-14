// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const filePath = path.resolve(process.cwd(), 'public/optimism-og.png')
const imageBuffer = fs.readFileSync(filePath)

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'image/png')
  res.send(imageBuffer)
}
