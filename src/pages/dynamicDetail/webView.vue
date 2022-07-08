<template>
	<web-view :src="src"></web-view>
</template>
<script>
export default {
	data() {
		return {
			src: ''
		}
	},
	onLoad() {
		this.src = this.$root.$mp.query.url
	}
}
</script>
