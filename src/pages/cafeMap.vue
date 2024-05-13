<template>
  <div>
    <CafeMapPc v-if="!isMobile" />
    <CafeMapMobile v-else />
  </div>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent} from 'vue';
import mixinPageCommon from '@/pages/mixin/mixinPageCommon';
import {useQuasar} from 'quasar';
import CafeMapPc from '@/pages/cafeMapPc.vue';
import CafeMapMobile from '@/pages/cafeMapMobile.vue';

export default defineComponent({
  name: 'cafeMap',
  methods: {
  },
  components: {CafeMapPc, CafeMapMobile},
  mixins: [mixinPageCommon],
  setup() {
    const $q = useQuasar();
    const isMobile: ComputedRef<boolean> = computed(() => $q.screen.sm || $q.screen.xs);

    return {
      isMobile
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
