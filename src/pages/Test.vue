<template>
  <div class="flex h-full">
    <div class="relative h-full bg-white shadow-xl w-96">
      <div class="px-4 mt-4">
        <button class="w-full py-2 text-white rounded bg-primary/95 rouned hover:bg-primary"
          @click="showBottomDialog">OPEN BOTTM DIALOG</button>
      </div>

      <BottomDialog :show="isShowBottomDialog"
        @hide="hideBottomDialog">
        <template v-slot:title>TITLE</template>
        <template v-slot:content>
          <div class="px-4">
            CONTENT !
          </div>
        </template>
        <template v-slot:footer>
          <div class="py-4 font-bold text-center border-t border-gray-300">
            FOOTER
          </div>
        </template>
      </BottomDialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import BottomDialog from '@/dialogs/BottomDialog.vue';

const isShowBottomDialog: Ref<boolean> = ref(false);

function showBottomDialog() {
  isShowBottomDialog.value = true;
}
function hideBottomDialog() {
  isShowBottomDialog.value = false;
}
</script>

<style scoped>
</style>