import { CustomLink } from '~/components/link/CustomLink'
import type { DefiProjectToken } from '~/server/features/defi/project/getDefiProjectTokens'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface DefiTokensSectionProps extends ProjectSectionProps {
  tokens: DefiProjectToken[]
}

/** The protocol's tokens, each linked to its token page when one exists. */
export function DefiTokensSection({
  tokens,
  ...sectionProps
}: DefiTokensSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ul className="flex flex-col gap-4">
        {tokens.map((token) => (
          <li key={token.symbol} className="flex items-start gap-3">
            <img
              src={token.icon}
              alt=""
              className="mt-0.5 size-6 shrink-0 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                {token.href ? (
                  <CustomLink href={token.href} className="font-bold">
                    {token.symbol}
                  </CustomLink>
                ) : (
                  <span className="font-bold">{token.symbol}</span>
                )}
                <span className="text-secondary text-sm">{token.name}</span>
              </div>
              <p className="mt-0.5 text-paragraph-15 md:text-paragraph-16">
                {token.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ProjectSection>
  )
}
