import { cva, VariantProps } from 'class-variance-authority';
import { useState } from 'react';
import { navigationExample, Sidebar } from '../components/Sidebar';
import { Header, userNavigationExample } from '../components/Header';
import { Page } from '../components/Page';
import { Notification } from '../components/Notification';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

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

export interface BaseLayoutProps extends VariantProps<typeof styles> {}

export function BaseLayout({}: BaseLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationVisible, setNotificationVisible] = useState(true);

  return (
    <div className="flex h-full w-full">
      <Sidebar
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
        navigation={navigationExample}
      ></Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-col-reverse">
        <div className="flex flex-1 items-stretch overflow-hidden">
          <Page></Page>
        </div>

        <Header
          setSidebarOpen={setSidebarOpen}
          userNavigation={userNavigationExample}
        ></Header>
      </div>

      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 pt-4 pb-20 lg:pt-20 lg:pb-4 lg:items-start"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Notification
            isVisible={isNotificationVisible}
            setVisible={setNotificationVisible}
            icon={CheckCircleIcon}
            title="Created Page"
            description="You've successfully created a new page"
          ></Notification>
          {/* <Notification
            isVisible={isNotificationVisible}
            setVisible={setNotificationVisible}
            icon={InboxIcon}
          ></Notification>
          <Notification
            isVisible={isNotificationVisible}
            setVisible={setNotificationVisible}
            icon={InboxIcon}
          ></Notification> */}
        </div>
      </div>
    </div>
  );
}
