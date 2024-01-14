<template>
  <svg v-if="isActive" width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="tabVector" d="M15 27.525L12.825 25.545C5.1 18.54 0 13.92 0 8.25C0 3.63 3.63 0 8.25 0C10.86 0 13.365 1.215 15 3.135C16.635 1.215 19.14 0 21.75 0C26.37 0 30 3.63 30 8.25C30 13.92 24.9 18.54 17.175 25.56L15 27.525Z" fill="#4285F4"/>
  </svg>
  <svg v-else width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="tabVector" d="M15 27.525L12.825 25.545C5.1 18.54 0 13.92 0 8.25C0 3.63 3.63 0 8.25 0C10.86 0 13.365 1.215 15 3.135C16.635 1.215 19.14 0 21.75 0C26.37 0 30 3.63 30 8.25C30 13.92 24.9 18.54 17.175 25.56L15 27.525Z" fill="#767676"/>
  </svg>
</template>

<script>
export default {
  name: "Favorite",
  props: {
    isActive  : {
      type    : Boolean,
      default : false,
    },
    isHover   : {
      type    : Boolean,
      default : false,
    }
  }
}
</script>

<style scoped>
svg:hover #favorite .tabVector {
  fill: #4285F4;
}
</style>
