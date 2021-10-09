<template>
  <div class="example">
    <div class="props">
      <div class="props-group">
        <div class="prop-title">theme:</div>

        <label for="theme_none">
          <input
              type="radio"
              :value="undefined"
              id="theme_none"
              name="theme"
              v-model="theme"
          />
          none
        </label>
        <label for="theme_light">
          <input
              type="radio"
              value="light"
              id="theme_light"
              name="theme"
              v-model="theme"
          />
          light
        </label>
        <label for="theme_dark">
          <input
              type="radio"
              value="dark"
              id="theme_dark"
              name="theme"
              v-model="theme"
          />
          dark
        </label>
        <label for="theme_tooltip-light">
          <input
              type="radio"
              value="tooltip-light"
              id="theme_tooltip-light"
              name="theme"
              v-model="theme"
          />
          tooltip-light
        </label>
        <label for="theme_tooltip-dark">
          <input
              type="radio"
              value="tooltip-dark"
              id="theme_tooltip-dark"
              name="theme"
              v-model="theme"
          />
          tooltip-dark
        </label>
      </div>
      <div class="props-group">
        <div class="prop-title">position:</div>

        <label for="position_top">
          <input
              type="radio"
              value="top"
              id="position_top"
              name="position"
              v-model="position"
          />
          top
        </label>
        <label for="position_bottom">
          <input
              type="radio"
              value="bottom"
              id="position_bottom"
              name="position"
              v-model="position"
          />
          bottom
        </label>
      </div>
      <div class="props-group">
        <div class="prop-title">align:</div>

        <label for="align_left">
          <input
              type="radio"
              value="left"
              id="align_left"
              name="align"
              v-model="align"
          />
          right
        </label>
        <label for="align_right">
          <input
              type="radio"
              value="right"
              id="align_right"
              name="align"
              v-model="align"
          />
          left
        </label>
        <label for="align_center">
          <input
              type="radio"
              value="center"
              id="align_center"
              name="align"
              v-model="align"
          />
          center
        </label>
      </div>
      <div class="props-group">
        <div class="prop-title">offset:</div>

        <label for="offset">
          <input type="number" id="offset" name="offset" v-model="offset"/>
        </label>
      </div>
      <div class="props-group">
        <div class="prop-title">hover:</div>

        <label for="hover">
          <input type="checkbox" id="hover" name="hover" v-model="hover"/>
        </label>
      </div>
    </div>
    <div style="max-height: 100px;">
      <SDropdown keep-toggle-width :hover="hover" :theme="theme" :offset="offset" :align="align" :position="position">
        <template #toggle="{ id, toggle }">
          <button style="width: 10vw;" :id="id" @click="toggle">Toggle</button>
        </template>

        <div style="border: 1px solid black;">
          dropdown content
        </div>
      </SDropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SDropdown from '@/s-dropdown.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    SDropdown
  },
  data() {
    return {
      position: "top",
      align: "left",
      offset: 10,
      theme: "light",
      hover: false,
    };
  },
  watch: {
    hover(hover) {
      console.log('hover', hover)
    }
  }
});
</script>

<style>
@import "../src/styles/light-theme.css";
@import "../src/styles/dark-theme.css";
@import "../src/styles/tooltip-light-theme.css";
@import "../src/styles/tooltip-dark-theme.css";

.example {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  justify-content: space-between;
  max-width: 500px;
  margin: 0 auto;
  height: 200vh;
  padding-top: 300px;
}

.props {
  display: flex;
  flex-direction: column;
}

.props-group {
  margin-bottom: 10px;
}
</style>
