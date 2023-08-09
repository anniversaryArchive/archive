<template>
  <div>
    <layout-header></layout-header>

    <div class="row bg-div">
      <q-card class="my-card info-card col-3 mr-12" color="white">
        <q-card-section>
          <ul>
            <li class="card-title pb-3">프로필 정보</li>
            <li class="info-text pb-5">닉네임</li>
          </ul>

          <div>
            <h1 class="search-text">그룹 선택</h1>
            <select-box
                id="artist"
                v-model="groupList"
                v-bind="selectBoxOptions.group"
                style="width: 100%"
                :multiplied="true"
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
import {Archive, ArchiveSearchParams} from "@/types/Archive"
import cscript from "@/composables/comScripts"
import {useQuasar} from "quasar"
import ccobject from "@/composables/createComObject"
import { useFavoriteStore } from '@/stores/favorite';
import {useUserStore} from '@/stores/user';

export default defineComponent({
  name: "favorite",
  components: {},
  mixins: [mixinPageCommon],
  setup() {
    //const $q = useQuasar()
    //const archiveParams = ref({} as Archive)

    const groupList = ref([] as string[])

    const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(["group"]);
    const {schParams: archiveSchParams} = ccobject.$createSchParams<ArchiveSearchParams>();

    const favoriteGroupsStore = useFavoriteStore();

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
      selectBoxOptions.value.group.data = await cscript.$getComboOptions(favoriteGroupsList.FavoriteGroupList);

      //초기값 셋팅
      archiveSchParams.value.group = null;
    });

    function resetFunc() {
      const msg = "초기화 하시겠습니까?"
      if (!confirm(msg)) {
        return
      }

      // 검색 조건
      /*archiveSchParams.value = {
        artist: null,
      } as ArchiveSearchParams;

      reset();*/
    }

    // 필수 입력 항목 체크
    async function isMstValid() {
      if (cscript.$isEmpty(groupList.value)) {
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
      /*searchData();
      isEarly = true;
      reset();*/
    }

    return {
      groupList,
      archiveSchParams,
      selectBoxOptions,
      resetFunc,
      searchBtnFunc
    }
  }
})
</script>

<style scoped></style>
