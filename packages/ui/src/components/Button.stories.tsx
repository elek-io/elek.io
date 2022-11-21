import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EllipsisVerticalIcon, HeartIcon } from '@heroicons/react/20/solid';
import { Button } from './Button';
import { Avatar } from './Avatar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    intent: { control: 'radio' },
    fullWidth: { control: 'boolean', defaultValue: false },
    state: { defaultValue: null },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>Button</Button>
);
const AvatarTemplate: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>
    <Avatar name="John Doe"></Avatar>
  </Button>
);
const IconTemplate: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>
    <EllipsisVerticalIcon className="h-5 w-5"></EllipsisVerticalIcon>
  </Button>
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

export const Link = Template.bind({});
Link.args = {
  intent: 'link',
};

export const Success = Template.bind({});
Success.args = {
  intent: 'success',
};

export const Warning = Template.bind({});
Warning.args = {
  intent: 'warning',
};

export const Danger = Template.bind({});
Danger.args = {
  intent: 'danger',
};

export const PrependIcon = Template.bind({});
PrependIcon.args = {
  intent: 'secondary',
  prependIcon: HeartIcon,
};

export const AppendIcon = Template.bind({});
AppendIcon.args = {
  intent: 'secondary',
  appendIcon: HeartIcon,
};

export const WithIcon = IconTemplate.bind({});
WithIcon.args = {
  intent: 'icon',
};

export const WithAvatar = AvatarTemplate.bind({});
WithAvatar.args = {
  intent: 'avatar',
};
