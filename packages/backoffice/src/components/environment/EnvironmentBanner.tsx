import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDownIcon } from 'lucide-react'
import { SelectContent, SelectItem } from '~/components/core/Select'
import { cn } from '~/utils/cn'
import { type Environment, useEnvironment } from './EnvironmentContext'

export function EnvironmentBanner() {
  const { environment, setEnvironment, config, allConfigs } = useEnvironment()

  return (
    <SelectPrimitive.Root
      value={environment}
      onValueChange={(value) => setEnvironment(value as Environment)}
    >
      <SelectPrimitive.Trigger
        className={cn(
          'sticky top-0 z-999 flex h-environment-banner w-full items-center justify-center gap-1.5 font-medium font-mono text-sm text-white uppercase leading-none outline-none transition-opacity hover:opacity-90 focus-visible:opacity-90',
          config.classNames.dot,
        )}
      >
        <span>{config.label}</span>
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-3.5" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectContent align="center" className="w-20">
        {allConfigs.map(({ id, config }) => (
          <SelectItem key={id} value={id}>
            <span className="flex items-center gap-2">
              <span
                className={cn('size-2 rounded-full', config.classNames.dot)}
              />
              <span>{config.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive.Root>
  )
}
