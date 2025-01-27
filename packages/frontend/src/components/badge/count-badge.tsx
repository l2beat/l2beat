interface Props {
  children: number
}

export function CountBadge({ children }: Props) {
  return (
    <div className="bg-brand text-2xs text-primary-invert rounded-full px-2 py-0.5 font-medium">
      {children}
    </div>
  )
}
