<template>
  <layout-header></layout-header>
  <div v-if="archive" :style="`background-image: url(${mainImage})`"
    class="relative text-white bg-center bg-cover h-80">
    <div class="absolute top-0 left-0 w-full h-full bg-black/70"></div>
    <div class="absolute top-1/2 translate-y-[-50%] left-40">
      <div class="text-2xl font-black">
        <span class="text-primary">{{ archive.artist?.name }}</span> 생일 카페
      </div>
      <div class="archive-theme text-5xl font-black">
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
        <a :href="link" class="border-b border-gray-800">{{ archive.organizer }}</a>
      </div>
    </div>

    <div class="inline-block pt-20 pb-2 text-3xl font-bold border-b-2 border-black">포스터 및 특전 정보</div>

    <div class="my-8">
      <ImageSlide :modelValue="images" height="50rem" :editMode="false" />  
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, computed, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import { useArchiveStore } from '@/stores/archive';
import { Archive } from '@/types/Archive';
import ImageSlide from '@/components/common/imageSlide.vue';
import LayoutHeader from '@/layouts/LayoutHeader.vue';
import moment from 'moment';

const route = useRoute();
const archiveStore = useArchiveStore();

const archive: Ref<Archive | undefined> = ref();

/**
 * ====================
 * Archive View 관련 computed .. 
 * ====================
 */
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

onBeforeMount(() => {
  getArchive();
});

async function getArchive() {
  const id: string = route.params.id;
  try {
    const { data } = await archiveStore.getArchive(id);
    archive.value = (data.value.archive || {}) as Archive;
  } catch (error) { console.error(error); }
}

function numToTime(num: int): string {
  return num < 10 ? `0${num}` : num; 
}

</script>

<style scoped>
  @media screen and (max-width: 767px){
    .h-80 {
      height: 16rem;
    }

    .left-40 {
      left: 1.25rem;
    }

    .text-2xl {
      font-size: 1.25rem;
    }

    .archive-theme {
      /*
      width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      */
    }

    .text-5xl {
      font-size: 2rem;
    }

    .text-lg {
      font-size: 0.8rem;
    }

    .px-40 {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .pt-20 {
      padding-top: 3rem;
    }

    .text-3xl {
      font-size: 1.5rem;
    }

    .mt-11 {
      margin-top: 1rem;
    }

    .w-8 {
      width: 1.5rem;
    }

    .text-xl {
      font-size: 1rem;
      line-height: 0rem;
    }
  }
</style>