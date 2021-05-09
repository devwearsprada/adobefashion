<template>
  <ul class="text-xs -mt-40">
    <li
      class="pt-40 -mb-40"
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