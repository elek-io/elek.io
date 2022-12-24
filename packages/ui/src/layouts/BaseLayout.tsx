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
import { NextRouter } from 'next/router';

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
  router: NextRouter;
  sidebarNavigation: SidebarNavigationItemGroup[];
  sidebarDisabledOnPaths: string[];
  userNavigation: UserNavigationItemGroup[];
  notifications: NotificationProps[];
}

export function BaseLayout(props: BaseLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full w-full">
      <Sidebar
        router={props.router}
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
        disabledOnPaths={props.sidebarDisabledOnPaths}
        navigation={props.sidebarNavigation}
      ></Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-col-reverse">
        <div className="flex flex-1 items-stretch overflow-hidden">
          {props.children}
        </div>

        <Header
          router={props.router}
          setSidebarOpen={setSidebarOpen}
          sidebarDisabledOnPaths={props.sidebarDisabledOnPaths}
          userNavigation={props.userNavigation}
        ></Header>
      </div>

      <NotificationContainer
        notifications={props.notifications}
      ></NotificationContainer>
    </div>
  );
}
