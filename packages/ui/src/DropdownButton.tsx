import { Menu } from '@headlessui/react';
import { cva, VariantProps } from 'class-variance-authority';

const styles = cva('base', {
  variants: {
    intent: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
      danger: 'bg-red-500 text-white',
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    intent: 'primary',
  },
});

export interface DropdownButtonProps extends VariantProps<typeof styles> {
  text: string;
}

export function DropdownButton({
  intent,
  fullWidth,
  ...props
}: DropdownButtonProps) {
  return (
    <Menu>
      <Menu.Button>More</Menu.Button>
      <Menu.Items>
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${active && 'bg-blue-500'}`}
              href="/account-settings"
            >
              Account settings
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${active && 'bg-blue-500'}`}
              href="/account-settings"
            >
              Documentation
            </a>
          )}
        </Menu.Item>
        <Menu.Item disabled>
          <span className="opacity-75">Invite a friend (coming soon!)</span>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
