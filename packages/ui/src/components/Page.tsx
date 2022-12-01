import { cva, VariantProps } from 'class-variance-authority';

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

export interface PageProps extends VariantProps<typeof styles> {}

export function Page(props: PageProps) {
  return (
    <>
      <main className="flex-1 overflow-y-auto">
        {/* Primary column */}
        <section
          aria-labelledby="primary-heading"
          className="flex h-full min-w-0 flex-1 flex-col lg:order-last"
        >
          <h1 id="primary-heading">Photos</h1>
          {/* Your content */}
        </section>
      </main>

      {/* Secondary column (hidden on smaller screens) */}
      <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white lg:block">
        {/* Your content */}
      </aside>
    </>
  );
}
