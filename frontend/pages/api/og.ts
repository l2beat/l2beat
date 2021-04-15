// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import { getOgImage } from '../../utils/getOgImage'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const project = req.query.project;

  if (Array.isArray(project)) {
    res.status(400).send({ error: 'Invalid parameters' })
    return;
  }

  const buffer = await getOgImage(project)
  res.setHeader('Content-Type', 'image/png')
  res.send(buffer)
}
