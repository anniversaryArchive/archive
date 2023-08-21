<template>
  <div v-if="communicaitonBoard" class="flex flex-col justify-center h-full">
    <div class="flex flex-col w-4/5 p-6 m-auto bg-white rounded h-4/5">
      <div class="flex w-full">
        <div class="w-20 font-bold text-primary">{{communicaitonBoard.division}}</div>
        <div class="flex-1">
          <div>{{communicaitonBoard.title}}</div>
          <div class="flex mt-2 text-sm">
            <div class="text-gray-600">
              <div class="inline-block mr-4">{{communicaitonBoard.author.name}}</div>
              <div class="inline-block">{{communicaitonBoard.createdAt}}</div>
            </div>
            <div class="flex-1"></div>
            <div v-if="!editMode">
              <button class="hover:text-gray-800" @click="onClickEditBtn">수정</button>
              <span class="mx-2">|</span>
              <button class="hover:text-gray-800" @click="onClickDeleteBtn">삭제</button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 w-full py-5 pl-20 my-2 overflow-y-scroll leading-6 break-words border-t border-b border-gray-200">
        <textarea v-if="editMode" v-model="communicaitonBoard.content"
          class="w-full h-full p-4 border border-gray-200 rounded"></textarea>
        <div v-else v-html="communicaitonBoard.content.replaceAll('\n', '<br/>')">
        </div>
      </div>

      <div class="text-right">
        <tempalte v-if="editMode">
          <button class="px-8 py-2 mr-2 font-bold border border-gray-200 rounded hover:bg-gray-100"
            @click="onClickCancel">취소</button>
          <button class="px-8 py-2 font-bold text-white border rounded bg-primary/80 hover:bg-primary"
            @click="onClickSave">저장</button>
        </tempalte>
        <button v-else class="px-8 py-2 border border-gray-200 rounded hover:bg-gray-100"
          @click="goToTableView">목록</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, computed, ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { query, mutate } from '@/composables/graphqlUtils';
import { CommunicationBoard } from '@/types/CommnunicationBoard';

import getCommunicationBoard from '@/graphql/getCommunicationBoard.query.gql';
import patchCommunicationBoard from '@/graphql/patchCommunicationBoard.mutate.gql';
import removeCommunicationBoard from '@/graphql/removeCommunicationBoard.mutate.gql';

const router = useRouter();
const route = useRoute();

const communicaitonBoard: Ref<CommnunicationBoard | undefined> = ref();
const communicaitonBoardOrg: Ref<CommnunicationBoard | undefined> = ref();
const editMode: Ref<boolean> = ref(false);

onBeforeMount(() => {
  // const route = useRoute();
  const id: string = route.params.id || '';
  if (!id) { return router.replace('/communication-board'); }
  getData(id);
});

function getData(id: string) {
  query(getCommunicationBoard, { id }).then((resp) => {
    communicaitonBoard.value = resp.data?.value?.CommunicationBoard;
    communicaitonBoardOrg.value = JSON.parse(JSON.stringify(communicaitonBoard.value));
  });
}

function goToTableView() {
  const lastPath = router.options.history.state.back;
  if (lastPath === '/communication-board') {
    router.go(-1);
  } else {
    router.push('/communication-board');
  }
}

function onClickEditBtn() {
  editMode.value = true;
}

function onClickDeleteBtn() {
  const value: boolean = confirm('정말 삭제하시겠습니까?');
  if (!value) { return; }
  mutate(removeCommunicationBoard, { id: communicaitonBoard.value._id }).then((resp) => {
    if (resp.data.success) {
      goToTableView();
    } else {
      // TODO: 재시도 alert
    }
  });
}

function onClickCancel() {
  communicaitonBoard.value = JSON.parse(JSON.stringify(communicaitonBoardOrg.value));
  editMode.value = false;
}

function onClickSave() {
  const fields: string[] = ['division', 'title', 'content'];
  const input = {};
  for (const field of fields) { input[field] = communicaitonBoard.value[field]; }
  mutate(patchCommunicationBoard, { id: communicaitonBoard.value._id, input }).then((resp) => {
    if (resp.data.success) {
      communicaitonBoardOrg.value = JSON.parse(JSON.stringify(communicaitonBoard.value));
      editMode.value = false;
    } else {
      // TODO: 재시도 alert
    }
  });
}
</script>

<style scoped>

</style>