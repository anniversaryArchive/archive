<template>
  <div class="px-4 py-6 text-center">
    <LayoutPageTitle :fnCallFunc="fnCallFunc" />

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
            <th>아티스트명</th>
            <td colspan="3">
              <q-input :ref='el => { refs["name"] = el }' v-model="inputArtist.name" :dense="true" maxlength="100" outlined/>
            </td>
          </tr>

          <tr>
            <th>생일</th>
            <td colspan="3">
              <DatePicker :ref='el => { refs["birthDay"] = el }' :id="inputArtist.birthDay"
                v-model='inputArtist.birthDay' :clearable='true' returnDataFormat="YYYY.MM.DD" />
            </td>
          </tr>

          <tr>
            <th>데뷔일</th>
            <td colspan="3">
              <DatePicker :ref='el => { refs["debutDate"] = el }' :id="inputArtist.debutDate" 
                v-model='inputArtist.debutDate' :clearable='true' returnDataFormat="YYYY.MM.DD" />
            </td>
          </tr>

          <tr>
            <th>이미지</th>
            <td colspan="3">
              <q-file :ref='el => { refs["image"] = el }' outlined
                v-model="inputArtist.image" accept=".jpg, .png, image/*" @rejected="onRejected">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </td>
          </tr>

          <!-- 선택 -->
          <tr>
            <th>소속된 그룹</th>
            <td colspan="3">
              <ComboBox :options="groups" v-model="artistGroup" />
            </td>
          </tr>

          <tr>
            <th>공식 컬러</th>
            <td colspan="3">
              <q-input outlined v-model="inputArtist.color">
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="inputArtist.color" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <div class='con_tit'>
        <h6>아티스트 목록</h6>
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
</template>

<script setup lang="ts">
import { LayoutPageTitle, DatePicker, SelectBox, AgGridVue } from '../mixin/mixinPageCommon';
import ComboBox from '@/components/common/comboBox.vue';
import { ComboBoxModel } from '@/types/CommonTypes';

import { ref, Ref, computed, ComputedRef, watch, onBeforeMount } from 'vue';
import axios from 'axios';
import ccobject from '@/composables/createComObject';
import cinitial from '@/composables/comInitialize';
import cscript from '@/composables/comScripts';
import caggrid, { DateFormatter } from '@/composables/customAgGridUtils';
import { CellFocusedEvent, GetRowIdParams, GridOptions, RowNode } from '@ag-grid-community/core';
import { Artist, ArtistType } from '@/types/Artist';
import { useGroupStore } from '@/stores/group';
import { useArtistStore } from '@/stores/artist';
import moment from 'moment';

const gridFields: { key: string, text: string }[] = [
  { key: 'name', text: '아티스트명' },
  { key: 'birthDay', text: '생일' },
  { key: 'group.name', text: '그룹' },
];

const groupStore = useGroupStore();
const artistStore = useArtistStore();

const { grdApi, grdMstKey, grdMstProps, onGridReady, onPaginationChanged } = initGrid();

// Artist List Table View 관련 변수
const total: ComputedRef<number> = computed(() => artistStore.total);
watch(() => artistStore.artists, () => {
  grdApi.value.setRowData(artistStore.artists);
});

// Artist Input Box 관련 변수
const refs: Ref<string, any> = ref({});
const inputArtist: Ref<Artist> = ref(cinitial.$inItData('', ArtistType) as Artist);
const inputArtistOrg: Ref<Artist> = ref(JSON.parse(JSON.stringify(inputArtist.value)));

// Groups 관련 변수
const groups: ref<ComboBoxModel[]> = ref([]);
const artistGroup: Ref<ComboBoxModel | undefiend> = ref();

onBeforeMount(() => {
  getGroups();
});

async function getGroups() {
  try {
    const data = await groupStore.getGroupsQuery();
    groups.value = (data.groups.data || []).map((group) => {
      return { id: group._id, name: group.name, unavailable: false } as ComboBoxModel;
    });
  } catch (error) {
    console.error(error);
  }
}

function setInputArtist(value: Artist) {
  value.image = value.image;
  for (const key of ['debutDate', 'birthDay']) {
    if (value[key]) { 
      value[key] = moment(value[key]).format('YYYY.MM.DD');
    }
  }
  inputArtist.value = value;
  inputArtistOrg.value = JSON.parse(JSON.stringify(inputArtist.value));
  const groupId: string | undefiend = value.group?._id;
  artistGroup.value = groupId && groups.value.find((group) => group.id === groupId);
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
    case 'delete': return deleteSelectedArtist();
    // 저장
    case 'save': return onClickSaveBtn();
  }
}

// 신규 버튼 클릭 시
function resetInputBox() {
  setInputArtist(cinitial.$inItData('', ArtistType) as Artist);
}

// Artist 리스트 조회(Server call)
function fnInquire() {
  artistStore.getArtists();
}

/**
 * =================================
 * 저장 관련 함수들 (생성, 수정)
 * =================================
 */

// 변경사항 체크
async function checkDiffData(): Promise<boolean> {
  // 그룹이 변경됐는 지 확인
  const groupDiff = artistGroup.value.id !== inputArtistOrg.value.group?._id;

  // 이미지가 변경됐는 지 확인 
  const imageDiff = (inputArtist.value.image?._id || inputArtist.value.image?.name) !== (inputArtistOrg.value.image?._id || inputArtistOrg.value.image?.name);

  // inputArtist 데이터가 변경되었는 지
  let dataDiff: boolean = false;
  try {
    const compResult = await cscript.$compareDatas<Artist>(inputArtist.value, inputArtistOrg.value, ['logo', 'group']);
    dataDiff = compResult.length != 0;
  } catch (_) {}
  return dataDiff || groupDiff || imageDiff;
}

