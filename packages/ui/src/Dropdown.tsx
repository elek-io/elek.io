import { Menu } from '@headlessui/react';

export function Dropdown({ foo }: { foo: string }) {
  return (
    <Menu>
      <Menu.Button className={'bg-green-100'}>{foo}</Menu.Button>
      <Menu.Items>
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${
                active ? 'bg-blue-500 text-white' : 'bg-white text-black'
              }`}
              href="#test"
            >
              Account settings
            </a>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
