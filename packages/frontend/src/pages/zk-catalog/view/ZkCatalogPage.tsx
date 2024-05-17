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
        <header className="text-left md:text-center mt-[72px]">
          <h1 className="text-6xl font-extrabold">ZK Catalog</h1>
          <p className="text-base font-medium mt-6">
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
