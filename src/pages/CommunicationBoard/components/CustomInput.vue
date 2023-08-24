<template>
  <!-- TODO: objectList / multi_image / select -->

  <q-file v-if="field.type === 'image'" name="data_file"
    :model-value="modelValue" @update:model-value="onUpdate" filled
    :label="field.label" :disable="disabled" />
  <q-input v-else-if="field.type === 'color'"
    filled :model-value="modelValue" @update:model-value="onUpdate"
    :rules="['anyColor']" :disable="disabled">
    <template v-slot:append>
      <q-icon name="colorize" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-color :model-value="modelValue" @update:model-value="onUpdate" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <q-input v-else :type="field.type"
    :model-value="modelValue" @update:model-value="onUpdate"
    :placeholder="field.label" class="w-full" :disable="disabled" />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  field: any;
  disabled: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['update:model-value']);

function onUpdate(event) {
  console.log('chloe test event : ', event);
  emit('update:model-value', event);
}
</script>

<style scoped>

</style>