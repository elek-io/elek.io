import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { userNavigationExample, Header } from './Header';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    isOpen: { control: 'boolean', defaultValue: false },
  },
} as ComponentMeta<typeof Header>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Header> = (args) => (
  <Header {...args} userNavigation={userNavigationExample}></Header>
);

export const Light = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Light.args = {};
