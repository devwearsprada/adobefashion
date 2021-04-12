<template>
  <div class="fixed flex h-screen w-screen justify-center items-center bg-primary z-50">
    <img 
      class="w-1/4 md:w-2/12 lg:w-1/12 animate-spin-slow" 
      src="@/assets/images/loader.svg"
    />
  </div>
</template>

<script>
export default {
  name: 'Preloader'
}
</script>