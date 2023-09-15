<template>
  <div>
    <layout-page-title
        :fnCallFunc="fnCallFunc"
    />

    <div class='form_table'>
      <table>
        <colgroup>
          <col style='width:120px'/>
          <col style='width:auto'/>
          <col style='width:120px'/>
          <col style='width:auto'/>
        </colgroup>
        <tbody>
        <tr>
          <th>로고 파일</th>
          <td colspan="3">
            <q-file :ref='el => { divs["logo"] = el }' outlined
              v-model="(groupParams.logo as File)"
              accept=".jpg, .png, image/*" @rejected="onRejected">
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </td>
        </tr>
        <tr>
          <th>그룹명</th>
          <td>
            <q-input :ref='el => { divs["name"] = el }' v-model="groupParams.name" :dense="true" maxlength="100" outlined/>
          </td>
          <th>영문 그룹명</th>
          <td>
            <q-input :ref='el => { divs["englishName"] = el }' v-model="groupParams.englishName" :dense="true" maxlength="100" outlined/>
          </td>
        </tr>
        <tr>
          <th>데뷔일</th>
          <td colspan="3">
            <date-picker :ref='(el: any) => { divs["debutDate"] = el }' :id="groupParams.debutDate" v-model='groupParams.debutDate' :clearable='true'/>
          </td>
        </tr>
        <tr>
          <th>아티스트</th>
          <td colspan="3">
            <select-box id="artist" v-model='artistList' v-bind='selectBoxOptions.artist' style="width: 100%;"
                        :multiplied='true'
                        use-chips/>
          </td>
        </tr>
        <tr>
          <th>공식 컬러</th>
          <td colspan="3">
            <q-input outlined v-model="groupParams.color">
              <template v-slot:append>
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-color v-model="groupParams.color" />
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
        <h6>그룹 목록</h6>
        <p class='num'>[총 {{ grdMstCnt }} 건]</p>
      </div>
      <div id='grdMstArea' class="grid_edge">
        <div class='default-list'>
          <ag-grid-vue
              id='grdMst'
              ref='grdMst'
              v-bind='grdMstProps'
              class='ag-theme-balham'
              @grid-ready="onGridReady"
              @cell-focused="onMstCellFocused"
              @pagination-changed="onPaginationChanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onBeforeMount, watch} from 'vue';
import _ from 'lodash';
import mixinPageCommon from '../mixin/mixinPageCommon';
import ccobject from '@/composables/createComObject';
import cinitial from '@/composables/comInitialize';
import cscript from '@/composables/comScripts';
import caggrid, { DateFormatter } from '@/composables/customAgGridUtils';
import {Group, GroupType} from '@/types/Group';
import {ToSaveData} from '@/types/CommonTypes';
import {CellFocusedEvent, GetRowIdParams, GridOptions, RowNode } from '@ag-grid-community/core';
import {useGroupStore} from '@/stores/group';
import {useArtistStore} from '@/stores/artist';
import axios from 'axios';
import moment from 'moment';

