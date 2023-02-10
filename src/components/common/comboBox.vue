<template>
  <Combobox :modelValue="value" @update:modelValue="onChange">
    <div class="relative mt-1">
      <div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
        <ComboboxInput
          class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          :displayValue="(option) => option.name"
          @change="query = $event.target.value" />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          DOWN
          <!--
          <ChevronUpDownIcon
            class="h-5 w-5 text-gray-400"
            aria-hidden="true" />
          -->
          </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''">
        <ComboboxOptions class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <div v-if="filterOptions.length === 0 && query !== ''"
            class="relative cursor-default select-none py-2 px-4 text-gray-700">
            Nothing found.
          </div>

          <ComboboxOption v-for="option in filterOptions"
            as="template" :key="option.id"
            :value="option" v-slot="{ selected, active }">
            <li class="relative cursor-default select-none py-2 pl-10 pr-4"
              :class="{
                'bg-teal-600 text-white': active,
                'text-gray-900': !active,
              }">
              <span class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }">
                {{ option.name }}
              </span>
              <span v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-teal-600': !active }">
                <!--
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                -->
                CHECK
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
  value?: ComboBoxModel;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), { });
const emit = defineEmits(['change']);

const query: Ref<string> = ref(''); 
const filterOptions: ComputedRef<ComboBoxModel[]> = computed(() => {
  return query.value === ''
    ? props.options
    : props.options.filter((option: ComboBoxModel) => {
      return option.name.toLowerCase().includes(query.value.toLowerCase());
    });
});

const onChange = (selected: ComboBoxModel) => {
  emit('change', selected);
}
</script>

<style scoped>

</style>
