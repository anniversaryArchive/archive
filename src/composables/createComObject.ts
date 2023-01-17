import {ref} from 'vue';
import _ from 'lodash';
import {CommonSelectBox} from '@/types/CommonTypes';

export default {
    $createSelectAll: function createSelectAll(names: string[]) {
        const selectBoxOptions = ref({} as { [key: string]: CommonSelectBox });

        if (names.length > 0) {
            _.forEach(names, (name: string) => {
                selectBoxOptions.value[name] = {} as CommonSelectBox;
            });
        }
        return {selectBoxOptions};
    },
}