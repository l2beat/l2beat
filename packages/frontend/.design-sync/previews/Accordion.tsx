import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@l2beat/frontend'

export function Single() {
  return (
    <div className="w-full max-w-xl text-primary">
      <Accordion type="single" collapsible defaultValue="state-validation">
        <AccordionItem value="state-validation">
          <AccordionTrigger>State validation</AccordionTrigger>
          <AccordionContent className="text-secondary">
            Fraud proofs allow anyone to challenge an invalid state root during
            the 7-day challenge window, provided they run a full node.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="data-availability">
          <AccordionTrigger>Data availability</AccordionTrigger>
          <AccordionContent className="text-secondary">
            All transaction data is posted to Ethereum as calldata.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sequencer-failure">
          <AccordionTrigger>Sequencer failure</AccordionTrigger>
          <AccordionContent className="text-secondary">
            Users can force transactions through the L1 queue.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function MultipleOpen() {
  return (
    <div className="w-full max-w-xl text-primary">
      <Accordion type="multiple" defaultValue={['what', 'how']}>
        <AccordionItem value="what">
          <AccordionTrigger>What is a rollup?</AccordionTrigger>
          <AccordionContent className="text-secondary">
            A chain that executes transactions off-chain but posts its data to
            Ethereum, inheriting its security.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="how">
          <AccordionTrigger>How is TVS calculated?</AccordionTrigger>
          <AccordionContent className="text-secondary">
            The sum of canonically bridged, externally bridged, and natively
            minted tokens, priced in USD.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
