<template>
  <div class="absolute relative top-0 left-0 w-full h-full dialog"
    :class="{ 'hide': !show }">
    <div class="w-full h-full bg-black backdrop" @click="hide">
    </div>
    <div class="absolute bottom-0 flex flex-col w-full bg-white !rounded-t-2xl dialog-content"
      :class="dialogContentHeight">
      <!-- Title 영역 -->
      <div class="relative p-4">
        <div class="px-8 text-lg font-extrabold text-center">
          <slot name="title"></slot>
        </div>
        <button class="absolute text-xl top-4 right-4" @click="hide">
          <q-icon name="keyboard_arrow_down" class="inline-block" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <slot name="content"></slot>
      </div>

      <!-- Footer -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';

interface Props {
  show: boolean;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['hide']);

const show: ComputedRef<boolean> = computed(() => props.show);
const dialogContentHeight: ComputedRef<string> = computed(() => {
  return `h-${props.height || '5/6'}`;
});

function hide() {
  emit('hide');
}
</script>

<style scoped lang="scss">
/**
  * Animation 관련
 */
.dialog, .backdrop, .dialog-content {
  transition: all 0.3s ease 0s;
}
.dialog {
  z-index: 100;
  .backdrop {
    opacity: 0.3;
  }
  .dialog-content {
    transform: translateY(0%);
    box-shadow: 0 -3px 6px rgba(0,0,0,.07);
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