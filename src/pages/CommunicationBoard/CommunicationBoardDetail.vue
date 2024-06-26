<template>
  <div v-if="communicaitonBoard" class="flex flex-col justify-center h-full">
    <div class="flex flex-col w-4/5 p-10 m-auto bg-white rounded h-4/5">
      <header class="flex pb-4 border-b border-gray-400">
        <div class="flex-1 text-2xl font-bold">소통창구</div>
      </header>

      <div class="flex w-full pt-4 pb-2">
        <!-- 구분 -->
        <div class="w-40 text-lg font-extrabold text-center text-primary">
          <q-select
            v-if="editMode"
            :model-value="communicaitonBoard.division"
            :options="divisionOptions"
            :option-label="(opt: CommunicationBoardDivision) => DIVISION_LABEL[opt]"
            @update:model-value="onChangeDivision"
            class="mr-4"
          ></q-select>
          <span v-else>{{ DIVISION_LABEL[communicaitonBoard.division] }}</span>

          <div
            class="mt-1 text-sm font-bold"
            :class="{
              'text-primary': communicaitonBoard.status === 'accept',
              'text-red-600': communicaitonBoard.status === 'reject',
              'text-green-600': communicaitonBoard.status === 'request',
            }"
          >
            {{ STATUS_LABEL[communicaitonBoard.status] }}
          </div>
        </div>

        <div class="flex-1 text-base">
          <!-- 제목 -->
          <q-input
            v-if="editMode"
            type="text"
            v-model="communicaitonBoard.title"
            class="w-full h-full"
            placeholder="제목을 입력해주세요."
          />
          <div v-else>
            {{ communicaitonBoard.title }}
          </div>

          <!-- 정보 -->
          <div v-if="!editMode" class="flex mt-2 text-sm">
            <div class="text-gray-600">
              <div class="inline-block mr-4">{{ communicaitonBoard.author?.name }}</div>
              <div class="inline-block">
                {{ formatDate(communicaitonBoard.createdAt) }}
              </div>
            </div>
            <div class="flex-1"></div>
            <!-- 수정 | 삭제 -->
            <div v-if="isAuthor">
              <button class="hover:text-gray-800" @click="onClickEditBtn">수정</button>
              <span class="mx-2">|</span>
              <button class="hover:text-gray-800" @click="onClickDeleteBtn">삭제</button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex-1 w-full py-5 pl-40 my-2 overflow-y-scroll leading-6 break-words border-t border-b border-gray-200"
      >
        <!-- Content -->
        <div class="mb-2" :class="editMode ? (formFields ? 'h-1/2' : 'h-full') : ''">
          <textarea
            v-if="editMode"
            v-model="communicaitonBoard.content"
            placeholder="글 내용을 입력해주세요."
            class="w-full h-full p-4 border border-gray-200 rounded"
          ></textarea>
          <div
            v-else-if="communicaitonBoard.content"
            v-html="communicaitonBoard.content.replaceAll('\n', '<br/>')"
          ></div>
        </div>

        <!-- 제안 Form -->
        <div
          v-if="formFields && proposalData"
          class="p-4 mt-6 border border-gray-300 rounded"
          :class="editMode ? '' : 'overflow-y-scroll'"
        >
          <div v-for="field in formFields" class="mb-2">
            <template v-if="!field.hidden">
              <div class="mb-1 font-bold">
                {{ field.label }}
                <span v-if="field.type === 'objectList'"> ({{ proposalData[field.key]?.length || 0 }}) </span>
                <span v-if="editMode && field.required" class="ml-2 text-red-700">*</span>
              </div>

              <template v-if="!field.parent || proposalData[field.parent]">
                <CustomInput
                  v-model="proposalData[field.key]"
                  :field="field"
                  :disabled="!editMode"
                  :parent="field.parent && proposalData[field.parent]"
                  @updateAddress="onUpdateAddress"
                />
              </template>
            </template>
          </div>
        </div>
      </div>

      <!-- 현재 계정이 관리자 계정이면서, 해당 게시글의 상태가 제안인 경우 -->
      <div v-if="isAdmin && communicaitonBoard.status === 'request'" class="flex my-4">
        <input
          type="text"
          class="flex-1 px-2 py-1 mr-2 border rounded"
          placeholder="메시지"
          v-model="communicaitonBoard.message"
        />
        <button
          @click="onClickAcceptBtn"
          class="px-4 py-1 mr-2 font-bold text-white rounded bg-primary/80 hover:bg-primary"
        >
          승인
        </button>
        <button @click="onClickRejectBtn" class="px-4 py-1 font-bold text-white bg-red-600 rounded hover:bg-red-800">
          거절
        </button>
      </div>

      <div v-if="communicaitonBoard.status !== 'request' && communicaitonBoard.message" class="flex my-4">
        <div class="self-center w-40 font-bold text-gray-800 border-r border-gray-400">
          관리자 {{ STATUS_LABEL[communicaitonBoard.status] }} 메세지
        </div>
        <div class="flex-1 px-4 py-2 ml-4 border border-gray-200 rounded">{{ communicaitonBoard.message }}</div>
      </div>

      <div class="text-right">
        <template v-if="editMode">
          <button
            class="px-8 py-2 mr-2 font-bold border border-gray-200 rounded hover:bg-gray-100"
            @click="onClickCancel"
          >
            취소
          </button>
          <button
            class="px-8 py-2 font-bold text-white border rounded bg-primary/80 hover:bg-primary"
            @click="onClickSave"
          >
            저장
          </button>
        </template>
        <template v-else>
          <button
            v-if="isAuthor && communicaitonBoard.status === 'reject'"
            class="px-8 py-2 mr-2 border rounded border-primary text-primary/80 hover:bg-primary hover:text-white"
            @click="onClickReRequestBtn"
          >
            재요청
          </button>
          <button class="px-8 py-2 border border-gray-200 rounded hover:bg-gray-100" @click="goToTableView">
            목록
          </button>
        </template>
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
import { CommunicationBoard, CommunicationBoardDivision } from '@/types/CommunicationBoard';
import { useUserStore } from '@/stores/user';
import { DIVISION_LABEL, DATA_FORM, STATUS_LABEL, Field } from './data';
import CustomInput from './components/CustomInput.vue';
import { formatDate } from '@/composables/formatDate';
import { getLatLng } from '@/composables/addressUtils';

