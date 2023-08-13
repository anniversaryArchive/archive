<template>
  <div>
    <div class="text-2xl text-black">NAVER</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  const route = useRoute();
  const code: string | undefined = route.query.code;

  doNaverLogin(code);
});

async function doNaverLogin(code: string) {
  try {
    const user = await userStore.doNaverLogin(code);
    if (user == null) {
      router.push('/signUp');
    } else { // TODO:
      router.push('/cafeMap');
    }
  } catch (error) {
    console.error(error);
    location.href.value = '';
  }
}

</script>

<style scoped>

</style>