<template>
	<view class="index bg-[#b5b5b5] h-screen pl-7.5" :class="{'text-[50px]': true}">
        <text :class="['font-bold', 'text-[#ffffff]']">{{ title }}</text>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue';
	export default Vue.extend({
		data() {
			return {
				title: 'Hello world!'
			}
		},
		onLoad() {

		},
		methods: {

		}
	});
</script>

<style>

    .index {
        @apply pt-[45vh];
    }
</style>
