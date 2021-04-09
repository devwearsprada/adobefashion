<template>
  <div class="fixed h-full p-4 z-50 backdrop-blur overflow-y-auto">
    <div
      class="fixed flex z-50 top-4 right-4 justify-center items-center leading-none border-black border bg-primary rounded-full w-12 h-12 transition-all transform hover:scale-110"
      @click="$emit('toggleModal')"
    >
      X
    </div>
    <div class="rounded-2xl shadow-secondary">
      <div class="relative h-4 rounded-t-full bg-secondary"/>
      <div class="bg-secondary px-4">
        Dear Visitor,
        <br/><br/>
        The images, which pop up as you read and scroll the text, each show a “look” that caught Rosalie’s attention on the street.
        <br/><br/>
        Like Rosalie, you can manipulate and change each look by dragging, pulling or swiping details in the image. If you are content with your re-design, you can save your version to the archive. If you want to start over, click “re-set.”
        <br/><br/>
        Click in the text to close the pop-up image and read on.
        <br/><br/>
        To view all versions of the five looks, including yours, click “archive.”
        <br/><br/>
        “Look 5,” the bag, will be actually produced  in a limited series of manipulated versions. In the archive, you can see which versions of “Look 5” are still available for sale.
      </div>
      <div class="h-4 rounded-b-full bg-secondary"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopUpModal',
  created() {
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.touchAction = 'none'

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
  },
  destroyed() {
    document.documentElement.style.overflow = 'auto'
    document.documentElement.style.touchAction = 'auto'

    document.body.style.overflow = 'auto'
    document.body.style.touchAction = 'auto'
  }
}

</script>