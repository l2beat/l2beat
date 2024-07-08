import { type Metadata } from 'next';
import { ContentWrapper } from '~/app/_components/content-wrapper';
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers';
import { getDefaultMetadata } from '~/utils/get-default-metadata';
import { ZkCatalogPage } from './_components/ZkCatalogPage';
import { getZkCatalogView } from './_utils/getZkCatalogView';
import { projects } from './_utils/projects';
import { env } from '~/env';
import { notFound } from 'next/navigation';

export const metadata: Metadata = getDefaultMetadata({
  title: 'ZK Catalog - L2BEAT',
  description: 'A catalog of the ZK projects with detailed research.',
  openGraph: {
    url: '/zk-catalog',
  },
});

export default async function Page() {
  if (!env.NEXT_PUBLIC_FEATURE_FLAG_ZK_CATALOG) {
    return notFound();
  }

  const verifiers = await getVerifiers();
  const view = getZkCatalogView(projects, verifiers);

  return (
    <ContentWrapper>
      <header className="mt-[72px] text-left md:text-center">
        <h1 className="font-extrabold text-6xl">ZK Catalog</h1>
        <p className="mx-auto mt-6 max-w-[994px] font-medium text-base">
          ZK Catalog by L2BEAT is a community-driven resource offering detailed
          insights into the ZK technology utilized by various blockchain
          projects. It aims to enhance transparency and understanding of ZK tech
          implementations across the industry.
        </p>
      </header>
      <main className="mt-4 md:mt-12">
        <ZkCatalogPage {...view} />
      </main>
    </ContentWrapper>
  );
}
