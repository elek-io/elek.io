import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Slideover } from './Slideover';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Slideover',
  component: Slideover,
  argTypes: {
    title: {
      defaultValue: 'A Slideover',
    },
  },
} as ComponentMeta<typeof Slideover>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Slideover> = (args) => (
  <Slideover {...args}>Slideover content</Slideover>
);

export const Light = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Light.args = {};
