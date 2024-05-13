<template>
  <div class="cafe-map-mobile">
    <div class="search-box">
      <!-- 선택한 그룹 Input -->
      <q-input v-if="groupData" borderless class="group-input" v-model="groupData.name" readonly>
        <template v-slot:prepend>
          <q-btn flat class="q-button list-btn" @click="bottomDialogClick('cafe')">
            <img src="@/assets/images/icon/list-icon.png" alt="list">
          </q-btn>
          <q-avatar>
            <img :src="groupData.logo?.path" alt="logo">
          </q-avatar>
        </template>
      </q-input>
      <!--필터 버튼-->
      <q-btn class="q-button filter-btn" color="primary" @click="bottomDialogClick('search')">
        <img src="@/assets/images/icon/filter-icon.svg" style="width: 20px" alt="filter">
      </q-btn>
    </div>

    <!-- 카페 목록 -->
    <BottomDialog :show="isShowCafeListBottomDialog" @hide="isShowCafeListBottomDialog = false"
                  :backdrop-none="true" :height="'60%'" class="cafe-bottom-dialog" :title-none="true"
                  :class="{ 'favorite-hidden': !isShowCafeListBottomDialog }">

      <template #content>
        <q-btn class="map-view-btn" color="primary" @click="isShowCafeListBottomDialog = false">
          지도보기
        </q-btn>

        <div class="list-order">
          <q-select
            class="order-select auto-cols-auto"
            v-model="orderData"
            :options="orderOptions"
            @update:model-value="orderSelectChange()"
            borderless
          ></q-select>
          <div v-if="artistNameList.length" class="artist-list">
            <label v-for="name in artistNameList">#{{name}}</label>
          </div>
        </div>

        <q-list v-if="archiveParams">
          <CafeItem
            v-for="archive in archiveParams"
            :archive="archive"
            @click="onClickArchive(archive)"
            @onClickFavorite="onClickFavorite(archive)"
          />
        </q-list>

        <div v-if="paginationData.maxCnt" class="flex q-pa-lg flex-center">
          <q-pagination
            v-model="paginationData.current"
            :max="paginationData.maxCnt"
            @update:model-value="paginationChange()"
            direction-links
          />
        </div>
      </template>
    </BottomDialog>

    <!-- 즐겨찾기 -->
    <BottomDialog :show="isShowFavoriteGroupBottomDialog" @hide="isShowFavoriteGroupBottomDialog = false"
                  :backdrop-none="true" :height="'100%'" class="bottom-dialog"
                  :class="{ 'favorite-hidden': !isShowFavoriteGroupBottomDialog }">
      <template #content>
        <FavoriteGroupList
          :selectable="true"
          :selected="clickedArchive?.favoriteGroup"
          @select="selectFavoriteGroupList"
        />
      </template>
    </BottomDialog>
    <!-- 검색 필터 -->
    <BottomDialog :show="isShowSearchBottomDialog" @hide="isShowSearchBottomDialog = false"
                  :backdrop-none="true" :height="'100%'" class="bottom-dialog"
                  :class="{ 'favorite-hidden': !isShowSearchBottomDialog }">
      <template v-slot:title>검색</template>
      <template v-slot:content>
        <div class="px-4">
          <h1 class="search-text mb-2">아티스트 선택</h1>
          <select-box
            id="artist"
            v-model="artistList"
            v-bind="selectBoxOptions.artist"
            style="width: 100%"
            :multiplied="true"
            use-chips
          />
          <h1 class="search-text mb-2">기간 선택</h1>
          <com-period-date-picker
            v-model="archiveSchParams"
            :clearable="true"
            :disabled="false"
            :readonly="false"
            beginDeNm="schBeginDe"
            endDeNm="schEndDe"
          />
          <h1 class="search-text mb-2">지역 선택</h1>
          <div class="district-container">
            <div v-for="item in districtCode()"
                 :key="item"
                 class="box"
                 :class="{ 'selected': isSelected(item) }"
                 @click="selectItem(item)">
              {{item.name}}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="font-bold text-center border-t border-gray-300">
          <div class="btn-box">
            <q-btn type="button" @click="resetFunc"> 초기화 </q-btn>
            <q-btn type="button" class="search-btn" @click="searchBtnFunc"> 검색 </q-btn>
          </div>
        </div>
      </template>
    </BottomDialog>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeMount, reactive, ref, Ref, toRefs, watch} from 'vue';
