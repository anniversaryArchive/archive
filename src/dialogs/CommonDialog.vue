<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeDialog" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out"
        enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 text-center">
          <TransitionChild as="template"
            enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel ref="modal"
              class="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <slot></slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, Ref, watch, onBeforeMount } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import useClickOutside from '@/composables/useClickOutside';

interface Props {
  show: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['close']);

const { onClickOutside } = useClickOutside();
const modal = ref(null);
const isOpen: Ref<boolean> = ref(false);

onBeforeMount(() => {
  isOpen.value = props.show;
});

watch(() => props.show, (newValue, _) => {
  if (isOpen.value === newValue) { return; }
  isOpen.value = newValue;
});

onClickOutside(modal, () => {
  if (isOpen.value === true) { closeDialog(); }
});

function closeDialog () {
  emit('close');
}
</script>

<style scoped>

</style>