// 필수 입력 항목 체크 - 생일, 이미지, 이름
function isMstValid(): boolean {
  const requireFields = [{ key: 'name', text: '이름' }, { key: 'image', text: '이미지' }, { key: 'birthDay', text: '생일' }];

  for (const field of requireFields) {
    if (cscript.$isEmpty(inputArtist.value[field.key])) {
      alert(`${field.text}은(는) 필수입니다.`);
      (refs.value[field.key] as HTMLInputElement).focus();
      return false;
    }
  }
  return true;
}

// 저장 버튼 클릭 시 
async function onClickSaveBtn() {
  if (inputArtist.value._id) {
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

  let success: boolean = false;
  try {
    if (inputArtist.value._id) {
      success = await updateArtist();
    } else {
      success = await createArtist();
    }
  } catch (error) { console.error(error); }

  if (!success) {
    alert('오류가 발생했습니다!');
    return;
  }
  alert('저장 완료했습니다!');
}

// 생성 / 수정 시 mutation에 넘길 input을 만들어서 반환하는 함수
async function getInput() {
  const input = Object.assign({}, inputArtist.value);
  input.group = artistGroup.value?.id;
  for (const field of ['birthDay', 'debutDate']) {
    if (!input[field]) { continue; }
    console.log('~ ', field, input[field], new Date(input[field]));
    input[field] = new Date(input[field]);
  }

  try {
    await uploadFile();
  } finally {
    input.image = inputArtist.value.image?._id;
  }
  delete input._id;
  
  return input;
}

// 새로운 아티스트 생성
async function createArtist(): Promise<boolean> {
  try {
    const input = await getInput();
    const success: boolean = await artistStore.createArtist(input);
    return success;
  } catch (error) { console.error(error); }
  return false;
}

// 현재 아티스트 업데이트
async function updateArtist(): Promise<boolean> {
  try {
    const input = await getInput();
    const success: boolean = await artistStore.updateArtist(inputArtist.value._id, input);
    return success;
  } catch (error) { console.error(error); }
  return false;
}

// 선택한 Artist를 반환하는 함수, 없으면 undefined를 반환한다.
function getSelectedArtist (required: boolean = false): Artist | undefined {
  const selectedRows = grdApi.value.getSelectedRows();
  // 선택한 아티스트가 없는 경우 
  if (!selectedRows.length) {
    if (required) { alert('아티스트를 선택해주세요!'); }
    return;
  }
  return selectedRows[0];
}

// Grid에서 선택된 Artist를 삭제하는 함수
async function deleteSelectedArtist () {
  const artist: Artist | undefined = getSelectedArtist(true);
  if (!artist) { return; }
  const confirmResult: boolean = confirm('정말 삭제하시겠습니까?');
  if (!confirmResult) { return; }
  try {
    const success: boolean = await artistStore.removeArtist(artist._id);
    if (success) { setInputArtist(cinitial.$inItData('', ArtistType) as Artist); }
  } catch (_) {}
}

const onRejected = () => {
}

function onChangeGroup(event: ComboBoxModel) {
  artistGroup.value = event;
}

/**
 * =================================
 * 파일 관련 로직
 * =================================
 */

function uploadFile(): Promise<boolean> {
  if (!inputArtist.value.image || inputArtist.value.image._id) { return true; }
  const formData: FormData = new FormData();
  formData.append('file', inputArtist.value.image);

  return new Promise((rejolve, reject) => {
    axios.post(`http://localhost:3000/file`, formData, {}).then((response) => {
      const image = response.data?.data && response.data.data;
      if (!image) { return rejolve(false); }
      inputArtist.value.image = image;
      return rejolve(true);
    });
  });
}

/**
 * =================================
 * Grid 관련 변수 및 Functions .. 
 * =================================
 */
// Grid Cell 포커스 
async function onCellFocused(event: CellFocusedEvent) {
  // 포커스 셀 변경 시 해당 셀의 행 선택
  const focusNode = grdApi.value.getRenderedNodes().find((node: RowNode) => {
    return node.childIndex === event.rowIndex;
  });

  // 변경사항 체크 
  try {
    const diff = await checkDiffData();
    const msg = '변경된 내용이 있습니다. 신규 작성시 변경 내용이 사라집니다.계속 하시겠습니까?';
    if (diff && !confirm(msg)) { return; }
  } catch (_) {}

  if (!cscript.$isEmpty(focusNode)){
    focusNode!.setSelected(true, true);
  }

  const artist: Artist | undefiend = getSelectedArtist();
  if (!artist) { return; }
  setInputArtist(artist);
}

function initGrid () {
  const {
    grdApi,
    grdColKey: grdMstKey,
    grdProps: grdMstProps,
    onGridReady,
    onPaginationChanged,
  } = ccobject.$createComGrd<Artist>(); // 그리드 변수

  const columnDefs = [
    { headerName: 'No', valueGetter: 'node.rowIndex + 1', width: 60, sortable: true },
    ... gridFields.map((field) => {
      const def = { headerName: field.text, field: field.key, width: 150, cellStyle : {textAlign: 'left'}, flex: 1 };
      if (field.key === 'birthDay' || field.key === 'debutDate') {
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