<template>
  <slot name="toggle" v-bind="slotProps"/>

  <Teleport to="body">
    <div :class="classes"
         v-show="isOpen"
         ref="dropdown"
         class="s-dropdown"
         :style="style"
    >
      <slot v-bind="slotProps"/>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  if (node == null) {
    return document.body;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentNode as HTMLElement);
  }
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
      type: String as () => "right" | "left" | "center",
      required: false,
      default: "right",
    },
    position: {
      type: String as () => "top" | "bottom",
      required: false,
      default: "bottom",
    },
    theme: {
      type: String,
      required: false,
    },
    hover: {
      type: Boolean,
      required: false,
      default: false,
    },
    keepToggleWidth: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,

      id: `s_dropdown_${id++}`,

      top: 0,
      left: 0,
      width: undefined as number | undefined,

      scrollParentElement: null as HTMLElement | null,

      currentAlign: this.align,
      currentPosition: this.position,

      toggleElement: null as HTMLElement | null,
    };
  },
  computed: {
    classes(): string[] {
      const classes = [
        `s-dropdown-align-${this.currentAlign}`,
        `s-dropdown-position-${this.currentPosition}`,
      ];

      if (this.theme) {
        classes.push(`s-dropdown-${this.theme}-theme`);
      }

      return classes;
    },
    style(): unknown {
      return {
        zIndex: this.zIndex,
        position: 'fixed',
        top: `${this.top}px`,
        left: `${this.left}px`,
        maxWidth: this.width != null ? `${this.width}px` : undefined,
        width: this.width != null ? `${this.width}px` : undefined,
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
  updated() {
    this.removeHoverListeners();

    this.toggleElement = document.getElementById(this.id);
    this.scrollParentElement = getScrollParent(this.toggleElement);

    this.addHoverListeners();
  },
  mounted() {
    this.toggleElement = document.getElementById(this.id);
    this.scrollParentElement = getScrollParent(this.toggleElement);
  },
  beforeUnmount() {
    this.removeScrollListeners();
    this.removeWindowListeners();
    this.removeHoverListeners();
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    windowOnClick(event: MouseEvent | TouchEvent) {
      const $toggle = document.getElementById(this.id);
      if ($toggle?.contains(event.target as Node)) {
        return;
      }

      if (this.$refs.dropdown) {
        const $dropdown = this.$refs.dropdown as HTMLElement;

        if (!$dropdown.contains(event.target as Node)) {
          this.isOpen = false;
        }
      }
    },
    resetPosition() {
      const $toggle = this.toggleElement;
      const $scrollParent = this.scrollParentElement;
      const $dropdown = this.$refs.dropdown as HTMLElement;

      if ($toggle && $scrollParent) {
        this.$nextTick(() => {
          const {
            width: tW,
            height: tH,
            x,
            y,
          } = $toggle.getBoundingClientRect();

          if (this.keepToggleWidth) {
            this.width = tW;
          } else {
            this.width = undefined;
          }

          const dW = this.width || $dropdown.clientWidth;
          const dH = $dropdown.clientHeight;

          const hasEnoughSpaceX = dW < x;
          const hasEnoughSpaceY = dH < y;

          const isOutX = dW + x > $scrollParent.clientWidth;
          const isOutY = dH + y > $scrollParent.clientHeight;

          const isLeft = (this.align === 'left' || isOutX) && hasEnoughSpaceX;
          const isTop = (this.position === 'top' || isOutY) && hasEnoughSpaceY;

          if (this.align === 'center') {
            this.left = x + (tW / 2) - (dW / 2);

            this.currentAlign = 'center';
          } else if (isLeft) {
            this.left = x - dW + tW;

            this.currentAlign = 'left';
          } else {
            this.left = x;

            this.currentAlign = 'right';
          }

          if (isTop) {
            this.top = y - dH - this.offset;

            this.currentPosition = 'top';
          } else {
            this.top = y + tH + this.offset;

            this.currentPosition = 'bottom';
          }
        });
      }
    },

    onMouseEnter(): void {
      if (this.hover) {
        this.isOpen = true;
      }
    },
    onMouseOut(): void {
      if (this.hover) {
        this.isOpen = false;
      }
    },

    addHoverListeners() {
      if (this.toggleElement) {
        this.toggleElement.addEventListener('mouseover', this.onMouseEnter, { passive: true });
        this.toggleElement.addEventListener('mouseout', this.onMouseOut, { passive: true });
      }

      const dropdownElement = this.$refs.dropdown as HTMLElement;
      dropdownElement.addEventListener('mouseover', this.onMouseEnter, { passive: true });
      dropdownElement.addEventListener('mouseout', this.onMouseOut, { passive: true });
    },
    removeHoverListeners() {
      if (this.toggleElement) {
        this.toggleElement.removeEventListener('mouseover', this.onMouseEnter);
        this.toggleElement.removeEventListener('mouseout', this.onMouseOut);
      }

      const dropdownElement = this.$refs.dropdown as HTMLElement;
      dropdownElement.removeEventListener('mouseover', this.onMouseEnter);
      dropdownElement.removeEventListener('mouseout', this.onMouseOut);
    },

    addWindowListeners() {
      window.addEventListener('scroll', this.resetPosition, { passive: true });
      window.addEventListener('resize', this.resetPosition, { passive: true });

      window.addEventListener('mousedown', this.windowOnClick, { passive: true });
      window.addEventListener('touchstart', this.windowOnClick, { passive: true });
    },
    removeWindowListeners() {
      window.removeEventListener('scroll', this.resetPosition);
      window.removeEventListener('resize', this.resetPosition);

      window.removeEventListener('mousedown', this.windowOnClick);
      window.removeEventListener('touchstart', this.windowOnClick);
    },

    addScrollListeners() {
      if (this.scrollParentElement) {
        this.scrollParentElement.addEventListener('scroll', this.resetPosition, { passive: true });
      }
    },
    removeScrollListeners() {
      if (this.scrollParentElement) {
        this.scrollParentElement.removeEventListener('scroll', this.resetPosition);
      }
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(isOpen) {
        if (isOpen) {
          this.addScrollListeners();

          setTimeout(() => {
            this.addWindowListeners();
          }, 0);
        } else {
          this.removeScrollListeners();
          this.removeWindowListeners();
        }

        this.resetPosition();
      }
    },
    hover(hover) {
      if (hover) {
        this.addHoverListeners();
      } else {
        this.removeHoverListeners();
      }
    }
  },
});
</script>

<style>
@import "./styles/dark-theme.css";
@import "./styles/light-theme.css";
@import "./styles/tooltip-dark-theme.css";
@import "./styles/tooltip-light-theme.css";
</style>
