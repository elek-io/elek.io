import { Dialog, Transition } from '@headlessui/react';
import { cva, VariantProps } from 'class-variance-authority';
import { Fragment, MouseEventHandler, ReactNode } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  XMarkIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import {
  CalendarIcon,
  MagnifyingGlassCircleIcon,
  MapIcon,
  MegaphoneIcon,
} from '@heroicons/react/20/solid';

const styles = cva(
  'inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60',
  {
    variants: {
      intent: {
        primary:
          'button-intent-primary bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500',
        secondary:
          'button-intent-secondary bg-white hover:bg-gray-50 text-gray-700 focus:ring-brand-500 border-gray-300',
        link: 'button-intent-link bg-transparent shadow-none text-brand-600 hover:text-brand-700 underline focus:ring-brand-500',
        success:
          'button-intent-success bg-green-700 hover:bg-green-800 text-white focus:ring-green-700',
        warning:
          'button-intent-warning bg-yellow-400 hover:bg-yellow-500 text-gray-700 focus:ring-yellow-400',
        danger:
          'button-intent-danger bg-red-600 hover:bg-red-700 text-white focus:ring-red-600',
        icon: 'shadow-none !rounded-full px-2 py-2',
        avatar: 'shadow-none !rounded-full px-0 py-0',
      },
      state: {
        loading: 'state-loading disabled:cursor-wait',
        disabled: 'disabled:cursor-not-allowed',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'secondary',
      state: null,
      fullWidth: false,
    },
  }
);

export type SidebarNavigationItem = {
  name: string;
  href: string;
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  current: boolean;
};

export type SidebarNavigationItemGroup = {
  name?: '';
  items: SidebarNavigationItem[];
};

export const navigationExample: SidebarNavigationItemGroup[] = [
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
      { name: 'Announcements', href: '#', icon: MegaphoneIcon, current: false },
      { name: 'Office Map', href: '#', icon: MapIcon, current: false },
    ],
  },
];

export interface SidebarProps extends VariantProps<typeof styles> {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: SidebarNavigationItemGroup[];
  children?: ReactNode;
  prependIcon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  appendIcon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

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
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-shrink-0 items-center px-4">
                    elek.io
                  </div>
                  <nav aria-label="Sidebar" className="mt-5">
                    {props.navigation.map((group, groupIndex) => (
                      <>
                        {groupIndex !== 0 ? (
                          <hr
                            className="my-5 border-t border-gray-200"
                            aria-hidden="true"
                          />
                        ) : (
                          ''
                        )}

                        <div className="space-y-1 px-2">
                          {group.items.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-200 text-gray-900'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                              )}
                              aria-current={item.current ? 'page' : undefined}
                            >
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? 'text-gray-500'
                                    : 'text-gray-400 group-hover:text-gray-500',
                                  'mr-4 h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </>
                    ))}
                  </nav>
                </div>
                <div className="flex flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4">
                  <a href="#" className="group block w-full flex-shrink-0">
                    <div className="flex items-center">
                      <div>
                        <RectangleStackIcon className="w-8 h-8" />
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 flex-col px-4">
                <span className="text-xl font-bold text-brand-600 d-block">
                  elek.io
                </span>
              </div>
              <nav className="mt-5 flex-1" aria-label="Sidebar">
                {props.navigation.map((group, groupIndex) => (
                  <>
                    {groupIndex !== 0 ? (
                      <hr
                        className="my-5 border-t border-gray-200"
                        aria-hidden="true"
                      />
                    ) : (
                      ''
                    )}
                    <div className="space-y-1 px-2">
                      {group.items.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-200 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? 'text-gray-500'
                                : 'text-gray-400 group-hover:text-gray-500',
                              'mr-4 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4">
              <a href="#" className="group block w-full flex-shrink-0">
                <div className="flex items-center">
                  <div>
                    <RectangleStackIcon className="w-8 h-8" />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
