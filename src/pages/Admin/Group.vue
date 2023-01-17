<template>
    <div>
        Group Page
        <br>
        <date-picker :id="groupParams.debutDate" v-model='groupParams.debutDate' :clearable='true'/>
        <br>
        <select-box id="artist" v-model='groupParams.artist'
                        v-bind='selectBoxOptions.artist' />
        <br>
        {{groupParams}}
    </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import ccobject from '@/composables/createComObject';
import cinitial from '@/composables/comInitialize';
import cscript from '@/composables/comScripts';
import DatePicker from '@/components/common/datePicker.vue';
import SelectBox from '@/components/common/selectBox.vue';
import {Group, GroupType} from '@/types/Group';

export default defineComponent({
    name        : 'Group',
    components  : {DatePicker, SelectBox},
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
            }];

            // 아티스트 셀렉트 옵션
            selectBoxOptions.value.artist = {
                name     : 'artistStatusOptions',
                clearable: true,
                style    : 'width: 250px',
            };
            selectBoxOptions.value.artist.data = await cscript.$getComboOptions(tempList);
        })();

        return{
            groupParams,
            selectBoxOptions
        };
    }
});

</script>

<style scoped>

</style>