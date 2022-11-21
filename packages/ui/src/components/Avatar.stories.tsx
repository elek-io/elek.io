import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Avatar } from './Avatar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    status: { defaultValue: 'offline' },
  },
} as ComponentMeta<typeof Avatar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Avatar> = (args) => (
  <Avatar {...args}></Avatar>
);

export const Image = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Image.args = {
  name: 'John Doe',
  src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const Initials = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Initials.args = {
  name: 'John Doe',
};
