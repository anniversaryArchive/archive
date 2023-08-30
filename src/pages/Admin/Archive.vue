<template>
  <div class="relative px-4 py-6 text-center">
    <LayoutPageTitle :fnCallFunc="fnCallFunc" />

    <div v-if="isLoading" class="absolute top-0 left-0 z-20 flex w-full h-screen text-center bg-black/30">
      <q-spinner color="primary" size="3em" class="m-auto" />
    </div>

    <div class='form_table'>
      <table>
        <colgroup>
          <col style='width:120px'/>
          <col style='width:auto'/>
          <col style='width:120px'/>
          <col style='width:auto'/>
        </colgroup>

        <tbody>
          <!-- 필수 -->
          <tr>
            <th>카페 이름</th>
            <td colspan="3">
              <q-input :ref='el => { refs["name"] = el }' v-model="inputArchive.name" :dense="true" maxlength="100" outlined/>
            </td>
          </tr>

          <tr>
            <th>카페 테마 명</th>
            <td colspan="3">
              <q-input :ref='el => { refs["themeName"] = el }' v-model="inputArchive.themeName" :dense="true" maxlength="100" outlined/>
            </td>
          </tr>

          <tr>
            <th>주소</th>
            <td colspan="2" class="pl-2 text-sm text-left">
              {{ inputArchive.address }}
            </td>
            <td class="text-right">
              <button class="px-4 py-2 font-semibold text-white rounded bg-primary"
                @click="onClickFindAddressButton">주소 찾기</button>
            </td>
          </tr>

          <tr>
            <th>카페 상세 주소</th>
            <td colspan="3">
              <q-input :ref='el => { refs["detailAddress"] = el }' v-model="inputArchive.detailAddress" :dense="true" maxlength="100" outlined/>
            </td>
          </tr>

          <tr>
            <th>주최자(트위터 아이디)</th>
            <td colspan="3">
              <q-input :ref='el => { refs["organizer"] = el }' v-model="inputArchive.organizer"
                :dense="true" maxlength="100" outlined placeholder="@주최자트위터아이디" />
            </td>
          </tr>

          <tr>
            <th>카페 시작일</th>
            <td colspan="3">
              <DatePicker :ref='el => { refs["startDate"] = el }'
                v-model='inputArchive.startDate' :clearable='true' returnDataFormat="YYYY.MM.DD" />
            </td>
          </tr>

          <tr>
            <th>카페 종료일</th>
            <td colspan="3">
              <DatePicker :ref='el => { refs["endDate"] = el }'
                v-model='inputArchive.endDate' :clearable='true' returnDataFormat="YYYY.MM.DD" />
            </td>
          </tr>

          <tr>
            <th>그룹</th>
            <td colspan="3">
              <ComboBox :options="groups" v-model="archiveGroup" />
            </td>
          </tr>

          <tr>
            <th>아티스트</th>
            <td colspan="3">
              <ComboBox :options="artists" v-model="archiveArtist" />
            </td>
          </tr>

          <tr>
            <th>메인 이미지</th>
            <td colspan="3">
              <q-file :ref='el => { refs["mainImage"] = el }' outlined
                v-model="(inputArchive.mainImage as File)" accept=".jpg, .png, image/*" @rejected="onRejected">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </td>
          </tr>

          <!-- 선택 : 영업 시작 시간, 종료 시간, 이미지 리스트, 전화번호, 대표링크 -->
          <tr>
            <th>영업 시작 시간</th>
            <td class="border-b border-gray-300">
              <input type="checkbox"
                id="openTimeCheckBox"
                :value="!inputArchive.openTime"
                :checked="!inputArchive.openTime"
                @click="(event) => onChangeTimeCheckbox('openTime', event)" />
              <label for="openTimeCheckBox"
                class="ml-1">사용 안 함</label>
            </td>
            <td colspan="2" class="border-b border-gray-300">
              <TimePicker v-model="inputArchive.openTime" />
            </td>
          </tr>

          <tr>
            <th>영업 종료 시간</th>
            <td>
              <input type="checkbox"
                id="closeTimeCheckBox"
                :value="!inputArchive.closeTime"
                :checked="!inputArchive.closeTime"
                @click="(event) => onChangeTimeCheckbox('closeTime', event)" />
              <label for="closeTimeCheckBox"
                class="ml-1">사용 안 함</label>
            </td>
            <td colspan="2">
              <TimePicker v-model="inputArchive.closeTime" />
            </td>
          </tr>

          <tr>
            <th>관련 이미지들</th>
            <td colspan="3" class="border rounded boder-gray-300">
              <ImageSlide v-model="inputArchive.images" :editMode="true" />

              <input type="file" class="hidden"
                accept=".jpg, .png, image/*"
                id="inputImages" @change="onChangeImage" />

              <div class="text-right">
                <button class="px-4 py-1 text-white rounded bg-primary"
                  @click="onClickAddImage">이미지 추가</button>
              </div>
            </td>
          </tr>

          <tr>
            <th>전화번호</th>
            <td colspan="3">
              <q-input :ref='el => { refs["phoneNumber"] = el }' v-model="inputArchive.phoneNumber" :dense="true" maxlength="100" outlined/>
            </td>
          </tr>

          <tr>
            <th>대표 링크</th>
            <td colspan="3">
              <q-input :ref='el => { refs["link"] = el }' v-model="inputArchive.link" :dense="true" maxlength="100" outlined/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <div class='con_tit'>
        <h6>카페 목록</h6>
        <p class='num'>[총 {{ total }} 건]</p>
      </div>
      <div id='grdMstArea' class="grid_edge">
        <div class='default-list'>
          <AgGridVue
            id='grdMst'
            ref='grdMst'
            v-bind='grdMstProps'
            class='ag-theme-balham'
            @grid-ready="onGridReady"
            @pagination-changed="onPaginationChanged"
            @cell-focused="onCellFocused"
          />
        </div>
      </div>
    </div>
  </div>

  <FindAddressDialog :show="isOpenFindAddressDialog"
    @done="onSelectAddress"
    @close="() => { isOpenFindAddressDialog = false; }" />
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef, watch, onBeforeMount } from 'vue';
import axios from 'axios';
import moment from 'moment';
import { convertFile } from '@/composables/fileUtils';

