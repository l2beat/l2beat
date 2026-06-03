const items = [
  {
    title: 'Decentralized sequencing',
    body: 'Block production is shared by many sequencers / validators. Inclusion depends on rotation, sampling, stake distribution, and whether enough non-censoring operators keep participating.',
  },
  {
    title: 'Centralized sequencing',
    body: 'A single operator handles normal ordering and can scale easily. Censorship resistance must be enforced with L1 paths, such as forced transactions, self-sequencing or escape hatch mechanisms.',
  },
  {
    title: 'Best of both worlds',
    body: 'A decentralised sequencer set excels at short short term (and real-time) censorship resistance. The long-term (eventual) censorship resistance should be derived from Ethereum if possible, as it likely is more decentralised and censorship resistant.',
  },
]

export function DecentralizedSequencingExplainer() {
  return (
    <section className="mb-4 grid gap-3 px-4 md:mb-6 md:grid-cols-3 md:px-0">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-lg border border-divider bg-surface-primary p-4"
        >
          <h2 className="mb-2 font-bold text-base">{item.title}</h2>
          <p className="text-secondary text-sm leading-5">{item.body}</p>
        </div>
      ))}
    </section>
  )
}
