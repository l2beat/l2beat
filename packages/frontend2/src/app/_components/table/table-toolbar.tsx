interface Props {
  children: React.ReactNode
}

export const TableToolbar = ({ children }: Props) => {
  return <div className="flex items-center gap-2 mb-2">{children}</div>
}
