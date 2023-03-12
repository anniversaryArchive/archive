import {GridOptions} from '@ag-grid-community/core';
import {AllCommunityModules} from '@ag-grid-community/all-modules';
import { QueryExecutionOpts } from 'villus';
import { ComputedRef } from 'vue';

export interface CommonSelect {
    label: string;
    value: string;
    description?: string;
    category?: string;
}

export interface CommonSelectBox {
    name?: string;
    data?: CommonSelect[];
    style?: string;
    readonly?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    isLabel?: boolean;
}

export interface CommonRowData {
    rowTypeGb?: string;
}

export interface CommonMapList {
    [p: string]: unknown;
}

export interface CommonSch {
    schDateNm?: string;
}

export interface CommonCode extends CommonRowData {
    codeGroup: string,
    codeValue: string,
    codeNm: string,
}

export interface FuncButtons {
    id: string;
    name: string;
    type: string;
    stat: boolean;
    dis: boolean;
    hide: boolean;
}

export interface AuthButtons {
    inquire: boolean;
    create: boolean;
    delete: boolean;
    save: boolean;
}

export interface ButtonAuths extends AuthButtons {
    menuId: string;
    authorGroup: string;
}

export interface ToSaveData {
    [p: string]: unknown;
}

export interface ResultModel {
    name: string;
    successCnt: number;
    errorCnt: number;
    retMsg: string;
    retCode: string;
}

export interface CommonGrdProps extends GridOptions {
    name: string,
    modules: typeof AllCommunityModules,
    //columnDefs: ColDef[],
    //defaultColDef: ColDef,
    style: string,
    //pagination: boolean,       // pagination properties
    //paginationPageSize?: number,
    // columnTypes?: {
    //   [key: string]: ColDef;
    // },
}

export interface ComboBoxModel {
    id: string;
    name: string;
    unavailable: boolean;
}

export interface Pagination {
    current: number,
    maxCnt: number | null,
    perPage: number,
}

export interface FetchFunc {
    (overrideOpts?: Partial<QueryExecutionOpts<any>>): Promise<any>
}

export interface WatchQuery<T> {
    list: ComputedRef<T[]>;
    total: ComputedRef<number>;
    fetch: FetchFunc;
}
