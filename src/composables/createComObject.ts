import {ref} from 'vue';
// @ts-ignore
import _ from 'lodash';
import {CommonSelectBox} from '@/types/CommonTypes';
export default {
    $createSelectAll: function createSelectAll(names: string[]) {
        // const _ = require('lodash');

        const selectBoxOptions = ref({} as { [key: string]: CommonSelectBox });

        if (names.length > 0) {
            _.forEach(names, (x: string) => {
                selectBoxOptions.value[x] = {} as CommonSelectBox;
            });
        }
        return {selectBoxOptions};
    },
}