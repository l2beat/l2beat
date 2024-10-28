interface Props {
  children: number
}

export function CountBadge({ children }: Props) {
  return (
    <div className="rounded-full bg-brand px-2 py-0.5 text-2xs font-medium text-primary-invert">
      {children}
    </div>
  )
}