import getCommunicationBoard from '@/graphql/getCommunicationBoard.query.gql';
import createCommunicationBoard from '@/graphql/createCommunicationBoard.mutate.gql';
import patchCommunicationBoard from '@/graphql/patchCommunicationBoard.mutate.gql';
import removeCommunicationBoard from '@/graphql/removeCommunicationBoard.mutate.gql';
import acceptCommunicationBoard from '@/graphql/acceptCommunicationBoard.mutate.gql';
import rejectCommunicationBoard from '@/graphql/rejectCommunicationBoard.mutate.gql';
import reRequestCommunicationBoard from '@/graphql/reRequestCommunicationBoard.mutate.gql';
import { VueDaumPostcodeCompleteResult } from 'vue-daum-postcode';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const userStore = useUserStore();

const isAdmin: ComputedRef<boolean> = computed(() => userStore.isAdmin);
const isAuthor: ComputedRef<boolean> = computed(() => communicaitonBoard.value?.author?._id === userStore.id);

const communicaitonBoard: Ref<CommunicationBoard | undefined> = ref();
const communicaitonBoardOrg: Ref<CommunicationBoard | undefined> = ref();

const createMode: Ref<boolean> = ref(false);
const editMode: Ref<boolean> = ref(false);

const divisionOptions: ComputedRef<CommunicationBoardDivision[]> = computed(
  () => Object.keys(DIVISION_LABEL) as CommunicationBoardDivision[],
);
const formFields: ComputedRef<Field[] | undefined> = computed(() => {
  return communicaitonBoard.value?.division && DATA_FORM[communicaitonBoard.value.division];
});
const proposalData: ComputedRef<Record<string, any> | undefined> = computed(() => {
  return communicaitonBoard.value?.data;
});

onBeforeMount(() => {
  const id: string = String(route.params.id);
  // 로그인하지 않은 유저가 게시글 생성으로 접근한 경우, notify를 띄워주고 소통창구 table view로 되돌려보낸다.
  if (id === 'create' && !userStore.loggedIn) {
    $q.notify(`게시글 작성은 로그인한 유저만 가능합니다.`);
    return goToTableView();
  }
  getData(id);
});

