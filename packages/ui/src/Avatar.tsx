import { cva, VariantProps } from 'class-variance-authority';

const styles = cva();

export interface AvatarProps extends VariantProps<typeof styles> {
  name: string;
  src?: string;
}

function getInitials(name: string) {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  let initials = [...name.matchAll(rgx)] || [];

  return (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();
}

export function Avatar({ name, src }: AvatarProps) {
  if (src) {
    return (
      <span className="relative inline-flex">
        <img className="h-12 w-12 rounded-full" src={src} alt={name} />
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-300 ring-2 ring-white" />
      </span>
    );
  } else {
    return (
      <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-500">
        <span className="text-lg font-medium leading-none text-white">
          {getInitials(name)}
        </span>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-300 ring-2 ring-white" />
      </span>
    );
  }
}
