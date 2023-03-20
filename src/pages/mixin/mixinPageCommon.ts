import {defineComponent} from 'vue';
import LayoutPageTitle from '@/layouts/LayoutPageTitle.vue';
import DatePicker from '@/components/common/datePicker.vue';
import ComPeriodDatePicker from '@/components/common/ComPeriodDatePicker.vue';
import SelectBox from '@/components/common/selectBox.vue';
import {AgGridVue} from '@ag-grid-community/vue3';
import '@ag-grid-community/core/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import '@ag-grid-community/core/dist/styles/ag-theme-material.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import '@ag-grid-community/core/dist/styles/ag-theme-blue.css';

export default defineComponent({
    components: {
        LayoutPageTitle,
        AgGridVue,
        DatePicker,
        ComPeriodDatePicker,
        SelectBox,
    },
    setup() {}
});

export { LayoutPageTitle, DatePicker, SelectBox, AgGridVue };
