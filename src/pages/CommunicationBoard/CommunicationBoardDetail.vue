<template>
  <div v-if="communicaitonBoard" class="flex flex-col justify-center h-full">
    <div class="flex flex-col w-4/5 p-10 m-auto bg-white rounded h-4/5">
      <header class="flex pb-4 border-b border-gray-400">
        <div class="flex-1 text-2xl font-bold">소통창구</div>
      </header>

      <div class="flex w-full pt-4 pb-2">
        <div class="w-40 text-lg font-extrabold text-center text-primary">
          <q-select v-if="editMode" :model-value="communicaitonBoard.division"
            :options="divisionOptions"
            :option-label="opt => DIVISION_LABEL[opt]"
            @update:model-value="onChangeDivision"
            class="mr-4"></q-select>
          <span v-else>{{DIVISION_LABEL[communicaitonBoard.division]}}</span>
        </div>
        <div class="flex-1 text-base">
          <q-input v-if="editMode" type="text" v-model="communicaitonBoard.title"
            class="w-full h-full"
            placeholder="제목을 입력해주세요." />
          <div v-else>
            {{communicaitonBoard.title}}
          </div>
          <div v-if="!editMode" class="flex mt-2 text-sm">
            <div class="text-gray-600">
              <div class="inline-block mr-4">{{communicaitonBoard.author?.name}}</div>
              <div class="inline-block">
                {{ formatDate(communicaitonBoard.createdAt, 'YYYY.MM.DD HH:mm.ss') }}
              </div>
            </div>
            <div class="flex-1"></div>
            <div v-if="communicaitonBoard.author?._id === userId">
              <button class="hover:text-gray-800" @click="onClickEditBtn">수정</button>
              <span class="mx-2">|</span>
              <button class="hover:text-gray-800" @click="onClickDeleteBtn">삭제</button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 w-full py-5 pl-40 my-2 overflow-y-scroll leading-6 break-words border-t border-b border-gray-200">
        <!-- Content -->
        <div class="mb-2" :class="formData && editMode ? 'h-1/2' : 'h-full'">
          <textarea v-if="editMode" v-model="communicaitonBoard.content"
            placeholder="글 내용을 입력해주세요."
            class="w-full h-full p-4 border border-gray-200 rounded"></textarea>
          <div v-else v-html="communicaitonBoard.content.replaceAll('\n', '<br/>')"></div>
        </div>

        <!-- 제안 Form -->
        <div v-if="formData && proposalData" class="p-4 mt-6 border border-gray-300 rounded"
          :class="editMode ? '' : 'overflow-y-scroll'">
          <div v-for="field in formData" class="mb-2">
            <div class="mb-1 font-bold">
              {{field.label}}
              <span v-if="field.type === 'objectList'">
                ({{ proposalData[field.key]?.length || 0 }})
              </span>
              <span v-if="editMode && field.required" class="ml-2 text-red-700">*</span>
            </div>

            <CustomInput v-model="proposalData[field.key]"
              :field="field" :disabled="!editMode" />
          </div>
        </div>
      </div>

      <div class="text-right">
        <template v-if="editMode">
          <button class="px-8 py-2 mr-2 font-bold border border-gray-200 rounded hover:bg-gray-100"
            @click="onClickCancel">취소</button>
          <button class="px-8 py-2 font-bold text-white border rounded bg-primary/80 hover:bg-primary"
            @click="onClickSave">저장</button>
        </template>
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
import _ from 'lodash';
import { query, mutate } from '@/composables/graphqlUtils';
import { CommunicationBoard } from '@/types/CommnunicationBoard';
import { useUserStore } from '@/stores/user';
import { DIVISION_LABEL, DATA_FORM } from './data';
import CustomInput from './components/CustomInput.vue';
import { formatDate } from '@/composables/formatDate';

import getCommunicationBoard from '@/graphql/getCommunicationBoard.query.gql';
import createCommunicationBoard from '@/graphql/createCommunicationBoard.mutate.gql';
import patchCommunicationBoard from '@/graphql/patchCommunicationBoard.mutate.gql';
import removeCommunicationBoard from '@/graphql/removeCommunicationBoard.mutate.gql';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const userStore = useUserStore();

