<template>
  <div class="flex h-full bg-primary"> 
    <div class="flex w-9/12 m-auto h-4/5">
      <div class="flex flex-col justify-center text-white">
        <div class="mb-6 text-6xl font-bold">ARCHIVE</div>
        <div class="mr-12 text-4xl font-semibold">
          원하는 아티스트의 생일 카페<br/>
          정보를 쉽게 찾아보세요.
        </div>

        <div class="mt-4 mb-2 text-xl">그룹을 검색하세요.</div>

        <div>
          <input type="search" placeholder="검색할 그룹을 입력해주세요."
            class="px-2 py-3 text-xl text-black rounded w-80"
            v-model="searchText" @search="doSearch" />
        </div>
      </div>
      <div class="flex-1 p-12 bg-white rounded-lg">
        <q-scroll-area :delay="1200" style="height: 100%;">
          <div class="grid grid-cols-1 grid-cols-2 gap-x-2 gap-y-6 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
            <div v-for="group in groups" class="text-center" @click="onClickGroup(group)">
              <template v-if="group.logo">
                <img :src="group.logo.path"
                  class="w-24 h-24 m-auto border border-gray-300 border-solid rounded-full cursor-pointer min-w-[6rem] min-h-[6rem]" />
              </template>
              <div class="mt-2 text-base text-gray-500">
                {{ group.name }}
              </div>
            </div>
          </div>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref } from 'vue';
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group';
import { useArchiveStore } from '@/stores/archive';
import { Group } from '@/types/Group';

const router = useRouter();

const groupStore = useGroupStore();
const archiveStore = useArchiveStore();

const groups: Ref<Group[]> = ref([]);
const searchText: Ref<string> = ref('');

onBeforeMount(() => {
  getGroups();
});

function getGroups() {
  const variables: Record<string, any> = { filter: {} };
  if (searchText.value) {
    variables.filter.fields = ['name', 'englishName'];
    variables.filter.q = searchText.value;
  }

  groupStore.getGroupsQuery(variables).then((result) => {
    groups.value = result.data.value?.groups?.data || [];
  });
}

function doSearch() {
  getGroups();
}

function onClickGroup(group: Group) {
  archiveStore.setGroup(group);
  router.push('/cafeMap');
}

</script>

<style scoped>

</style>