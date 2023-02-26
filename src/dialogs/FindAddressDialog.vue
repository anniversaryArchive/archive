<template>
  <CommonDialog :show="show" @close="closeDialog">
    <VueDaumPostcode @complete="onCompleteAddress" />
  </CommonDialog>
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef } from 'vue';
import CommonDialog from './CommonDialog.vue';
import { VueDaumPostcode, VueDaumPostcodeCompleteResult } from 'vue-daum-postcode';

interface Props {
  show: boolean;
}

const props = withDefaults(defineProps<Props>(), { });
const emit = defineEmits(['done', 'close']);

function onCompleteAddress (result: VueDaumPostcodeCompleteResult) {
  emit('done', result.address);
}

function closeDialog () {
  emit('close')
}
</script>

<style scoped>

</style>