const userId: ComputedRef<string | undefined> = computed(() => userStore.id);

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
  // 로그인하지 않은 유저가 게시글 생성으로 접근한 경우, notify를 띄워주고 소통창구 table view로 되돌려보낸다.
  if (id === 'create' && !userStore.loggedIn) {
    $q.notify(`게시글 작성은 로그인한 유저만 가능합니다.`);
    return goToTableView();
  }
  getData(id);
});

function getData(id: string) {
  if (id === 'create') {
    createMode.value = editMode.value = true;
    communicaitonBoard.value = { division: 'notice' } as CommunicationBoard;
    communicaitonBoardOrg.value = _.cloneDeep(communicaitonBoard.value);
    return;
  }
  query(getCommunicationBoard, { id }).then((resp) => {
    const data = resp.data?.value?.CommunicationBoard;
    if (!data) {
      $q.notify('존재하지 않는 게시글입니다.');
      return goToTableView();
    }
    communicaitonBoard.value = _.cloneDeep(resp.data?.value?.CommunicationBoard);
    communicaitonBoard.value.data = communicaitonBoard.value.data || {};
    communicaitonBoardOrg.value = _.cloneDeep(communicaitonBoard.value);
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
    } else { $q.notify('삭제에 실패했습니다. 다시 시도해주세요.'); }
  });
}

function onClickCancel() {
  if (createMode.value) { return goToTableView(); }
  communicaitonBoard.value = _.cloneDeep(communicaitonBoardOrg.value);
  editMode.value = false;
}

function checkRequiredFields(fields: any, data: any): boolean {
  for (const field of fields) {
    if (field.type === 'objectList') {
      if (!data[field.key]) { return !field.required; }
      for (const object of data[field.key]) {
        if (!checkRequiredFields(field.objectFields, object)) { return false; }
      }
    }
    if (!field.required) {
      data[field.key] = data[field.key] || field.default;
    } else if (!data[field.key]) {
      $q.notify(`${field.label}은 필수입니다.`);
      return false;
    }
  }
  return true;
}

function checkRequired(): boolean {
  if (!communicaitonBoard.value.title) {
    $q.notify('제목은 필수입니다.');
    return false;
  }
  if (!formData.value) { return true; }
  if (!proposalData.value) { return false; }

  return checkRequiredFields(formData.value, proposalData.value);
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

function getInputFields(fields: any, data: any) {
  const input = {};

  for (const field of fields) {
    const { key } = field;
    if (!data[key]) { continue; }

    switch (field.type) {
      case 'image': case 'select':
        input[key] = data[key]._id;
        break;
      case 'objectList':
        input[key] = [];
        for (const object of data) {
          input[key].push(getInputFields(field.objectFields, object));
        }
        break;
      default:
        input[key] = data[key];
    }
  }
  return input;
}

function getInput() {
  const fields: string[] = ['division', 'title', 'content'];
  const input = {};
  for (const field of fields) { input[field] = communicaitonBoard.value[field]; }
  if (formData.value) {
    const { division } = communicaitonBoard.value;

    input[division] = getInputFields(formData.value, proposalData.value);
  }
  if (createMode.value) {
    input.status = formData.value ? 'request' : 'none';
  }
  return input;
}

async function onClickSave() {
  if (!checkRequired()) { return; }

  try {
    await uploadFiles();
  } catch (error) { console.log('error : ', error); }

  const fields: string[] = ['division', 'title', 'content'];
  const input = getInput();
  const variables = { id: communicaitonBoard.value._id, input };
  mutate(createMode.value ? createCommunicationBoard : patchCommunicationBoard, variables).then((resp) => {
    const data = resp.data[createMode.value ? 'communicationBoard' : 'success'];
    if (data) {
      if (createMode.value) { communicaitonBoard.value = _.cloneDeep(data); }
      communicaitonBoardOrg.value = _.cloneDeep(communicaitonBoardOrg.value);
      editMode.value = false;
    } else { $q.notify('저장에 실패했습니다. 다시 시도해주세요.'); }
  });
}
</script>

<style scoped>

</style>