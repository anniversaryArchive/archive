import { defineStore } from 'pinia';
import { User } from '@/types/User';
import { googleTokenLogin, googleLogout } from 'vue3-google-login';
import { mutate } from '@/composables/graphqlUtils';

import signIn from '@/graphql/signIn.mutate.gql';
import signUp from '@/graphql/signUp.mutate.gql';

interface UserState {
  user?: User;
}

export const useUserStore = defineStore({
  id: 'user',
  persist: true,

  state : (): UserState => ({ user: undefined }),

  getters: {
    loggedIn(state): boolean { return !!state.user },
  },

  actions: {
    doLogin(provider: string): Promise<User | null | undefined> {
      switch (provider) {
        case 'google': return this.doGoogleLogin();
      }
      return Promise.resolve(undefined);
    },

    async doGoogleLogin(): Promise<User | null | undefined> {
      try {
        var response = await googleTokenLogin();
        if (!response?.access_token) { return; }
        const { data, error } = await mutate(signIn, { token: response.access_token, provider: 'google' });
        if (error) {
          const code: number | undefined = error?.graphqlErrors && error?.graphqlErrors[0]?.extensions?.code;
          this.onErrorLogin(code);
          return;
        }
        const user: User | undefined = data?.user;
        if (user) { this.user = user;  }
        return user;
      } catch (error) { console.error(error); }
      return;
    },

    onErrorLogin(code: number | undefined) {
      switch (code) {
        case 401:
          alert('유효하지 않은 토큰입니다.');
          break;
        default:
          alert('로그인에 실패했습니다.');
      }
    },

    doLogout() {
      googleLogout();
      this.user = undefined;
      location.href = '/';
    },

    doSignUp(provider: string): Promise<boolean> {
      switch (provider) {
        case 'google': return this.doGoogleSignUp();
      }
      return Promise.resolve(false); 
    },

    async doGoogleSignUp(): Promise<boolean> {
      try {
        var response = await googleTokenLogin();
        if (!response?.access_token) { return false; }
        const { data, error } = await mutate(signUp, { token: response.access_token, provider: 'google' });
        if (error) {
          const code: number | undefined = error?.graphqlErrors && error?.graphqlErrors[0]?.extensions?.code;
          this.onErrorSignUp(code);
          return false;
        }
        const user: User | undefined = data?.user;
        if (!user) { return false; }
        this.user = user;
        return true;
      } catch (error) { console.error(error); }
      return true;
    },

    onErrorSignUp(code: number | undefined) {
      switch (code) {
        case 401:
          alert('유효하지 않은 토큰입니다.');
          break;
        case 1001:
          alert('이미 있는 유저입니다.');
          break;
        default:
          alert('회원가입에 실패했습니다.');
      }
    },
  }, 
});
