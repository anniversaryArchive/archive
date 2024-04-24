<template>
  <div class="date-btn">
    <q-btn flat @click="setToday">오늘</q-btn>
    <q-btn flat @click="setWeek" class="btn-center">7일</q-btn>
    <q-btn flat @click="setMonth">1개월</q-btn>
  </div>

  <div class="date-period">
    <date-picker :id='beginDeNm' :ref='el => { divs[beginDeNm] = el }'
                     v-model='theModel[beginDeNm]' :clearable='clearable' :disabled='disabled'
                     :readonly="readonly"/>
    <date-picker :id='endDeNm' :ref='el => { divs[endDeNm] = el }'
                     v-model='theModel[endDeNm]' :clearable='clearable' :disabled='disabled'
                     :readonly="readonly"/>
  </div>
</template>
<script lang="ts">
import {computed, defineComponent, PropType, ref} from 'vue';
import DatePicker from '@/components/common/datePicker.vue';
import moment from 'moment';

export default defineComponent({
  name      : 'comPeriodDatePicker',
  emits     : ['update:modelValue'],
  components: {DatePicker},
  props     : {
    modelValue: {
      type   : Object as PropType<{ [key: string]: string }>, // Type Annotation
      default: () => ({}),
    },
    beginDeNm : {
      type   : String, // Type Annotation
      default: () => (''),
    },
    endDeNm   : {
      type   : String, // Type Annotation
      default: () => (''),
    },
    clearable : {
      required: false,
      default : false,
    },
    disabled  : {
      required: false,
      default : false,
    },
    readonly  : {
      required: false,
      default : false,
    },
  },
  setup(props, {emit}) {
    // 템플릿 내 ref 사용을 위한 div 변수 셋팅
    // console.log('props : ', props);
    const divs = ref({} as { [key: string]: unknown });
    const getData = ref(props.modelValue);
    const theModel = computed({
      get: () => getData.value,
      set: (value) => emit('update:modelValue', value),
    });

    function focusDatePicker(refDeNm: string) {
      ((divs.value[refDeNm] as { inputRef: HTMLInputElement }).inputRef).focus();
    }

    // 오늘 날짜 셋팅
    function setToday() {
      getData.value[props.beginDeNm] = moment(new Date()).format('YYYYMMDD');
      getData.value[props.endDeNm] = moment(new Date()).format('YYYYMMDD');
    }

    // 오늘 ~ 일주일 후로 날짜 셋팅
    function setWeek() {
      getData.value[props.endDeNm] = moment(new Date()).subtract(1, 'days').add(7, 'days').format('YYYYMMDD');
      getData.value[props.beginDeNm] = moment(new Date()).format('YYYYMMDD');
    }

    // 오늘 ~ 한달 후로 날짜 셋팅
    function setMonth() {
      getData.value[props.endDeNm] = moment(new Date()).subtract(1, 'days').add(1, 'months').format('YYYYMMDD');
      getData.value[props.beginDeNm] = moment(new Date()).format('YYYYMMDD');
    }

    return {
      divs,
      theModel,
      focusDatePicker,
      setToday,
      setWeek,
      setMonth,
    };
  },
});
</script>

<style scoped>
.date-period {
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}

.date-btn button {
  border: 1px solid #CCCCCC;
  border-radius: 5px;
  /*
  text-align: center;
  border        : none;
  padding       : 0 15px;
  border-radius : 3px;
  height        : 26px;
  background    : rgba(79, 190, 159, 0.2);
  min-height    : 1em;
  transition    : all .3s ease-in-out;
  color         : #424242 !important;
  */
}

.date-btn .btn-center {
  margin: 0 5px;
}

.date-btn button:hover {
  background : #4285F4;
  color      : #fff !important;
}

.date-btn button .q-icon {
  font-size : 1.1em;
}
</style>
