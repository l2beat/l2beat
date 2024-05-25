import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  // TODO: If we want to add another language, we'd need to enable
  // internationalized routing, or read this from cookies etc.
  // https://next-intl-docs.vercel.app/docs/getting-started/app-router
  const locale = 'en'

  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
