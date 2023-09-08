<template>
  <!-- 이미지 -->
  <q-file v-if="field.type === 'image'" name="data_file"
    :model-value="(modelValue as File)" @update:model-value="onUpdate" filled
    :label="field.label" :disable="disabled" />

  <!-- 컬러 -->
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

  <!-- Object List Ex) artist -->
  <div v-else-if="field.type === 'objectList'">
    <template v-if="modelValue">
      <div v-for="(object, objectIndex) in modelValue"
        class="relative px-4 py-2 m-2 border border-gray-100 rounded shadow">
        <div v-if="!disabled" class="absolute text-right top-4 right-4">
          <button class="px-4 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-300"
            @click="removeObject(objectIndex)">제거</button>
        </div>
        <div v-for="(objectField, index) in field.objectFields" class="my-2">
          <div class="font-semibold">
            {{objectField.label}}
            <span v-if="!disabled && objectField.required" class="ml-2 text-red-600">*</span>
          </div>
          <CustomInput v-model="object[objectField.key]"
            :field="objectField" :disabled="disabled" />
        </div>
      </div>
    </template>
    <button v-if="!disabled" class="w-full py-1 text-center border rounded border-primary hover:bg-primary/20 text-primary"
      @click="addObject">Add</button>
  </div>

  <!-- Select -->
  <div v-else-if="field.type === 'select'">
    <q-select :model-value="modelValue" @update:model-value="onUpdate"
      :disable="disabled" :options="selectOptions" :option-label="opt => opt.name"></q-select>
  </div>

  <!-- 그 외 (text, date ..) -->
  <q-input v-else-if="field.type === 'text' || field.type === 'date'" :type="field.type"
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
import { Field } from '../data';

interface Props {
  modelValue: any;
  field: Field;
  disabled: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['update:modelValue']);

const groupStore = useGroupStore();

onBeforeMount(() => {
  const { type, key } = props.field;
  if (type === 'select' && key === 'group') {
    groupStore.getGroups();
  }
});

const selectOptions: ComputedRef<Record<string, any>[]> = computed(() => {
  if (props.field.type !== 'select' || props.disabled) { return []; }
  if (props.field.key === 'group') { return groupStore.groups; }
  return [];
});

function addObject() {
  const list = props.modelValue || [];
  emit('update:modelValue', [...list, {}]);
}
function removeObject(index: number) {
  const list = [...props.modelValue];
  emit('update:modelValue', list.splice(index, 1));
}

function onUpdate(event: string | number | null) {
  emit('update:modelValue', event);
}
</script>

<style scoped>

</style>