<template>
  <q-carousel v-if="images.length" v-model="slide" v-model:fullscreen="fullscreen"
    transition-prev="scale" transition-next="scale"
    swipeable animated control-color="blue"
    control-type="outline" navigation padding arrows
    height="300px" class="text-white bg-white shadow-1 rounded-borders">
    <q-carousel-slide v-for="(image, index) in images"
      class="column no-wrap flex-center" :name="image.name"
      :img-src="image.path">
    </q-carousel-slide>

    <template v-slot:control>
      <q-carousel-control position="bottom-right" :offset="[18, 18]">
        <q-btn push round dense color="white" text-color="primary"
          :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="fullscreen = !fullscreen" />
      </q-carousel-control>

      <q-carousel-control position="top-right" :offset="[18, 18]">
        <q-btn push round dense color="white" text-color="red"
          icon="delete" @click="onClickDeleteButton(index)" />
      </q-carousel-control>
    </template>
  </q-carousel>
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef, onBeforeMount, watch } from 'vue';
import { Image } from '@/types/image';

interface Props {
  modelValue: (Image | File)[];
}

const props = withDefaults(defineProps<Props>(), { });
const emit = defineEmits(['delete', 'update:modelValue']);

const slide: Ref<string | undefined> = ref(null);
const images: Ref<(Image | File)[]> = ref([]);
const fullscreen: Ref<boolean> = ref(false);

onBeforeMount(() => initImages());

watch(() => props.modelValue, () => initImages());

function initImages () {
  images.value = [...props.modelValue];
  if (!slide.value && images.value.length) {
    slide.value = images.value[0].name;
  }
}

function onClickDeleteButton (index: number) {
  images.value.splice(index, 1);
  emit('update:modelValue', images);
}
</script>

<style scoped>

</style>
