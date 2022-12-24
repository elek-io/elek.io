import { cva, VariantProps } from 'class-variance-authority';
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import {
  Bars3BottomLeftIcon,
  CalendarIcon,
  ChevronDownIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  MapIcon,
  MegaphoneIcon,
} from '@heroicons/react/20/solid';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Dropdown, dropdownItemGroupsExample } from './Dropdown';

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

export type UserNavigationItem = {
  name: string;
  href: string;
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  current: boolean;
};

export type UserNavigationItemGroup = {
  name?: string;
  items: UserNavigationItem[];
};

export const userNavigationExample: UserNavigationItemGroup[] = [
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

export interface HeaderProps extends VariantProps<typeof styles> {
  currentPath: string;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarDisabledOnPaths: string[];
  userNavigation: UserNavigationItemGroup[];
}

export function Header(props: HeaderProps) {
  return (
    <header className="w-full">
      <div className="relative z-10 flex h-16 flex-shrink-0 border-t lg:border-t-0 lg:border-b border-gray-200 bg-white shadow-sm">
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <div className="flex flex-1">
            <form className="flex w-full md:ml-0" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search all files
              </label>
              <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <input
                  name="search-field"
                  id="search-field"
                  className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </form>
          </div>
          <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
            {/* Profile dropdown */}
            <Dropdown itemGroups={dropdownItemGroupsExample}>
              <Button intent="avatar" appendIcon={ChevronDownIcon}>
                <Avatar name="John Doe"></Avatar>
                <span className="ml-2 hidden lg:block">John Doe</span>
              </Button>
            </Dropdown>
          </div>
        </div>
        <button
          type="button"
          className="border-l border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 lg:hidden"
          onClick={() => props.setSidebarOpen(true)}
          disabled={props.sidebarDisabledOnPaths.includes(props.currentPath)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