// Types
import { ComboBoxModel } from '@/types/CommonTypes';
import { Group } from '@/types/Group';
import { Artist } from '@/types/Artist';
import { Archive, ArchiveType } from '@/types/Archive';
import { Image } from '@/types/Image';
import { CellFocusedEvent, GetRowIdParams, GridOptions, RowNode } from '@ag-grid-community/core';
import { VueDaumPostcodeCompleteResult } from 'vue-daum-postcode';

// Stores
import { useArchiveStore } from '@/stores/archive';
import { useArtistStore } from '@/stores/artist';
import { useGroupStore } from '@/stores/group';

// Composables
import ccobject from '@/composables/createComObject';
import cinitial from '@/composables/comInitialize';
import cscript from '@/composables/comScripts';
import caggrid, { DateFormatter } from '@/composables/customAgGridUtils';

// Components
import { LayoutPageTitle, DatePicker, SelectBox, AgGridVue } from '../mixin/mixinPageCommon';
import ComboBox from '@/components/common/comboBox.vue';
import TimePicker from '@/components/common/timePicker.vue';
import ImageSlide from '@/components/common/imageSlide.vue';

// Dialogs
import FindAddressDialog from '@/dialogs/FindAddressDialog.vue';

const isOpenFindAddressDialog: Ref<boolean> = ref(false);

const gridFields: { key: string, text: string }[] = [
  { key: 'name', text: '카페명' },
  { key: 'themeName', text: '카페테마명' },
];

const archiveStroe = useArchiveStore();
const artistStore = useArtistStore();
const groupStore = useGroupStore();

// Grid 관련 변수
const { grdApi, grdMstKey, grdMstProps, onGridReady, onPaginationChanged } = initGrid();
const lastActionId: Ref<string | undefined> = ref(); // 마지막으로 생성/수정한 Archive의 _id

