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
                        <q-file :ref='el => { divs["logo"] = el }' outlined v-model="groupParams.logo" accept=".jpg, .png, image/*" @rejected="onRejected">
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
                        <date-picker :ref='el => { divs["debutDate"] = el }' :id="groupParams.debutDate" v-model='groupParams.debutDate' :clearable='true'/>
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
import {defineComponent, ref, defineProps,} from 'vue';
import { useQuasar } from 'quasar';
import _ from 'lodash';
import mixinPageCommon from '../mixin/mixinPageCommon';
import ccobject from '@/composables/createComObject';
import cinitial from '@/composables/comInitialize';
import cscript from '@/composables/comScripts';
import caggrid, { DateFormatter } from '@/composables/customAgGridUtils';
import {Group, GroupType} from '@/types/Group';
import {CommonMapList, ToSaveData } from '@/types/CommonTypes';
import {CellFocusedEvent, GetRowIdParams, GridOptions, RowNode } from '@ag-grid-community/core';
import {useGroupStore} from '@/stores/group';

export default defineComponent({
    name        : 'Group',
    mixins: [mixinPageCommon],
    setup(){
        const $q = useQuasar()
        const groupParams = ref({} as Group);
        const groupParamsOrgData = ref({} as Group);
        const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(['artist']);

        // 템플릿 내 ref 사용을 위한 div 변수 셋팅
        const divs = ref({} as { [key: string]: unknown });

        // 아티스트 멀티 셀렉트박스 배열 변수
        const artistList = ref([] as string[]);
        const artistListOrgData = ref([] as string[]);

        const groupStore = useGroupStore();
        defineProps<{msg : string}>();

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

        (async () => {
            // 아티스트 정보 가져오기
            const tempList = [{
                'codeNm': '김원필',
                'codeValue': '940428'
            },{
                'codeNm': '윤도운',
                'codeValue': '950825'
            }];

            // 아티스트 셀렉트 옵션
            selectBoxOptions.value.artist = {
                name     : 'artistStatusOptions',
                clearable: true,
                style    : 'width: 250px',
            };
            selectBoxOptions.value.artist.data = await cscript.$getComboOptions(tempList);
        })();

        grdMstCnt.value = 0;
        grdMstProps.value = Object.assign({}, cinitial.$comGridOption, {
            name                         : 'grdMstProps',
            columnDefs                   : [
                {headerName: 'No', valueGetter: 'node.rowIndex + 1', width: 60, sortable: true},
                {headerName: '그룹명', field: 'name', cellStyle : {textAlign: 'left'}, flex: 1},
                {headerName: '영문 그룹명', field: 'englishName', cellStyle : {textAlign: 'left'}, flex: 1},
                {headerName: '데뷔일', field: 'debutDate', cellStyle : {textAlign: 'left'}, flex: 1},
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
            let focusedNodes = _.find(grdApi.value.getRenderedNodes(), (x: RowNode) => x.childIndex === event.rowIndex);
            if (!cscript.$isEmpty(focusedNodes)){
                focusedNodes!.setSelected(true, true);
            }

            // 변경사항 체크
            const msg = '변경된 내용이 있습니다. 신규 작성시 변경 내용이 사라집니다.계속 하시겠습니까?';
            if ((await checkDiffData()) && !confirm(msg)) {
                return;
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
            // 비교 대상 제외를 위해 null 처리
            groupParams.value.artists = null;
            groupParams.value.logo = null;
            groupParamsOrgData.value = _.cloneDeep(groupParams.value);

            // 사실은 그룹 안에 있는 아티스트는 전 멤버가 할당된 것이 아니기 때문에 따로 아티스트 조회가 필요함
            const artistsData = <CommonMapList[]>[];
            _.forEach(n.data.artists, (node: RowNode) => {
                let jsonNode = JSON.parse(JSON.stringify(node));
                artistsData.push(jsonNode);
                artistList.value.push(jsonNode._id);
            });
            selectBoxOptions.value.artist.data = await cscript.$getComboOptions(artistsData);

            // 아티스트 셀렉트 박스 할당
            artistListOrgData.value = _.cloneDeep(artistList.value);
        }

        // 로고 파일 업로드 제한
        function onRejected(){
            alert('.jpg, .png 파일만 업로드 가능합니다.');
        }

        // 변경사항 체크
        async function checkDiffData() {
            let diffMst = false;

            const compResult = await cscript.$compareDatas<Group>(groupParams.value, groupParamsOrgData.value);
            console.log('groupParams.value : ', groupParams.value);
            console.log('groupParamsOrgData.value : ', groupParamsOrgData.value);
            console.log("compResult : ", compResult);

            if (compResult.length != 0) {
                diffMst = true; // 변경 사항 있음.
            }

            // 아티스트 체크 추가 예정

            return diffMst;
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
                (divs.value.debutDate as HTMLInputElement).focus();
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
            grdReset();

            // 데이터 호출
            const groupList = groupStore.getGroups();

            // 그리드 데이터 셋팅
            await grdApi.value.setRowData(groupList);
            // grdMstCnt 셋팅
            grdMstCnt.value = grdApi.value.getDisplayedRowCount();
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

            // 로고 파일 입력창에 포커스
            (divs.value.logo as HTMLInputElement).focus();
        }

        async function fnDelete() {
            await deleteRowData();
        }

        async function deleteRowData() {
            const url = '';
            // const saveResult = await apis.$deleteData(url);
            // alert('저장 완료하였습니다.');
        }

        async function fnSave(){
            // 변경사항 체크
            const groupDiff = await checkDiffData();

            console.log('groupDiff : ', groupDiff);

            if (!groupDiff) {
                alert('변경 사항이 없습니다.')
                return;
            }

            if (!await isMstValid()) {
                return;
            }

            // 저장 데이터 생성
            const toSaveData = Object.assign({} as ToSaveData, groupParams.value);
            // console.log('toSaveData', toSaveData);
            await saveRowData(toSaveData);
        }

        async function saveRowData(toSaveData: ToSaveData) {
            const url = '';
            // const saveResult = await apis.$saveData(url, toSaveData);
            // alert('저장 완료하였습니다.');
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