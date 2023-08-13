import { defineStore } from 'pinia';
import { User } from '@/types/User';
import { ProviderInfo } from '@/types/ProviderInfo';
import { googleTokenLogin, googleLogout } from 'vue3-google-login';
import { mutate } from '@/composables/graphqlUtils';

import signIn from '@/graphql/signIn.mutate.gql';
import providerSignUp from '@/graphql/providerSignUp.mutate.gql';

interface UserState {
  user?: User;
  providerInfo?: ProviderInfo;
}

export const useUserStore = defineStore({
  id: 'user',
  persist: true,

  state: (): UserState => ({
    user: undefined,
    providerInfo: undefined,
  }),

  getters: {
    loggedIn(state): boolean { return !!state.user; },
  },
  actions: {
    doLogin(provider: string): Promise<User | null | undefined> {
      this.providerInfo = undefined;
      switch (provider) {
        case 'google': return this.doGoogleLogin();
        case 'naver':
          const url: string = `https://nid.naver.com/oauth2.0/authorize?client_id=${import.meta.env.VITE_NAVER_CLIENT_ID}&redirect_uri=${window.location.origin}/naverOauth&response_type=code`;
          window.location.href = url;
          break;
      }
      return Promise.resolve(undefined);
    },

    async signIn(provider: string, code: string): Promise<User | null | undefined> {
      try {
        const { data, error } = await mutate(signIn, { token: code, provider });
        if (error) {
          const code: number | undefined = error?.graphqlErrors && error?.graphqlErrors[0]?.extensions?.code;
          this.onErrorLogin(code);
          throw error;
        }
        const { user, token, info }: { user?: User, token?: string, info?: ProviderInfo } = data?.auth || {};
        this.user = user;
        if (token) { localStorage.setItem(import.meta.env.VITE_TOKEN_KEY, token); }
        if (!user) { this.providerInfo = info; }
        return user;
      } catch (error) { console.error(error); }
      return null;
    },

    async doNaverLogin(code: string): Promise<User | null | undefined> {
      try {
        return await this.signIn('naver', code);
      } catch (error) { console.error(error); }
      return;
    },

    async doGoogleLogin(): Promise<User | null | undefined> {
      try {
        var response = await googleTokenLogin();
        if (!response?.access_token) { return; }
        return await this.signIn('google', response.access_token);
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
      localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);
      googleLogout();
      this.user = undefined;
      location.href = '/';
    },

    async doSignUp(): Promise<boolean> {
      try {
        const { data, error } = await mutate(providerSignUp, { info: this.providerInfo });
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
      return false;
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