// Archive List Table View 관련 변수
const total: ComputedRef<number> = computed(() => archiveStroe.total);
watch(() => archiveStroe.archives, () => {
  grdApi.value.setRowData(archiveStroe.archives);
  const rowIndex: number = lastActionId.value ? archiveStroe.archives.findIndex((archive) => {
    return archive[grdMstKey.value] === lastActionId.value;
  }) : 0;
  grdApi.value.setFocusedCell(rowIndex, grdMstKey.value);
});

const isLoading: Ref<boolean> = ref(false);

// Archive Input Box 관련 변수
const refs: Ref<Record<string, any>> = ref({});
const inputArchive: Ref<Archive> = ref(cinitial.$inItData('', ArchiveType) as Archive);
const inputArchiveOrg: Ref<Archive> = ref(JSON.parse(JSON.stringify(inputArchive.value)));

// Groups 관련 변수
const groups: Ref<ComboBoxModel[]> = ref([]);
const archiveGroup: Ref<ComboBoxModel | undefined> = ref();

// Artists 관련 변수
const artists: Ref<ComboBoxModel[]> = ref([]);
const archiveArtist: Ref<ComboBoxModel | undefined> = ref();

onBeforeMount(() => {
  getArtists();
  getGroups();
});

async function getArtists () {
  try {
    const result = await artistStore.getArtistsQuery();
    artists.value = (result.data.value.artist.data || []).map((artist: Artist) => {
      return { id: artist._id, name: artist.name, unavailable: false } as ComboBoxModel;
    });
  } catch (error) { console.error(error); }
}

async function getGroups () {
  try {
    const result = await groupStore.getGroupsQuery();
    groups.value = (result.data.value.groups.data || []).map((group: Group) => {
      return { id: group._id, name: group.name, unavailable: false } as ComboBoxModel;
    });
  } catch (error) { console.error(error); }
}

function setInputArchive(value: Archive) {
  value.mainImage = value.mainImage;
  for (const key of ['startDate', 'endDate']) {
    if (value[key]) {
      value[key] = moment(value[key]).format('YYYY.MM.DD');
    }
  }
  inputArchive.value = value;
  inputArchiveOrg.value = JSON.parse(JSON.stringify(inputArchive.value));
  const artistId: string | undefined = value.artist?._id;
  archiveArtist.value = artistId ? artists.value.find((artist: ComboBoxModel) => artist.id === artistId) : undefined;
  const groupId: string | undefined = value.group?._id;
  archiveGroup.value = groupId ? groups.value.find((group: ComboBoxModel) => group.id === groupId) : undefined;
}

/**
 * Input Box 내 Action 관련 함수
 */
// 주소 찾기 버튼 클릭 시
function onClickFindAddressButton () {
  isOpenFindAddressDialog.value = true;
}

function onSelectAddress (address: string) {
  inputArchive.value.address = address;
  isOpenFindAddressDialog.value = false;
}

function onChangeTimeCheckbox (type: string, event: Event) {
  inputArchive.value[type] = (event.target as HTMLInputElement).checked ? undefined : { hour: 0, minute: 0 };
}

/**
 * =================================
 * 상단 버튼(Action) 관련 Functions ..
 * =================================
 */
const fnCallFunc = (id: string) => {
  switch (id) {
    // 조회
    case 'inquire': return fnInquire();
    // 신규
    case 'create': return resetInputBox();
    // 삭제
    case 'delete': return deleteSelectedArchive();
    // 저장
    case 'save': return onClickSaveBtn();
  }
}

// 신규 버튼 클릭 시
async function resetInputBox() {
  try {
    const checked: boolean = await confirmDiffData();
    if (!checked) { return; }
  } catch (error) { console.error(error); }

  archiveGroup.value = archiveArtist.value = undefined;
  setInputArchive(cinitial.$inItData('', ArchiveType) as Archive);

  // 그리드 선택 해제 (포커스 먹으려면 await)
  try {
    await grdApi.value.deselectAll();
  } catch (error) { console.error(error); }
}

