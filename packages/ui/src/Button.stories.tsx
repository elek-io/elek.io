import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>Button</Button>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  intent: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  intent: 'secondary',
};

export const Danger = Template.bind({});
Danger.args = {
  intent: 'danger',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
};
