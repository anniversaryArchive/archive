<template>
  <div v-if="archive" :style="`background-image: url(${mainImage})`"
    class="relative text-white bg-center bg-cover h-80">
    <div class="absolute top-0 left-0 w-full h-full bg-black/70"></div>
    <div class="absolute top-1/2 translate-y-[-50%] left-40">
      <div class="text-2xl font-black">
        <span class="text-primary">{{ artistName }}</span> 생일 카페
      </div>
      <div class="text-5xl font-black">
        {{ archive.themeName }}
      </div>
      <div class="text-lg text-gray-400">{{ archive.organizer }}</div>
    </div>
  </div>

  <div class="px-40">
    <div class="inline-block pt-20 pb-2 text-3xl font-bold border-b-2 border-black">기본 정보</div>

    <div v-if="archive" class="text-xl text-gray-800 mt-11">
      <div>
        <span class="inline-block w-8"><q-icon name="calendar_today" /></span>
        <span class="align-middle">{{ startDate }} ~ {{ endDate }}</span>
      </div>
      <div class="my-3">
        <span class="inline-block w-8"><q-icon name="schedule" /></span>
        {{ openTime }} ~ {{ closeTime }}
      </div>
      <div>
        <span class="inline-block w-8"><q-icon name="location_on" /></span>
        <a :href="`https://map.naver.com/v5/search/${archive.address}`"
          class="border-b border-gray-800">
          {{ archive.address }} {{ archive.detailAddress }}
        </a>
      </div>
      <div class="my-3">
        <span class="inline-block w-8">
          <img src="@/assets/twitter.svg" class="w-5" />
        </span>
        <a :href="link" class="border-b border-gray-800">{{ link }}</a>
      </div>
    </div>

    <div class="inline-block pt-20 pb-2 text-3xl font-bold border-b-2 border-black">포스터 및 특전 정보</div>

    <div class="my-8">
      <ImageSlide v-model="images" height="50rem" />  
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, computed, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import { useArchiveStore } from '@/stores/archive';
import { Archive } from '@/types/Archive';
import ImageSlide from '@/components/common/imageSlide.vue';
import moment from 'moment';

const route = useRoute();
const archiveStore = useArchiveStore();

const archive: Ref<Archive | undefined> = ref();

onBeforeMount(() => {
  getArchive();
});

const artistName: ComputedRef<string | undefined> = computed(() => {
  return archive.value?.artist?.name;
});
const mainImage: ComputedRef<string | undefined> = computed(() => {
  return archive.value?.mainImage?.path;
});
const startDate: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value) { return; }
  return moment(archive.value.startDate).format('YYYY-MM-DD');
});
const endDate: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value) { return; }
  return moment(archive.value.endDate).format('YYYY-MM-DD');
});
const openTime: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value?.openTime) { return; }
  const { hour, minute } = archive.value.openTime;
  return `${numToTime(hour)}:${numToTime(minute)}`;
});
const closeTime: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value?.closeTime) { return; }
  const { hour, minute } = archive.value.closeTime;
  return `${numToTime(hour)}:${numToTime(minute)}`;
});
const link: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value?.link) { return; }
  const index: number = archive.value.link.indexOf('?');
  if (index === -1) { return archive.value.link; }
  return archive.value.link.slice(0, index);
})
const images: ComputedRef<Record<string, any>[]> = computed(() => {
  return archive.value?.images || [];
});

async function getArchive() {
  const id: string = route.params.id;
  try {
    const { data } = await archiveStore.getArchive(id);
    archive.value = (data.value.archive || {}) as Archive;
    console.log('archive : ', archive.value);
  } catch (error) {
    console.error(error);
  }
}

function numToTime(num: int): string {
  return num < 10 ? `0${num}` : num; 
}

</script>

<style scoped>

</style>