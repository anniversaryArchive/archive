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

export interface CommonCode extends CommonRowData {
    codeGroup: string,
    codeValue: string,
    codeNm: string,
}