<template>
    <div>
        <q-input ref="inputRef" v-model="val" :clearable="clearable" :dense="true" outlined
                 :mask='maskFormat' :readonly="readonly" >
            <template v-slot:append>
                <q-icon class="cursor-pointer" name="event">
                    <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                        <q-date v-model="val" :emit-immediately="false" :locale="changeMonthToNum" :today-btn="true" :value="val"
                                mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                                <q-btn v-close-popup color="primary" flat label="Close"/>
                            </div>
                        </q-date>
                    </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>
    </div>
</template>

<script>
import {computed, defineComponent, ref} from 'vue';
import cscript from '@/composables/comScripts';
import moment from 'moment/moment';

export default defineComponent({
    name : 'DatePicker',
    emits: ['update:modelValue'],
    props: {
        modelValue      : {
            type   : String,
            default: () => (''),
        },
        id              : {
            type    : String,
            required: false,
        },
        disabled        : {
            required: false,
            default : false,
        },
        readonly        : {
            required: false,
            default : false,
        },
        clearable       : {
            required: false,
            default : false,
        },
        dateFormat      : {
            require: false,
            default: () => ('YYYY-MM-DD'),
        },
        returnDataFormat: {
            require: false,
            default: () => ('YYYYMMDD'),
        },
    },
    setup(props, {emit}) {
        const maskFormat = props.dateFormat.replace(/[a-z]/gi, '#');
        // console.log('maskFormat : ', maskFormat);
        const changeMonthToNum = {
            days       : ['?????????', '?????????', '?????????', '?????????', '?????????', '?????????', '?????????'],
            daysShort  : ['???', '???', '???', '???', '???', '???', '???'],
            months     : ['1???', '2???', '3???', '4???', '5???', '6???', '7???', '8???', '9???', '10???', '11???', '12???'],
            monthsShort: ['1???', '2???', '3???', '4???', '5???', '6???', '7???', '8???', '9???', '10???', '11???', '12???'],
        };
        const inputRef = ref(null); // ????????? ?????? ?????????
        const val = computed({
            get: () => getVal(props.modelValue),
            set: (value) => emit('update:modelValue', setVal(value)),
        });

        function getVal() {
            let resultVal = '';

            if (!cscript.$isEmpty(props.modelValue)) {
                resultVal = moment(props.modelValue).format(props.returnDataFormat).toString() === props.modelValue ? moment(props.modelValue).format(props.dateFormat).toString() : props.modelValue;
            }

            return resultVal;
        }

        function setVal(value) {
            let resultVal = '';
            if (!cscript.$isEmpty(value)) {
                resultVal = moment(value).format(props.dateFormat).toString() === value ? moment(value).format(props.returnDataFormat).toString() : value;
            }
            return resultVal;
        }

        return {
            val,
            maskFormat,
            inputRef,
            changeMonthToNum,
        };
    },
});
</script>