import { cva, VariantProps } from 'class-variance-authority';
import { useState } from 'react';
import { navigationExample, Sidebar } from '../components/Sidebar';
import { Header, userNavigationExample } from '../components/Header';
import { Page } from '../components/Page';

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

  return (
    <div className="flex h-full w-full">
      <Sidebar
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
        navigation={navigationExample}
      ></Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          setSidebarOpen={setSidebarOpen}
          userNavigation={userNavigationExample}
        ></Header>

        <div className="flex flex-1 items-stretch overflow-hidden">
          <Page></Page>
        </div>
      </div>
    </div>
  );
}
