<template>
  <CommonDialog :show="show" @close="closeDialog">
    <div class="mx-10 text-center my-14">
      <div class="text-5xl font-black text-primary">ARCHIVE</div>

      <div class="mt-6 text-base font-semibold">
        회원가입 / 로그인하고<br/>
        많은 기능을 사용해보세요!
      </div>

      <div class="w-full h-[1px] bg-gray-300 mt-10 mb-8"></div>

      <div v-if="signUpMode" class="mb-6 text-xlg">회원가입 하시겠습니까?</div>
      <button class="w-4/5" @click="doAction('google')">
        <img :src="googleLoginBtnImage" 
          @mouseover="hoverGoogleLoginBtn = true" @mouseleave="hoverGoogleLoginBtn = false"
          @mousedown="pressedGoogleLoginBtn = true" @mouseup="pressedGoogleLoginBtn = false" />
      </button>
    </div>
  </CommonDialog>
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef } from 'vue';
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

const userStore = useUserStore();
const signUpMode: Ref<boolean> = ref(false);    // 회원가입 모드

const hoverGoogleLoginBtn: Ref<boolean> = ref<boolean>(false);
const pressedGoogleLoginBtn: Ref<boolean> = ref<boolean>(false);

const googleLoginBtnImage: ComputedRef<string> = computed<string>(() => {
  if (pressedGoogleLoginBtn.value) { return pressedGoogleBtnImage; }
  if (hoverGoogleLoginBtn.value) { return focusGoogleBtnImage; }
  return nomarlGoogleBtnImage;
})

function closeDialog () {
  emit('close')
}

function doAction(provider: string) {
  if (signUpMode.value) {
    doSignUp(provider);
  } else { doLogin(provider); }
}

async function doLogin(provider: string) {
  try {
    const user: User | null | undefined = await userStore.doLogin(provider);
    if (user == null) { // 회원가입 한 유저 정보가 없는 경우 
      signUpMode.value = true;
      alert('회원가입이 필요합니다');
    } else { emit('close'); }
  } catch (error) {
    console.error(error);
  }
}

async function doSignUp(provider: string) {
  try {
    const success: boolean = await userStore.doSignUp(provider);
    if (!success) { return false; }
    emit('close');
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>

</style>