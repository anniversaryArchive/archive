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

          <div class="search-box">
            <h1 class="search-text">멤버 선택</h1>
            <select-box id="artist" v-model='artistList' v-bind='selectBoxOptions.artist' style="width: 100%;"
                        :multiplied='true'
                        use-chips/>
            <h1 class="search-text">기간 선택</h1>
            <com-period-date-picker v-model='archiveSchParams'
                                    :clearable="true" :disabled='false' :readonly='false'
                                    beginDeNm="schBeginDe" endDeNm="schEndDe"/>

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
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, ref} from 'vue';
import mixinPageCommon from '@/pages/mixin/mixinPageCommon';
import {ArchiveSearchParams} from '@/types/Archive';
import cscript from '@/composables/comScripts';
import {useQuasar} from 'quasar';
import ccobject from '@/composables/createComObject';

export default defineComponent({
  name      : 'favorite',
  components: {},
  mixins    : [mixinPageCommon],
  setup() {
    const $q = useQuasar();
    const artistList = ref([] as string[]);

    const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(['artist']);
    const {schParams: archiveSchParams} = ccobject.$createSchParams<ArchiveSearchParams>();

    function resetFunc() {
      const msg = '초기화 하시겠습니까?';
      if (!confirm(msg)) {
        return;
      }

      // 검색 조건
      /*archiveSchParams.value = {
        artist: null,
      } as ArchiveSearchParams;

      reset();*/
    }

    // 필수 입력 항목 체크
    async function isMstValid() {
      /*if (cscript.$isEmpty(artistList.value)) {
        alert('아티스트 선택은 필수입니다.');
        return false;
      }*/
      return true;
    }

    async function searchBtnFunc() {
      // 검색 조건 확인
      if (!await isMstValid()) {
        return;
      }
      /*searchData();
      isEarly = true;
      reset();*/
    }

    return {
      artistList,
      archiveSchParams,
      selectBoxOptions,
      resetFunc,
      searchBtnFunc
    }
  }
});
</script>

<style scoped>
.bg-div {
  background: #DDF1FF;
  padding: 64px 210px;
}

.info-card,
.favorite-card {
  padding: 20px;
}

.info-card ul {
  border-bottom: 1px solid #CCCCCC;
}

.card-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
}

.info-text {
  font-weight: 400;
  font-size: 18px;
  line-height: 30px;
}

/**/

.search-box {
  /*padding: 15px;*/
  /*border-bottom: 1px solid #CCCCCC;*/
}

.list-order {
  padding-left: 15px;
  border-bottom: 1px solid #CCCCCC;
}

.search-text {
  padding-top : 15px;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
}

.archive-item {
  border-bottom: 1px solid #CCCCCC;
}

.infowindow-style .archive-item {
  border-bottom: 0;
  padding: 16px;
  width: 300px;
}

.archive-title {
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.archive-account {
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  color: #767676;
}

.archive-address {
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  color: #767676;
}

.btn-box {
  padding-top : 15px;
}

.btn-box button,
.infowindow-btn-box button{
  border: 1px solid #CCCCCC;
  border-radius: 5px;
  margin-bottom: 10px;
}

.search-btn {
  float: right;
}

</style>