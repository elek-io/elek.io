import { cva, VariantProps } from 'class-variance-authority';
import { MouseEventHandler, ReactElement, ReactNode } from 'react';

const styles = cva('base', {
  variants: {
    intent: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
      danger: 'bg-red-500 text-white',
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    intent: 'primary',
  },
});

export interface ButtonProps extends VariantProps<typeof styles> {
  children: ReactNode;
  icon?: ReactElement;
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
      {props.icon}
      {children}
    </button>
  );
}
