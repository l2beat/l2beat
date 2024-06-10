import React from 'react'
import { PageContent } from '../../../components/PageContent'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { ZkCatalogView, ZkCatalogViewProps } from './ZkCatalogView'

export interface ZkCatalogPageProps {
  view: ZkCatalogViewProps
}

export function ZkCatalogPage(props: ZkCatalogPageProps) {
  return (
    <DashboardLayout>
      <PageContent>
        <header className="mt-[72px] text-left md:text-center">
          <h1 className="font-extrabold text-6xl">ZK Catalog</h1>
          <p className="mx-auto mt-6 max-w-[994px] font-medium text-base">
            ZK Catalog by L2BEAT is a community-driven resource offering
            detailed insights into the ZK technology utilized by various
            blockchain projects. It aims to enhance transparency and
            understanding of ZK tech implementations across the industry.
          </p>
        </header>
        <main className="mt-4 md:mt-12">
          <ZkCatalogView {...props.view} />
        </main>
      </PageContent>
    </DashboardLayout>
  )
}
