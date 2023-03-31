<template>
  <q-layout view="lHh lpr lFf" container style="height: 61px" class="rounded-borders">
    <q-header bordered class="bg-white text-primary">
      <q-toolbar>
        <q-toolbar-title class="toolbar-title">
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
          -->
          <span class="layout-title">ARCHIVE</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
  </q-layout>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'LayoutHeader.',
  setup() {
    return {
    };
  },
});
</script>

<style scoped>
  .toolbar-title {
    text-align: left;
  }

  .layout-title {
    font-style: normal;
    font-weight: 900;
    font-size: 2rem;
    line-height: 60px;
  }

  @media screen and (max-width: 767px){
    .toolbar-title {
      text-align: center;
    }
  }
</style>
