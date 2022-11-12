import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { BaseLayout } from './BaseLayout';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Layouts/Base',
  component: BaseLayout,
  argTypes: {
    intent: { control: 'radio' },
    fullWidth: { control: 'boolean', defaultValue: false },
    state: {
      defaultValue: null,
    },
  },
} as ComponentMeta<typeof BaseLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BaseLayout> = (args) => (
  <BaseLayout {...args}>BaseLayout</BaseLayout>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  intent: 'primary',
};
