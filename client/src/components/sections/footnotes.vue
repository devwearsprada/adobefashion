<template>
  <ul class="text-xs pt-4">
    <li
      v-for="(footnote, i) in data.footnoteLinks"
      :key="i"
      :id="footnote.anchor"
    >
      <span v-html="footnote.linkText"></span>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['data'],
  name: 'Footnotes'
}
</script>

<style>

</style>