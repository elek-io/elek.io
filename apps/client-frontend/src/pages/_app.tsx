import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import {
  CalendarIcon,
  MagnifyingGlassCircleIcon,
  MapIcon,
  MegaphoneIcon,
} from '@heroicons/react/20/solid';
import { BaseLayout } from 'ui';

function MyApp({ Component, pageProps }: AppProps) {
  const sidebarNavigation = [
    {
      name: 'sidebar',
      items: [
        {
          name: 'Dashboard',
          href: '/',
          icon: HomeIcon,
          current: false,
        },
        {
          name: 'Calendar',
          href: '/',
          icon: CalendarIcon,
          current: false,
        },
        {
          name: 'Teams',
          href: '/',
          icon: UserGroupIcon,
          current: false,
        },
        {
          name: 'Directory',
          href: '/',
          icon: MagnifyingGlassCircleIcon,
          current: true,
        },
        {
          name: 'Announcements',
          href: '/',
          icon: MegaphoneIcon,
          current: false,
        },
        {
          name: 'Office Map',
          href: '/',
          icon: MapIcon,
          current: false,
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
      sidebarNavigation={sidebarNavigation}
      userNavigation={userNavigation}
    >
      <Component {...pageProps} />
    </BaseLayout>
  );
}

export default MyApp;
