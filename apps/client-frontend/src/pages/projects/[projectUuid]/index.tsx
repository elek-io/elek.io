import Project from 'core/dist/esm/model/Project';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Page } from 'ui';

const Dashboard: NextPage = () => {
  const [currentProject, setCurrentProject] = useState<Project>();
  const router = useRouter();
  const { projectUuid } = router.query;

  useEffect(() => {
    if (projectUuid && typeof projectUuid === 'string') {
      window.ipc.core.projects
        .read(projectUuid)
        .then((project) => {
          setCurrentProject(project);
          console.log('Got current project: ', project);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <Page title="Dashboard">
      <div>Dashboard of {JSON.stringify(router.query, undefined, 2)}</div>
      <div>Current Project: {JSON.stringify(currentProject, undefined, 2)}</div>
    </Page>
  );
};

export default Dashboard;
