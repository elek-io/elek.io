import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { sidebarNavigationExample, Sidebar } from './Sidebar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  argTypes: {
    currentPath: { defaultValue: '/' },
    isOpen: { control: 'boolean', defaultValue: false },
    disabledOnPaths: { defaultValue: [] },
  },
} as ComponentMeta<typeof Sidebar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Sidebar> = (args) => (
  <Sidebar {...args} navigation={sidebarNavigationExample}></Sidebar>
);

export const Light = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Light.args = {};
