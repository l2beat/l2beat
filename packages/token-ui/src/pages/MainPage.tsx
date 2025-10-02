import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Badge } from '~/components/core/Badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { AppLayout } from '~/layouts/AppLayout'
import { MockTokenService } from '~/mock/MockTokenService'
import type { AbstractToken, DeployedToken } from '~/mock/types'
import { cn } from '~/utils/cn'

export function MainPage() {
  const mockTokenService = new MockTokenService()
  const { data: abstractTokens } = useQuery({
    queryKey: ['abstractTokens'],
    queryFn: () => mockTokenService.getAbstractTokens(),
  })
  const [selectedAbstractToken, setSelectedAbstractToken] = useState<
    AbstractToken | undefined
  >(undefined)
  const [selectedDeployedToken, setSelectedDeployedToken] = useState<
    DeployedToken | undefined
  >(undefined)

  return (
    <AppLayout>
      <div className="grid h-full grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Abstract Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {abstractTokens?.map((token) => (
                <div key={token.id}>
                  <button
                    onClick={() => {
                      setSelectedAbstractToken(token)
                      if (selectedDeployedToken?.abstractTokenId !== token.id) {
                        setSelectedDeployedToken(undefined)
                      }
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md p-2 text-left',
                      selectedAbstractToken?.id === token.id && 'bg-muted',
                    )}
                  >
                    <img
                      src={token.iconUrl ?? '/images/token-placeholder.png'}
                      alt={token.symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {token.symbol}
                  </button>
                  <div className="mt-1 ml-6 flex flex-col items-start gap-1">
                    {token.deployedTokens.map((deployedToken) => (
                      <button
                        key={deployedToken.id}
                        className={cn(
                          'w-full rounded-md p-2 text-left text-muted-foreground text-sm',
                          selectedDeployedToken?.id === deployedToken.id &&
                            'bg-muted',
                        )}
                        onClick={() => {
                          setSelectedAbstractToken(token)
                          setSelectedDeployedToken(deployedToken)
                        }}
                      >
                        {deployedToken.symbol} ({deployedToken.chain})
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-rows-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Abstract Token</CardTitle>
              <CardContent>
                {selectedAbstractToken === undefined ? (
                  <div className="text-muted-foreground text-sm">
                    No abstract token selected
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <ItemWithLabel
                      label="Symbol"
                      value={selectedAbstractToken.symbol}
                    />
                    <ItemWithLabel
                      label="Issuer"
                      value={selectedAbstractToken.issuer}
                    />
                    <ItemWithLabel
                      label="Category"
                      value={selectedAbstractToken.category}
                    />
                    <ItemWithLabel
                      label="Icon URL"
                      value={selectedAbstractToken.iconUrl}
                    />
                    <ItemWithLabel
                      label="Coingecko ID"
                      value={selectedAbstractToken.coingeckoId}
                    />
                    <ItemWithLabel
                      label="Coingecko Listing Timestamp"
                      value={selectedAbstractToken.coingeckoListingTimestamp?.toISOString()}
                    />
                    <ItemWithLabel
                      label="Comment"
                      value={selectedAbstractToken.comment}
                    />
                  </div>
                )}
              </CardContent>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deployed Token</CardTitle>
              <CardContent>
                {selectedDeployedToken === undefined ? (
                  <div className="text-muted-foreground text-sm">
                    No deployed token selected
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <ItemWithLabel
                      label="Symbol"
                      value={selectedDeployedToken.symbol}
                    />
                    <ItemWithLabel
                      label="Chain"
                      value={selectedDeployedToken.chain}
                    />
                    <ItemWithLabel
                      label="Address"
                      value={selectedDeployedToken.address}
                    />
                    <ItemWithLabel
                      label="Decimals"
                      value={selectedDeployedToken.decimals.toString()}
                    />
                    <ItemWithLabel
                      label="Deployment Timestamp"
                      value={selectedDeployedToken.deploymentTimestamp.toISOString()}
                    />
                    <ItemWithLabel
                      label="Comment"
                      value={selectedDeployedToken.comment}
                    />
                  </div>
                )}
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

function ItemWithLabel({
  label,
  value,
}: {
  label: string
  value: string | undefined
}) {
  return (
    <div>
      <span className="font-medium text-muted-foreground text-sm">{label}</span>
      {value ? (
        <p>{value}</p>
      ) : (
        <Badge variant="secondary" className="block">
          N/A
        </Badge>
      )}
    </div>
  )
}
