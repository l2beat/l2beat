interface Props {
  children: number
}

export function CountBadge({ children }: Props) {
  return (
    <div className="rounded-full bg-brand px-2 py-0.5 font-medium text-2xs text-primary-invert">
      {children}
    </div>
  )
}
