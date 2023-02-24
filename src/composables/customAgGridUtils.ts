import {ValueFormatterParams} from '@ag-grid-community/core';

export const GrdHeaderHeight = 38;
const GrdPageNation = 32;
const GrdScroll = 15;

export default {
    // 그리드 높이 계산을 위함
    $getGridStyle(showRowCnt: number) {
        const height = (showRowCnt * 27) + GrdHeaderHeight + GrdPageNation + GrdScroll + 3.2;
        return 'width: 100%; height: ' + height + 'px;';
    },
}

export function PhoneNumFormatter(params: ValueFormatterParams) {
    if (!params.value) {
        return '-';
    }
    if (params.value.charAt(0) === '+') { //국제전화인지 확인
        if (params.value.substring(0, 3) === '+82') { //한국인지 확인
            if (params.value.length === 11) {
                // +82 2 123 4567 : 서울 지역번호로 국제전화
                return params.value.replace(/(.\d{2})(\d)(\d{3})(\d{4})/, '$1-$2-$3-$4');
            }
            if (params.value.length === 12) {
                return params.value.replace(/(.\d{2})(\d{2})(\d{3})(\d{4})/, '$1-$2-$3-$4');
            }
            if (params.value.length === 13) {
                return params.value.replace(/(.\d{2})(\d{2})(\d{4})(\d{4})/, '$1-$2-$3-$4');
            }
        }
    } else { //국제전화 아님
        if (params.value.length < 9) {
            return params.value;
        }
        if (params.value.length === 9) {
            return params.value.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        if (params.value.length === 10) {
            return params.value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        if (params.value.length === 11) {
            return params.value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
    }
    return params.value;
}

// YYYY-MM-DD
export function DateFormatter(params: ValueFormatterParams) {
    let result = params.value;
    if (!params.value) {
        result = '-';
    } else {
        // ex) 2021-02-22 14:22:46
        if (params.value.length >= 19) {
            if (params.value.charAt(4) === '-' && params.value.charAt(7) === '-') {
                result = params.value.substring(0, 10);
            }
        }
        // ex) 20200709
        if (params.value.length === 8) {
            result = params.value.substring(0, 4) + '-' + params.value.substring(4, 6) + '-' + params.value.substring(6, 8);
        }
    }
    return result;
}