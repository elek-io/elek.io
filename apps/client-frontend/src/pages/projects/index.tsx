import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Project from 'core/dist/esm/model/Project';
import { PaginatedList } from 'core/dist/esm/type/service';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Page } from 'ui';

const Projects: NextPage = () => {
  const [projects, setProjects] = useState<PaginatedList<Project>>();
  const [isLoading, setLoading] = useState(false);

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
    <Page title="Projects" aside="Test of aside content">
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <Link href="/projects/2ab08e48-435e-49b0-a3bb-667c811167c2">
          <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
            Test
          </li>
        </Link>
        {projects.list.map((project: Project) => (
          <Link href={`/projects/${project.id}`}>
            <li
              key={project.id}
              className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
            >
              <div className="flex flex-1 flex-col p-8">
                <h3 className="mt-6 text-sm font-medium text-gray-900">
                  {project.name}
                </h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dt className="sr-only">Title</dt>
                  <dd className="text-sm text-gray-500">{project.name}</dd>
                  <dt className="sr-only">Role</dt>
                  <dd className="mt-3">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {project.version}
                    </span>
                  </dd>
                </dl>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    {JSON.stringify(project, undefined, 2)}
                  </div>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </Page>
  );
};

export default Projects;