export default defineComponent({
  name        : 'Group',
  mixins: [mixinPageCommon],
  setup(){
    const groupParams = ref({} as Group);
    const groupParamsOrgData = ref({} as Group);
    const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(['artist']);

    // 템플릿 내 ref 사용을 위한 div 변수 셋팅
    const divs = ref({} as { [key: string]: unknown });

    // 아티스트 멀티 셀렉트박스 배열 변수
    const artistList = ref([] as string[]);
    const artistListOrgData = ref([] as string[]);

    let pCurMstRowKey = -1;

    // 데이터 초기화
    groupParams.value = cinitial.$inItData('', GroupType) as unknown as Group;
    groupParamsOrgData.value = cinitial.$inItData('', GroupType) as unknown as Group;

    // 그리드 변수
    const {
      grdApi,
      //columnApi,
      grdCnt   : grdMstCnt,
      grdColKey: grdMstKey,
      grdProps : grdMstProps,
      onGridReady,
      onPaginationChanged,
    } = ccobject.$createComGrd<Group>();

    // 그리드 키 컬럼 명 변경 => 기본 id
    grdMstKey.value = '_id';

    // 그룹 + 아티스트 목록
    const groupStore = useGroupStore();
    const artistStore = useArtistStore();

    onBeforeMount(() => {
      initialize();
    });

    const initialize = () => {
      groupStore.getGroups();
      artistStore.getArtists();
    }

    watch(() => artistStore.artists, async () => {
      const artistList = JSON.parse(JSON.stringify(artistStore.artists));

      selectBoxOptions.value.artist = {
        name     : 'artistStatusOptions',
        clearable: true,
        style    : 'width: 250px',
      };
      selectBoxOptions.value.artist.data = await cscript.$getComboOptions(artistList);
    });

    let findKey : string;

    // 생성/수정/삭제 이벤트 발생 시 변경된 groups를 watch하여 grid를 update 해준다.
    watch(() => groupStore.groups, async () => {
      grdReset();

      await grdApi.value.setRowData(groupStore.groups);
      grdMstCnt.value = grdApi.value.getDisplayedRowCount();

      // 그리드 포커스
      const findRowIndex = !cscript.$isEmpty(findKey) ? _.findIndex(groupStore.groups, (x: { [x: string]: any; }) => String(x[grdMstKey.value]) === findKey) : 0;
      grdApi.value.setFocusedCell(findRowIndex, grdMstKey.value);
    });

    grdMstCnt.value = 0;
    grdMstProps.value = Object.assign({}, cinitial.$comGridOption, {
      name                         : 'grdMstProps',
      columnDefs                   : [
        {headerName: 'No', valueGetter: 'node.rowIndex + 1', width: 60, sortable: true},
        {headerName: '그룹명', field: 'name', cellStyle : {textAlign: 'left'}, flex: 1},
        {headerName: '영문 그룹명', field: 'englishName', cellStyle : {textAlign: 'left'}, flex: 1},
        {headerName: '데뷔일', field: 'debutDate', cellStyle : {textAlign: 'left'}, flex: 1, valueFormatter: DateFormatter},
        {headerName: 'ID', field: '_id', hide: true}
      ],
      rowData                      : [],
      getRowId                     : (params: GetRowIdParams) => params.data._id,
      style                 : caggrid.$getGridStyle(10), // 보여주고싶은 행 숫자
      pagination        : true,
      paginationAutoPageSize: true,
      animateRows       : true,
      rowSelection      : 'single',
    } as GridOptions) as unknown as typeof grdMstProps.value;

    // 그리드 셀 포커스
    async function onMstCellFocused(event: CellFocusedEvent) {
      // 포커스 셀 변경시 해당셀의 행 선택
      const focusedNodes = _.find(grdApi.value.getRenderedNodes(), (x: RowNode) => x.childIndex === event.rowIndex);

      // 변경사항 체크
      const msg = '변경된 내용이 있습니다. 신규 작성시 변경 내용이 사라집니다.계속 하시겠습니까?';
      if ((await checkDiffData()) && !confirm(msg)) {
        return;
      }

      if (!cscript.$isEmpty(focusedNodes)){
        focusedNodes!.setSelected(true, true);
      }

      // 선택 셀 상세 셋팅
      await detailSetting(focusedNodes!);
    }

    async function detailSetting(n: RowNode){
      // 아티스트 초기화
      artistList.value.splice(0, artistList.value.length);
      artistListOrgData.value = _.cloneDeep(artistList.value);

      // 현재 그리드 rowIndex 기억 (선택된 행 구분시 사용)
      pCurMstRowKey = n.rowIndex ?? -1;

      // 그룹 입력 form 할당
      groupParams.value = _.cloneDeep(n.data);
      // groupParams.value = _.cloneDeep(JSON.parse(JSON.stringify(n.data)));
      // 비교 대상 제외를 위해 null 처리
      groupParams.value.artists = null;
      groupParams.value.debutDate = moment(groupParams.value.debutDate).format('YYYYMMDD');
      groupParamsOrgData.value = _.cloneDeep(groupParams.value);

      // 아티스트 셀렉트 박스 할당
      _.forEach(n.data.artists, (node: RowNode) => {
        let jsonNode = JSON.parse(JSON.stringify(node));
        artistList.value.push(jsonNode._id);
      });
      artistListOrgData.value = _.cloneDeep(artistList.value);
    }

    // 로고 파일 업로드 제한
    function onRejected(){
      alert('.jpg, .png 파일만 업로드 가능합니다.');
    }

    // 변경사항 체크
    async function checkDiffData(gridGb = 'All') {
      let diffMst = false;
      let artistDiff = false;
      let logoDiff = false;

      if (gridGb == 'Mst' || gridGb == 'All') {
        const compResult = await cscript.$compareDatas<Group>(groupParams.value, groupParamsOrgData.value, ['logo']);
        // console.log("compResult : ", compResult);

        if (compResult.length != 0) {
          diffMst = true; // 변경 사항 있음.
        }
      }

      // 아티스트 비교
      if (gridGb == 'DtlArt' || gridGb == 'All') {
        if (artistList.value.length !== artistListOrgData.value.length){
          artistDiff = true;
        }

        // 배열 순서 없이 비교
        const uniqueValues = new Set([...artistList.value, ...artistListOrgData.value]);
        for (const v of uniqueValues) {
          const artistCount = artistList.value.filter(e => e === v).length;
          const artistOrgCount = artistListOrgData.value.filter(e => e === v).length;
          if (artistCount !== artistOrgCount) artistDiff = true;
        }
      }

      // 로고 파일 변경 확인
      if (gridGb == 'DtlLogo' && groupParams.value.logo) {
        const logoData = JSON.parse(JSON.stringify(groupParams.value.logo));
        if(!logoData.name){
          logoDiff = true; // 변경 사항 있음.
        }
      }

      //return gridGb == 'Mst' ? diffMst : gridGb === 'DtlArt' ? artistDiff : gridGb === 'DtlLogo' ? logoDiff : ((diffMst || artistDiff || logoDiff));
      switch (gridGb) {
        case 'Mst': return diffMst;
        case 'DtlArt': return artistDiff;
        case 'DtlLogo': return logoDiff;
        default: return diffMst || artistDiff || logoDiff;
      }
    }

    // 필수 입력 항목 체크
    async function isMstValid() {
      // 로고, 그룹명, 영문 그룹명. 데뷔일
      if (cscript.$isEmpty(groupParams.value.logo)) {
        alert('로고 파일은 필수입니다.');
        (divs.value.logo as HTMLInputElement).focus();
        return false;
      }
      if (cscript.$isEmpty(groupParams.value.name)) {
        alert('그룹명은 필수입니다.');
        (divs.value.name as HTMLInputElement).focus();
        return false;
      }
      if (cscript.$isEmpty(groupParams.value.englishName)) {
        alert('영문 그룹명은 필수입니다.');
        (divs.value.englishName as HTMLInputElement).focus();
        return false;
      }
      if (cscript.$isEmpty(groupParams.value.debutDate)) {
        alert('데뷔일은 필수입니다.');
        return false;
      }
      return true;
    }

    // 그리드 초기화
    function grdReset() {
      grdApi.value.setRowData([]);
      grdMstCnt.value = 0;
      grdApi.value.deselectAll();
      pCurMstRowKey = -1;

      // 그룹 초기화
      groupParams.value = {} as Group;
      groupParamsOrgData.value = _.cloneDeep(groupParams.value);

      // 아티스트 초기화
      artistList.value.splice(0, artistList.value.length);
      artistListOrgData.value = _.cloneDeep(artistList.value);
    }

    async function fnInquire() {
      const msg = '변경된 내용이 있습니다. 신규 작성시 변경 내용이 사라집니다.계속 하시겠습니까?';
      if ((await checkDiffData()) && !confirm(msg)) {
        return;
      }

      // 조회 호출
      await getMstList();
    }

    // 그리드 조회
    async function getMstList(pkKey?: string | number) {
      // 그리드 데이터 초기화
      await grdReset();

      // 그리드 데이터 셋팅
      await grdApi.value.setRowData(groupStore.groups);
      // grdMstCnt 셋팅
      grdMstCnt.value = grdApi.value.getDisplayedRowCount();

      // 그리드 포커스
      const findRowIndex = !cscript.$isEmpty(pkKey) ? _.findIndex(groupStore.groups, (x: { [x: string]: any; }) => String(x[grdMstKey.value]) === pkKey) : 0;
      grdApi.value.setFocusedCell(findRowIndex, grdMstKey.value);
    }

    async function fnNew() {
      const msg = '변경된 내용이 있습니다. 신규 작성시 변경 내용이 사라집니다.계속 하시겠습니까?';
      if ((await checkDiffData()) && !confirm(msg)) {
        return;
      }

      // 데이터 초기화
      groupParams.value = {} as Group;
      groupParamsOrgData.value = _.cloneDeep(groupParams.value);

      // 아티스트 배열 초기화
      artistList.value.splice(0, artistList.value.length);
      artistListOrgData.value = _.cloneDeep(artistList.value);

      // 그리드 선택 해제 (포커스 먹으려면 await)
      await grdApi.value.deselectAll();
      pCurMstRowKey = -1;

      // 로고 파일 입력창에 포커스
      (divs.value.logo as HTMLInputElement).focus();
    }

    async function fnDelete() {
      if(!groupParams.value._id){
        alert('조회 후 삭제할 그룹을 선택하세요.');
        return;
      }

      const confirmResult: boolean = confirm('정말 삭제하시겠습니까?');
      if (!confirmResult) { return; }

      await groupStore.removeGroup(groupParams.value._id);

      alert('삭제되었습니다.');
      await getMstList();
    }

    async function fnSave(){
      // 변경사항 체크
      const groupDiff = await checkDiffData('Mst');
      const artistDiff = await checkDiffData('DtlArt');
      const logoDiff = await checkDiffData('DtlLogo');

      if (!(groupDiff || artistDiff || logoDiff)) {
        alert('변경 사항이 없습니다.')
        return;
      }

      if (!await isMstValid()) {
        return;
      }

      // 로고 파일 저장
      const logoData = JSON.parse(JSON.stringify(groupParams.value.logo));

      // 로고 파일 변경 확인
      let logoId: string;
      if(!logoData.name){
        const result = await fileChange();
        if(!result){
          alert('로고 파일 저장 시 오류가 발생했습니다.');
          return;
        }else {
          logoId = result!;
        }
      }else {
        logoId = logoData._id;
      }

      // 저장 데이터 생성
      let artistListSave : unknown[] = [];
      Object.entries(artistList.value).forEach(([, val]) => {
        artistListSave.push(val);
      });
      // console.log('artistList.value : ', artistList.value);

      const toSaveInfo = {
        name        : groupParams.value.name,
        englishName : groupParams.value.englishName,
        debutDate   : moment(groupParams.value.debutDate).format('YYYY-MM-DD'),
        artists     : artistListSave ? artistListSave : null,
        logo        : logoId,
        color       : groupParams.value.color ? groupParams.value.color : null
      }

      const toSaveData = Object.assign({} as ToSaveData, toSaveInfo);
      // console.log('toSaveData : ', toSaveData);

      if(!groupParams.value._id){ // 신규
        await createGroupData(toSaveData);
      } else {
        await updateGroupData(toSaveData);
      }
    }

    async function createGroupData(toSaveData: ToSaveData) {
      const saveResult = await groupStore.createGroup(toSaveData);

      if(!saveResult){
        alert('오류가 발생하였습니다.');
        return;
      }

      alert('저장 완료하였습니다.');

      // 저장 후 새로고침 및 조회
      findKey = (String(saveResult));
    }

    async function updateGroupData(toSaveData: ToSaveData) {
      const saveResult = await groupStore.updateGroup(groupParams.value._id, toSaveData);

      if(!saveResult){
        alert('오류가 발생하였습니다.');
        return;
      }

      alert('저장 완료하였습니다.');

      // 저장 후 새로고침 및 조회
      findKey = groupParams.value._id;
    }

    async function fileChange(){
      if (!groupParams.value.logo) { return; }
      const formData = new FormData();
      formData.append("file", groupParams.value.logo as Blob);
      let resultModel;
      await axios.post(`${import.meta.env.VITE_API_URL}/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        resultModel = response.data.data._id;
      }).catch((error) => {
        resultModel = false;
      })

      return resultModel;
    }

    function fnCallFunc(id: string) {
      switch (id) {
        case 'inquire'  :   // 조회
          fnInquire();
          break;
        case 'create'   :   // 신규
          fnNew();
          break;
        case 'delete'   :   // 삭제
          fnDelete();
          break;
        case 'save'     :   // 저장
          fnSave();
          break;
        default:
          break;
      }
    }

    return{
      divs,
      fnCallFunc,
      grdMstCnt,
      grdMstProps,
      onGridReady,
      onMstCellFocused,
      onPaginationChanged,
      groupParams,
      selectBoxOptions,
      onRejected,
      artistList,
    };
  }
});

</script>

<style scoped>
.form_table {
  padding: 20px 10px;
}

.form_table table {
  border-collapse : collapse;
  border-spacing  : 0;
  font-size       : 12px;
  text-align      : center;
  width           : 100%;
  table-layout    : fixed;
  border-top      : 1px solid #DDF1FF;
  border-bottom   : 1px solid #DDF1FF;
  letter-spacing  : -0.07em;
}

.form_table table thead tr th {
  background    : rgba(79, 190, 159, 0.2);
  height        : 26px;
  border-bottom : 1px solid #CCEFF1;
  padding       : 7px 0;
}

.form_table table tbody tr th {
  background    : #DDF1FF;
  height        : 26px;
  border-bottom : 1px solid #A8E3F1;
  text-align    : center;
  padding       : 5px 0;
  line-height   : 26px;
}

</style>