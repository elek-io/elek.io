import type { NextPage } from 'next';
import Link from 'next/link';
import { Page } from 'ui';

const Projects: NextPage = () => {
  return (
    <Page title="Projects" aside="Test of aside content">
      All Projects
      <Link href="/projects/123">Project 123</Link>
    </Page>
  );
};

export default Projects;
