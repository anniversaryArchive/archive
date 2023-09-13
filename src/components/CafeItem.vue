<template>
  <q-item class="archive-item" clickable
    @click="onClickItem">
    <q-item-section>
      <div class="grid grid-flow-row-dense grid-cols-2">
        <q-item-label class="overflow-hidden leading-7 text-ellipsis whitespace-nowrap">{{archive.themeName}}</q-item-label>
        <q-button class="text-right" @click="onClickFavoriteIcon">
          <q-icon :name="`favorite${!archive.favorite && '_outline'}`"
            class="inline-block" />
        </q-button>
      </div>
      <q-item-label class="text-xs leading-5 text-[#767676]">{{archive.organizer}}</q-item-label>
      <q-item-label class="text-sm leading-6 text-[#767676]">{{archive.address}}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useQuasar } from 'quasar';
import { Archive } from '@/types/Archive';
import { mutate } from '@/composables/graphqlUtils';
import { useUserStore } from '@/stores/user';

import createFavorite from '@/graphql/createFavorite.mutate.gql';
import removeFavorite from '@/graphql/removeFavorite.mutate.gql';
import {useFavoriteArchiveStore} from '@/stores/favoriteArchive';

interface Props {
  archive: Archive;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['click']);

const $q = useQuasar();
const userStore = useUserStore();
const favoriteArchiveStore = useFavoriteArchiveStore();
const archive: ComputedRef<Archive> = computed(() => props.archive);

// 카페 아이템 클릭 시
function onClickItem() {
  emit('click');
}

// 즐겨찾기 아이콘 클릭 시, 즐겨찾기 여부를 확인하여 doCreateFavorite / doRemoveFavorite 함수를 호출해준다.
async function onClickFavoriteIcon() {
  // 로그인되어 있지 않은 경우, 경고 메세지를 띄워준다.
  if (!userStore.loggedIn) {
    $q.notify('즐겨찾기 기능은 로그인 시 이용 가능합니다.');
    return;
  }

  let success: any = false;
  try {
    if (archive.value.favorite) {
      success = favoriteArchiveStore.doRemoveFavorite(archive.value._id);
    } else {
      success = favoriteArchiveStore.doCreateFavorite(archive.value._id);
    }
    if (!success) { return; }
    props.archive.favorite = !props.archive.favorite;
  } catch (_) {}
}
</script>

<style scoped>

</style>
