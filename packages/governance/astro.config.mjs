// eslint-disable-next-line import/no-default-export
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

import preact from '@astrojs/preact'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact()],
})
