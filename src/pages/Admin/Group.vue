<template>
    <div>
        <layout-page-title
                :fnCallFunc="fnCallFunc"
        />
        <br>
        <date-picker :id="groupParams.debutDate" v-model='groupParams.debutDate' :clearable='true'/>
        <br>
        <select-box id="artist" v-model='groupParams.artist' v-bind='selectBoxOptions.artist' />
    </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import mixinPageCommon from '@/pages/mixin/mixinPageCommon';
import ccobject from '@/composables/createComObject';
import cinitial from '@/composables/comInitialize';
import cscript from '@/composables/comScripts';
import {Group, GroupType} from '@/types/Group';

export default defineComponent({
    name        : 'Group',
    mixins: [mixinPageCommon],
    setup(){
        const groupParams = ref({} as Group);
        const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(['artist']);

        // 데이터 초기화
        groupParams.value = cinitial.$inItData('', GroupType) as unknown as Group;

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

        function fnCallFunc(id: string) {
            switch (id) {
                case 'inquire'  :   // 조회
                    break;
                case 'create'   :   // 신규
                    break;
                case 'delete'   :   // 삭제
                    break;
                case 'save'     :   // 저장
                    break;
                default:
                    break;
            }
        }

        return{
            fnCallFunc,
            groupParams,
            selectBoxOptions
        };
    }
});

</script>

<style scoped>

</style>