import mixinPageCommon from '@/pages/mixin/mixinPageCommon';
import {Group} from '@/types/Group';
import {useQuasar} from 'quasar';
import ccobject from '@/composables/createComObject';
import {Archive, ArchiveSearchParams} from '@/types/Archive';
import {Pagination} from '@/types/CommonTypes';
import {useArtistStore} from '@/stores/artist';
import {useArchiveStore} from '@/stores/archive';
import {useMapStore} from '@/stores/map';
import {useFavoriteGroupStore} from '@/stores/favoriteGroup';
import cscript from '@/composables/comScripts';
import _ from 'lodash';
import moment from 'moment/moment';
import FavoriteGroupList from '@/components/FavoriteGroupList.vue';
import BottomDialog from '@/dialogs/BottomDialog.vue';
import districtCode from '@/lib/districtCode.js';
import CafeItem from '@/components/CafeItem.vue';

export default defineComponent({
  name: 'cafeMapMobile',
  methods: {
    districtCode() {
      return districtCode
    }
  },
  components: {CafeItem, BottomDialog, FavoriteGroupList},
  mixins: [mixinPageCommon],
  setup() {
    const $q = useQuasar();

    // 아티스트 멀티 셀렉트박스 배열 변수
    const { selectBoxOptions: selectBoxOptions } = ccobject.$createSelectAll(['artist']);
    const { schParams: archiveSchParams } = ccobject.$createSchParams<ArchiveSearchParams>();

    const archiveParams: Ref<Archive[]> = ref([]);
    const detailArchive = ref({} as Archive);

    // 아티스트 멀티 셀렉트박스 배열 변수
    const artistList = ref([] as string[]);

    const markerData = ref({} as Archive);
    const mapOptions = {
      latitude: 37.51747, // 지도 중앙 위도
      longitude: 127.000022, // 지도 중앙 경도
      zoom: 13,
      zoomControl: false,
      zoomControlOptions: { position: 'TOP_RIGHT' },
    };

    const orderOptions = [
      { label: '최신순', value: 'newest' },
      { label: '오래된순', value: 'oldest' },
    ];

    const orderData = ref({ label: '최신순', value: 'newest' });

    const paginationData = ref({ current: 1, perPage: 2 } as Pagination);

    const marker = ref([] as unknown);
    const isOpen = ref(true); // false: 안보임, true: 보임

    const artistStore = useArtistStore();
    const archiveStore = useArchiveStore();
    const mapStore = useMapStore();
    const favoriteGroupStore = useFavoriteGroupStore();

    const groupData: Ref<Group | undefined> = ref();
    const artistNameList = ref([] as string[]);
    const isShowSearchBottomDialog: Ref<boolean> = ref(false);
    const isShowCafeListBottomDialog: Ref<boolean> = ref(false);

    const state = reactive({
      selectedItems: [] as Object[],
    });
    const selectItem = (item: any) => {
      const index = state.selectedItems.findIndex((selectedItem: any) => selectedItem === item.code);
      if (index !== -1) {
        state.selectedItems.splice(index, 1);
      } else {
        /*const row = {
          code: item.code,
          name: item.name
        };
        state.selectedItems.push(row);*/
        state.selectedItems.push(item.code);
      }
    };

    const isSelected = (item: any) => {
      return state.selectedItems.some((selectedItem: any) => {
        // return selectedItem.code === item.code;
        return selectedItem === item.code;
      });
    };

    onBeforeMount(() => {
      initialize();
    });

    const initialize = () => {
      const artistFilterData = {
        flds: { group: archiveStore.groupId },
      };
      artistStore.getArtists(artistFilterData);
      getArchives();
      favoriteGroupStore.getFavoriteGroupList();
      groupData.value = archiveStore.group;
    };

    watch(
      () => artistStore.artists,
      async () => {
        const artistList = JSON.parse(JSON.stringify(artistStore.artists));

        selectBoxOptions.value.artist = {
          name: 'artistStatusOptions',
          clearable: true,
          style: 'width: 250px',
        };
        selectBoxOptions.value.artist.data = await cscript.$getComboOptions(artistList);

        //초기값 셋팅
        archiveSchParams.value.artist = null;
      },
    );

    watch(
      () => archiveStore.archives,
      async () => {
        // 카페 목록 초기화 및 검색 버튼 이후에 할당
        if (!cscript.$isEmpty(artistList.value)) {
          const archiveList = JSON.parse(JSON.stringify(archiveStore.archives));
          archiveParams.value = _.cloneDeep(archiveList);

          // 페이지네이션 설정
          paginationData.value.maxCnt = archiveStore.total / paginationData.value.perPage;

          mapStore.setMarkerData(archiveList);
        }
      },
    );

    // 필수 입력 항목 체크
    async function isMstValid() {
      if (cscript.$isEmpty(artistList.value)) {
        alert('아티스트 선택은 필수입니다.');
        return false;
      }
      if(cscript.$isEmpty(state.selectedItems)) {
        alert('지역 번호 선택은 필수입니다.');
        return false;
      }
      return true;
    }

    // 현재 설정값에 맞춰 archiveStore.getArchives를 호출하여, 데이터를 가져오는 함수
    function getArchives() {
      const { schBeginDe, schEndDe } = archiveSchParams.value;

      archiveStore.getArchives({
        page: paginationData.value.current - 1,
        perPage: paginationData.value.perPage,
        filter: {
          flds: {
            artist: Array.from(artistList.value),
            districtCode: state.selectedItems
          }
        },
        search: {
          start: schBeginDe ? moment(schBeginDe).format('YYYY-MM-DD') : '',
          end: schEndDe ? moment(schEndDe).format('YYYY-MM-DD') : '',
        },
        sortOrder: orderData.value.value === 'newest' ? -1 : 1,
        sortField: 'startDate',
      });
    }

    // 아카이브 검색
    async function searchBtnFunc() {
      // 검색 조건 확인
      if (!(await isMstValid())) {
        return;
      }
      searchData();
      reset();
      isShowSearchBottomDialog.value = false;
      isShowCafeListBottomDialog.value = true;
    }

    function searchData() {
      // 검색 데이터 생성
      // let artistListSave: unknown[] = [];
      let selectList : unknown[] | undefined = selectBoxOptions.value.artist.data;
      artistNameList.value = [];
      Object.entries(artistList.value).forEach(([, val]) => {
        // artistListSave.push(val);

        selectList?.forEach((item) => {
          const result = JSON.parse(JSON.stringify(item));
          if(result.value === val) {
            artistNameList.value.push(result.label);
          }
        });
      });
      getArchives();
    }

    function resetFunc() {
      const msg = '초기화 하시겠습니까?';
      if (!confirm(msg)) {
        return;
      }
      // 검색 조건
      artistList.value = [];
      archiveSchParams.value = {
        artist: null,
        schBeginDe: null,
        schEndDe: null
      } as ArchiveSearchParams;
    }

    function reset() {
      // 카페 목록
      archiveParams.value = [];
      // 마커
      markerData.value = {} as Archive;
      // 정보창 열려있으면 닫기
      if (!cscript.$isEmpty(marker.value) && isOpen.value) {
        isOpen.value = _.cloneDeep(!isOpen.value);
      }
      // 페이지네이션
      paginationData.value.maxCnt = null;
    }

    // 정렬 방식 변경 시, 호출되는 함수
    function orderSelectChange() {
      if (cscript.$isEmpty(archiveParams.value)) {
        return;
      }
      getArchives();
    }

    // CafeItem 클릭
    function onClickArchive(archive: Archive) {
      // 모바일인 경우, 바로 상세 페이지로 넘어간다.
      if ($q.screen.xs) return this.$router.push(`/archive/${archive._id}`);
      // 그 외, 맵에서 Info Component를 띄워준다.
      mapStore.selectedArchive = { ...archive };
    }

    function paginationChange() {
      // 정보창 열려있으면 닫기
      if (!cscript.$isEmpty(marker.value) && isOpen.value) {
        isOpen.value = _.cloneDeep(!isOpen.value);
      }
      searchData();
    }

    const clickedArchive: Ref<Archive | null> = ref(null);
    const isShowFavoriteGroupBottomDialog = computed({
      get: () => !!clickedArchive.value,
      set: value => {
        if (value) return;
        clickedArchive.value = null;
      },
    });

    // 즐겨찾기 버튼 클릭 시
    function onClickFavorite(archive: Archive) {
      isShowCafeListBottomDialog.value = false;
      isShowSearchBottomDialog.value = false;
      isShowFavoriteGroupBottomDialog.value = true;
      clickedArchive.value = archive;
    }

    // 즐겨찾기 그룹 선택 완료 시
    async function selectFavoriteGroupList(ids: string[]) {
      try {
        const favoriteGroups = await favoriteGroupStore.updateFavoriteGroupsInArchive(clickedArchive.value!._id, ids);
        clickedArchive.value!.favoriteGroup = favoriteGroups;
        clickedArchive.value!.favorite = favoriteGroups?.length > 0;
      } catch (error) {
        console.error('[ERROR] select favorite group list : ', error);
      } finally {
        isShowFavoriteGroupBottomDialog.value = false;
      }
    }

    function bottomDialogClick(type: String) {
      if(type === 'cafe') {
        isShowCafeListBottomDialog.value = !isShowCafeListBottomDialog.value;
        isShowSearchBottomDialog.value = false;
        isShowFavoriteGroupBottomDialog.value = false;
      }
      if(type === 'search') {
        isShowCafeListBottomDialog.value = false;
        isShowSearchBottomDialog.value = !isShowSearchBottomDialog.value;
        isShowFavoriteGroupBottomDialog.value = false;
      }
    }

    return {
      marker,
      mapOptions,
      isOpen,
      markerData,
      detailArchive,
      artistList,
      selectBoxOptions,
      archiveSchParams,
      archiveParams,
      searchBtnFunc,
      resetFunc,
      orderOptions,
      orderData,
      orderSelectChange,
      paginationData,
      paginationChange,
      onClickFavorite,
      isShowCafeListBottomDialog,
      isShowFavoriteGroupBottomDialog,
      onClickArchive,
      clickedArchive,
      selectFavoriteGroupList,
      isShowSearchBottomDialog,
      groupData,
      artistNameList,
      ...toRefs(state),
      selectItem,
      isSelected,
      bottomDialogClick
    };
  },
});
</script>

