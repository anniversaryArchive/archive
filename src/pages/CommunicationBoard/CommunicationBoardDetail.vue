<template>
  <div v-if="communicaitonBoard" class="flex flex-col justify-center h-full">
    <div class="flex flex-col w-4/5 p-6 m-auto bg-white rounded h-4/5">
      <div class="flex w-full">
        <div class="w-20 font-bold text-primary">
          <q-select v-if="editMode" :model-value="communicaitonBoard.division"
            :options="divisionOptions"
            :option-label="opt => DIVISION_LABEL[opt]"
            @update:model-value="onChangeDivision"></q-select>
          <span v-else>{{DIVISION_LABEL[communicaitonBoard.division]}}</span>
        </div>
        <div class="flex-1">
          <input v-if="editMode" type="text" v-model="communicaitonBoard.title"
            class="w-full h-full px-2 py-1 border border-gray-200 rounded" />
          <div v-else>
            {{communicaitonBoard.title}}
          </div>
          <div v-if="!editMode" class="flex mt-2 text-sm">
            <div class="text-gray-600">
              <div class="inline-block mr-4">{{communicaitonBoard.author?.name}}</div>
              <div class="inline-block">{{communicaitonBoard.createdAt}}</div>
            </div>
            <div class="flex-1"></div>
            <div>
              <button class="hover:text-gray-800" @click="onClickEditBtn">수정</button>
              <span class="mx-2">|</span>
              <button class="hover:text-gray-800" @click="onClickDeleteBtn">삭제</button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 w-full py-5 pl-20 my-2 overflow-y-scroll leading-6 break-words border-t border-b border-gray-200">
        <textarea v-if="editMode" v-model="communicaitonBoard.content"
          class="w-full p-4 border border-gray-200 rounded"
          :class="formData ? 'h-1/2' : 'h-full'"></textarea>
        <div v-else v-html="communicaitonBoard.content.replaceAll('\n', '<br/>')"></div>
        <div v-if="formData && proposalData" class="h-1/2">
          <div v-for="field in formData" class="mb-2">
            <div class="mb-1 font-bold">
              {{field.label}}
              <span v-if="field.required" class="ml-2 text-red-700">*</span>
            </div>
            <q-input v-if="field.type === 'text'" v-model="proposalData[field.key]"
              :placeholder="field.label" class="w-full" />
            <q-input v-else-if="field.type === 'date'" type="date"
              v-model="proposalData[field.key]" />
            <q-file v-else-if="field.type === 'image'" name="data_file"
              v-model="proposalData[field.key]" filled :label="field.label" />
            <q-input v-else-if="field.type === 'color'"
              filled v-model="proposalData[field.key]" :rules="['anyColor']">
              <template v-slot:append>
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-color v-model="proposalData[field.key]" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
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
import { useQuasar } from 'quasar';
import axios from 'axios';
import { query, mutate } from '@/composables/graphqlUtils';
import { CommunicationBoard } from '@/types/CommnunicationBoard';
import { DIVISION_LABEL, DATA_FORM } from './data';

import getCommunicationBoard from '@/graphql/getCommunicationBoard.query.gql';
import createCommunicationBoard from '@/graphql/createCommunicationBoard.mutate.gql';
import patchCommunicationBoard from '@/graphql/patchCommunicationBoard.mutate.gql';
import removeCommunicationBoard from '@/graphql/removeCommunicationBoard.mutate.gql';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const communicaitonBoard: Ref<CommnunicationBoard | undefined> = ref();
const communicaitonBoardOrg: Ref<CommnunicationBoard | undefined> = ref();

const createMode: Ref<boolean> = ref(false);
const editMode: Ref<boolean> = ref(false);

const divisionOptions: ComputedRef<string[]> = computed(() => Object.keys(DIVISION_LABEL));
const formData: ComputedRef<Record<string, any>[] | undefined | null> = computed(() => {
  if (!communicaitonBoard.value?.division) { return null; }
  return DATA_FORM[communicaitonBoard.value.division];
});
const proposalData: ComputedRef<Record<string, any> | undefined> = computed(() => {
  return communicaitonBoard.value && communicaitonBoard.value.data;
});

onBeforeMount(() => {
  const id: string = route.params.id || '';
  if (!id) { return router.replace('/communication-board'); }
  getData(id);
});

function getData(id: string) {
  if (id === 'create') {
    createMode.value = editMode.value = true;
    communicaitonBoard.value = { division: 'notice' } as CommunicationBoard;
    communicaitonBoardOrg.value = JSON.parse(JSON.stringify(communicaitonBoard.value));
    return;
  }
  query(getCommunicationBoard, { id }).then((resp) => {
    // TODO: 데이터가 없는 경우
    communicaitonBoard.value = resp.data?.value?.CommunicationBoard;
    communicaitonBoard.value.data = communicaitonBoard.value.data || {};
    communicaitonBoardOrg.value = JSON.parse(JSON.stringify(communicaitonBoard.value));
  });
}

function onChangeDivision(event) {
  communicaitonBoard.value.data = {};
  communicaitonBoard.value.division = event;
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

function checkRequiredFields(): boolean {
  if (!communicaitonBoard.value.title) {
    $q.notify('제목은 필수입니다.');
    return false;
  }
  if (!formData.value) { return true; }
  if (!proposalData.value) { return false; }

  for (const field of formData.value) {
    if (!field.required) {
      proposalData.value[field.key] = proposalData.value[field.key] || field.default;
    } else if (!proposalData.value[field.key]) {
      $q.notify(`${field.label}은 필수입니다.`);
      return false;
    }
  }
  return true;
}

async function uploadFiles(): Promise<boolean> {
  if (!proposalData.value || !formData.value) { return; }
  try {
    const promises = formData.value.reduce((acc, field) => {
      if (field.type !== 'image') { return acc; }
      const file = proposalData.value[field.key];
      if (!file || file._id) { return acc; }
      const formData: FormData = new FormData();
      formData.append('file', file);
      acc.push(axios.post(`http://localhost:3000/file`, formData, {}).then((response) => {
        const fileData = response.data?.data && response.data.data;
        if (fileData) {
          proposalData.value[field.key] = fileData;
          return true;
        }
        return false;
      }));
      return acc;
    }, []);

    const result = await Promise.all(promises);
    return true;
  } catch (error) { throw error; }
  return false;
}

function getInput() {
  const fields: string[] = ['division', 'title', 'content'];
  const input = {};
  for (const field of fields) { input[field] = communicaitonBoard.value[field]; }
  if (formData.value) {
    input[communicaitonBoard.value.division] = {};
    for (const field of formData.value) {
      if (!proposalData.value[field.key]) { continue; }
      input[communicaitonBoard.value.division][field.key] = field.type === 'image' ? proposalData.value[field.key]._id : proposalData.value[field.key];
    }
  }
  return input;
}

async function onClickSave() {
  if (!checkRequiredFields()) { return; }

  // TODO: 파일 업로드
  try {
    await uploadFiles();
  } catch (error) { console.log('error : ', error); }

  const fields: string[] = ['division', 'title', 'content'];
  const input = getInput();
  console.log('chloe test input : ', input);
  const variables = { id: communicaitonBoard.value._id, input };
  mutate(createMode.value ? createCommunicationBoard : patchCommunicationBoard, variables).then((resp) => {
    if (resp.data[createMode.value ? 'communicationBoard' : 'success']) {
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