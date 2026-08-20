import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  HorizontalSeparator,
} from '@l2beat/frontend'

export function Open() {
  return (
    <div className="w-full max-w-xl text-primary">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-bold">
          Technology details
          <span className="text-secondary text-xs">Hide</span>
        </CollapsibleTrigger>
        <HorizontalSeparator />
        <CollapsibleContent className="pt-3 text-secondary text-sm">
          The project uses a ZK validity proof system with a SHARP prover,
          verified on Ethereum by a STARK verifier contract.
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export function Closed() {
  return (
    <div className="w-full max-w-xl text-primary">
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-bold">
          Technology details
          <span className="text-secondary text-xs">Show</span>
        </CollapsibleTrigger>
        <HorizontalSeparator />
        <CollapsibleContent className="pt-3 text-secondary text-sm">
          Hidden until the trigger is activated.
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