<style lang="scss" scoped>
.cafe-map-mobile {
  position: absolute;
  width: 100%;
  height: 100px;
  z-index: 1;

  /* 상단 */
  .search-box {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    gap: 7px;
    border: 0;
    .group-input {
      width: 100%;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
      .list-btn {
        img {
          width: 20px;
          object-fit: cover;
        }
      }
    }
    .filter-btn {
      img {
        -webkit-filter: brightness(0) invert(1);
        filter: brightness(0) invert(1);
      }
    }
  }

  .bottom-dialog {
    height: 90vh;
  }

  .cafe-bottom-dialog {
    height: 78vh;
    bottom: 0;
    position: relative;
  }

  /* 애니메이션 키 프레임 정의 */
  @keyframes slideUp {
    from {
      transform: translateY(100vh); /* 화면의 높이만큼 이동 */
    }
    to {
      transform: translateY(0);
    }
  }

  /* 애니메이션을 적용할 클래스 */
  .slide-up-animation {
    animation: slideUp 0.5s ease forwards;
  }

  /* 기본 숨김 스타일 */
  .favorite-hidden {
    transform: translateY(100vh); /* 초기 상태에서도 화면 밖으로 이동 */
  }

}

.search-text {
  color: #3C3C3C;
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
}

.btn-box {
  button {
    width: 50%;
    height: 70px;
    border: 0;
    background: #D9D9D9;
    color: #767676;
    border-radius: 0;
    margin: 0;
  }

  .search-btn {
    background: #4D8CF4;
    color: #fff;
  }
}

/* 검색필터 : 지역 선택 */
.district-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  .box {
    border-radius: 5px;
    border: 1px solid #CCCCCC;
    padding: 12px 0;
    color: #767676;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .selected {
    background-color: #4D8CF4;
    color: #fff;
  }
}

.list-order {
  display: flex;
  .order-select {
    width: 30%;
  }
  .artist-list {
    white-space: nowrap;
    padding: 15px;
    overflow-y: auto;
    label {
      color: #767676;
      font-size: 14px;
      font-weight: 400;
      border-radius: 50px;
      background: #D9D9D9;
      padding: 5px 8px;
      margin: 0 3px;
    }
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 10px 10px #F6F6F6;
      border-radius: 10px;
      border: solid 6px transparent;
    }
    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 10px 10px #DDD;
      border-radius: 10px;
      border: solid 6px transparent;
    }
  }
}

.map-view-btn {
  border-radius: 30px;
  width: 100px;
  height: 40px;
  font-size: 12px;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
