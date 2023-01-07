<script setup lang="ts">
import { computed, ComputedRef, ref, Ref } from 'vue';
import { useCounterStore } from '@/stores/counter';

const counterStore = useCounterStore();

defineProps<{ msg: string }>();

const count: ComputedRef<number> = computed(() => {
  return counterStore.getCount;
});
const value: Ref<boolean> = ref(false);

const onClickCount = () => {
  counterStore.addCounter();
}

</script>

<template>
  <q-toggle v-model="value" color="green" />

  <div class="text-3xl text-blue-700 text-bold">{{ msg }}</div>

  <div class="card">
    <button type="button" @click="onClickCount">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
