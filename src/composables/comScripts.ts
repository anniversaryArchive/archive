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
                label : !this.$isEmpty(options.label) ? String(item[options.label]) : item.name,
                value : !this.$isEmpty(options.value) ? String(item[options.value]) : item._id,
            };
            cpListItems.push(row as CommonSelect);
        });
        return cpListItems;
    },

    /**
     * 데이터 비교
     * @desc 2개의 데이터(json)를 비교 후, 변경 된 부분의 값을 반환
     * ==============================================================================================================
     *
     *   [[[[[[[[[[[[ 데이터(json) 비교 ]]]]]]]]]]]]]]]
     *     - 데이터1                  - 데이터2               -키이름 배열
     *     {a:1, b:2}                 {a:1, b:999}           ['a', 'b']
     *
     * comScripts.$compareDatas(데이터1, 데이터2, 키이름 배열)
     * ompResult = await cscript.$compareDatas<CodeGroup>(detailData.value, detailOrgData.value, ['item1Nm']);
     *
     * - 결과
     * [
     *    {'keyName' : 'b', 'data1' : 2, 'data2': 999}
     * ]
     *
     *  - 설명
     *   rowNum : 'b' : 다른 키 이름, 'data1': 데이터 1번 파라미터 의 값, 'data2': 데이터 2번 파라미터의 값
     *
     * @return 비교 항목
     * @param obj1
     * @param obj2
     * @param xcptKeyLists
     */
    $compareDatas: async function $compareDatas<T>(obj1: T, obj2: T, xcptKeyLists: string[] = []) {
        const rtnValue = [] as { keyNm: string, data1: unknown, data2: unknown }[];
        const tempKeyList = _.uniq((Object.keys(obj1 as any) as (keyof T)[]).concat(Object.keys(obj2 as any) as (keyof T)[]));

        await _.forEach(tempKeyList, (keyNm: keyof T) => {
            //제외 키 인지 확인
            const isXcptKey = _.includes(xcptKeyLists as any, keyNm);
            //둘중 하나라도 값이 있고, 제외키가 아니고, 둘의 값이 일치하지 않을 때
            if (!(this.$isEmpty(obj1[keyNm]) && this.$isEmpty(obj2[keyNm])) && !isXcptKey && obj1[keyNm] != obj2[keyNm]) {
                rtnValue.push({
                    keyNm: keyNm as string,
                    data1: obj1[keyNm],
                    data2: obj2[keyNm],
                });
            }
        });

        return rtnValue;
    },
}