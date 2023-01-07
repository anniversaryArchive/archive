import { defineStore } from 'pinia';

interface CounterState {
  count: number;
}

/**
 * Test를 위한 Counter Store 생성 
 */
export const useCounterStore = defineStore({
  id: 'counter',
  state : (): CounterState => ({ 
    count: 0,
  }),
  actions: {
    addCounter() {
      this.count ++;
    },
  },
  getters: {
    getCount: (state) => state.count,
  },
});