function setCommunicationBoardData(data: CommunicationBoard | undefined) {
  communicaitonBoard.value = _.cloneDeep(data || ({} as CommunicationBoard));
  communicaitonBoard.value.data = communicaitonBoard.value.data || {};
  communicaitonBoardOrg.value = _.cloneDeep(communicaitonBoard.value);
}

// 소통창구 게시글 가져오는 함수
function getData(id: string) {
  // 생성인 경우
  if (id === 'create') {
    createMode.value = editMode.value = true;
    setCommunicationBoardData({ division: 'notice' } as CommunicationBoard);
    return;
  }

  query(getCommunicationBoard, { id }, false).then(resp => {
    const data = resp.data?.value?.CommunicationBoard;
    if (!data) {
      $q.notify('존재하지 않는 게시글입니다.');
      return goToTableView();
    }
    setCommunicationBoardData(resp.data?.value?.CommunicationBoard);
  });
}

// 구분 변경 시
function onChangeDivision(event: CommunicationBoardDivision) {
  communicaitonBoard.value!.data = {};
  communicaitonBoard.value!.division = event;
}

// 주소 변경 시
function onUpdateAddress({ address, sido }: VueDaumPostcodeCompleteResult) {
  proposalData.value!.address = address;
  proposalData.value!.districtName = sido;
}

// 소통창구 테이블 화면으로 되돌아가기
function goToTableView() {
  const lastPath = router.options.history.state.back;
  if (lastPath === '/communication-board') {
    router.go(-1);
  } else {
    router.push('/communication-board');
  }
}

// 수정 버튼 클릭 시
function onClickEditBtn() {
  editMode.value = true;
}

