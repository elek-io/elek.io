import { Dialog, Transition } from '@headlessui/react';
import { cva, VariantProps } from 'class-variance-authority';
import { Fragment } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  UserGroupIcon,
  XMarkIcon,
  FolderOpenIcon,
} from '@heroicons/react/24/outline';
import {
  CalendarIcon,
  MagnifyingGlassCircleIcon,
  MapIcon,
  MegaphoneIcon,
} from '@heroicons/react/20/solid';

const styles = cva('', {
  variants: {
    mode: {
      light: '',
      dark: '',
    },
  },
  defaultVariants: {
    mode: 'light',
  },
});

export type SidebarNavigationItem = {
  name: string;
  href: string;
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
};

export type SidebarNavigationItemGroup = {
  name?: string;
  items: SidebarNavigationItem[];
};

export const sidebarNavigationExample: SidebarNavigationItemGroup[] = [
  {
    name: 'sidebar',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
      },
      {
        name: 'Calendar',
        href: '/calendar',
        icon: CalendarIcon,
      },
      {
        name: 'Teams',
        href: '/teams',
        icon: UserGroupIcon,
      },
      {
        name: 'Directory',
        href: '/directory',
        icon: MagnifyingGlassCircleIcon,
      },
      {
        name: 'Announcements',
        href: '/announcements',
        icon: MegaphoneIcon,
      },
      {
        name: 'Office Map',
        href: '/office-map',
        icon: MapIcon,
      },
    ],
  },
];

export interface SidebarProps extends VariantProps<typeof styles> {
  currentPath: string;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  disabledOnPaths: string[];
  navigation: SidebarNavigationItemGroup[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function isCurrentRoute(currentPath: string, href: string) {
  return href === currentPath;
}

function sidebarNavigationItems(
  currentPath: string,
  navigation: SidebarNavigationItemGroup[]
) {
  return navigation.map((group, groupIndex) => (
    <Fragment key={groupIndex}>
      {groupIndex !== 0 ? (
        <hr className="my-5 border-t border-gray-200" aria-hidden="true" />
      ) : (
        ''
      )}
      <div className="space-y-1 px-2">
        {group.items.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={classNames(
                isCurrentRoute(currentPath, item.href)
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )}
              aria-current={
                isCurrentRoute(currentPath, item.href) ? 'page' : undefined
              }
            >
              <item.icon
                className={classNames(
                  isCurrentRoute(currentPath, item.href)
                    ? 'text-gray-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-4 h-6 w-6'
                )}
                aria-hidden="true"
              />
              {item.name}
            </a>
          </Link>
        ))}
      </div>
    </Fragment>
  ));
}

const sidebarNavigationContent = (
  currentPath: string,
  navigation: SidebarNavigationItemGroup[]
) => (
  <>
    <div className="flex flex-shrink-0 flex-col px-4 pt-5 pb-4">
      <span className="text-xl text-brand-600 d-block">elek.io</span>
    </div>
    <div className="flex flex-1 flex-col overflow-y-auto pb-4">
      <nav className="flex-1" aria-label="Sidebar">
        {sidebarNavigationItems(currentPath, navigation)}
      </nav>
    </div>
    <div className="flex flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4">
      {/* @todo this should be added via props and not be static */}
      <Link href="/projects">
        <a className="group block w-full flex-shrink-0">
          <div className="flex items-center">
            <div>
              <FolderOpenIcon className="w-8 h-8" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Project #1
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                View profile
              </p>
            </div>
          </div>
        </a>
      </Link>
    </div>
  </>
);

export function Sidebar(props: SidebarProps) {
  return (
    <>
      {/* Sidebar for mobile */}
      <Transition.Root show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={props.setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => props.setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {sidebarNavigationContent(props.currentPath, props.navigation)}
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      {!props.disabledOnPaths.includes(props.currentPath) ? (
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
              {sidebarNavigationContent(props.currentPath, props.navigation)}
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
