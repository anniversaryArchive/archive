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
    excel: boolean;
    skll1: boolean;
    skll2: boolean;
    skll3: boolean;
}

export interface ButtonAuths extends AuthButtons {
    menuId: string;
    authorGroup: string;
}

const AuthButtonsType: { [key: string]: string } = {
    inquire: ' boolean',
    create : ' boolean',
    delete : ' boolean',
    save   : ' boolean',
    excel  : ' boolean',
    skll1  : ' boolean',
    skll2  : ' boolean',
    skll3  : ' boolean',
};
export {AuthButtonsType};