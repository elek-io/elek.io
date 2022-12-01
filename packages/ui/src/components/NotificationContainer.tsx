import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { cva, VariantProps } from 'class-variance-authority';
import { Fragment, useState } from 'react';
import { Notification, NotificationProps } from './Notification';

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

export interface NotificationContainerProps
  extends VariantProps<typeof styles> {
  notifications: NotificationProps[];
}

export function NotificationContainer(props: NotificationContainerProps) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 pt-4 pb-20 lg:pt-20 lg:pb-4 lg:items-start"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {props.notifications.map((notification) => (
          <Notification {...notification}></Notification>
        ))}
      </div>
    </div>
  );
}
