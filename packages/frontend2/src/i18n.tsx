import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  // TODO: If we want to add another language, we'd need to enable
  // internationalized routing, or read this from cookies etc.
  // https://next-intl-docs.vercel.app/docs/getting-started/app-router
  const locale = 'en-us'
  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../messages/${locale}.json`)).default,
    formats: {
      dateTime: {
        monthWithYear: {
          month: 'long',
          year: 'numeric',
        },
      },
      number: {
        USD: {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        },
      },
    },
    defaultTranslationValues: {
      p: (children) => <p>{children}</p>,
      div: (children) => <div>{children}</div>,
      span: (children) => <span>{children}</span>,
      li: (children) => <li>{children}</li>,
      strong: (children) => <strong>{children}</strong>,
    },
  }
})
