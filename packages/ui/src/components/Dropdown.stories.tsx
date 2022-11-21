import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Dropdown, itemGroupsExample } from './Dropdown';
import { Button } from './Button';
import { Avatar } from './Avatar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  argTypes: {
    items: {
      defaultValue: itemGroupsExample,
    },
  },
} as ComponentMeta<typeof Dropdown>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const TemplateWithButton: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args} itemGroups={itemGroupsExample}>
    <Button>Dropdown</Button>
  </Dropdown>
);
const TemplateWithAvatar: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args} itemGroups={itemGroupsExample}>
    <Avatar name="John Doe"></Avatar>
  </Dropdown>
);

export const WithButton = TemplateWithButton.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithButton.args = {};

export const WithAvatar = TemplateWithAvatar.bind({});
WithAvatar.args = {};
