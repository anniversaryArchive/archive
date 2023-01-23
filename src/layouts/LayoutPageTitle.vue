<template>
    <div class="page_tit">
        {{pageTitle}}
    </div>
    <div id='comBtns' class="com_btn">
        <com-func-buttons
                v-for="btn in funcButtons"
                v-show="! btn.hide"
                v-bind:id="btn.id"
                v-bind:key="btn.id"
                v-bind:dis="btn.dis"
                v-bind:name="btn.name"
                v-bind:stat="btn.stat"
                v-bind:type="btn.type"
                @gfnCallFunc="gfnCallFunc"
        />
    </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useRoute} from 'vue-router';
import ComFuncButtons from '@/components/common/ComFuncButtons.vue';
import { ButtonAuths, FuncButtons } from '@/types/CommonTypes';

export default defineComponent({
    name      : 'LayoutPageTitle',
    components: {ComFuncButtons},
    props     : ['fnCallFunc'],
    setup(props) {
        const route = useRoute();
        const funcButtons = ref(<FuncButtons[]>[]);
        const fnCallFunc = ref(props.fnCallFunc);
        const pageTitle = route.meta.title;

        (async () => {
            pushFucnButtons('inquire', '조회', 'inquire', true, false, false);
            pushFucnButtons('create', '신규', 'create', true, false, false);
            pushFucnButtons('delete', '삭제', 'delete', true, false, false);
            pushFucnButtons('save', '저장', 'save', true, false, false);
        })();

        // funcButton 생성하는 함수
        function pushFucnButtons(id: string, name: string, type: string, stat: boolean, dis: boolean, hide: boolean) {
            if (stat) {
                funcButtons.value.push({
                    id   : id,
                    name : name,
                    type : type,
                    stat : stat,
                    dis  : dis,
                    hide : hide,
                });
            }
        }

        //	공통권한버튼 클릭시 호출
        function gfnCallFunc(id: string, ev: Event) {
            let btnAuth = true;
            const btnAuths = funcButtons.value as unknown as ButtonAuths;

            switch (id) {
                case 'inquire':
                    if (!btnAuths.inquire) {
                        btnAuth = false;
                    }
                    break;
                case 'create':
                    if (!btnAuths.create) {
                        btnAuth = false;
                    }
                    break;
                case 'delete':
                    if (!btnAuths.delete) {
                        btnAuth = false;
                    }
                    break;
                case 'save':
                    if (!btnAuths.save) {
                        btnAuth = false;
                    }
                    break;
                default:
                    btnAuth = false;
                    return;
            }
            fnCallFunc.value(id, ev);
        }

        return {
            funcButtons,
            gfnCallFunc,
            pageTitle
        };
    }
});
</script>