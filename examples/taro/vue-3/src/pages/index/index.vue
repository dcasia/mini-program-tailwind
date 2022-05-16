<template>
  <view class="index bg-[#b5b5b5] h-screen pl-7.5" :class="{'text-[50px]': true}">
    <text :class="['font-bold', 'text-[#ffffff]']">{{ msg }}</text>
  </view>
</template>

<script>
import { ref } from 'vue'
import './index.css'

export default {
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  }
}
</script>
