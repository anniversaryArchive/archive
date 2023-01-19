import _ from 'lodash';
import {CommonMapList, CommonSelect, CommonCode} from '@/types/CommonTypes';

export default {
    /**
     * null 여부 확인
     * 사용 방법 : $isEmpty(date)
     */
    $isEmpty: function $isEmpty(objValue: unknown) {
        if (objValue === undefined || objValue == null) {
            return true;
        } else {
            return (String(objValue)).length == 0;
        }
    },

    /**
     * 콤보 설정
     *
     * @param listItems 콤보 목록
     * @param options   [선택] 추가 옵션
     *            text   콤보 표시 명 변경. ex) { label: 'refrn1Value' }
     *            value  콤보 선택 값 변경. ex) { value: 'refrn2Value' }
     */
    $getComboOptions: async function $getComboOptions(listItems: CommonMapList[] | CommonCode[], options = {
        label: '', value: '',
    }) {
        //	원본 배열 복사
        const cpListItems: CommonSelect[] = [];

        //콤보 생성할 데이터가 없는 경우
        if (listItems.length === 0) {
            return cpListItems;
        }
        await _.forEach(listItems as CommonMapList[], (item: CommonMapList) => {
            const row = {
                label : !this.$isEmpty(options.label) ? String(item[options.label]) : item.codeNm,
                value : !this.$isEmpty(options.value) ? String(item[options.value]) : item.codeValue,
            };
            cpListItems.push(row as CommonSelect);
        });
        return cpListItems;
    },
}