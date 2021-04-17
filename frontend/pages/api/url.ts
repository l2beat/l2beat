import { NextApiRequest, NextApiResponse } from "next"

const APP_URL = process.env.VERCEL_URL || 'https://localhost:3000'

export default (_: NextApiRequest, res: NextApiResponse) => {
    res.send({ APP_URL })
}