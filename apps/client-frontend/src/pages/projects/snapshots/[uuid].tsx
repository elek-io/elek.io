import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Page } from 'ui';

const Snapshot: NextPage = () => {
  const router = useRouter();
  const { uuid } = router.query;

  return <Page title={`Snapshot XYZ (${uuid})`}>A single Snapshot</Page>;
};

export default Snapshot;
