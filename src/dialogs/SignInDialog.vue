<template>
  <CommonDialog :show="show" @close="closeDialog">
    <div class="text-center">
      <div v-if="signUpMode" class="mb-6 text-xlg">회원가입 하시겠습니까?</div>
      <button class="px-2 py-1 font-bold text-white bg-blue-600 rounded shadow-lg hover:bg-blue-800"
        @click="doAction('google')">GOOGLE</button>
    </div>
  </CommonDialog>
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef } from 'vue';
import CommonDialog from './CommonDialog.vue';
import { useUserStore } from '@/stores/user';

interface Props {
  show: boolean;
}

const props = withDefaults(defineProps<Props>(), { });
const emit = defineEmits(['done', 'close']);

const userStore = useUserStore();
const signUpMode: Ref<boolean> = ref(false);    // 회원가입 모드

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