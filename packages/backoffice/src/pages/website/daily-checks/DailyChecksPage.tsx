import { ExternalLinkIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { AppLayout } from '~/layouts/AppLayout'

const KIBANA_URL = import.meta.env.VITE_KIBANA_URL?.replace(/\/+$/, '') ?? ''

const DAILY_CHECKS = [
  {
    name: 'Backend Dashboard',
    path: '/app/dashboards#/view/721447df-9024-4ff9-80da-88700ddd1c7a',
  },
  {
    name: 'Backend Errors [PROD]',
    path: "/app/discover#/view/1b15597c-2de7-4b93-832e-462fef68ea08?_g=(filters:!(),refreshInterval:(pause:!f,value:60000),time:(from:now-24h%2Fh,to:now))&_a=(breakdownField:log.level.keyword,columns:!(log.level,error.type,service.name,message,error.message,parameters.attempt,labels.chain),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'5a26f8e1-4d53-4461-98da-1662344a9b3e',negate:!f,params:!((meta:(alias:!n,disabled:!f,index:'5a26f8e1-4d53-4461-98da-1662344a9b3e',key:log.level,negate:!f,params:(query:ERROR),type:phrase),query:(match_phrase:(log.level:ERROR))),(meta:(alias:!n,disabled:!f,field:log.level,index:'5a26f8e1-4d53-4461-98da-1662344a9b3e',key:log.level,negate:!f,params:(query:CRITICAL),type:phrase),query:(match_phrase:(log.level:CRITICAL)))),relation:OR,type:combined),query:())),grid:(columns:('@timestamp':(width:212),error.message:(width:472),error.type:(width:95),log.level:(width:82),message:(width:157),service.name:(width:226))),hideChart:!f,index:'5a26f8e1-4d53-4461-98da-1662344a9b3e',interval:auto,query:(language:kuery,query:'NOT%20error.message.keyword%20:*timeout*'),sort:!(!('@timestamp',desc)))",
  },
  {
    name: 'Website Dashboard',
    path: '/app/dashboards#/view/16dbd103-d19b-4e0d-b47e-761d1d0286cd',
  },
  {
    name: 'Public API Dashboard',
    path: '/app/dashboards#/view/083d2c63-99dc-40f6-b27b-81a07afc35c9',
  },
]

export function DailyChecksPage() {
  return (
    <AppLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle>Daily checks</CardTitle>
          <CardDescription>
            Quick links to the Elastic Search dashboards we monitor on a daily
            basis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {DAILY_CHECKS.map((check) => (
              <li key={check.name}>
                <a
                  href={`${KIBANA_URL}${check.path}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  {check.name}
                  <ExternalLinkIcon className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
