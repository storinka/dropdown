<template>
  <div class="example">
    <div class="props">
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
      </div>
      <div class="props-group">
        <div class="prop-title">offset:</div>

        <label for="offset">
          <input type="number" id="offset" name="offset" v-model="offset"/>
        </label>
      </div>
    </div>
    <div style="overflow: auto; max-height: 100px;">
      <SDropdown :offset="offset" :align="align" :position="position">
        <template #toggle="{ id, toggle }">
          <button :id="id" @click="toggle">Toggle</button>
        </template>

        <div
            style="
            width: 200px;
            height: 200px;
            border: 1px solid #ccc;
            background-color: white;
          "
        >
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
    };
  },
});
</script>

<style>
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
