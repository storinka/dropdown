<template>
  <div id="app" style="height: 100vh; overflow: scroll;">
    <div style="height: 80%;"/>
    <SDropdown position="top" align="right">
      <template #toggle="{ id, toggle }">
        <button style="margin-left: 200px;" :id="id" @click="toggle">Toggle</button>
      </template>

      <div
          style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc;">
        dropdown content
      </div>
    </SDropdown>
    <div style="height: 80%;"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SDropdown from '@/s-dropdown.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    SDropdown
  }
});
</script>
