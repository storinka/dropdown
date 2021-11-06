import { Directive } from "vue";
import { DirectiveBinding } from "@vue/runtime-core";

export const toggleElements: Map<string, HTMLElement> = new Map<string, HTMLElement>();

const sDropdownDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        toggleElements.set(binding.arg as string, el);
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        toggleElements.set(binding.arg as string, el);
    },
    beforeUnmount(el: HTMLElement, binding: DirectiveBinding) {
        toggleElements.delete(binding.arg as string);

        if (el) {
            //
        }
    },
};

export default sDropdownDirective;
