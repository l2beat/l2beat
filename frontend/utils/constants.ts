import { join } from "path"

export const APP_URL = process.env.VERCEL_URL || 'http://localhost:3000'
export const ARTIFACTS_DIR = join(process.cwd(), 'artifacts')
export const OG_FILES_DIR = join(process.cwd(), 'artifacts', 'og-images')