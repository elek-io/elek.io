import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { BaseLayout } from './BaseLayout';
import { sidebarNavigationExample } from '../components/Sidebar';
import { userNavigationExample } from '../components/Header';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Layouts/Base',
  component: BaseLayout,
  argTypes: {
    currentPath: { defaultValue: '/' },
    sidebarDisabledOnPaths: { defaultValue: [] },
    sidebarNavigation: {
      defaultValue: sidebarNavigationExample,
    },
    userNavigation: {
      defaultValue: userNavigationExample,
    },
    notifications: {
      defaultValue: [
        {
          icon: CheckCircleIcon,
          title: 'Created Page',
          description: 'Successfully created a new page',
        },
      ],
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
