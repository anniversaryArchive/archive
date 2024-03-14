<template>
    <div class="inp_date">
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

<script lang="ts">
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
            days       : ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
            daysShort  : ['일', '월', '화', '수', '목', '금', '토'],
            months     : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        };
        const inputRef = ref(null); // 마운트 이후 바인딩
        const val = computed({
            get: () => getVal(),
            set: (value) => emit('update:modelValue', setVal(value)),
        });

        function getVal() {
            let resultVal = '';

            if (!cscript.$isEmpty(props.modelValue)) {
                resultVal = moment(props.modelValue).format(props.returnDataFormat).toString() === props.modelValue ? moment(props.modelValue).format(props.dateFormat).toString() : props.modelValue;
            }

            return resultVal;
        }

        function setVal(value: string) {
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

<style scoped>
.inp_date {
  width: 44%;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.inp_date input {
  width: 100%;
  text-align: center !important;
}
.inp_date label {
  padding-bottom: 0;
}
.inp_date .q-field__marginal {
  height: auto;
}

.inp_date + .inp_date:after {
  content: "~";
  font-weight: bold;
  position: absolute;
  left: -30px;
  top: 10px;
}

</style>
