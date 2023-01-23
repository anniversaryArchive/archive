import {ResultModel, ToSaveData} from '@/types/CommonTypes';
// import cscript from '@/composables/comScripts';
// import axios from 'axios';

export default {
    // 데이터 삭제
    async $deleteData(url: string, toDeleteData?: ToSaveData): Promise<ResultModel> {
        let resultModel = {} as ResultModel;
        console.log('삭제 시작 : ');

        return resultModel
    },

    //데이터 저장
    async $saveData(url: string, toSaveData: ToSaveData | ToSaveData[], postGb = false): Promise<ResultModel> {

        let resultModel = {} as ResultModel;
        console.log('저장시작 : ');

        return resultModel;
    },
}