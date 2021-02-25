import Vue from 'vue'

const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

const getBreakpoint = width => {
  if (width >= screens.xl) return 'xl'
  if (width >= screens.lg) return 'lg'
  if (width >= screens.md) return 'md'
  if (width >= screens.sm) return 'sm'
  return 'all'
}

const debounce = function(func, wait) {
  var timeout
  return () => {
    const later = function() {
      timeout = null
    }
    const callNow = !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func()
  }
}

const breakpoints = Vue.observable({
  w: window.innerWidth,
  h: window.innerHeight,
  is: getBreakpoint(window.innerWidth)
})

window.addEventListener(
  'resize',
  debounce(() => {
    breakpoints.w = window.innerWidth
    breakpoints.h = window.innerHeight
    breakpoints.is = getBreakpoint(window.innerWidth)
  }, 200),
  false
)

export default breakpoints