// Archive 리스트 조회(Server call)
async function fnInquire() {
  try {
    const checked: boolean = await confirmDiffData();
    if (!checked) { return; }
  } catch (error) { console.error(error); }
  archiveStroe.getArchives({});
}

/**
 * =================================
 * 저장 관련 함수들 (생성, 수정)
 * =================================
 */

// 변경사항 체크
async function checkDiffData(): Promise<boolean> {
  // 아티스트가 변경되었는 지 여부
  const artistDiff = archiveArtist.value?.id !== inputArchiveOrg.value.artist?._id;

  // 그룹이 변경되었는 지 여부
  const groupDiff = archiveGroup.value?.id !== inputArchiveOrg.value.group?._id;

  // 이미지가 변경됐는 지 확인
  const imageDiff = (() => {
    const currentImage = inputArchive.value.mainImage;
    const current = currentImage && (currentImage.hasOwnProperty('_id') ? (currentImage as Image)._id : currentImage.name);
    const orgImage = inputArchiveOrg.value.mainImage;
    const org = orgImage && (orgImage.hasOwnProperty('_id') ? (orgImage as Image)._id : orgImage.name);
    return current !== org;
  })();

  const images = inputArchive.value.images.map(image => image.path);
  const orgIamges = inputArchiveOrg.value.images.map(image => image.path);
  const imagesDiff: boolean = JSON.stringify(images) !== JSON.stringify(orgIamges);

  // inputArchive 데이터가 변경되었는 지
  let dataDiff: boolean = false;
  try {
    const xcptKeyLists: string[] = ['mainImage', 'artist', 'group', 'images', 'openTime', 'closeTime'];
    const compResult = await cscript.$compareDatas<Archive>(inputArchive.value, inputArchiveOrg.value, xcptKeyLists);
    dataDiff = compResult.length != 0;
  } catch (_) {}

  // openTime, closeTime
  let timeDiff = false;
  for (const key of ['openTime', 'closeTime']) {
    if (JSON.stringify(inputArchive.value[key] || {}) !== JSON.stringify(inputArchiveOrg.value[key] || {})) {
      timeDiff = true;
      break;
    }
  }

  return dataDiff || artistDiff || groupDiff || imageDiff || imagesDiff || timeDiff;
}

// 필수 입력 항목 체크 - 생일, 이미지, 이름
function isMstValid(): boolean {
  const requireFields = [
    { key: 'name', text: '카페 이름' },
    { key: 'themeName', text: '카페 테마 명' },
    { key: 'address', text: '주소' },
    { key: 'organizer', text: '주최자' },
    { key: 'startDate', text: '카페 시작일' },
    { key: 'endDate', text: '카페 종료일' },
    { key: 'mainImage', text: '메인 이미지' },
  ];

  for (const field of requireFields) {
    if (cscript.$isEmpty(inputArchive.value[field.key])) {
      alert(`${field.text}은(는) 필수입니다.`);
      (refs.value[field.key] as HTMLInputElement).focus();
      return false;
    }
  }
  return true;
}

// 저장 버튼 클릭 시
async function onClickSaveBtn() {
  if (inputArchive.value._id) {
    try {
      const diff: boolean = await checkDiffData();
      if (!diff) {
        alert('변경 사항이 없습니다.');
        return;
      }
    } catch (_) { return; }
  }

  // 필수값 모두 입력됐는지 확인
  if (!isMstValid()) { return; }

  isLoading.value = true;
  let result: string | boolean = false;
  try {
    if (inputArchive.value._id) {
      result = await updateArchive();
    } else {
      result = await createArchive();
    }
  } catch (error) { console.error(error); }

  isLoading.value = false;
  if (result !== true) {
    alert(result || '오류가 발생했습니다!');
    return;
  }

  if (archiveArtist.value) {
    const { id, name } = archiveArtist.value;
    inputArchive.value.artist = { _id: id, name };
  } else { inputArchive.value.artist = undefined; }
  if (archiveGroup.value) {
    const { id, name } = archiveGroup.value;
    inputArchive.value.group = { _id: id, name };
  } else { inputArchive.value.group = undefined; }
  setInputArchive(inputArchive.value);
  alert('저장 완료했습니다!');
}

