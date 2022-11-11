import { cva, VariantProps } from 'class-variance-authority';
import { MouseEventHandler, ReactElement, ReactNode } from 'react';
import { ArrowPathIcon } from '@heroicons/react/20/solid';

const styles = cva(
  'inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60',
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
      },
      state: {
        loading: 'state-loading disabled:cursor-wait',
        disabled: 'disabled:cursor-not-allowed',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
  }
);

export interface ButtonProps extends VariantProps<typeof styles> {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  intent,
  fullWidth,
  state,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={styles({ intent, fullWidth, state })}
      disabled={state === 'loading' || state === 'disabled' ? true : false}
      {...props}
    >
      {state === 'loading' ? (
        <ArrowPathIcon
          className="mr-2 h-5 w-5 animate-spin"
          aria-hidden="true"
        />
      ) : (
        ''
      )}
      {children}
    </button>
  );
}
