<template>
    <q-btn :class='btnClass' :disabled='dis' type='button'
           @click='$emit("gfnCallFunc",id,{},$event)'>
        {{ name }}
    </q-btn>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';

export default defineComponent({
    name      : 'ComFuncButtons',
    props     : ['id', 'name', 'type', 'dis'],
    emits: ['update:modelValue', 'gfnCallFunc'],
    setup(props) {
        const btnClass = computed(() => {
            let btnClassName;

            switch (props.type) {
                //	공통 영역 버튼
                case 'inquire'  :	//	조회
                case 'create'   :	//	신규
                case 'delete'   :	//	삭제
                case 'save'     :	//	저장
                    btnClassName = 'btn-' + props.type;
                    break;
                //	그 외에는 type 을 class 명 으로 받음
                default :
                    btnClassName = props.type;
                    break;
            }
            return btnClassName;
        });

        return {
            btnClass,
        };

    },

});
</script>
