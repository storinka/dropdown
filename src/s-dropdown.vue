<template>
  <slot name="toggle" v-bind="slotProps"/>

  <Teleport to="body">
    <div v-show="isOpen" ref="dropdown" class="s-dropdown" :style="style">
      <slot v-bind="slotProps"/>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

function getElementPosition($el: HTMLElement): { top: number; left: number; } {
  const {
    x,
    y,
  } = $el.getBoundingClientRect();

  return {
    top: y,
    left: x,
  };
}

function getScrollParent(element: HTMLElement, includeHidden: boolean = true): HTMLElement | null {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

  if (style.position === "fixed") return document.body;
  for (let parent: HTMLElement | null = element; (parent = parent.parentElement);) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
  }

  return document.body;
}

let id = 0;

export default defineComponent({
  name: 'SDropdown',
  props: {
    zIndex: {
      type: Number,
      required: false,
      default: 1000,
    },
    offset: {
      type: Number,
      required: false,
      default: 10,
    },
  },
  data() {
    return {
      isOpen: false,

      id: `s_dropdown_${id++}`,

      top: 0,
      left: 0,

      scrollParentElement: null as HTMLElement | null,
    };
  },
  computed: {
    style(): unknown {
      return {
        zIndex: this.zIndex,
        position: 'fixed',
        top: `${this.top}px`,
        left: `${this.left}px`,
      };
    },
    slotProps(): unknown {
      return {
        id: this.id,
        toggle: this.toggle,
        isOpen: this.isOpen,
      };
    },
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    windowOnClick(event: MouseEvent) {
      if (this.$refs.dropdown) {
        const $dropdown = this.$refs.dropdown as HTMLElement;

        if (!$dropdown.contains(event.target as Node)) {
          this.isOpen = false;
        }
      }
    },
    resetPosition() {
      const $el = document.getElementById(this.id);
      const $scrollParent = this.scrollParentElement;

      if ($el && $scrollParent) {
        const {
          top,
          left,
        } = getElementPosition($el);

        const h = $el.clientHeight;
        const w = $el.clientWidth;

        this.top = top + h + this.offset;
        this.left = left;

        this.$nextTick(() => {
          const $dropdown = this.$refs.dropdown as HTMLElement;

          const dW = $dropdown.clientWidth;
          const dH = $dropdown.clientHeight;

          const isOutX = dW + left > $scrollParent.clientWidth;
          const isOutY = dH + top > $scrollParent.clientHeight;

          const hasEnoughSpaceX = dW < left;
          const hasEnoughSpaceY = dH < top;

          if (isOutX && hasEnoughSpaceX) {
            this.left = left - dW + w;
          }

          if (isOutY && hasEnoughSpaceY) {
            this.top = top - dH - this.offset;
          }
        });
      }
    },
  },
  watch: {
    isOpen(isOpen) {
      if (isOpen) {
        const $el = document.getElementById(this.id);

        if ($el) {
          this.scrollParentElement = getScrollParent($el);

          if (this.scrollParentElement) {
            this.scrollParentElement.addEventListener('scroll', this.resetPosition, { passive: true });
          }
        }

        setTimeout(() => {
          window.addEventListener('scroll', this.resetPosition, { passive: true });
          window.addEventListener('resize', this.resetPosition, { passive: true });

          window.addEventListener('click', this.windowOnClick, { passive: true });
        }, 0);
      } else {
        if (this.scrollParentElement) {
          this.scrollParentElement.removeEventListener('scroll', this.resetPosition);

          this.scrollParentElement = null;
        }

        window.removeEventListener('scroll', this.resetPosition);
        window.removeEventListener('resize', this.resetPosition);

        window.removeEventListener('click', this.windowOnClick);
      }

      this.resetPosition();
    },
  },
});
</script>

<style lang="scss">
</style>
