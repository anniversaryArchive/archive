<template>
  <div>
    <layout-header></layout-header>

    <div class="row bg-div">
      <q-card class="my-card info-card col-3 mr-12" color="white">
        <q-card-section>
          <br>
          {{archiveSchParams.group}}
          <br>
          <ul>
            <li class="card-title pb-3">프로필 정보</li>
            <li class="info-text pb-5">닉네임</li>
          </ul>

          <div>
            <h1 class="search-text">그룹 선택</h1>
            <select-box
                id="artist"
                v-model="archiveSchParams.group"
                v-bind="selectBoxOptions.group"
                style="width: 100%"
                :multiplied="false"
                use-chips
            />
            <h1 class="search-text">기간 선택</h1>
            <com-period-date-picker
                v-model="archiveSchParams"
                :clearable="true"
                :disabled="false"
                :readonly="false"
                beginDeNm="schBeginDe"
                endDeNm="schEndDe"
            />

            <div class="btn-box">
              <q-btn type="button" class="" @click="resetFunc"> 초기화 </q-btn>
              <q-btn type="button" class="search-btn" @click="searchBtnFunc"> 검색 </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="my-card favorite-card col-8" color="white">
        <q-card-section>
          <ul>
            <li class="card-title pb-3">즐겨찾기</li>
            <li>
              <div class="list-order">
                <q-select class="order-select" v-model="orderData" :options="orderOptions"
                          @update:model-value="orderSelectChange()"
                          borderless style="width: 50%"></q-select>
              </div>
            </li>
          </ul>

<!--          <ul class="favor-list row">
            <li class="col-2">몬스타엑스</li>
            <li class="col-1">형원</li>
            <li class="col-8 cafe-text">
              나의 하루는 오늘도 너에게
              <span>@with_my_H</span>
            </li>
            <li class="col-1 text-right"><font-awesome-icon :icon="['fas', 'heart']" style="color: #4e84c1" /></li>
          </ul>-->
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch} from 'vue';
import mixinPageCommon from "@/pages/mixin/mixinPageCommon"
import {ArchiveSearchParams} from "@/types/Archive"
import cscript from "@/composables/comScripts"
import ccobject from "@/composables/createComObject"
import { useFavoriteGroupStore } from '@/stores/favoriteGroup';
import {Pagination, variables} from '@/types/CommonTypes';
import moment from 'moment/moment';
import {useFavoriteArchiveStore} from '@/stores/favoriteArchive';
import { useQuasar } from 'quasar';
import {FavoriteArchive} from '@/types/Favorite';
import _ from 'lodash';

export default defineComponent({
  name: "favorite",
  components: {},
  mixins: [mixinPageCommon],
  setup() {
    const $q = useQuasar()
    const archiveParams = ref({} as FavoriteArchive)

    const groupList = ref([] as string[])

    const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(["group"]);
    const {schParams: archiveSchParams} = ccobject.$createSchParams<ArchiveSearchParams>();

    const favoriteGroupsStore = useFavoriteGroupStore();
    const favoriteArchiveStore = useFavoriteArchiveStore();

    const orderOptions = [{
      'label': '최신순',
      'value': 'newest',
    }, {
      'label': '오래된순',
      'value': 'oldest',
    }];

    const orderData = ref({
      'label': '최신순',
      'value': 'newest',
    });

    const paginationData = ref({
      current: 1,
      perPage: 10,
    } as Pagination);

    onBeforeMount(() => {
      initialize();
    });

    const initialize = () => {
      favoriteGroupsStore.getFavoriteGroupState();
    };

    watch(() => favoriteGroupsStore.favoriteGroups, async () => {
      const favoriteGroupsList = JSON.parse(JSON.stringify(favoriteGroupsStore.favoriteGroups));
      selectBoxOptions.value.group = {
        name     : 'favoriteGroupsStatusOptions',
        clearable: true,
        style    : 'width: 250px',
      };
      if(favoriteGroupsList.FavoriteGroupList){
        selectBoxOptions.value.group.data = await cscript.$getComboOptions(favoriteGroupsList.FavoriteGroupList);
      }

      //초기값 셋팅
      archiveSchParams.value.group = null;
    });

    watch(() => favoriteArchiveStore.favoriteArchives, async () => {
      // 카페 목록 초기화 및 검색 버튼 이후에 할당 ? 일단 작성 후 추가
      let archiveList = JSON.parse(JSON.stringify(favoriteArchiveStore.favoriteArchives));

      // orderData 확인 (최신순, 오래된순)
      archiveList = orderDataFunc(archiveList, orderData.value.value);
      archiveParams.value = _.cloneDeep(archiveList);
      console.log(archiveParams.value);

      // 페이지네이션 설정


     });

    function resetFunc() {
      const msg = "초기화 하시겠습니까?"
      if (!confirm(msg)) {
        return
      }

      // 검색 조건
      archiveSchParams.value = {
        group: null,
      } as ArchiveSearchParams;

      reset();
    }

    // 필수 입력 항목 체크
    async function isMstValid() {
      if (cscript.$isEmpty(archiveSchParams.value.group)) {
        alert('그룹 선택은 필수입니다.');
        return false;
      }
      return true
    }

    async function searchBtnFunc() {
      // 검색 조건 확인
      if (!(await isMstValid())) {
        return
      }

      searchData();
      reset();
    }

    function searchData() {
      const searchDate = {
        "start": archiveSchParams.value.schBeginDe ? moment(archiveSchParams.value.schBeginDe).format('YYYY-MM-DD') : "",
        "end": archiveSchParams.value.schEndDe ? moment(archiveSchParams.value.schEndDe).format('YYYY-MM-DD') : ""
      }

      const result = {
        page : paginationData.value.current-1,
        perPage: paginationData.value.perPage,
        group: archiveSchParams.value.group,
      } as variables;

      favoriteArchiveStore.getFavoriteArchives(result, searchDate);
    }

    function reset() {
      // 카페 목록
      archiveParams.value = {} as FavoriteArchive;

      // 페이지네이션
      paginationData.value.maxCnt = null;
    }

    function orderSelectChange() {
      if(cscript.$isEmpty(archiveParams.value)){
        const changeData = orderDataFunc(archiveParams.value, orderData.value.value);
        archiveParams.value = _.cloneDeep(changeData);
      }
    }

    function orderDataFunc(list: any, key: string) {
      switch (key) {
        case 'newest': return descOrdSortDate(list);
        case 'oldest': return ascOrdSortDate(list);
        default: return list;
      }
    }

    // 오름차순
    function ascOrdSortDate(list : any) {
      return list.sort(function (a: { startDate: string | number | Date; }, b: { startDate: string | number | Date; }) {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
    }

    // 내림차순
    function descOrdSortDate(list : any) {
      return list.sort(function (a: { startDate: string | number | Date; }, b: { startDate: string | number | Date; }) {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }).reverse();
    }

    return {
      groupList,
      archiveSchParams,
      selectBoxOptions,
      orderData,
      orderOptions,
      resetFunc,
      searchBtnFunc,
      orderSelectChange
    }
  }
})
</script>

<style scoped></style>
