import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { Separator } from '~/components/core/Separator'
import { AppLayout } from '~/layouts/AppLayout'
import { tokenService } from '~/mock/MockTokenService'
import type { AbstractToken, DeployedToken } from '~/mock/types'
import { cn } from '~/utils/cn'

export function MainPage() {
  const { data, isLoading: isAbstractTokensLoading } = useQuery({
    queryKey: ['abstractTokens', 'deployedTokens'],
    queryFn: () => tokenService.getMainPageTokens(),
  })
  const [selectedAbstractToken, setSelectedAbstractToken] = useState<
    AbstractToken | undefined
  >(undefined)
  const [selectedDeployedToken, setSelectedDeployedToken] = useState<
    DeployedToken | undefined
  >(undefined)
  console.log(data)
  return (
    <AppLayout>
      <div className="grid h-full grid-cols-2 gap-4">
        <Card className="max-h-[calc(100vh-16px)] overflow-y-auto">
          <CardHeader>
            <CardTitle>Abstract Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {isAbstractTokensLoading ? (
                <span className="text-muted-foreground text-sm">
                  Loading...
                </span>
              ) : (
                <>
                  {data?.abstractTokens.map((token) => (
                    <div key={token.id}>
                      <button
                        onClick={() => {
                          setSelectedAbstractToken(token)
                          if (
                            selectedDeployedToken?.abstractTokenId !== token.id
                          ) {
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
                  <Separator className="mt-2 mb-4" />
                  <h2 className="font-semibold leading-none">
                    Unmatched Deployed Tokens
                  </h2>
                  <div className="mt-1 ml-6 flex flex-col items-start gap-1">
                    {data?.deployedWithoutAbstractTokens.map((token) => {
                      return (
                        <button
                          key={token.id}
                          className={cn(
                            'w-full rounded-md p-2 text-left text-muted-foreground text-sm',
                            selectedDeployedToken?.id === token.id &&
                              'bg-muted',
                          )}
                          onClick={() => {
                            setSelectedAbstractToken(undefined)
                            setSelectedDeployedToken(token)
                          }}
                        >
                          {token.symbol} ({token.chain})
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-rows-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Abstract Token</CardTitle>
              {selectedAbstractToken && (
                <CardAction>
                  <Button asChild variant="outline">
                    <Link to={`/tokens/${selectedAbstractToken.id}`}>
                      Go to Token page
                    </Link>
                  </Button>
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              {selectedAbstractToken === undefined ? (
                <div className="text-muted-foreground text-sm">
                  No abstract token selected
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3">
                    <ItemWithLabel
                      label="ID"
                      value={selectedAbstractToken.id}
                    />
                    <ItemWithLabel
                      label="Issuer"
                      value={selectedAbstractToken.issuer}
                    />
                    <ItemWithLabel
                      label="Symbol"
                      value={selectedAbstractToken.symbol}
                    />
                  </div>
                  <ItemWithLabel
                    label="Coingecko ID"
                    value={selectedAbstractToken.coingeckoId}
                  />

                  <ItemWithLabel
                    label="Icon URL"
                    value={selectedAbstractToken.iconUrl}
                  />

                  <ItemWithLabel
                    label="Coingecko Listing Timestamp"
                    value={selectedAbstractToken.coingeckoListingTimestamp?.toISOString()}
                  />
                  <ItemWithLabel
                    label="Category"
                    value={selectedAbstractToken.category}
                  />
                  <ItemWithLabel
                    label="Comment"
                    value={selectedAbstractToken.comment}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deployed Token</CardTitle>
              {selectedDeployedToken && (
                <CardAction>
                  <Button asChild variant="outline">
                    <Link to={`/tokens/${selectedDeployedToken.id}`}>
                      Go to Token page
                    </Link>
                  </Button>
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              {selectedDeployedToken === undefined ? (
                <div className="text-muted-foreground text-sm">
                  No deployed token selected
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3">
                    <ItemWithLabel
                      label="Chain"
                      value={selectedDeployedToken.chain}
                    />
                    <ItemWithLabel
                      className="col-span-2"
                      label="Address"
                      value={selectedDeployedToken.address}
                    />
                  </div>
                  <ItemWithLabel
                    label="Symbol"
                    value={selectedDeployedToken.symbol}
                  />

                  <ItemWithLabel
                    label="Abstract Token ID"
                    value={selectedDeployedToken.abstractTokenId}
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
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

function ItemWithLabel({
  label,
  value,
  className,
}: {
  label: string
  value: string | undefined
  className?: string
}) {
  return (
    <div className={className}>
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
