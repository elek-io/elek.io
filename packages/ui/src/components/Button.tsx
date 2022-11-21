import { cva, VariantProps } from 'class-variance-authority';
import { MouseEventHandler, ReactNode } from 'react';

const styles = cva(
  'inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60',
  {
    variants: {
      intent: {
        primary:
          'button-intent-primary bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500',
        secondary:
          'button-intent-secondary bg-white hover:bg-gray-50 text-gray-700 focus:ring-brand-500 border-gray-300',
        link: 'button-intent-link bg-transparent shadow-none text-brand-600 hover:text-brand-700 underline focus:ring-brand-500',
        success:
          'button-intent-success bg-green-700 hover:bg-green-800 text-white focus:ring-green-700',
        warning:
          'button-intent-warning bg-yellow-400 hover:bg-yellow-500 text-gray-700 focus:ring-yellow-400',
        danger:
          'button-intent-danger bg-red-600 hover:bg-red-700 text-white focus:ring-red-600',
        icon: 'shadow-none !rounded-full px-2 py-2',
        avatar: 'shadow-none !rounded-full px-0 py-0',
      },
      state: {
        loading: 'state-loading disabled:cursor-wait',
        disabled: 'disabled:cursor-not-allowed',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'secondary',
      state: null,
      fullWidth: false,
    },
  }
);

export interface ButtonProps extends VariantProps<typeof styles> {
  children?: ReactNode;
  prependIcon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  appendIcon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={styles(props)}
      disabled={props.state === 'loading' || props.state === 'disabled'}
    >
      {props.state === 'loading' ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        ''
      )}
      {props.state !== 'loading' && props.prependIcon ? (
        <props.prependIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      ) : (
        ''
      )}
      {props.children}
      {props.appendIcon ? (
        <props.appendIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
      ) : (
        ''
      )}
    </button>
  );
}
