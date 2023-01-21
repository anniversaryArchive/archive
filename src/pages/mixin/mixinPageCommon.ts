import {defineComponent} from 'vue';
import LayoutPageTitle from '@/layouts/LayoutPageTitle.vue';
import DatePicker from '@/components/common/datePicker.vue';
import SelectBox from '@/components/common/selectBox.vue';
import {AgGridVue} from '@ag-grid-community/vue3';

export default defineComponent({
    components: {
        LayoutPageTitle,
        AgGridVue,
        DatePicker,
        SelectBox,
    },
    setup() {}
});