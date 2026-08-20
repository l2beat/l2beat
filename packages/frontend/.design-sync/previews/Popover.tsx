import { Popover, PopoverContent, PopoverTrigger } from '@l2beat/frontend'

export function Open() {
  return (
    <div className="flex justify-center py-8">
      <Popover open modal={false}>
        <PopoverTrigger>Data availability</PopoverTrigger>
        <PopoverContent align="center" className="w-64">
          <div className="font-bold text-primary text-sm">
            Where is the data posted?
          </div>
          <p className="pt-1 text-secondary text-xs">
            Transaction data is published to Ethereum as blobs, so anyone can
            reconstruct the chain state without trusting the operator.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  )
}
