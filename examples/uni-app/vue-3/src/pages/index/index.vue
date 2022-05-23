<template>
	<view class="index bg-[#b5b5b5] h-screen pl-7.5" :class="{'text-[50px]': true}">
        <text :class="['font-bold', 'text-[#ffffff]']">{{ title }}</text>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello world!')
</script>

<style>
    .index {
        @apply pt-[45vh];
    }
</style>