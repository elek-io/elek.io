import Asset from 'core/dist/esm/model/Asset';
import { PaginatedList } from 'core/dist/esm/type/service';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Page } from 'ui';

const Assets: NextPage = () => {
  const [assets, setAssets] = useState<PaginatedList<Asset>>();
  const router = useRouter();
  const { projectUuid } = router.query;

  useEffect(() => {
    if (projectUuid && typeof projectUuid === 'string') {
      window.ipc.core.assets
        .list(projectUuid)
        .then((assets) => {
          setAssets(assets);
          console.log('Got current Assets: ', assets);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <Page title="Assets">
      Current Assets: {JSON.stringify(assets, undefined, 2)}
    </Page>
  );
};

export default Assets;
