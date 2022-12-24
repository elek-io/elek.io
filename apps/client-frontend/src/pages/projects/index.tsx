import { FolderPlusIcon } from '@heroicons/react/24/outline';
import Project from 'core/dist/esm/model/Project';
import { PaginatedList } from 'core/dist/esm/type/service';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Page, PageAside, EmptyState } from 'ui';

const Projects: NextPage = () => {
  const [projects, setProjects] = useState<PaginatedList<Project>>();
  const [aside, setAside] = useState<PageAside>();
  const [isLoading, setLoading] = useState(false);

  async function onCreateProject() {
    setAside({
      title: 'Create Project',
      content: createProjectContent(),
      set: setAside,
    });
  }

  function createProjectContent() {
    return <h1>Create content</h1>;
  }

  useEffect(() => {
    setLoading(true);
    window.ipc.core.projects.count().then((number) => {
      console.log('Projects count: ', number);
    });
    window.ipc.core.projects
      .list()
      .then((projects) => {
        setProjects(projects);
        setLoading(false);
        console.log(projects);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!projects) return <p>No projects</p>;

  return (
    <Page title="Projects" aside={aside}>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        <li>
          <EmptyState
            icon={FolderPlusIcon}
            title="No Projects"
            description="Get started by creating a project"
            onClick={onCreateProject}
          ></EmptyState>
        </li>
        {projects.list.map((project: Project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow">
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  {project.name} ({project.status})
                </h2>
                <p className="text-sm text-gray-500">{project.description}</p>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {project.version}
                </span>
                <p className="mt-2 text-sm text-gray-500">
                  Created: {project.created}
                  <br></br>Updated: {project.updated}
                </p>
              </div>
              {/* <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    {JSON.stringify(project, undefined, 2)}
                  </div>
                </div>
              </div> */}
            </li>
          </Link>
        ))}
      </ul>
    </Page>
  );
};

export default Projects;
