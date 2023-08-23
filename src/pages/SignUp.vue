<template>
  <div class="flex flex-col justify-center h-full bg-primary">
    <!-- 회원가입 -->
    <div class="w-2/5 px-6 py-8 m-auto bg-white border rounded shadow-lg">
      <div class="mb-4 text-3xl font-bold text-center text-primary">회원가입</div>

      <div v-if="info">
        <div v-for="field in ['name', 'email', 'provider']"
          class="mb-3">
          <div class="font-bold text-gray-500">{{infoLabel[field]}}</div>
          <div>
            <input disabled :value="info[field]"
              class="w-full text-lg text-black" />
          </div>
        </div>

        <div class="text-center">
          <button class="px-4 py-1 text-lg font-bold text-white rounded shadow bg-primary/90 hover:bg-primary"
            @click="doSignUp">회원가입</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ProviderInfo } from '@/types/ProviderInfo';

const router = useRouter();
const userStore = useUserStore();
const info: Ref<ProviderInfo | undefined>  = ref();

const infoLabel = {
  name: '이름',
  email: '이메일',
  provider: 'SSO'
};

onBeforeMount(() => {
  info.value = userStore.providerInfo;
});

async function doSignUp() {
  try {
    const success: boolean = await userStore.doSignUp();
    if (!success) { return false; }
    router.push('/cafeMap');
  } catch (error) {
    console.error(error);
  }
}

</script>

<style scoped>

</style>