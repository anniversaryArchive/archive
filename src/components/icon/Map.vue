<template>
  <svg v-if="isActive" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="tabVector" d="M29.1667 0L28.9 0.05L20 3.5L10 0L0.6 3.16667C0.25 3.28333 0 3.58333 0 3.96667V29.1667C0 29.6333 0.366667 30 0.833333 30L1.1 29.95L10 26.5L20 30L29.4 26.8333C29.75 26.7167 30 26.4167 30 26.0333V0.833333C30 0.366667 29.6333 0 29.1667 0ZM20 26.6667L10 23.15V3.33333L20 6.85V26.6667Z" fill="#4285F4"/>
  </svg>
  <svg v-else width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="tabVector" d="M29.1667 0L28.9 0.05L20 3.5L10 0L0.6 3.16667C0.25 3.28333 0 3.58333 0 3.96667V29.1667C0 29.6333 0.366667 30 0.833333 30L1.1 29.95L10 26.5L20 30L29.4 26.8333C29.75 26.7167 30 26.4167 30 26.0333V0.833333C30 0.366667 29.6333 0 29.1667 0ZM20 26.6667L10 23.15V3.33333L20 6.85V26.6667Z" fill="#767676"/>
  </svg>
</template>

<script>
export default {
  name: "Map",
  props: {
    isActive  : {
      type    : Boolean,
      default : false,
    },
  }
}
</script>

<style lang="scss" scoped>
.tab-link:hover {
  .tab-icon {
    svg .tabVector {
      fill: #4285F4;
    }
  }
}
</style>
