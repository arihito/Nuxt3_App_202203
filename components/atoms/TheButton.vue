<script setup lang="ts">
const props = defineProps({
  name: String
})
</script>
<template>
  <button>
    {{ props.name }}
  </button>
</template>
