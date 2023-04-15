import { defineStore } from 'pinia';
import { User } from '@/types/User';
import { googleTokenLogin, googleLogout } from 'vue3-google-login';
import { mutate } from '@/composables/graphqlUtils';

import signIn from '@/graphql/signIn.mutate.gql';

interface UserState {
  user?: User;
}

export const useUserStore = defineStore({
  id: 'user',

  state : (): UserState => ({ user: undefined }),

  getters: {
    loggedIn(state): boolean { return !!state.user },
  },

  actions: {
    doLogin(provider: string): Promise<boolean> {
      switch (provider) {
        case 'google': return this.doGoogleLogin();
      }
      return Promise.resolve(false);
    },

    async doGoogleLogin(): Promise<boolean> {
      try {
        var response = await googleTokenLogin();
        if (!response?.access_token) { return false; }
        const { data, error } = await mutate(signIn, { token: response.access_token, provider: 'google' });
        if (error) {
          const code: number | undefined = error?.graphqlErrors && error?.graphqlErrors[0]?.extensions?.code;
          this.onErrorLogin(code);
          return false;
        }
        const user: User | undefined = data?.user;
        if (!user) { return false; }
        this.user = user; 
        return true;
      } catch (error) { console.error(error); }
      return false;
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
    },
  }, 
});
