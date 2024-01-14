<template>
  <svg v-if="isActive" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="tabVector" d="M26.6667 0H3.31667C1.48333 0 0 1.5 0 3.33333L0.0166667 26.6667C0.0166667 28.5 1.5 30 3.33333 30H20L30 20V3.33333C30 1.5 28.5 0 26.6667 0ZM6.66667 8.33333H23.3333V11.6667H6.66667V8.33333ZM15 18.3333H6.66667V15H15V18.3333ZM18.3333 27.5V18.3333H27.5L18.3333 27.5Z" fill="#4285F4"/>
  </svg>
  <svg v-else width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="tabVector" d="M26.6667 0H3.31667C1.48333 0 0 1.5 0 3.33333L0.0166667 26.6667C0.0166667 28.5 1.5 30 3.33333 30H20L30 20V3.33333C30 1.5 28.5 0 26.6667 0ZM6.66667 8.33333H23.3333V11.6667H6.66667V8.33333ZM15 18.3333H6.66667V15H15V18.3333ZM18.3333 27.5V18.3333H27.5L18.3333 27.5Z" fill="#767676"/>
  </svg>
</template>

<script>
export default {
  name: "Forum",
  props: {
    isActive  : {
      type    : Boolean,
      default : false,
    },
  }
}
</script>

<style scoped>
svg:hover .tabVector {
  fill: #4285F4;
}
</style>
