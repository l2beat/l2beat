import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@l2beat/frontend'

export function SearchPalette() {
  return (
    <div className="w-full max-w-lg">
      <Command>
        <CommandInput placeholder="Search projects, chains, tokens…" />
        <CommandList>
          <CommandGroup heading="Rollups">
            <CommandItem value="arbitrum">Arbitrum One</CommandItem>
            <CommandItem value="optimism">OP Mainnet</CommandItem>
            <CommandItem value="base">Base</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Validiums">
            <CommandItem value="starknet">Starknet</CommandItem>
            <CommandItem value="immutablex">Immutable X</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="w-full max-w-lg">
      <Command>
        <CommandInput placeholder="Search projects…" value="zzzzz" />
        <CommandList>
          <CommandEmpty>No projects found.</CommandEmpty>
        </CommandList>
      </Command>
    </div>
  )
}
