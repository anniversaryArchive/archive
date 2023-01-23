import _ from 'lodash';
import {AllCommunityModules} from '@ag-grid-community/all-modules';

/*
* 데이터를 타입 정의에 맞게 초기화
* 사용법 initData(데이터 타입 객제 , 객체구분)
* 데이터 타입 객체 : 인터페이스로 정의한 타입을 String으로 재정의한 Object
* */
export default {
    $inItData: function inItData(gb: string, sendType: { [key: string]: string }) {
        const tempData: { [key: string]: string | number | boolean | [] | object } = {};
        const type = sendType;

        _.forEach(Object.keys(type), (x: string) => {
            if (type[x] === 'string') {
                tempData[x] = '';
            } else if (type[x] === 'number') {
                tempData[x] = 0;
            } else if (type[x] === 'boolean') {
                tempData[x] = false;
            } else if (type[x] === '[]') {
                tempData[x] = [];
            } else if (type[x] === 'object') {
                tempData[x] = {};
            }
        });

        return tempData;
    },

    $comGridOption: {
        modules                : AllCommunityModules,
        defaultColDef          : {
            editable    : false, // 입력가능
            sortable    : false, // 정렬가능
            resizable   : false, // 사이즈조절가능
            filter      : true, // 필터 *현황은 필수
            lockPosition: true, // 컬럼 드래그 방지
            width       : 100,
        },
        localeText             : {noRowsToShow: '조회 결과가 없습니다.'},
        enableCellTextSelection: true,
    },
}