<template>
  <div
    v-if="archive"
    :style="`background-image: url(${mainImage})`"
    class="relative text-white bg-center bg-cover h-96 sm:h-80"
  >
    <div class="absolute top-0 left-0 w-full h-full bg-black/70"></div>
    <div
      class="absolute top-1/2 translate-y-[-50%] translate-x-[-50%] left-[50%] w-[90%] md:w-auto md:left-28 md:translate-x-0 text-center md:!text-left"
    >
      <!-- 아티스트 명 + 생일 카페 -->
      <div class="text-2xl font-black">
        <span class="text-primary">{{ archive.artist?.name }}</span>
        <span>&nbsp;생일 카페</span>
      </div>

      <!-- 카페 테마 명 -->
      <div class="mt-2 mb-3 font-black archive-theme">
        <div class="inline-block text-5xl align-middle">
          {{ archive.themeName }}
        </div>
      </div>

      <!-- 주최자 -->
      <div class="text-[#D9D9D980] text-lg mb-3">{{ archive.organizer }}</div>

      <!-- 해시태그 : 지역, 아티스트, 실제 카페 명 -->
      <div>
        <!-- 그룹명 -->
        <div :class="classes.hashtag">#{{ archive.group?.name }}</div>
        <!-- 아티스트 -->
        <div :class="classes.hashtag">#{{ archive.artist?.name }}</div>
        <!-- 실제 카페 명 -->
        <div :class="classes.hashtag" class="!mr-0">#{{ archive.name }}</div>
      </div>
    </div>
    <!-- 즐겨찾기 버튼 -->
    <span
      class="absolute bottom-10 left-[50%] md:left-auto translate-x-[-50%] md:translate-x-0 md:right-14 inline-block w-10 h-10 mr-2 text-xl md:text-3xl text-left align-middle rounded-full cursor-pointer"
      @click="onClickFavoriteIcon"
    >
      <q-icon v-if="archive.favorite" name="favorite" class="!inline m-auto text-primary !text-5xl" />
      <q-icon v-else name="favorite_outline" class="!inline m-auto text-primary !text-5xl" />
    </span>
  </div>

  <div class="px-6 md:px-28">
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
        <a :href="`https://map.naver.com/v5/search/${archive.address}`" class="border-b border-gray-800">
          {{ archive.address }} {{ archive.detailAddress }}
        </a>
      </div>

      <div class="my-3">
        <span class="inline-block w-8">
          <img src="@/assets/twitter.svg" class="w-5" />
        </span>
        <a :href="link" class="leading-5 break-words border-b border-gray-800">{{ link }}</a>
      </div>
    </div>

    <div class="inline-block pt-20 pb-2 text-3xl font-bold border-b-2 border-black">포스터 및 특전 정보</div>

    <div class="pb-20 mt-4">
      <ImageSlide :modelValue="images" :editMode="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, computed, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import { useArchiveStore } from '@/stores/archive';
import { useUserStore } from '@/stores/user';
import { useFavoriteArchiveStore } from '@/stores/favoriteArchive';
import { Archive } from '@/types/Archive';
import { Image } from '@/types/Image';
import ImageSlide from '@/components/common/imageSlide.vue';
import LayoutHeader from '@/layouts/LayoutHeader.vue';
import moment from 'moment';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const archiveStore = useArchiveStore();
const favoriteArchiveStore = useFavoriteArchiveStore();
const userStore = useUserStore();

const archive: Ref<Archive | undefined> = ref();

const classes: Record<string, string> = {
  hashtag: 'inline-block px-3 py-1 mr-2 bg-[#D9D9D980] text-white rounded-full',
};

/**
 * ====================
 * Archive View 관련 computed ..
 * ====================
 */
const mainImage: ComputedRef<string | undefined | null> = computed(() => {
  return archive.value?.mainImage?.hasOwnProperty('path') ? (archive.value.mainImage as Image).path : null;
});
const startDate: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value) return;
  return moment(archive.value.startDate).format('YYYY-MM-DD');
});
const endDate: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value) return;
  return moment(archive.value.endDate).format('YYYY-MM-DD');
});
const openTime: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value?.openTime) return;
  const { hour, minute } = archive.value.openTime;
  return `${numToTime(hour)}:${numToTime(minute)}`;
});
const closeTime: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value?.closeTime) return;
  const { hour, minute } = archive.value.closeTime;
  return `${numToTime(hour)}:${numToTime(minute)}`;
});
const organizerLink: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value?.organizer) return;
  const organizer = archive.value.organizer.replace('@', '');
  return `https://twitter.com/${organizer}`;
});
const link: ComputedRef<string | undefined> = computed(() => {
  if (!archive.value?.link) return;
  const index: number = archive.value.link.indexOf('?');
  if (index === -1) {
    return archive.value.link;
  }
  return archive.value.link.slice(0, index);
});
const images: ComputedRef<Record<string, any>[]> = computed(() => {
  if (!archive.value) return [];
  return [archive.value.mainImage, ...(archive.value.images || [])];
});

onBeforeMount(() => {
  getArchive();
});

async function getArchive() {
  const id: string = String(route.params.id);
  try {
    const { data } = await archiveStore.getArchive(id);
    archive.value = (data.value.archive || {}) as Archive;
  } catch (error) {
    console.error(error);
  }
}

function numToTime(num: number): string {
  return num < 10 ? `0${num}` : String(num);
}

async function onClickFavoriteIcon() {
  // 로그인되어 있지 않은 경우, 경고 메세지를 띄워준다.
  if (!userStore.loggedIn) return $q.notify('즐겨찾기 기능은 로그인 시 이용 가능합니다.');

  let success: any = false;
  try {
    if (archive.value!.favorite) {
      success = await favoriteArchiveStore.doRemoveFavorite(archive.value!._id);
    } else {
      success = await favoriteArchiveStore.doCreateFavorite(archive.value!._id);
    }
    if (!success) return;
    archive.value!.favorite = !archive.value!.favorite;
  } catch (_) {}
}
</script>

<style scoped></style>
