<template>
  <svg v-if="isActive" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="30" height="30" fill="url(#pattern0)"/>
    <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image0_931_90" transform="scale(0.0104167)"/>
      </pattern>
      <image id="image0_931_90" width="96" height="96" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAD3ElEQVR4nO2cT4scVRTFnwuZKFF0IYwEFNSIGA2oK6NG8DP4JwHXAyJl09Q751UPahkXCiGbbPJnknwE8QvoQsGMBBeCm6gLY1Q0ulGcqBkhLVcq0AQJ03ZX3ddT5wcXhu5mqu457716Vfe9CkEIIYQQQgghhBBCiMwoiuJ2AAdJngJwDsDPJDct7O/mszWSBwDc5n2+24aqqh4keQbAZZLjrYT9FsBpALu9z39hGQ6Ht5A8AuDvrQr/H2E95HBd1zu881koAOwm+cUMwl/fI9ZXV1fv9s5rIUgpPdaM73MRf8KE72KMe73zy77lowXxrzNh2TvPLKnregeAz9sSf8KEz+z64p1vdpA80rb4E3HIO9/sppqYbbYzbS/4XUPRBCTPdNj6r5lwzK/J5XeHe7lrA0hu6I45/DvzOegg/rVe8FLoOyRPeRlA8mToOwDOOfaA9dB3SP7i2AMuhb4D4IqjAX+FvgMZ4As1BPkCXYTdDVhznAWdCH2H5AFHA14Ifaeu6532WMDBgA07tnf+WQDgtEPrX/POO7ca8GaH4l+pquo+77yzguThDg141zvfXEuS6x0YcLYoiiXvfLMkxrhM8mKL4v8wHA53eeeZNTHGvbZ6oQXxL6aUHvXObyEYjUZ3AfhonsOOasBTUhTFkq1emOUewWY7AN7RmD8DMcZlK6BPaYT99qSmmnOkruudVsO15zckP7ViStPCrZ5wqfnsOMkXdYcrhBBCCCGEEEIIIYTIk6IollJK+8uyfKTtY1lVDMAzva8RVFX1BMk3AHxI8o/mOf6PKaV72hK/LMt7AfzUHMuO+QGA1wE8HvoAyT0A3gLw5Q2qWN/EGO9vSfyvb1DEuQDgaErp6RDCTWG7UFXVnQCGJL+aoqL1Pcl98zqHGONTzf/c6vHPAxgMBoM7wqIyGo0eat7Z83+3oG5aTXiW1wrUdX0rgLdn2ARuW1nXbCN5WBTstTBWj53jzvcLMcZimjKj7f8l+RqAb+dxDk0ux7NeWbGysnIzybrFlc4bAN5LKb0SY3zSxLDVdBbNgq599h3J91vc+G3n8KblGnKiucB90lLS49zCdvVUVfVAyAFbqUDyN29R2L0Jv5J83lv8Acmr3mLQL66mlF51Ed/W3/Rc/PGECS93Lf4e2+ScQfLjHALAn2VZPtylAWe9k2Z+8XEn4qeUnssg2XGOAeDZbfl2Ky5IdLLxb8pnOn2L860b4PR6sfGCxEbrBmSQ5DjnkAGUAe6tkOoB/kJQQ5C/GHQIXQMoA9xbIdUD/IWghiB/MegQugZwmxsghBBCCCGEEEIIIcKi8g94+KGvNJiHpgAAAABJRU5ErkJggg=="/>
    </defs>
  </svg>
  <svg v-else width="30" height="27" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 6L20.385 8.115L24.255 12H9V15H24.255L20.385 18.87L22.5 21L30 13.5L22.5 6ZM3 3H15V0H3C1.35 0 0 1.35 0 3V24C0 25.65 1.35 27 3 27H15V24H3V3Z" fill="#767676"/>
  </svg>
</template>

<script>
export default {
  name: "Login",
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
