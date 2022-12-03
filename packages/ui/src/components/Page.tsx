import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

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

export interface PageProps extends VariantProps<typeof styles> {
  title: string;
  children: ReactNode;
}

export function Page(props: PageProps) {
  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {props.title}
        </h1>
        {props.children}
      </main>

      <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white lg:block">
        <span>Aside content</span>
      </aside>
    </>
  );
}
