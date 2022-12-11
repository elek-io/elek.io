import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode, useState } from 'react';
import {
  sidebarNavigationExample,
  Sidebar,
  SidebarNavigationItemGroup,
} from '../components/Sidebar';
import {
  Header,
  userNavigationExample,
  UserNavigationItemGroup,
} from '../components/Header';
import { NotificationProps } from '../components/Notification';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { NotificationContainer } from '../components/NotificationContainer';

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

export interface BaseLayoutProps extends VariantProps<typeof styles> {
  children: ReactNode;
  sidebarNavigation: SidebarNavigationItemGroup[];
  userNavigation: UserNavigationItemGroup[];
}

export function BaseLayout(props: BaseLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>([
    {
      icon: CheckCircleIcon,
      title: 'Created Page',
      description: 'Successfully created a new page',
    },
  ]);

  return (
    <div className="flex h-full w-full">
      <Sidebar
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
        navigation={props.sidebarNavigation}
      ></Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-col-reverse">
        <div className="flex flex-1 items-stretch overflow-hidden">
          {props.children}
        </div>

        <Header
          setSidebarOpen={setSidebarOpen}
          userNavigation={props.userNavigation}
        ></Header>
      </div>

      <NotificationContainer
        notifications={notifications}
      ></NotificationContainer>
    </div>
  );
}
