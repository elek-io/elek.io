import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cva, VariantProps } from 'class-variance-authority';
import { Dispatch, Fragment, ReactNode, SetStateAction } from 'react';

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

export interface PageAside {
  title: string;
  content: ReactNode;
  set: Dispatch<SetStateAction<PageAside | undefined>>;
}

export interface PageProps extends VariantProps<typeof styles> {
  title: string;
  children: ReactNode;
  aside?: PageAside;
}

export function Page(props: PageProps) {
  return (
    <>
      <main className="relative flex-1 overflow-y-auto">
        <div className="container mx-auto px-4">
          <h1 className="my-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {props.title}
          </h1>
          {props.children}
        </div>
      </main>

      {/* @todo for desktop slide in from right is ok, but on mobile it should slide in from bottom (bottom sheet) to make it consistent with most mobile apps */}
      <Transition
        show={props.aside !== undefined}
        as={Fragment}
        enter="transform transition ease-in-out duration-500 sm:duration-700"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-500 sm:duration-700"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white lg:block">
          <div className="flex h-full flex-col py-6">
            <div className="px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {props.aside?.title}
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => props.aside?.set(undefined)}
                  >
                    <span className="sr-only">Close aside content</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="relative mt-6 flex-1 px-4 sm:px-6">
              {props.aside?.content}
            </div>
          </div>
        </aside>
      </Transition>
    </>
  );
}
