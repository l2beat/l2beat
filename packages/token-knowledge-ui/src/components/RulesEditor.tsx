import { useEffect, useState } from 'react'
import { api } from '~/react-query/trpc'
import { Button } from './Button'

export function RulesEditor() {
  const rules = api.getRules.useQuery()
  const saveMutation = api.saveRules.useMutation({
    onSuccess: () => rules.refetch(),
  })

  const [content, setContent] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (rules.data) {
      setContent(rules.data.content)
      setDirty(false)
    }
  }, [rules.data])

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-sm">Rules editor</h2>
        <Button
          size="sm"
          onClick={() => saveMutation.mutate({ content })}
          disabled={!dirty || saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <textarea
        className="flex-1 resize-none rounded-md border border-input bg-card p-3 font-mono text-xs leading-relaxed outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setDirty(true)
        }}
        spellCheck={false}
      />
      {saveMutation.error && (
        <p className="text-destructive text-xs">
          Error: {saveMutation.error.message}
        </p>
      )}
      {saveMutation.data && !dirty && (
        <p className="text-muted-foreground text-xs">Saved.</p>
      )}
    </div>
  )
}
