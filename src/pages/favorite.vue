<template>
  <div class="xl-flex flex-col justify-center h-full">
    <div class="row bg-div">
      <q-card class="my-card info-card col-xl-3 col-xs-12" color="white">
        <q-card-section>
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

      <q-card class="my-card favorite-card col-xl-8 col-xs-12" color="white">
        <ul class="row">
          <li class="card-title col-xl-10 col-xs-8">
            즐겨찾기
          </li>
          <li class="card-title col-xl-2 col-xs-4">
            <q-select class="order-select" v-model="orderData" :options="orderOptions"
                      @update:model-value="orderSelectChange()" borderless ></q-select>
          </li>
        </ul>

        <q-card-section class="q-card-box">
          <ul v-for="(item) in archiveParams" v-bind:key="item._id" class="favor-list row">
            <li class="col-2">{{item.archive.group?.name}}</li>
            <li class="col-2">{{item.archive.artist?.name}}</li>
            <li class="col-7 cafe-text" @click="detailBtnFunc(item.archive._id)">
              {{item.archive.themeName}}
              <span>{{item.archive.organizer}}</span>
            </li>
            <li class="col-1 text-right">
              <q-button class="text-right" @click="onClickFavoriteIcon(item.archive)">
                <q-icon :name="`favorite${!item.archive.favorite && '_outline'}`"
                        class="inline-block" />
              </q-button>
            </li>
          </ul>
        </q-card-section>

        <footer>
          <div class="pagination justify-center mt-4 row q-mt-md q-mb-md">
            <q-pagination
              v-model="paginationData.current"
              direction-links
              :max="maxPage"
              @update:model-value="onChangePage" />
          </div>
        </footer>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent, onBeforeMount, ref, Ref, watch} from 'vue';
import mixinPageCommon from "@/pages/mixin/mixinPageCommon"
import {Archive, ArchiveSearchParams} from '@/types/Archive';
import cscript from "@/composables/comScripts"
import ccobject from "@/composables/createComObject"
import { useFavoriteGroupStore } from '@/stores/favoriteGroup';
import {Pagination, Variables} from '@/types/CommonTypes';
import moment from 'moment/moment';
import {useFavoriteArchiveStore} from '@/stores/favoriteArchive';
import {FavoriteArchive} from '@/types/Favorite';
import _ from 'lodash';
import {mutate} from '@/composables/graphqlUtils';
import createFavorite from '@/graphql/createFavorite.mutate.gql';
import removeFavorite from '@/graphql/removeFavorite.mutate.gql';
import {useUserStore} from '@/stores/user';

export default defineComponent({
  name: "favorite",
  components: {},
  mixins: [mixinPageCommon],
  setup() {
    const archiveParams: Ref<FavoriteArchive[]> = ref([])
    const groupList = ref([] as string[])

    const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(["group"]);
    const {schParams: archiveSchParams} = ccobject.$createSchParams<ArchiveSearchParams>();

    const userStore = useUserStore();
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

    // pagination 관련 변수
    const paginationData = ref({
      current: 1,
      perPage: 10,
    } as Pagination);
    const total: Ref<number> = ref(0);
    const perPage: number = 10;
    const maxPage: ComputedRef<number> = computed(() => Math.ceil(total.value / perPage));

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
      if(favoriteGroupsList){
        selectBoxOptions.value.group.data = await cscript.$getComboOptions(favoriteGroupsList);
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
        schBeginDe: '',
        schEndDe: ''
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
      } as Variables;

      favoriteArchiveStore.getFavoriteArchives(result, searchDate);
    }

    function reset() {
      // 카페 목록
      archiveParams.value = [];

      // 페이지네이션
      paginationData.value.maxCnt = null;
    }

    function orderSelectChange() {
      if(!cscript.$isEmpty(archiveParams.value)){
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
      return list.sort(function (a: {
        archive: {
          startDate: string | number | Date;
        }
      }, b: {
        archive: {
          startDate: string | number | Date;
        }
      }) {
        return new Date(a.archive.startDate).getTime() - new Date(b.archive.startDate).getTime();
      });
    }

    // 내림차순
    function descOrdSortDate(list : any) {
      return list.sort(function (a: {
        archive: {
          startDate: string | number | Date;
        }
      }, b: {
        archive: {
          startDate: string | number | Date;
        }
      }) {
        return new Date(a.archive.startDate).getTime() - new Date(b.archive.startDate).getTime();
      }).reverse();
    }

    function detailBtnFunc(id: string | undefined) {
      if (!id) { return; }
      this.$router.push(`/archive/${id}`);
    }

    // 즐겨찾기 아이콘 클릭 시
    async function onClickFavoriteIcon(item: Archive) {
      let success: boolean = false;
      try {
        if(item.favorite && item._id) {
          success = await doRemoveFavorite(item._id);
        }else if(item._id) {
          success = await doCreateFavorite(item._id);
        }

        if(!success) { return; }

        item.favorite = !item.favorite;
        return item.favorite
      } catch(_) {}
    }

    async function doCreateFavorite(_id: string): Promise<boolean> {
      try {
        const { data } = await mutate(createFavorite, { archive: _id });
        return !!data.favorite?._id;
      } catch (_) {}
      return false;
    }

    async function doRemoveFavorite(_id: string): Promise<boolean> {
      try {
        const { data } = await mutate(removeFavorite, { archive: _id });
        return data.success && true;
      } catch (_) {}
      return false;
    }

    // 페이지 변경 시
    function onChangePage() {
      searchData();
    }

    return {
      groupList,
      archiveParams,
      archiveSchParams,
      selectBoxOptions,
      orderData,
      orderOptions,
      paginationData,
      maxPage,
      resetFunc,
      detailBtnFunc,
      searchBtnFunc,
      orderSelectChange,
      onClickFavoriteIcon,
      onChangePage
    }
  }
})
</script>

<style scoped>
.xl-flex {
  display: flex;
  flex-wrap: wrap;
}

footer .pagination {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 모바일 화면 */
@media screen and (max-width: 767px) {
  .xl-flex {
    display: block;
    flex-wrap: nowrap;
  }

  footer .pagination {
    position: relative;
    margin-bottom: 0;
  }

  .q-card-box {
    padding: 0 0 10px;
  }

  .favor-list {
    padding: 10px;
  }

  .favor-list li {
    font-size: 12px;
  }
}
</style>
