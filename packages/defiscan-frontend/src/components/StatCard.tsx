interface StatCardProps {
  label: string
  value: string
  sublabel?: string
}

export function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <p className="mt-1 text-3xl font-bold text-text-primary">{value}</p>
      {sublabel && (
        <p className="mt-1 text-sm text-text-muted">{sublabel}</p>
      )}
    </div>
  )
}
