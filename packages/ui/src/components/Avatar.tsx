import { cva, VariantProps } from 'class-variance-authority';

const styles = cva('', {
  variants: {
    status: {
      available: 'bg-green-500',
      busy: 'bg-red-600',
      dnd: 'bg-red-600',
      brb: 'bg-yellow-500',
      away: 'bg-yellow-500',
      offline: 'bg-gray-300',
      null: 'hidden',
    },
  },
  defaultVariants: {
    status: 'available',
  },
});

export interface AvatarProps extends VariantProps<typeof styles> {
  name: string;
  src?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getInitials(name: string) {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  let initials = [...name.matchAll(rgx)] || [];

  return (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();
}

export function Avatar(props: AvatarProps) {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-500">
      {props.src ? (
        <img
          className="h-8 w-8 rounded-full"
          src={props.src}
          alt={props.name}
        />
      ) : (
        <span className="text-sm font-medium leading-none text-white">
          {getInitials(props.name)}
        </span>
      )}
      {props.status ? (
        <span
          className={classNames(
            'absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white',
            styles({ status: props.status })
          )}
        />
      ) : (
        ''
      )}
    </span>
  );
}
