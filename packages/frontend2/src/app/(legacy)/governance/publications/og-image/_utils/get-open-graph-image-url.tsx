type Options = {
  title: string
}

export function getGovernanceOpenGraphImageUrl(opts: Options) {
  const { title } = opts

  return `/governance/publications/og-image?title=${encodeURIComponent(title)}`
}
