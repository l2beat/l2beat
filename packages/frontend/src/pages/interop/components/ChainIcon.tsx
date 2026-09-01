export function ChainIcon({
  iconUrl,
  alt,
}: {
  iconUrl: string | undefined
  alt: string
}) {
  if (!iconUrl) {
    return <span className="size-4 rounded-sm bg-surface-secondary" />
  }
  return (
    <img src={iconUrl} alt={alt} className="size-4 rounded-sm object-contain" />
  )
}
