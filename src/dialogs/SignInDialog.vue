<template>
  <CommonDialog :show="show" @close="closeDialog">
    <div class="mx-10 text-center my-14">
      <div class="text-5xl font-black text-primary">ARCHIVE</div>

      <div class="mt-6 text-base font-semibold">
        회원가입 / 로그인하고<br/>
        많은 기능을 사용해보세요!
      </div>

      <div class="w-full h-[1px] bg-gray-300 mt-10 mb-8"></div>

      <button class="w-4/5" @click="doLogin('google')">
        <img class="m-auto" :src="googleLoginBtnImage"
          @mouseover="hoverGoogleLoginBtn = true" @mouseleave="hoverGoogleLoginBtn = false"
          @mousedown="pressedGoogleLoginBtn = true" @mouseup="pressedGoogleLoginBtn = false" />
      </button>
      <button class="w-4/5 text-center" @click="doLogin('naver')">
        <img src="@/assets/images/btn_naver_signin.png" class="px-1 m-auto" />
      </button>
    </div>
  </CommonDialog>
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import CommonDialog from './CommonDialog.vue';
import { useUserStore } from '@/stores/user';

// images
import nomarlGoogleBtnImage from '@/assets/images/btn_google_signin_light_normal.png';
import focusGoogleBtnImage from '@/assets/images/btn_google_signin_light_focus.png';
import pressedGoogleBtnImage from '@/assets/images/btn_google_signin_light_pressed.png';

interface Props {
  show: boolean;
}

const props = withDefaults(defineProps<Props>(), { });
const emit = defineEmits(['done', 'close']);

const router = useRouter();
const userStore = useUserStore();

const hoverGoogleLoginBtn: Ref<boolean> = ref<boolean>(false);
const pressedGoogleLoginBtn: Ref<boolean> = ref<boolean>(false);

const googleLoginBtnImage: ComputedRef<string> = computed<string>(() => {
  if (pressedGoogleLoginBtn.value) { return pressedGoogleBtnImage; }
  if (hoverGoogleLoginBtn.value) { return focusGoogleBtnImage; }
  return nomarlGoogleBtnImage;
});

function closeDialog () {
  emit('close')
}

async function doLogin(provider: string) {
  try {
    const user: User | null | undefined = await userStore.doLogin(provider);
    if (user) { // 로그인 성공
      emit('close');
      if (user.role === 'admin') { // 어드민 계정인 경우, 어드민 페이지로 이동
        router.push('/admin/group');
      }
    } else if (user !== undefined) { // 회원가입하지 않은 계정인 경우, 회원가입 페이지로 이동
      router.push('/signUp');
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>

</style>