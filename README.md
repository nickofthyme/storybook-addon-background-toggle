# Storybook Addon Background Toggle

This addon is inspired by [`@storybook/addon-backgrounds`](https://github.com/storybooks/storybook/tree/next/addons/backgrounds) and [`storybook-addon-backgrounds`](https://github.com/tonai/storybook-addon-backgrounds) and builds a smoother and more feature rich implementation. Also see [`storybook-addon-theme-toggle`](https://github.com/nickofthyme/storybook-addon-theme-toggle).

This addon can be used to add a custom [`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background) to one or many target HTML elements. All options are explained below, see [Parameters](#parameters) section below.

Test it out at https://nickofthyme.github.io/storybook-addon-background-toggle/

https://user-images.githubusercontent.com/19007109/128195841-a8ef6de0-d804-486e-93f7-13b373eb68c8.mp4

## Compatibility

This version is compatible with storybook version `>6.x` only. Does not work for `>7.x`, see https://github.com/nickofthyme/storybook-addon-background-toggle/issues/1.

As of storybook `6.3.0` global parameters are synced with the url as query search params ([storybookjs/storybook#15056](https://github.com/storybookjs/storybook/pull/15056)). As such this will lock-in the default global and be persisted between stories. If you want to avoid this behavior you can use `storybook@~6.2.0`.

## Installation

### yarn
```sh
yarn add -D storybook-addon-background-toggle
```

### npm
```sh
npm i -D storybook-addon-background-toggle
```

## Getting started

Once installed, add this addon to the `addons` array in storybooks `main.js` file:

```jsx
// main.js
module.exports = {
  addons: [
    'storybook-addon-background-toggle'
  ],
};
```

See the [storybook documentation](https://storybook.js.org/docs/addons/using-addons/) for more information.

## Parameters

The parameters for this plugin are under the `background` key and are defined below.

```tsx
interface Parameters {
  /**
   * Ignores global values in url params
   *
   * @default true
   */
  ignoreQueryParams?: false;
  /**
   * Tefault background id
   */
  default?: string;
  /**
   * Background options to be applied
   */
  options: Background[];
  /**
   * Selected background is clearable
   *
   * @default true
   */
  clearable?: boolean;
  /**
   * Disable addon at story level
   *
   * @default false
   */
  disable?: boolean;
  /**
   * Persist background selection between stories
   *
   * @default false
   */
  persist?: boolean;
  /**
   * Blur tooltip on background selection
   *
   * @default true
   */
  blurOnSelect?: boolean;
  /**
   * Override icon used in toolbar
   * See https://next--storybookjs.netlify.app/official-storybook/?path=/story/basics-icon--labels
   *
   * @default 'mirror'
   */
  icon?: IconsProps['icon'];
  /**
   * A callback that will be executed when the background changes
   */
  onChange?: (background: Background) => void;
  /**
   * Target element selector(s) to apply class(es)
   *
   * @default 'body'
   */
  selector?: string | string[];
}
```

The `Background` type is defined below.

```tsx
interface Background {
  /**
   * id of the background
   */
  id: string;
  /**
   * Title of the background in background selector ui
   *
   * @default {@link Background#id}
   */
  title?: string;
  /**
   * Background string to be applied to targeted element(s) via selector(s)
   * See https://developer.mozilla.org/en-US/docs/Web/CSS/background
   *
   * @default {@link Background#color}
   */
  background?: string;
  /**
   * Adds the `!important` flag to the background style definition
   * See https://www.w3schools.com/css/css_important.asp
   *
   * @default false
   */
  important?: boolean;
  /**
   * Badge color in the background selector ui, also used as default background property
   * Can be any valid background string.
   * See https://developer.mozilla.org/en-US/docs/Web/CSS/background
   */
  color: string;
}
```

## Configuration

### Global level

You can configure the backgrounds at the global level in the storybook `preview.(ts|js)` file as demonstrated below.

```tsx
// preview.ts

import type { BackgroundParameter } from 'storybook-addon-background-toggle';

type Parameters = BackgroundParameter & {
  // other global types
};

export const parameters: Parameters = {
  background: {
    default: 'white',
    selector: 'body',
    onChange(background) {
      // handle new background
    },
    backgrounds: [
      {
        id: 'white',
        title: 'White',
        color: '#fff',
      },
      {
        id: 'black',
        title: 'Black',
        color: '#000',
      },
      {
        id: 'black-important',
        title: 'Black - Important',
        important: true,
        color: '#000',
      },
      {
        id: 'raindow',
        title: 'Raindow',
        background: 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)',
        color: 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)',
      },
    ],
  }
};
```

### Story level

All properties defined in `BackgroundParameter` are capable of being overridden at the story level. However, it is only advisable to override some of the parameters to prevent defining parameters that could negatively affect the addon behavior across all stories. The acceptable properties include `default`, `blurOnSelect`, `disable`, `ignoreQueryParams` and `clearable`. The `BackgroundStoryParameter` type is a helper that should be used to limit what properties are overridden at the story level;

```tsx
// story1.stories.tsx

import type { BackgroundStoryParameter } from 'storybook-addon-background-toggle';

const Example = () => <span>Hello!</span>;

Example.parameters: BackgroundStoryParameter = {
  background: {
    default: 'black',
  }
};
```

## Usage in Decorators

Global storybook [`Decorators`](https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators) can be used for a multitude of things. As such it is important to have access to the selected background inside the decorators. This is the primary reason for chosing to use `globals` to maintain the state of the selected background.

Below is a simple example of how you could access the background via the `context.globals`.

```tsx
// preview.tsx

import React from "react";

import type { DecoratorFunction } from "@storybook/addons";
import type { BackgroundGlobals } from 'storybook-addon-background-toggle';

const Decorator: DecoratorFunction<JSX.Element> = (Story, context) => {
  const globals = context.globals as BackgroundGlobals;
  const selectedBackground = globals.background; // background id

  return (
    <div>
      <Story {...context} />
      <br />
      <pre>
        Background: {selectedBackground}
        {JSON.stringify(globals, null, 2)}
      </pre>
    </div>
  );
};

export const decorators = [Decorator];
```

See a full example of this in [`.storybook/Decorator.tsx`](.storybook/Decorator.tsx).

> Globals are currently not correctly initialized by storybook, meaning they *always* return `{}` as the initial value. To correct this, we update globals with the default/initial background id once the `SET_STORIES` event is emitted, if they differ.

## Framework Support

| [React](https://reactjs.org/) |
|:-:|
| :white_check_mark: |
