<template>
  <div>
    <div class="my-10 text-2xl text-center text-primary">NAVER 로그인 중</div>
  </div>
</template>

<script setup lang="ts">
// 네이버 로그인 후, redirect 되는 페이지
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
    // 넘어온 code로 login을 진해한다.
    const user = await userStore.doNaverLogin(code);
    if (user == null) { // 회원가입된 계정이 아닌 경우
      router.push('/signUp');
    } else { // 로그인 성공
      router.push('/cafeMap');
    }
  } catch (error) {
    console.error(error);
    router.push('/');
  }
}

</script>

<style scoped>

</style>