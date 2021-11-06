# Storinka Dropdown

Highly customizable, simple and modern Vue 3 dropdown component.

## Setup

#### 1. Install package via NPM or Yarn:

```shell
yarn add @storinka/dropdown
```

```shell
npm i @storinka/dropdown
```

#### 2. Install as Vue plugin:

```javascript
import { createApp } from "vue";
import SDropdown from "@storinka/dropdown";

const app = createApp();

app.use(SDropdown);
```

## Usage

Example 1 (with provided name):

```vue

<template>
  <div class="container">
    <button v-s-dropdown-toggle:some-dropdown>
      toggle
    </button>
    <SDropdown name="some-dropdown">
      dropdown content
    </SDropdown>
  </div>
</template>
```

Example 2 (without provided name):

```vue

<template>
  <div class="container">
    <SDropdown>
      <template #toggle="{ name }">
        <button v-s-dropdown-toggle:[name]>
          toggle
        </button>
      </template>

      dropdown content
    </SDropdown>
  </div>
</template>
```

> **WARNING**: You must always set id provided in template props for toggle element.

## Props

### `z-index`

- Type: `number | undefined`
- Default: `1000`

Provide custom z-index for dropdown container.

### `offset`

- Type: `number | undefined`
- Default: `10`

Provide custom offset for dropdown container from toggle element.

### `align`

- Type: `string | undefined`
- Value: `"left" | "right"`
- Default: `"right"`

Provide initial dropdown align.

### `position`

- Type: `string | undefined`
- Value: `"top" | "bottom"`
- Default: `"bottom"`

Provide initial dropdown position.

### `theme`

- Type: `string | undefined`
- Value: `"light" | "dark" | "tooltip-light" | "tooltip-dark"`
- Default: `undefined`

Specify a theme.

### `hover`

- Type: `boolean | undefined`
- Default: `false`

Open dropdown on hover.

### `is-enabled`

- Type: `boolean | undefined`
- Default: `true`

Enable or disable dropdown.

### `keep-toggle-width`

- Type: `boolean | undefined`
- Default: `false`

Enable or disable making dropdown width same as toggle width.

## Slot props

Available slots: `toggle`, `default`

### `name`

- Type: `string`

Dropdown name.

### `isOpen`

- Type: `boolean`

Is dropdown open or not.

## Themes

The component by default comes without any styles. But, there are few built-in themes you can use.

```javascript
// theme: "dark"
import "@storinka/dropdown/dist/styles/dark-theme.css";

// theme: "light"
import "@storinka/dropdown/dist/styles/light-theme.css";

// theme: "tooltip-dark"
import "@storinka/dropdown/dist/styles/tooltip-dark-theme.css";

// theme: "tooltip-light"
import "@storinka/dropdown/dist/styles/tooltip-light-theme.css";
```

## Customization

If you want to customize the dropdown, you can apply any styles to `s-dropdown` class.

```css
.s-dropdown {
    background-color: white;

    border: 1px solid #eee;
    border-radius: 10px;

    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
}

.s-dropdown-position-bottom {
    /* when position is bottom */
}

.s-dropdown-position-top {
    /* when position is top */
}

.s-dropdown-align-right {
    /* when align is right */
}

.s-dropdown-align-left {
    /* when align is left */
}

.s-dropdown-align-center {
    /* when align is center */
}
```
