<template>
  <div class="absolute relative top-0 left-0 w-full h-full dialog"
    :class="{ 'hide': !show }">
    <div class="w-full h-full bg-black backdrop">
    </div>
    <div class="absolute bottom-0 flex flex-col w-full bg-white !rounded-t-2xl h-5/6 dialog-content">
      <div class="px-6 my-5 text-right">
        <button class="text-lg font-bold" @click="onClickCloseBtn">
          <q-icon name="close" class="inline-block" />
        </button>
      </div>
      <div class="flex-1 px-4">
        <slot name="content"></slot>
      </div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';

interface Props {
  show: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['hide']);

const show: ComputedRef<boolean> = computed(() => props.show);

function onClickCloseBtn() {
  emit('hide');
}
</script>

<style scoped lang="scss">
.dialog {
  z-index: 100;
  transition: all 0.8s ease-in-out;
  .backdrop {
    opacity: 0.3;
    transition: all 0.8s ease-in-out;
  }
  .dialog-content {
    transform: translateY(0%);
    transition: all 0.8s ease-in-out;
    box-shadow: 0px 10px 5px #888, 0px -10px 25px #888;
  }

  &.hide {
    z-index: -1;
    .dialog-content {
      transform: translateY(100%);
    }
    .backdrop {
      opacity: 0;
    }
  }
}
</style>