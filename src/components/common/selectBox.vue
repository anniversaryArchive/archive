<template>
    <q-select
            :id='name'
            :ref='name'
            v-model='val'
            :borderless="isLabel"
            :clearable='clearable'
            :dense='true'
            :disable="disabled"
            :options='data'
            :outlined="! (isLabel || readonly)"
            :readonly="readonly"
            :standout="readonly"
            :style="style"
            :multiple="multiplied"
            emit-value
            map-options
            @change="$emit('change', val)"
    />
</template>
<script lang="ts">
import {computed, defineComponent} from 'vue';

export default defineComponent({
    name : 'SelectBox',
    emits: ['update:modelValue', 'change'],
    props: {
        modelValue: {
            type   : Array, // Type Annotation
            default: () => (''),
        },
        name      : {
            type    : String,
            required: false,
            default : 'Select',
        },
        data      : {
            type: Array,
            required: false,
        },
        style     : {
            required: false,
            default : 'min-width: 10%;',
        },
        isLabel   : {
            required: false,
            default : false,
        },
        readonly  : {
            required: false,
            default : false,
        },
        clearable : {
            required: false,
            default : false,
        },
        disabled  : {
            required: false,
            default : false,
        },
        multiplied: {
            required: false,
            default : false,
        }
    },
    setup(props, {emit}) {
        // 템플릿 내 ref 사용을 위한 div 변수 셋팅
        const val = computed({
            get: () => props.modelValue,
            set: (value) => {
                emit('update:modelValue', value);
                emit('change', value);
            },
        });

        return {
            val,
        };
    },
});
</script>

