interface ProxyTypeTagProps {
  proxyType: string | undefined
}

/**
 * Displays a colored tag indicating whether a contract is a Proxy or Immutable
 * - Immutable: Green tag
 * - Proxy (any proxy type): Yellow/Orange tag
 */
export function ProxyTypeTag({ proxyType }: ProxyTypeTagProps) {
  if (!proxyType) {
    return null
  }

  const isImmutable = proxyType === 'immutable'
  const label = isImmutable ? 'Immutable' : 'Proxy'

  const styles = isImmutable
    ? {
        backgroundColor: 'rgba(20, 83, 45, 0.5)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        color: '#10b981',
      }
    : {
        backgroundColor: 'rgba(113, 63, 18, 0.5)',
        borderColor: 'rgba(234, 179, 8, 0.3)',
        color: '#fbbf24',
      }

  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded border text-xs"
      style={styles}
    >
      {label}
    </span>
  )
}
