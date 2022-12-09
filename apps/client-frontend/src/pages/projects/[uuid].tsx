import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Page } from 'ui';

const Project: NextPage = () => {
  const router = useRouter();
  const { uuid } = router.query;

  return <Page title={`Project XYZ (${uuid})`}>A single Project</Page>;
};

export default Project;
