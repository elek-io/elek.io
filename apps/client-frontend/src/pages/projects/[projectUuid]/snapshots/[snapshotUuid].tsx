import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Page } from 'ui';

const Snapshot: NextPage = () => {
  const router = useRouter();
  const { snapshotUuid } = router.query;

  return (
    <Page title={`Snapshot XYZ (${snapshotUuid})`}>A single Snapshot</Page>
  );
};

export default Snapshot;
