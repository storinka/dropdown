<template>
  <slot name="toggle" v-bind="slotProps"/>

  <Teleport to="body">
    <Transition v-bind="transition" v-if="transition">
      <div :class="classes"
           v-if="isReallyOpen"
           ref="dropdown"
           class="s-dropdown"
           :style="style"
      >
        <slot v-bind="slotProps"/>
      </div>
    </Transition>
    <div :class="classes"
         v-else-if="isReallyOpen"
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
import { toggleElements } from "@/directive";

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

// 1. toggle click
// 2. render dropdown
// 3. calculate positions

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
    name: {
      type: String,
      required: false,
      default: () => `s_dropdown_${id++}`,
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
    isEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    transition: {
      type: Object,
      required: false,
      default: () => ({
        name: 's-dropdown',
      }),
    }
  },
  data() {
    return {
      isOpen: false,

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
    isReallyOpen() {
      return this.isEnabled && this.isOpen;
    },
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
        name: this.name,
        toggle: this.toggle,
        isOpen: this.isReallyOpen,
      };
    },
  },
  updated() {
    this.removeHoverListeners();

    this.toggleElement = this.getToggleElement();
    this.scrollParentElement = getScrollParent(this.toggleElement);

    this.addHoverListeners();
  },
  mounted() {
    this.toggleElement = this.getToggleElement();
    this.scrollParentElement = getScrollParent(this.toggleElement);

    this.addHoverListeners();
  },
  beforeUnmount() {
    this.removeScrollListeners();
    this.removeWindowListeners();
    this.removeHoverListeners();
  },
  methods: {
    getToggleElement(): HTMLElement | null {
      return toggleElements.get(this.name || '') || null;
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
    windowOnClick(event: MouseEvent | TouchEvent) {
      const $toggle = this.getToggleElement();
      if ($toggle?.contains(event.target as Node)) {
        return;
      }

      if (this.$refs.dropdown) {
        const $dropdown = this.$refs.dropdown as HTMLElement;

        if ($dropdown && !$dropdown.contains(event.target as Node)) {
          this.isOpen = false;
        }
      }
    },
    resetPosition() {
      this.$nextTick(() => {
        const $toggle = this.toggleElement;
        const $scrollParent = this.scrollParentElement;
        const $dropdown = this.$refs.dropdown as HTMLElement;

        if ($toggle && $scrollParent && $dropdown) {
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

          const {
            width: dW,
            height: dH,
          } = $dropdown.getBoundingClientRect();

          const hasEnoughSpaceLeft = dW < x;
          const hasEnoughSpaceTop = dH < y;

          const isOutX = dW + x > $scrollParent.clientWidth;
          const isOutY = dH + y > $scrollParent.clientHeight;

          const isLeft = (this.align === 'left' || isOutX) && hasEnoughSpaceLeft;
          const isTop = (this.position === 'top' || isOutY) && hasEnoughSpaceTop;

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
        }
      });
    },

    onToggleClick(): void {
      this.isOpen = !this.isOpen;
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

        this.toggleElement.addEventListener('click', this.onToggleClick);
      }

      const dropdownElement = this.$refs.dropdown as HTMLElement;
      if (dropdownElement) {
        dropdownElement.addEventListener('mouseover', this.onMouseEnter, { passive: true });
        dropdownElement.addEventListener('mouseout', this.onMouseOut, { passive: true });
      }
    },
    removeHoverListeners() {
      if (this.toggleElement) {
        this.toggleElement.removeEventListener('mouseover', this.onMouseEnter);
        this.toggleElement.removeEventListener('mouseout', this.onMouseOut);

        this.toggleElement.removeEventListener('click', this.onToggleClick);
      }

      const dropdownElement = this.$refs.dropdown as HTMLElement;
      if (dropdownElement) {
        dropdownElement.removeEventListener('mouseover', this.onMouseEnter);
        dropdownElement.removeEventListener('mouseout', this.onMouseOut);
      }
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
    isReallyOpen: {
      immediate: true,
      handler(isReallyOpen) {
        if (isReallyOpen) {
          this.addScrollListeners();

          setTimeout(() => {
            this.addWindowListeners();
          }, 0);
        } else {
          this.removeScrollListeners();
          this.removeWindowListeners();
        }

        this.resetPosition();

        setTimeout(() => {
          this.resetPosition();
        }, 0);
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
.s-dropdown-enter-active, .s-dropdown-leave-active {
  transition: transform 50ms ease, opacity 100ms ease;
}

.s-dropdown-enter-from, .s-dropdown-leave-active {
  transform: translateY(5px);
  opacity: 0;
}

.s-dropdown-position-bottom.s-dropdown-enter-from, .s-dropdown-position-bottom.s-dropdown-leave-active {
  transform: translateY(-5px);
}
</style>
