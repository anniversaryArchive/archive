<template>
  <!-- 이미지 -->
  <q-file v-if="field.type === 'image' || field.type === 'images'" name="data_file"
    :model-value="(modelValue as File)" @update:model-value="onUpdate" filled
    :multiple="field.type === 'images'" :label="field.label" :disable="disabled" />

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

  <!-- Address -->
  <div v-else-if="field.type === 'address'" class="flex">
    <div class="flex-1">{{modelValue}}</div>
    <div class="text-right w-22">
      <button class="px-4 py-1 border border-gray-400 rounded hover:bg-gray-200"
        @click="() => { isOpenFindAddressDialog = true; }">주소 찾기</button>
    </div>
  </div>

  <!-- 그 외 (text, date ..) -->
  <q-input v-else-if="field.type === 'text' || field.type === 'date' || field.type === 'url'" :type="field.type"
    :model-value="modelValue" @update:model-value="onUpdate"
    :placeholder="field.label" class="w-full" :disable="disabled" />

  <FindAddressDialog :show="isOpenFindAddressDialog"
    @done="onUpdate"
    @close="() => { isOpenFindAddressDialog = false; }" />
</template>

<script lang="ts">
export default {
  name: 'CustomInput',
};
</script>

<script setup lang="ts">
import { onBeforeMount, computed, ComputedRef, ref, Ref } from 'vue';
import { useGroupStore } from '@/stores/group';
import { useArtistStore } from '@/stores/artist';
import { Field } from '../data';

// Dialogs
import FindAddressDialog from '@/dialogs/FindAddressDialog.vue';

interface Props {
  modelValue: any;
  field: Field;
  disabled: boolean;
  parent?: any;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['update:modelValue']);

const groupStore = useGroupStore();
const aritstStore = useArtistStore();

const isOpenFindAddressDialog: Ref<boolean> = ref(false);

onBeforeMount(() => {
  const { type, key, parent } = props.field;
  if (type !== 'select') { return; }
  if (key === 'group') {
    groupStore.getGroups();
  } else if (key == 'artist') {
    const flds: Record<string, any> = {};
    if (parent && props.parent) { flds[parent] = props.parent; }
    aritstStore.getArtists({ flds });
  }
});

const selectOptions: ComputedRef<Record<string, any>[]> = computed(() => {
  if (props.field.type !== 'select' || props.disabled) { return []; }

  switch (props.field.key) {
    case 'group': return groupStore.groups;
    case 'artist': return aritstStore.artists;
  }
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
  isOpenFindAddressDialog.value = false;
  emit('update:modelValue', event);
}
</script>

<style scoped>

</style>