<template>
  <div>
    <layout-page-title :fnCallFunc="fnCallFunc" />

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
          <tr>
            <th>로고 파일</th>
            <td colspan="3">
              <q-file :ref='el => { refs["logo"] = el }' outlined v-model="groupParams.logo" accept=".jpg, .png, image/*" @rejected="onRejected">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </td>
          </tr>
          <tr>
            <th>그룹명</th>
            <td>
              <q-input :ref='el => { refs["name"] = el }' v-model="groupParams.name" :dense="true" maxlength="100" outlined/>
            </td>
            <th>영문 그룹명</th>
            <td>
              <q-input :ref='el => { refs["englishName"] = el }' v-model="groupParams.englishName" :dense="true" maxlength="100" outlined/>
            </td>
          </tr>
          <tr>
            <th>데뷔일</th>
            <td colspan="3">
              <date-picker :ref='el => { refs["debutDate"] = el }' :id="groupParams.debutDate" v-model='groupParams.debutDate' :clearable='true'/>
            </td>
          </tr>
          <tr>
            <th>아티스트</th>
            <td colspan="3">
              <!--
              <select-box id="artist" v-model='artistList'
                v-bind='selectBoxOptions.artist' style="width: 100%;"
                :multiplied='true' use-chips />
              -->
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
        <h6>아티스트 목록</h6>
        <p class='num'>[총 {{ total }} 건]</p>
      </div>
      <div id='grdMstArea' class="grid_edge">
        <div class='default-list'>
          <ag-grid-vue
            id='grdMst'
            ref='grdMst'
            v-bind='grdMstProps'
            class='ag-theme-balham'
            @grid-ready="onGridReady"
            @pagination-changed="onPaginationChanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, Ref, computed, ComputedRef, watch } from 'vue';
import ccobject from '@/composables/createComObject';
import cinitial from '@/composables/comInitialize';
import cscript from '@/composables/comScripts';
import caggrid from '@/composables/customAgGridUtils';
import { Group, GroupType } from '@/types/Group';
import { useArtistStore } from '@/stores/artist';
import mixinPageCommon from '../mixin/mixinPageCommon';

const gridFields = [
  { key: 'name', text: '아티스트명' },
  { key: 'birthDay', text: '생일' },
  { key: 'group.name', text: '그룹' },
];

function initGrid () {
  const {
    grdApi,
    grdColKey: grdMstKey,
    grdProps: grdMstProps,
    onGridReady,
    onPaginationChanged,
  } = ccobject.$createComGrd<Group>(); // 그리드 변수

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

export default defineComponent({
  mixins: [ mixinPageCommon ],
  setup () {
    const refs: Ref<string, any> = ref({});
    const groupParams: Ref<Group> = ref({} as Group);

    const { grdApi, grdMstKey, grdMstProps, onGridReady, onPaginationChanged } = initGrid();

    const artistStore = useArtistStore();

    onBeforeMount(() => {
      console.log('call on before mount');
      artistStore.getArtists();
    });

    const total: ComputedRef<number> = computed(() => artistStore.total);

    watch(() => artistStore.artists, () => {
      console.log('on change artists : ', artistStore.artists);
      grdApi.value.setRowData(artistStore.artists);
    });

    return {
      refs,
      groupParams,
      grdMstProps,
      onGridReady,
      onPaginationChanged,
      total,
    };
  },
  methods: {
    fnCallFunc (id: string) {
      switch (id) {
        case 'inquire'  :   // 조회
          // fnInquire();
          break;
        case 'create'   :   // 신규
          // fnNew();
          break;
        case 'delete'   :   // 삭제
          // fnDelete();
          break;
        case 'save'     :   // 저장
          // fnSave();
          break;
        default:
            break;
      }
    },
    onRejected () { // 로고 파일 업로드 제한
      alert('.jpg, .png 파일만 업로드 가능합니다.');
    }
  },
})
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