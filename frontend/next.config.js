module.exports = {
  publicRuntimeConfig: {
    PUBLIC_URL: 'https://' + (process.env.VERCEL_URL ?? 'l2beat.com'),
  },
}
