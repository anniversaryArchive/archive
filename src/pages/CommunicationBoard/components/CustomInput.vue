<template>
  <!-- TODO: multi_image -->

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
  <div v-else-if="field.type === 'objectList'">
    <template v-if="modelValue">
      <div v-for="object in modelValue"
        class="px-4 py-2 m-2 border border-gray-100 rounded shadow">
        <div v-for="objectField in field.objectFields" class="my-2">
          <div class="font-semibold">
            {{objectField.label}}
            <span v-if="!disabled && objectField.required" class="text-red-600 ml-2">*</span>
          </div>
          <CustomInput v-model="object[objectField.key]"
            :field="objectField" :disabled="disabled" />
        </div>
      </div>
    </template>
    <button v-if="!disabled" class="w-full py-1 text-center border rounded border-primary hover:bg-primary/20 text-primary"
      @click="addObject">Add</button>
  </div>
  <div v-else-if="field.type === 'select'">
    <q-select :model-value="modelValue" @update:model-value="onUpdate"
      :disable="disabled" :options="selectOptions" :option-label="opt => opt.name"></q-select>
  </div>
  <q-input v-else :type="field.type"
    :model-value="modelValue" @update:model-value="onUpdate"
    :placeholder="field.label" class="w-full" :disable="disabled" />
</template>

<script lang="ts">
export default {
  name: 'CustomInput',
};
</script>

<script setup lang="ts">
import { onBeforeMount, computed, ComputedRef } from 'vue';
import { useGroupStore } from '@/stores/group';

interface Props {
  modelValue: string;
  field: any;
  disabled: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['update:model-value']);

const groupStore = useGroupStore();

onBeforeMount(() => {
  const { type, key } = props.field;
  if (type === 'select' && key === 'group') {
    groupStore.getGroups();
  }
});

const selectOptions: ComputedRef<any> = computed(() => {
  if (props.field.type !== 'select' || props.disabled) { return []; }
  if (props.field.key === 'group') { return groupStore.groups; }
  return [];
});

function addObject() {
  const list = props.modelValue || [];
  emit('update:model-value', [...list, {}]);
}

function onUpdate(event) {
  emit('update:model-value', event);
}
</script>

<style scoped>

</style>