import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EmptyState } from './EmptyState';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/EmptyState',
  component: EmptyState,
  argTypes: {
    title: {
      defaultValue: 'EmptyState title',
    },
  },
} as ComponentMeta<typeof EmptyState>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EmptyState> = (args) => (
  <div className="flex w-full h-full">
    <div className="flex flex-1 items-stretch overflow-hidden">
      <EmptyState {...args}></EmptyState>
    </div>
  </div>
);

export const Light = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Light.args = {};
