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
    align: {
      type: String as () => "right" | "left",
      required: false,
      default: "right",
    },
    position: {
      type: String as () => "top" | "bottom",
      required: false,
      default: "bottom",
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
    windowOnClick(event: MouseEvent | TouchEvent) {
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
      const $dropdown = this.$refs.dropdown as HTMLElement;

      if ($el && $scrollParent) {
        const {
          width,
          height,
          x,
          y,
        } = $el.getBoundingClientRect();

        this.$nextTick(() => {
          const dW = $dropdown.clientWidth;
          const dH = $dropdown.clientHeight;

          const hasEnoughSpaceX = dW < x;
          const hasEnoughSpaceY = dH < y;

          const isOutX = dW + x > $scrollParent.clientWidth;
          const isOutY = dH + y > $scrollParent.clientHeight;

          const isLeft = (this.align === 'left' || isOutX) && hasEnoughSpaceX;
          const isTop = (this.position === 'top' || isOutY) && hasEnoughSpaceY;

          if (isLeft) {
            this.left = x - dW + width;
          } else {
            this.left = x;
          }

          if (isTop) {
            this.top = y - dH - this.offset;
          } else {
            this.top = y + height + this.offset;
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

          window.addEventListener('mousedown', this.windowOnClick, { passive: true });
          window.addEventListener('touchstart', this.windowOnClick, { passive: true });
        }, 0);
      } else {
        if (this.scrollParentElement) {
          this.scrollParentElement.removeEventListener('scroll', this.resetPosition);

          this.scrollParentElement = null;
        }

        window.removeEventListener('scroll', this.resetPosition);
        window.removeEventListener('resize', this.resetPosition);

        window.removeEventListener('mousedown', this.windowOnClick);
        window.removeEventListener('touchstart', this.windowOnClick);
      }

      this.resetPosition();
    },
  },
});
</script>

<style lang="scss">
</style>
