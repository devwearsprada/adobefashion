<template>
  <article 
    v-html="html"
  />
</template>

<script>
export default {
  props: ['html'],
  name: 'SanitizeHTML',
}
</script>