// 삭제 버튼 클릭 시
function onClickDeleteBtn() {
  if (!communicaitonBoard.value) return;
  const value: boolean = confirm('정말 삭제하시겠습니까?');
  if (!value) return;
  mutate(removeCommunicationBoard, { id: communicaitonBoard.value._id }).then(resp => {
    if (resp.data.success) {
      goToTableView();
    } else {
      $q.notify('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  });
}

// 취소 버튼 클릭 시
function onClickCancel() {
  if (createMode.value) return goToTableView();
  communicaitonBoard.value = _.cloneDeep(communicaitonBoardOrg.value);
  editMode.value = false;
}

function checkRequiredFields(fields: any, data: any): boolean {
  for (const field of fields) {
    if (field.type === 'objectList') {
      if (!data[field.key]) return !field.required;
      for (const object of data[field.key]) {
        if (!checkRequiredFields(field.objectFields, object)) {
          return false;
        }
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

// 필수 필드 모두 입력됐는 지 확인
function checkRequired(): boolean {
  if (!communicaitonBoard.value?.title) {
    $q.notify('제목은 필수입니다.');
    return false;
  }
  if (!formFields.value) return true;
  if (!proposalData.value) return false;
  return checkRequiredFields(formFields.value, proposalData.value);
}

function uploadImage(field: Field, file: any, index?: number): Promise<boolean> {
  const formData: FormData = new FormData();
  formData.append('file', file);
  return axios.post(`${import.meta.env.VITE_API_URL}/file`, formData, {}).then(response => {
    const fileData = response.data?.data && response.data.data;
    if (proposalData.value && fileData) {
      if (field.type === 'images' && index) {
        proposalData.value[field.key][index] = fileData;
      } else {
        proposalData.value[field.key] = fileData;
      }
      return true;
    }
    return false;
  });
}

// 파일 업로드
async function uploadFiles(): Promise<boolean> {
  if (!proposalData.value || !formFields.value) return true;
  try {
    const promises: Promise<boolean>[] = formFields.value.reduce((acc: Promise<boolean>[], field: Field) => {
      if (field.type === 'images' && proposalData.value![field.key]) {
        for (let index = 0; index < proposalData.value![field.key].length; index++) {
          const file = proposalData.value![field.key][index];
          if (!file || file._id) continue;
          acc.push(uploadImage(field, file, index));
        }
      }
      if (field.type !== 'image') return acc;

      const file = proposalData.value![field.key];
      if (!file || file._id) return acc;
      acc.push(uploadImage(field, file));
      return acc;
    }, []);
    await Promise.all(promises);
    return true;
  } catch (error) {
    throw error;
  }
}

function getInputFields(fields: any, data: any) {
  const input: Record<string, any> = {};

  for (const field of fields) {
    const { key } = field;
    if (!data[key]) continue;

    switch (field.type) {
      case 'image':
      case 'select':
        input[key] = data[key]._id;
        break;
      case 'images':
        input[key] = data[key] && data[key].map((d: any) => d._id);
        break;
      case 'objectList':
        input[key] = [];
        for (const object of data[key]) {
          input[key].push(getInputFields(field.objectFields, object));
        }
        break;
      default:
        input[key] = data[key];
    }
  }
  return input;
}

// mutation varialbes로 보낼 input 반환하는 함수
function getInput(): Record<string, any> {
  if (!communicaitonBoard.value) return {};
  const fields: string[] = ['division', 'title', 'content'];
  const input: Record<string, any> = {};
  for (const field of fields) {
    input[field] = communicaitonBoard.value[field];
  }
  if (formFields.value) {
    const { division } = communicaitonBoard.value;
    input[division] = getInputFields(formFields.value, proposalData.value);
  }
  if (createMode.value) {
    input.status = formFields.value ? 'request' : 'none';
  }
  return input;
}

// 저장 버튼 클릭 시
async function onClickSave() {
  if (!communicaitonBoard.value || !checkRequired()) return;

  try {
    await uploadFiles();
  } catch (error) {
    console.error('error : ', error);
  }

  const input: Record<string, any> = getInput();

  // 아카이브인 경우 address의 lat, lng 계산을 해줘야한다.
  if (input.division === 'archive' && input.archive) {
    try {
      const { lat, lng } = await getLatLng(input.archive!.address);
      input.archive.lat = lat;
      input.archive.lng = lng;
    } catch (_) {}
  }

  const variables = { id: communicaitonBoard.value!._id, input };
  mutate(createMode.value ? createCommunicationBoard : patchCommunicationBoard, variables).then(resp => {
    const data = resp.data[createMode.value ? 'communicationBoard' : 'success'];
    if (data) {
      if (createMode.value) {
        communicaitonBoard.value = _.cloneDeep(data);
      }
      communicaitonBoardOrg.value = _.cloneDeep(communicaitonBoardOrg.value);
      editMode.value = false;
    } else {
      $q.notify('저장에 실패했습니다. 다시 시도해주세요.');
    }
  });
}

// 재요청 버튼 클릭 시
function onClickReRequestBtn() {
  if (!communicaitonBoard.value) return;
  mutate(reRequestCommunicationBoard, { id: communicaitonBoard.value._id }).then(({ data }) => {
    const success = !!data?.success;
    if (!success) {
      $q.notify('재요청에 실패했습니다.');
    }
    communicaitonBoard.value = Object.assign({}, communicaitonBoard.value, { status: 'request' });
  });
}

// 관리자 계정 - 승인
function onClickAcceptBtn() {
  if (!communicaitonBoard.value) return;
  const { _id, message } = communicaitonBoard.value;
  mutate(acceptCommunicationBoard, { id: _id, message }).then(({ data }) => {
    const success = !!data?.success;
    if (!success) {
      $q.notify('승인에 실패했습니다.');
    }
    communicaitonBoard.value = Object.assign({}, communicaitonBoard.value, { status: 'accept', message });
  });
}

// 관리자 계절 - 거절
function onClickRejectBtn() {
  if (!communicaitonBoard.value) return;
  const { _id, message } = communicaitonBoard.value;
  if (!message) {
    return $q.notify('거절 시에는 메세지가 필수입니다!');
  }
  mutate(rejectCommunicationBoard, { id: _id, message }).then(({ data }) => {
    const success = !!data?.success;
    if (!success) {
      $q.notify('거절에 실패했습니다.');
    }
    communicaitonBoard.value = Object.assign({}, communicaitonBoard.value, { status: 'reject', message });
  });
}
</script>

<style scoped></style>
