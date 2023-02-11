<template>
  <Combobox :modelValue="modelValue" @update:modelValue="onChange">
    <div class="relative mt-1">
      <div class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
        <ComboboxInput
          class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0"
          :displayValue="(option) => option.name"
          @change="query = $event.target.value" />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <q-icon name="expand_more" />
        </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''">
        <ComboboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <div v-if="filterOptions.length === 0 && query !== ''"
            class="relative px-4 py-2 text-gray-700 cursor-default select-none">
            Nothing found.
          </div>

          <ComboboxOption v-for="option in filterOptions"
            as="template" :key="option.id"
            :value="option" v-slot="{ selected, active }">
            <li class="relative py-2 pl-10 pr-4 cursor-default select-none"
              :class="{
                'bg-blue-200 text-bold': active,
                'text-gray-900': !active,
              }">
              <span class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }">
                {{ option.name }}
              </span>
              <span v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'font-bold': active, 'text-blue-400': !active }">
                <q-icon name="done" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef } from 'vue';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import { ComboBoxModel } from '@/types/CommonTypes';

interface Props {
  options: ComboBoxModel[];
  modelValue?: ComboBoxModel;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), { });
const emit = defineEmits(['update:modelValue']);

const query: Ref<string> = ref(''); 
const filterOptions: ComputedRef<ComboBoxModel[]> = computed(() => {
  return query.value === ''
    ? props.options
    : props.options.filter((option: ComboBoxModel) => {
      return option.name.toLowerCase().includes(query.value.toLowerCase());
    });
});

const onChange = (selected: ComboBoxModel) => {
  emit('update:modelValue', selected);
}
</script>

<style scoped>

</style>
