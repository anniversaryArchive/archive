<template>
  <CommonDialog :show="show" @close="closeDialog">
    <VueDaumPostcode @complete="onCompleteAddress" />
  </CommonDialog>
</template>

<script setup lang="ts">
import CommonDialog from './CommonDialog.vue';
import { VueDaumPostcode, VueDaumPostcodeCompleteResult } from 'vue-daum-postcode';

interface Props {
  show: boolean;
}

withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['done', 'close']);

function onCompleteAddress(data: VueDaumPostcodeCompleteResult) {
  emit('done', data);
}

function closeDialog() {
  emit('close');
}
</script>

<style scoped></style>
