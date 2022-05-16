<template>
  <view class="index bg-[#b5b5b5] h-screen pl-7.5" :class="{'text-[50px]': true}">
    <text :class="['font-bold', 'text-[#ffffff]']">{{ msg }}</text>
  </view>
</template>

<script>
import './index.css'

export default {
  data () {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>
