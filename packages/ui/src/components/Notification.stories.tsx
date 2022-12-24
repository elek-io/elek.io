import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NotificationContainer } from './NotificationContainer';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Notification',
  component: NotificationContainer,
  argTypes: {
    notifications: {
      defaultValue: [
        {
          icon: CheckCircleIcon,
          title: 'Created Page',
          description: 'Successfully created a new page',
        },
      ],
    },
  },
} as ComponentMeta<typeof NotificationContainer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NotificationContainer> = (args) => (
  <NotificationContainer {...args}></NotificationContainer>
);

export const Light = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Light.args = {};
