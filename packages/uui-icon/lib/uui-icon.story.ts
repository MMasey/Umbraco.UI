import { Story } from '@storybook/web-components';
import { html } from 'lit-html';
import '@umbraco-ui/uui-icon/lib/index';
import '@umbraco-ui/uui-icon-registry-essential/lib/index';
import { LitElement } from 'lit';
import { UUIIconElement } from './uui-icon.element';
import { query } from 'lit/decorators.js';

export default {
  id: 'uui-icon',
  title: 'Symbols/Icon',
  component: 'uui-icon',
};

const fallbackSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M85.065 420.232c-6.507 6.509-6.507 17.054 0 23.56 6.504 6.514 17.056 6.514 23.559.002l33.049-33.042c-5.737-10.21-10.526-21.23-14.25-32.877l-42.358 42.357zm339.124-198.011c6.51-6.501 6.51-17.053 0-23.562-6.502-6.504-17.055-6.504-23.562 0l-29.451 29.452c5.74 10.208 10.526 21.231 14.251 32.879l38.762-38.769zm-305.782 97.213c0-5.818.263-11.562.759-17.226l-46.137-.002c-9.204.002-16.662 7.458-16.662 16.66 0 9.203 7.458 16.664 16.662 16.664h46.046a197.503 197.503 0 0 1-.668-16.096zm8.151-55.715a177.918 177.918 0 0 1 13.86-33.274l-31.786-31.786c-6.51-6.504-17.061-6.504-23.565 0-6.509 6.51-6.509 17.062 0 23.562l41.491 41.498zm257.974 116.854c-3.882 11.521-8.813 22.389-14.676 32.448l30.776 30.772c6.505 6.512 17.056 6.512 23.56-.002 6.507-6.506 6.507-17.051 0-23.56l-39.66-39.658zm51.697-78.367l-42.545.002c.497 5.663.758 11.407.758 17.226 0 5.432-.234 10.8-.666 16.097h42.453c9.203 0 16.662-7.461 16.662-16.664 0-9.203-7.459-16.659-16.662-16.661zM162.407 70.389c27.314.198 39.683 10.33 46.938 21.625 5.964 9.492 7.656 20.515 8.036 27.072-15.226 10.442-26.149 26.689-29.561 45.572h138.623c-3.413-18.886-14.338-35.135-29.564-45.577.376-6.559 2.071-17.583 8.04-27.068 7.246-11.295 19.614-21.425 46.942-21.625a7.233 7.233 0 0 0 0-14.466c-31.162-.202-49.95 13.171-59.234 28.45-5.947 9.627-8.48 19.591-9.55 27.353a70.4 70.4 0 0 0-25.938-4.981 70.43 70.43 0 0 0-25.96 4.986c-1.069-7.761-3.602-17.725-9.549-27.358-9.287-15.281-28.068-28.652-59.223-28.45-4.006 0-7.238 3.238-7.238 7.233s3.232 7.234 7.238 7.234zm-18.253 248.188c0 71.594 44.03 130.722 100.454 138.429V193.879h-37.77c-37.118 22.856-62.684 70.152-62.684 124.698zm14.814 4.98c0-10.557 12.448-19.117 27.805-19.117 15.354 0 27.802 8.561 27.802 19.117s-12.447 19.112-27.802 19.112c-15.357 0-27.805-8.556-27.805-19.112zm54.263 82.629c-7.163 0-12.966-8.796-12.966-19.645 0-10.85 5.803-19.648 12.966-19.648 7.158 0 12.964 8.799 12.964 19.648.001 10.849-5.806 19.645-12.964 19.645zm9.525-132.331c-7.467 7.463-22.32 4.714-33.177-6.146-10.857-10.854-13.61-25.714-6.144-33.176 7.465-7.464 22.318-4.717 33.176 6.141 10.857 10.859 13.611 25.715 6.145 33.181zm84.664-79.976h-37.77v263.127c56.423-7.707 100.459-66.835 100.459-138.429 0-54.546-25.566-101.842-62.689-124.698zm-10.414 46.795c10.859-10.857 25.711-13.604 33.176-6.141 7.469 7.462 4.716 22.322-6.141 33.176-10.861 10.86-25.713 13.609-33.18 6.146-7.465-7.466-4.713-22.322 6.145-33.181zm3.382 165.512c-7.159 0-12.964-8.796-12.964-19.645 0-10.85 5.805-19.648 12.964-19.648 7.16 0 12.964 8.799 12.964 19.648s-5.804 19.645-12.964 19.645zm26.46-63.517c-15.357 0-27.807-8.556-27.807-19.112s12.449-19.117 27.807-19.117c15.355 0 27.804 8.561 27.804 19.117s-12.449 19.112-27.804 19.112z"/></svg>';

const pictureSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M246.486 299.31l-85.604-91.047-58.21 107.66v29.658h289.12c-36.821-31.753-114.476-99.682-114.476-99.682l-30.83 53.411zM347 230.786c16.062 0 29.073-13 29.073-29.06 0-16.04-13.012-29.062-29.073-29.062-16.019 0-29.038 13.021-29.038 29.062 0 16.06 13.019 29.06 29.038 29.06zM37.74 102.699v306.569h434.688V102.699H37.74zm396.082 267.916H77.635l-.016-228.033h354.928v.017h1.275v228.016z"></path></svg>';

export const Overview: Story = () => html`
  <uui-icon svg=${pictureSVG}></uui-icon>
  <br />
  <p style="color:green">
    Icons use the color of the context:<br />
    <uui-icon svg=${pictureSVG}></uui-icon>
  </p>
  <p>
    or can be colored individually by setting the color css property on each:<br />
    <uui-icon svg=${pictureSVG} style="color:green"></uui-icon>
  </p>
  <p style="font-size:22px;">
    The icons use the font-size of its context:<br />
    <uui-icon svg=${pictureSVG}></uui-icon>
  </p>
  <p>
    Example of icon that is not captured by icon service, therefore showing the
    bug-fallback icon<br />
    <uui-icon name="not_existing" fallback=${fallbackSVG}></uui-icon>
  </p>
  <p>
    Its recommended to use a icon-registry to provide the icons, this makes it
    possible to define an icon with the name attribute.<br />
    <uui-icon-registry-essential>
      <uui-icon name="check"></uui-icon>
    </uui-icon-registry-essential>
  </p>
`;

class TestIconElement extends LitElement {
  @query('#myIcon')
  public iconElement!: UUIIconElement;

  render() {
    return html`<uui-icon id="myIcon" name="picture"></uui-icon>`;
  }
}
customElements.define('uui-test-icon', TestIconElement);

export const WorkingThroughShadowDOMTest: Story = () => html`
  <uui-icon-registry-essential>
    <uui-test-icon></uui-test-icon>
  </uui-icon-registry-essential>
`;
