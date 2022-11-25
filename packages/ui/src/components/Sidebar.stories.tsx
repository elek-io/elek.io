import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { navigationExample, Sidebar } from './Sidebar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  argTypes: {
    isOpen: { control: 'boolean', defaultValue: false },
  },
} as ComponentMeta<typeof Sidebar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Sidebar> = (args) => (
  <Sidebar {...args} navigation={navigationExample}>
    Sidebar
  </Sidebar>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  intent: 'primary',
};
