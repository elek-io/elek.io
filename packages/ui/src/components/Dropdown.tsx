import { cva, VariantProps } from 'class-variance-authority';
import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  PencilSquareIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  UserPlusIcon,
  HeartIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import React from 'react';

const styles = cva('', {
  variants: {},
  defaultVariants: {},
});

export type DropdownItem = {
  name: string;
  href: string;
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
};

export type DropdownItemGroup = {
  name?: '';
  items: DropdownItem[];
};

export const itemGroupsExample: DropdownItemGroup[] = [
  {
    name: '',
    items: [
      {
        name: 'Edit',
        href: '#',
        icon: PencilSquareIcon,
      },
      {
        name: 'Duplicate',
        href: '#',
        icon: DocumentDuplicateIcon,
      },
    ],
  },
  {
    name: '',
    items: [
      {
        name: 'Archive',
        href: '#',
        icon: ArchiveBoxIcon,
      },
      {
        name: 'Move',
        href: '#',
        icon: ArrowRightCircleIcon,
      },
    ],
  },
  {
    name: '',
    items: [
      {
        name: 'Share',
        href: '#',
        icon: UserPlusIcon,
      },
      {
        name: 'Add to favorites',
        href: '#',
        icon: HeartIcon,
      },
    ],
  },
  {
    name: '',
    items: [
      {
        name: 'Delete',
        href: '#',
        icon: TrashIcon,
      },
    ],
  },
];

export interface DropdownProps extends VariantProps<typeof styles> {
  itemGroups: DropdownItemGroup[];
  children: ReactNode;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Dropdown(props: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>{props.children}</Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm">Signed in as</p>
            <p className="truncate text-sm font-medium text-gray-900">
              tom@example.com
            </p>
          </div>
          {props.itemGroups.map((itemGroup) => {
            return (
              <>
                <div className="py-1">
                  {itemGroup.items.map((item) => {
                    return (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'group flex items-center px-4 py-2 text-sm'
                            )}
                          >
                            {item.icon ? (
                              <item.icon
                                className={classNames(
                                  active
                                    ? 'text-gray-500'
                                    : 'text-gray-400 group-hover:text-gray-500',
                                  'mr-4 h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              ''
                            )}

                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    );
                  })}
                </div>
              </>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
