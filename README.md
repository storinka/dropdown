# Storinka Dropdown

Highly customizable, simple and modern Vue 3 dropdown component.

## Setup

#### 1. Install package via NPM or Yarn:

```shell
yarn add @storinka/vue-dropdown
```

```shell
npm i @storinka/vue-dropdown
```

#### 2. Install as Vue plugin:

```javascript
import { createApp } from "vue";
import SDropdown from "@storinka/vue-dropdown";

const app = createApp();

app.use(SDropdown);
```

## Usage

```vue

<template>
  <div class="container">
    <SDropdown>
      <template #toggle="{ id, toggle }">
        <button :id="id" @click="toggle">
          Toggle
        </button>
      </template>

      <div style="width: 200px; height: 200px; border: 1px solid #ccc;">
        dropdown content
      </div>
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

## Customization

If you want to customize the dropdown, you can apply any styles to `s-dropdown` class.

```css
.s-dropdown {
    background-color: white;

    border: 1px solid #eee;
    border-radius: 10px;

    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
}
```