function getLatLng(): Promise<Record<string, number>> {
  return new Promise((resolve, reject) => {
    naver.maps.Service.geocode({
      query: inputArchive.value.address
    }, function (status, response) {
      const data = response.v2.addresses[0];
      const { x, y } = data;
      resolve({ lng: Number(x), lat: Number(y) });
    });
  });
}

// 생성 / 수정 시 mutation에 넘길 input을 만들어서 반환하는 함수
async function getInput(): Promise<Record<string, any> | undefined> {
  const input: Record<string, any> = Object.assign({}, inputArchive.value);
  input.artist = archiveArtist.value?.id;
  input.group = archiveGroup.value?.id;
  for (const field of ['startDate', 'endDate']) {
    if (!input[field]) { continue; }
    input[field] = new Date(input[field]);
  }

  try {
    let success: boolean = await uploadFile();
    if (!success) { return undefined; }
    success = await uploadImages();
    if (!success) { return undefined; }
  } catch (error) {
    console.error(error);
    return undefined;
  } finally {
    const { mainImage } = inputArchive.value;
    input.mainImage = mainImage?.hasOwnProperty('_id') && (mainImage as Image)._id;
    input.images = inputArchive.value.images.map((image) => image._id);
  }
  delete input._id;

  if (inputArchive.value.address !== inputArchiveOrg.value.address) {
    try {
      const { lat, lng } = await getLatLng();
      input.lat = inputArchive.value.lat = lat;
      input.lng = inputArchive.value.lng = lng;
    } catch (_) {}
  }
  return input;
}

// 새로운 아티스트 생성
async function createArchive(): Promise<boolean | string> {
  try {
    const input = await getInput();
    if (!input) { return false; }
    const result = await archiveStroe.createArchive(input);
    if (result) {
      const { id, error } = result;
      lastActionId.value = id;
      const code: number = Number(error?.graphqlErrors && error?.graphqlErrors[0]?.extensions?.code);
      switch (code) {
        case 1002: return '그룹 혹은 아티스트를 넣어주셔야 합니다.';
      }
      return !!id;
    }
  } catch (error) { console.error(error); }
  return false;
}

// 현재 아티스트 업데이트
async function updateArchive(): Promise<boolean> {
  try {
    const input = await getInput();
    if (!inputArchive.value._id || !input) { return false; }
    const success: boolean = await archiveStroe.updateArchive(inputArchive.value._id, input);
    if (success) { lastActionId.value = inputArchive.value._id; }
    return success;
  } catch (error) { console.error(error); }
  return false;
}

// 선택한 Archive를 반환하는 함수, 없으면 undefined를 반환한다.
function getSelectedArchive (required: boolean = false): Archive | undefined {
  const selectedRows = grdApi.value.getSelectedRows();
  // 선택한 아티스트가 없는 경우
  if (!selectedRows.length) {
    if (required) { alert('아티스트를 선택해주세요!'); }
    return;
  }
  return selectedRows[0];
}

// Grid에서 선택된 Archive를 삭제하는 함수
async function deleteSelectedArchive () {
  const archive: Archive | undefined = getSelectedArchive(true);
  if (!archive || !archive._id) { return; }
  const confirmResult: boolean = confirm('정말 삭제하시겠습니까?');
  if (!confirmResult) { return; }
  try {
    const success: boolean = await archiveStroe.removeArchive(archive._id);
    if (success) { setInputArchive(cinitial.$inItData('', ArchiveType) as Archive); }
  } catch (_) {}
}

const onRejected = () => {
}

/**
 * =================================
 * 파일 관련 로직
 * =================================
 */
function onClickAddImage (): void {
  document.getElementById('inputImages')?.click();
}

function onChangeImage (event: Event) {
  const target: HTMLInputElement = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) { return; }
  const file = target.files[0];
  convertFile(file).then((result) => {
    const image: Blob = (result.file || file) as Blob;
    inputArchive.value.images.push({
      file: image,
      path: result.path,
      name: image.name,
    });
    inputArchive.value.images = [...inputArchive.value.images];
  });
}

