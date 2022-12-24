import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Page } from './Page';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Page',
  component: Page,
  argTypes: {
    title: {
      defaultValue: 'Page title',
    },
  },
} as ComponentMeta<typeof Page>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Page> = (args) => (
  <div className="flex w-full h-full">
    <div className="flex flex-1 items-stretch overflow-hidden">
      <Page {...args}></Page>
    </div>
  </div>
);

export const Light = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Light.args = {};
