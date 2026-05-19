import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface Props extends AppLayoutProps {}

const DAILY_CHECKS = [
  {
    name: 'Backend Dashboard',
    href: 'https://e14a8096838c415a953586ac14e8f02f.us-east-1.aws.found.io:9243/app/dashboards#/view/721447df-9024-4ff9-80da-88700ddd1c7a',
  },
  {
    name: 'Backend Errors [PROD]',
    href: "https://e14a8096838c415a953586ac14e8f02f.us-east-1.aws.found.io:9243/app/discover#/view/1b15597c-2de7-4b93-832e-462fef68ea08?_g=(filters:!(),refreshInterval:(pause:!f,value:60000),time:(from:now-24h%2Fh,to:now))&_a=(breakdownField:log.level.keyword,columns:!(log.level,error.type,service.name,message,error.message,parameters.attempt,labels.chain),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'5a26f8e1-4d53-4461-98da-1662344a9b3e',negate:!f,params:!((meta:(alias:!n,disabled:!f,index:'5a26f8e1-4d53-4461-98da-1662344a9b3e',key:log.level,negate:!f,params:(query:ERROR),type:phrase),query:(match_phrase:(log.level:ERROR))),(meta:(alias:!n,disabled:!f,field:log.level,index:'5a26f8e1-4d53-4461-98da-1662344a9b3e',key:log.level,negate:!f,params:(query:CRITICAL),type:phrase),query:(match_phrase:(log.level:CRITICAL)))),relation:OR,type:combined),query:())),grid:(columns:('@timestamp':(width:212),error.message:(width:472),error.type:(width:95),log.level:(width:82),message:(width:157),service.name:(width:226))),hideChart:!f,index:'5a26f8e1-4d53-4461-98da-1662344a9b3e',interval:auto,query:(language:kuery,query:'NOT%20error.message.keyword%20:*timeout*'),sort:!(!('@timestamp',desc)))",
  },
  {
    name: 'Website Dashboard',
    href: 'https://e14a8096838c415a953586ac14e8f02f.us-east-1.aws.found.io:9243/app/dashboards#/view/16dbd103-d19b-4e0d-b47e-761d1d0286cd',
  },
  {
    name: 'Public API Dashboard',
    href: 'https://e14a8096838c415a953586ac14e8f02f.us-east-1.aws.found.io:9243/app/dashboards#/view/083d2c63-99dc-40f6-b27b-81a07afc35c9',
  },
]

export function DailyChecksPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Daily checks</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <p className="mb-4 text-primary">
            Quick links to the Elastic Search dashboards we monitor on a daily
            basis.
          </p>
          <ul className="flex flex-col gap-2">
            {DAILY_CHECKS.map((check) => (
              <li key={check.name}>
                <CustomLink
                  href={check.href}
                  className="inline-flex items-center gap-1.5"
                >
                  {check.name}
                  <CustomLinkIcon className="fill-current" />
                </CustomLink>
              </li>
            ))}
          </ul>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
