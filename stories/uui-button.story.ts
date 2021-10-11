import { html } from 'lit-html';
import '@umbraco-ui/uui-button/lib/index';
// import '../uui-icon/index';
// import '../uui-badge/index';
import {
  InterfaceLookNames,
  InterfaceLookType,
} from '@umbraco-ui/uui-base/lib/types';
import { Story } from '@storybook/web-components';

export default {
  title: 'Buttons/Button',
  component: 'uui-button',
  args: {
    look: 'primary',
  },
  argTypes: {
    look: {
      options: [
        'primary',
        'secondary',
        'outline',
        'placeholder',
        'positive',
        'warning',
        'danger',
      ],
      control: { type: 'select' },
    },
  },
};

const Template: Story = props =>
  html`
    <uui-button
      ?disabled=${props.disabled}
      ?compact=${props.compact}
      look=${props.look}
      label=${props.label}
      >${props.content}</uui-button
    >
  `;

export const AAAOverview = Template.bind({});
AAAOverview.args = { label: 'Basic' };
AAAOverview.storyName = 'Overview';

export const Disabled = Template.bind({});
Disabled.args = { label: 'Disabled', disabled: true };

export const Compact = Template.bind({});
Compact.args = { label: 'Compact', compact: true };

function uppercaseFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const Looks: Story = props => html`
  <uui-button
    ?disabled=${props.disabled}
    ?compact=${props.compact}
    look=${props.look}
    label=${props.label}
    >${props.content}</uui-button
  >
  <h5>Looks</h5>
  ${InterfaceLookNames.map(
    (lookName: InterfaceLookType) =>
      html`<uui-button .look=${lookName} style="margin-right:12px;">
        ${uppercaseFirstLetter(lookName)} look
      </uui-button>`
  )}
`;
Looks.args = { label: 'Button' };

// export const WithIcon = () => html`
//   <uui-button look="danger">
//     <uui-icon .name=${'bug'}></uui-icon>
//   </uui-button>
//   <br />
//   <br />
//   <uui-button look="danger">
//     <uui-icon .name=${'bug'}></uui-icon><span>Hello button with icon</span>
//   </uui-button>
//   <br />
//   <br />
//   <p>
//     For buttons displaying an icon, its important to parse a aria-label
//     attribute to ensure accessibility. The default sixing for a button with just
//     a icon is generally too wide, there please use with the 'compact' attribute.
//   </p>
//   <uui-button look="positive" compact>
//     <uui-icon name="info"></uui-icon>
//   </uui-button>
// `;

// export const WithBadge = () => html` <uui-button look="primary">
//   Button label
//   <uui-badge>!</uui-badge>
// </uui-button>`;
