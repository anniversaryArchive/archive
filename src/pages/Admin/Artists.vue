<template>
  <div>
    <LayoutPageTitle :fnCallFunc="fnCallFunc" />

    <div class='form_table'>
      <table>
        <colgroup>
          <col style='width:120px'/>
          <col style='width:auto'/>
          <col style='width:120px'/>
          <col style='width:auto'/>
        </colgroup>

        <!--
          TODO:
          - name: 이름
          - birthDay: 생일
          - debutDate: 데뷔일자
          - image: 이미지

          - group: 그룹 ID
          - color: 색상
        -->

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
              <DatePicker :ref='el => { refs["birthDay"] = el }' :id="inputArtist.birthDay" v-model='inputArtist.birthDay' :clearable='true'/>
            </td>
          </tr>

          <tr>
            <th>데뷔일</th>
            <td colspan="3">
              <DatePicker :ref='el => { refs["debutDate"] = el }' :id="inputArtist.debutDate" v-model='inputArtist.debutDate' :clearable='true'/>
            </td>
          </tr>

          <tr>
            <th>이미지</th>
            <td colspan="3">
              <q-file :ref='el => { refs["image"] = el }' outlined v-model="inputArtist.image" accept=".jpg, .png, image/*" @rejected="onRejected">
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
              <!--
              <SelectBox id="artist" v-model='artistList'
                v-bind='selectBoxOptions.artist' style="width: 100%;"
                :multiplied='true' use-chips />
              -->
              <ComboBox :options="groups" :value="artistGroup"
                @change="onChangeGroup" />
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
            @selection-changed="onSelectionChanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LayoutPageTitle, DatePicker, SelectBox, AgGridVue } from '../mixin/mixinPageCommonTest';
import ComboBox from '@/components/common/comboBox.vue';
import { ComboBoxModel } from '@/types/CommonTypes';

import { ref, Ref, computed, ComputedRef, watch, onBeforeMount } from 'vue';
import axios from 'axios';
import ccobject from '@/composables/createComObject';
import cinitial from '@/composables/comInitialize';
import cscript from '@/composables/comScripts';
import caggrid from '@/composables/customAgGridUtils';
import { Artist, ArtistType } from '@/types/Artist';
import { useGroupStore } from '@/stores/group';
import { useArtistStore } from '@/stores/artist';

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
    const data = await groupStore.getGroupsTest();
    groups.value = (data.groups || []).map((group) => {
      return { id: group._id, name: group.name, unavailable: false } as ComboBoxModel;
    });
  } catch (_) {}
}

/**
 * =================================
 * 상단 버튼(Action) 관련 Functions .. 
 * =================================
 */
const fnCallFunc = (id: string) => {
  console.log('chloe test id : ', id);
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
  inputArtist.value = cinitial.$inItData('', ArtistType) as Artist;
  inputArtistOrg.value = JSON.parse(JSON.stringify(inputArtist.value));
}

// 저장 버튼 클릭 시 
function onClickSaveBtn() {
  if (inputArtist.value._id) {
    updateArtist();
  } else {
    createArtist();
  }
}

// Artist 리스트 조회(Server call)
function fnInquire() {
  artistStore.getArtists();
}

async function getInput() {
  const input = Object.assign({}, inputArtist.value);
  input.group = artistGroup.value?.id;

  try {
    await uploadFile();
  } finally {
    input.image = inputArtist.value.image?._id;
  }
  delete input._id;

  return input;
}

// 새로운 아티스트 생성
async function createArtist() {
  // TODO:
  // 1. 필수 필드들 입력됐는 지 확인하기 
  // 2. 이미지 업로드
  // 3. Artist 얻로드

  try {
    const input = await getInput();
    const success: boolean = await artistStore.createArtist(input);
    console.log('success : ', success);
  } catch (error) { console.error(error); }
}

// 현재 아티스트 업데이트
async function updateArtist() {
  // TODO: 필수 필드 값 다 넣었는 지 확인
  try {
    const input = await getInput();
    const success: boolean = await artistStore.updateArtist(inputArtist.value._id, input);
    console.log('success : ', success);
  } catch (error) { console.error(error); }
}

// 선택한 Artist를 반환하는 함수, 없으면 undefined를 반환한다.
function getSelectedArtist (): Artist | undefined {
  const selectedRows = grdApi.value.getSelectedRows();
  // 선택한 아티스트가 없는 경우 
  if (!selectedRows.length) {
    alert('아티스트를 선택해주세요!');
    return;
  }
  return selectedRows[0];
}

// Grid에서 선택된 Artist를 삭제하는 함수
function deleteSelectedArtist () {
  const artist: Artist | undefined = getSelectedArtist();
  if (!artist) { return; }
  const confirmResult: boolean = confirm('정말 삭제하시겠습니까?');
  if (!confirmResult) { return; }
  artistStore.removeArtist(artist._id);
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
function onSelectionChanged() {
  const artist: Artist | undefiend = getSelectedArtist();
  if (!artist) { return; }
  inputArtist.value = artist;
  inputArtistOrg.value = JSON.parse(JSON.stringify(inputArtist.value));
  const groupId: string | undefiend = artist.group?._id;
  artistGroup.value = groupId && groups.value.find((group) => group.id === groupId);
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
    ... gridFields.map((field) => ({ headerName: field.text, field: field.key, width: 150, cellStyle : {textAlign: 'left'} })),
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