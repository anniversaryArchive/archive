<template>
  <div v-if="communicaitonBoard" class="flex flex-col justify-center h-full">
    <div class="flex flex-col w-4/5 p-6 m-auto bg-white rounded h-4/5">
      <div class="flex w-full">
        <div class="w-20 font-bold text-primary">{{communicaitonBoard.division}}</div>
        <div class="flex-1">
          <div>{{communicaitonBoard.title}}</div>
          <div class="mt-2 text-sm text-gray-600">
            <div class="inline-block mr-4">{{communicaitonBoard.author.name}}</div>
            <div class="inline-block">{{communicaitonBoard.createdAt}}</div>
          </div>
        </div>
      </div>

      <div class="flex-1 w-full py-5 pl-20 my-2 overflow-y-scroll leading-6 break-words border-t border-b border-gray-200">
        {{ communicaitonBoard.content }}
      </div>

      <div class="text-right">
        <button class="px-8 py-2 border border-gray-200 rounded hover:bg-gray-100"
          @click="onClickTable">목록</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, computed, ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { query } from '@/composables/graphqlUtils';
import { CommunicationBoard } from '@/types/CommnunicationBoard';

import getCommunicationBoard from '@/graphql/getCommunicationBoard.query.gql';

const communicaitonBoard: Ref<CommnunicationBoard | undefined> = ref();

onBeforeMount(() => {
  const route = useRoute();
  const id: string = route.params.id || '';
  if (!id) { return router.replace('/communicationBoards'); }
  getData(id);
});

function getData(id: string) {
  query(getCommunicationBoard, { id }).then((resp) => {
    communicaitonBoard.value = resp.data?.value?.CommunicationBoard;
  });
}

function onClickTable() {
  const router = useRouter();
  router.replace('/communicationBoard')
}


</script>

<style scoped>

</style>