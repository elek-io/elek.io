import { cva, VariantProps } from 'class-variance-authority';
import { MouseEventHandler, ReactElement, ReactNode } from 'react';

const styles = cva(
  'inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      intent: {
        primary:
          'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
        secondary:
          'bg-white hover:bg-gray-50 text-gray-700 focus:ring-indigo-500 border-gray-300',
        link: 'bg-transparent shadow-none text-indigo-600 hover:text-indigo-700 underline',
        success:
          'bg-green-700 hover:bg-green-800 text-white focus:ring-green-700',
        warning:
          'bg-yellow-400 hover:bg-yellow-500 text-gray-700 focus:ring-yellow-400',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
);

export interface ButtonProps extends VariantProps<typeof styles> {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({ intent, fullWidth, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={styles({ intent, fullWidth })}
      {...props}
    >
      {children}
    </button>
  );
}
