import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Notification } from './Notification';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Notification',
  component: Notification,
  argTypes: {
    isVisible: { control: 'boolean', defaultValue: true },
  },
} as ComponentMeta<typeof Notification>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Notification> = (args) => (
  <div
    aria-live="assertive"
    className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
      <Notification {...args}></Notification>
    </div>
  </div>
);

export const Light = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Light.args = {};
