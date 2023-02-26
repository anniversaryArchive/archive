<template>
  <div v-if="time">
    <select v-model="time.hour" name="hours"
      class="text-xl bg-transparent outline-none appearance-none"
      @select="onChangeTime">
      <option v-for="value in Array.from(Array(24).keys())" :value="value">
        {{value}}
      </option>
    </select>
    <span class="mr-3 text-xl">:</span>
    <select v-model="time.minute" name="minutes"
      class="mr-4 text-xl bg-transparent outline-none appearance-none"
      @select="onChangeTime">
      <option v-for="minute in minutes" :value="minute">{{minute}}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, onBeforeMount, computed, ComputedRef } from 'vue';

interface Time {
  hour: number;
  minute: number;
}

interface Props {
  modelValue?: Time;
}

const props = withDefaults(defineProps<Props>(), { });
const emit = defineEmits(['update:modelValue']);

const minutes: ComputedRef<number[]> = computed(() => [0, 30]);
const time: Ref<Time | undefined> = ref();

onBeforeMount(() => {
  time.value = props.modelValue;
});

watch(() => props.modelValue, () => {
  time.value = props.modelValue;
});

function onChangeTime () {
  emit('update:modelValue', time.value);
}
</script>

<style scoped>

</style>