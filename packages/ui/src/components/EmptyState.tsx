import { cva, VariantProps } from 'class-variance-authority';
import { MouseEventHandler, ReactNode } from 'react';

const styles = cva(
  'relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
  {
    variants: {
      mode: {
        light: '',
        dark: '',
      },
    },
    defaultVariants: {
      mode: 'light',
    },
  }
);

export interface EmptyStateProps extends VariantProps<typeof styles> {
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  title: string;
  description?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function EmptyState(props: EmptyStateProps) {
  return (
    <button type="button" onClick={props.onClick} className={styles(props)}>
      {props.icon ? (
        <props.icon
          className="mx-auto h-12 w-12 text-gray-400"
          aria-hidden="true"
        />
      ) : (
        ''
      )}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{props.title}</h3>
      {props.description ? (
        <p className="mt-1 text-sm text-gray-500">{props.description}</p>
      ) : (
        ''
      )}
    </button>
  );
}
