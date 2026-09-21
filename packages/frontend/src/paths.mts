export const CLIENT_BASE_PATH = '/static/' as const
export const CLIENT_ASSETS_DIR = 'assets' as const
export const CLIENT_OUTPUT_DIR = 'dist/client' as const
export const CLIENT_ASSETS_PATH =
  `${CLIENT_BASE_PATH}${CLIENT_ASSETS_DIR}` as const
export const CLIENT_ASSETS_OUTPUT_DIR =
  `${CLIENT_OUTPUT_DIR}/${CLIENT_ASSETS_DIR}` as const
export const CLIENT_TEMPLATE_PATH = `${CLIENT_OUTPUT_DIR}/index.html` as const
