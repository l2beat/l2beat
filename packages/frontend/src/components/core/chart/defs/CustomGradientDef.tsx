interface Props {
  id: string
  colors: {
    primary: string
    secondary: string
  }
}

export function CustomFillGradientDef({ id, colors }: Props) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="25%" stopColor={colors.primary} stopOpacity={0.8} />
      <stop offset="50%" stopColor={colors.secondary} stopOpacity={0.4} />
      <stop offset="100%" stopColor={colors.secondary} stopOpacity={0} />
    </linearGradient>
  )
}
