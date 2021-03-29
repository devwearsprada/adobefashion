<template>
  <div
    class="sticky top-0 rounded-xl shadow-primary"
  >
    <div class="h-2 rounded-t-full bg-primary"/>
    <ul
      class="flex flex-row space-x-6 bg-primary px-4"
    >
      <li 
        class="cursor-pointer"
        @click="setTypeId()"
      >
        All
      </li>
      <li
        class="cursor-pointer" 
        @click="setTypeId(original.id)"
        v-for="(original, index) in originals"
        :key="`filter-${index}`"
      >
        {{ original.title }}
      </li>
    </ul>
    <div class="h-2 rounded-b-full bg-primary"/>
  </div>
</template>

<script>
export default {
  name: 'FilterMenu',
  computed: {
    originals() {
      return this.$store.getters.originals
    },
  },
  mounted() {

  },
  methods: {
    setTypeId(id) {
      this.$store.commit('clearEdits')
      this.$store.commit('setTypeId', id)
    }
  }
}
</script>