<template>
  <Swiper
    effect="coverflow"
    slidesPerView="auto"
    :grabCursor="true"
    :centeredSlides="true"
    :coverflowEffect="coverflowEffect"
    :pagination="true"
    :modules="[EffectCoverflow, Pagination]">
    <SwiperSlide v-for="(image, index) in images" class="relative">
      <img :src="image.path" />
      <q-btn v-if="editMode" push round dense color="white" text-color="red"
        icon="delete" class="absolute top-2 right-2"
        @click="onClickDeleteButton(index)" />
    </SwiperSlide>
  </Swiper>
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef, onBeforeMount, watch } from 'vue';
import { Image } from '@/types/image';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCoverflow, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

interface Props {
  modelValue: Record<string, any>[];
  editMode: boolean;
}

const props = withDefaults(defineProps<Props>(), { editMode: false });
const emit = defineEmits(['delete', 'update:modelValue']);

const images: Ref<Record<string, any>[]> = ref([]);
const coverflowEffect: Record<string, any> = {
  rotate: 50,
  stretch: 0,
  depth: 100,
  modifier: 1,
  slideShadows: true,
};

onBeforeMount(() => initImages());

watch(() => props.modelValue, () => initImages());

const editMode: ComputedRef<boolean> = computed(() => props.editMode);

function initImages () {
  images.value = [...props.modelValue];
}

function onClickDeleteButton(index: number) {
  images.value.splice(index, 1);
  const viewIndex = images.value.length <= index ? images.value.length - 1 : 0;
}
</script>

<style scoped>
.swiper {
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 33vw;
}

.swiper-slide img {
  display: block;
  width: 100%;
}

@media screen and (max-width: 767px) {
  .swiper-slide {
    width: 80vw;
  }
}
</style>
