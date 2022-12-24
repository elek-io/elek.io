import '../styles/globals.css';
import type { AppProps } from 'next/app';
import {
  CheckCircleIcon,
  HomeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  CalendarIcon,
  MagnifyingGlassCircleIcon,
  MapIcon,
  MegaphoneIcon,
} from '@heroicons/react/20/solid';
import { BaseLayout, NotificationProps } from 'ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Project from 'core/dist/esm/model/Project';

function MyApp({ Component, pageProps }: AppProps) {
  const [notifications, setNotifications] = useState<NotificationProps[]>([
    {
      icon: CheckCircleIcon,
      title: 'Created Page',
      description: 'Successfully created a new page',
    },
  ]);
  const [currentProject, setCurrentProject] = useState<Project>();
  const router = useRouter();
  const { projectUuid } = router.query;
  const sidebarDisabledOnPaths = ['/projects'];

  useEffect(() => {
    if (projectUuid && typeof projectUuid === 'string') {
      window.ipc.core.projects
        .read(projectUuid)
        .then((project) => {
          setCurrentProject(project);
          console.log('Got current Project: ', project);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const sidebarNavigation = [
    {
      items: [
        {
          name: 'Dashboard',
          href: `/projects/${projectUuid}`,
          icon: HomeIcon,
        },
        {
          name: 'Assets',
          href: `/projects/${projectUuid}/assets`,
          icon: CalendarIcon,
        },
        {
          name: 'Snapshots',
          href: `/projects/${projectUuid}/snapshots`,
          icon: CalendarIcon,
        },
        {
          name: 'Theme',
          href: `/projects/${projectUuid}/theme`,
          icon: CalendarIcon,
        },
        {
          name: 'Logs',
          href: `/projects/${projectUuid}/logs`,
          icon: CalendarIcon,
        },
        {
          name: 'Settings',
          href: `/projects/${projectUuid}/settings`,
          icon: CalendarIcon,
        },
      ],
    },
  ];

  const userNavigation = [
    {
      name: '',
      items: [
        { name: 'Dashboard', href: '#', icon: HomeIcon, current: false },
        { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
        { name: 'Teams', href: '#', icon: UserGroupIcon, current: false },
        {
          name: 'Directory',
          href: '#',
          icon: MagnifyingGlassCircleIcon,
          current: true,
        },
        {
          name: 'Announcements',
          href: '#',
          icon: MegaphoneIcon,
          current: false,
        },
        { name: 'Office Map', href: '#', icon: MapIcon, current: false },
      ],
    },
  ];

  return (
    <BaseLayout
      router={router}
      sidebarNavigation={sidebarNavigation}
      sidebarDisabledOnPaths={sidebarDisabledOnPaths}
      userNavigation={userNavigation}
      notifications={notifications}
    >
      <Component
        {...pageProps}
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
      />
    </BaseLayout>
  );
}

export default MyApp;
