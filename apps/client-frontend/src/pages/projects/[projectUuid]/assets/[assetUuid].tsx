import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Page } from 'ui';

const Asset: NextPage = () => {
  const router = useRouter();
  const { assetUuid } = router.query;

  return <Page title={`Asset XYZ (${assetUuid})`}>A single Asset</Page>;
};

export default Asset;
