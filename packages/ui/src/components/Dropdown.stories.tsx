import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid';
import { Dropdown, itemGroupsExample } from './Dropdown';
import { Button } from './Button';
import { Avatar } from './Avatar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  argTypes: {},
} as ComponentMeta<typeof Dropdown>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const TemplateWithButton: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args} itemGroups={itemGroupsExample}>
    <Button appendIcon={ChevronDownIcon}>Dropdown</Button>
  </Dropdown>
);
const TemplateWithAvatar: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args} itemGroups={itemGroupsExample}>
    <Button intent="avatar">
      <Avatar name="John Doe"></Avatar>
    </Button>
  </Dropdown>
);
const TemplateWithIcon: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args} itemGroups={itemGroupsExample}>
    <Button intent="icon">
      <EllipsisVerticalIcon className="h-5 w-5"></EllipsisVerticalIcon>
    </Button>
  </Dropdown>
);

export const WithButton = TemplateWithButton.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithButton.args = {};

export const WithAvatar = TemplateWithAvatar.bind({});
WithAvatar.args = {};

export const WithIcon = TemplateWithIcon.bind({});
WithIcon.args = {};