function uploadFile(): Promise<boolean> {
  const { mainImage } = inputArchive.value;
  if (!mainImage || mainImage.hasOwnProperty('_id')) { return Promise.resolve(true); }
  const formData: FormData = new FormData();
  formData.append('file', mainImage as Blob);

  return new Promise((rejolve, reject) => {
    axios.post(`http://localhost:3000/file`, formData, {}).then((response) => {
      const image = response.data?.data && response.data.data;
      if (!image) { return rejolve(false); }
      inputArchive.value.mainImage = image;
      return rejolve(true);
    }).catch((error) => reject(error));
  });
}

async function uploadImages(): Promise<boolean> {
  const promises = [];
  for (let index = 0; index < inputArchive.value.images.length; index ++) {
    const image = inputArchive.value.images[index];
    if (image.hasOwnProperty('_id') || !image.file) { continue; }
    const formData: FormData = new FormData();
    formData.append('file', image.file);
    promises.push(axios.post(`http://localhost:3000/file`, formData, {}).then((response) => {
      const data = response.data?.data && response.data.data;
      if (!data) { return false; }
      inputArchive.value.images[index] = data;
      return true;
    }));
  }

  if (!promises.length) { return true; }
  try {
    const results = await Promise.all(promises);
    return !results.some((result) => !result);
  } catch (error) { console.error(error); }
  return false;
}

/**
 * =================================
 * Grid 관련 변수 및 Functions ..
 * =================================
 */
// 변경사항 체크
async function confirmDiffData(): Promise<boolean> {
  try {
    const diff = await checkDiffData();
    const msg = '변경된 내용이 있습니다. 신규 작성시 변경 내용이 사라집니다.계속 하시겠습니까?';
    if (diff && !confirm(msg)) { return false; }
  } catch (_) {}
  return true;
}

// Grid Cell 포커스
async function onCellFocused(event: CellFocusedEvent) {
  // 포커스 셀 변경 시 해당 셀의 행 선택
  const focusNode = grdApi.value.getRenderedNodes().find((node: RowNode) => {
    return node.childIndex === event.rowIndex;
  });

  // 변경사항 체크
  try {
    const confirm: boolean = await confirmDiffData();
    if (!confirm) { return; }
  } catch (_) {}

  if (!cscript.$isEmpty(focusNode)){
    focusNode!.setSelected(true, true);
  }

  const archive: Archive | undefined = getSelectedArchive();
  if (!archive) { return; }
  setInputArchive(archive);
}

function initGrid () {
  const {
    grdApi,
    grdColKey: grdMstKey,
    grdProps: grdMstProps,
    onGridReady,
    onPaginationChanged,
  } = ccobject.$createComGrd<Archive>(); // 그리드 변수

  grdMstKey.value = '_id';
  const columnDefs = [
    { headerName: 'No', valueGetter: 'node.rowIndex + 1', width: 60, sortable: true },
    ... gridFields.map((field) => {
      const def: Record<string, any> = { headerName: field.text, field: field.key, width: 150, cellStyle : {textAlign: 'left'}, flex: 1 };
      if (field.key === 'startDate' || field.key === 'endDate') {
        def.valueFormatter = DateFormatter;
      }
      return def;
    }),
    { headerName: 'ID', field: '_id', hide: true },
  ]

  grdMstProps.value = Object.assign({}, cinitial.$comGridOption, {
    name: 'grdMstProps',
    columnDefs,
    rowData: [],
    getRowId: (params: GetRowIdParams) => params.data._id,
    style: caggrid.$getGridStyle(10), // 보여주고싶은 행 숫자
    pagination: true,
    paginationAutoPageSize: true,
    animateRows: true,
    rowSelection: 'single',
  } as GridOptions) as unknown as typeof grdMstProps.value;
  return { grdApi, grdMstKey, grdMstProps, onGridReady, onPaginationChanged };
}
</script>

<style scoped>
@import './style.css';
</style>