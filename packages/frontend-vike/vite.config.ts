import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [react(), vike()],
  ssr: {
    external: ['@l2beat/config', '@l2beat/shared-pure', '@l2beat/database'],
  },
}

export default config
