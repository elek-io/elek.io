import { cva, VariantProps } from 'class-variance-authority';
import { Fragment, ReactNode } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';
import { Button, ButtonProps } from './Button';

const styles = cva('relative inline-block text-left', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

export interface ButtonDropdownProps extends Omit<ButtonProps, 'onClick'> {
  label: string;
  children: ReactNode;
}

export function ButtonDropdown({
  label,
  intent,
  fullWidth,
  state,
  children,
}: ButtonDropdownProps) {
  return (
    <Menu as="div" className={styles({ fullWidth })}>
      <div>
        <Menu.Button
          as={Button}
          fullWidth={fullWidth}
          intent={intent}
          state={state}
        >
          {label}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
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
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
