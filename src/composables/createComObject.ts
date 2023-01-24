import {ref} from 'vue';
import _ from 'lodash';
import {CommonGrdProps, CommonSelectBox} from '@/types/CommonTypes';
import {ColumnApi, GridApi, GridReadyEvent, PaginationChangedEvent} from '@ag-grid-community/core';

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

    $createComGrd: function createComGrd<T>() {
        // 그리드 변수
        const grdApi = ref({} as GridApi);
        const columnApi = ref({} as ColumnApi);
        const grdCnt = ref(0);
        const grdColKey = ref('id');

        interface GrdProps extends CommonGrdProps {
            rowData: T[],
        }

        const grdProps = ref({} as GrdProps);

        function onGridReady(event: GridReadyEvent) {
            grdApi.value = event.api;
            columnApi.value = event.columnApi;
            grdApi.value.setHeaderHeight(37);
        }

        async function onPaginationChanged(event: PaginationChangedEvent) {
            // console.log(event.type, ' : newData : ', event.newData, 'newPage : ', event.newPage, 'keepRenderedRows : ', event.keepRenderedRows, 'animate : ', event.animate);
            if (event.newPage) { // 사용자가 페이지를 이동한 경우 → 되돌아가는 경우랑 이동하는 경우는 달라야함
                // console.log('newPage!');
                const firstRenderedNode = await grdApi.value.getRenderedNodes()[0];
                // 사용자가 페이지를 바꿀때마다 첫번째 행 선택
                await grdApi.value.setFocusedCell(firstRenderedNode.rowIndex as number, grdColKey.value);
                // console.log('setFocusedCell 끝');
            }
        }

        return {grdApi, columnApi, grdCnt, grdColKey, grdProps, onGridReady, onPaginationChanged};
    },
}