<template>
  <div class="grid grid-cols-1 grid-rows-1">
    <template v-if="ready">
      <canvas class="col-span-1 col-start-1 row-start-1 w-full" :width="imageSizes[0]" :height="imageSizes[1]" ref="webglcanvas"></canvas>
      <canvas class="col-span-1 col-start-1 row-start-1 w-full"  :width="imageSizes[0]" :height="imageSizes[1]" ref="2dcanvas"></canvas>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import { Move, Point } from '@/constructors'

export default {
  name: 'Warp',
  props: ['image', 'saveEdit', 'resetEdit'],
  data() {
    return {
      api: process.env.VUE_APP_API_URL,
      ready: false,
      imageDimensions: {
        width: null,
        height: null,
      },
      gl: null,
      lineProgram: null,
      texCoordLocation2: null,
      texCoordBuffer2: null,
      resolution: 100,
      pictureProgram: null,
      texCoordLocation: null,
      texCoordBuffer: null,
      moves: [],
      MAXMOVES: 100,
      renderLines: false,
      canvasMode: 0,
      modeUniform: 1,
      stop: false,
    }
  },
  created() {
    // get image dimensions
    const image = new Image()
    image.src = this.image
    image.onload = () => {
      this.imageDimensions.width = image.width
      this.imageDimensions.height = image.height
    }
  },
  watch: {
    imageSizes() {
      if (this.imageSizes[0] > 0 && this.imageSizes[1] > 0) {
        this.ready = true
        this.$nextTick(() => {
          this.init()
          this.inputHandler()
        })
      }
    },
    resetEdit() {
      if (this.resetEdit) {
        this.reset()
        this.$emit('reset')
      }
    },
    saveEdit() {
      if (this.saveEdit) {
        console.log('yo');
        const canvas = this.$refs.webglcanvas

        canvas.toBlob((blob) => {
          let formData = new FormData()
          const original = this.original.id
          let object = { "original": original }
          object = JSON.stringify(object)          

          formData.append("files.image", blob, `${this.original.image.hash}_edit.png`)
          formData.append("data", object)
          
          axios.post(`${this.api}/edits`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then((response) => {
            this.$store.commit('pushEdits', [response.data])
            this.$emit('save')
            // TODO: Push response to edits array in store
          })
        })
      }
    }
  },
  computed: {
    devicePixelRatio() {
      var devicePixelRatio;
      if (typeof window.devicePixelRatio !== undefined) devicePixelRatio = window.devicePixelRatio;
      else devicePixelRatio = 2;

      return devicePixelRatio;
    },
    imageSizes() {
      let width = 1, height = 1
      const imageWidth = this.imageDimensions.width
      const imageHeight = this.imageDimensions.height

      width = Math.round((imageWidth / 2) * this.devicePixelRatio)
      height = Math.round((imageHeight / 2) * this.devicePixelRatio)

      return [width, height]
    },
    original() {
      return this.$store.getters.inView
    }
  },
  methods: {
    init() {
      const canvas = this.$refs.webglcanvas;

      // Set canvas context to WEBGL
      try {
        this.gl = canvas.getContext("webgl", { preserveDrawingBuffer: true })
          || canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
      } catch(e) {
        console.log(e);
      }

      /* If we can't get a WebGL context (no WebGL support), 
      then display an error message. */
      if (!this.gl) {
        // TODO: handle WEBGL error
        return
      }

      try {
        /* Load the GLSL source written in the index
        and create program with the two shaders. */
        this.lineProgram = this.loadProgram(this.gl, 
          this.getShader(this.gl, '2d-vertex-shader'), 
          this.getShader(this.gl, 'red')
        )

        // tell WEBGL to use this program
        this.gl.useProgram(this.lineProgram)

        // look up where the vertex data needs to go
        this.texCoordLocation2 = this.gl.getAttribLocation(this.lineProgram, "a_texCoord")

        // provide texture coordinates for the rectangle
        this.texCoordBuffer2 = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer2)

        /* create a buffer and set it to use the array set up above.
        set it to be modified once, use many.
        createRedGrid sets up the vector array itself */
        this.gl.bufferData(this.gl.ARRAY_BUFFER, 
          this.createRedGrid(), 
          this.gl.STATIC_DRAW
        ) // fill buffer data

        // turn one the vertex attributes in the GPU program
        this.gl.enableVertexAttribArray(this.texCoordLocation2)

        // set up the data format for the vertex array. set points to (x/y). use floats.
        this.gl.vertexAttribPointer(this.texCoordLocation2, 2, this.gl.FLOAT, false, 0, 0)
      } catch(e) {
        // TODO: clean error handling
        console.warn(e)
      }

      try {
        const vertexShader = this.getShader(this.gl, "2d-vertex-shader")
        const fragmentShader = this.getShader(this.gl, "2d-fragment-shader")

        this.pictureProgram = this.loadProgram(this.gl, vertexShader, fragmentShader)
        this.gl.useProgram(this.pictureProgram)

        // looks up where the vertex data needs to go
        this.texCoordLocation = this.gl.getAttribLocation(this.pictureProgram, "a_texCoord")

        // provide texture coordinates for the rectangle
        this.texCoordBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer)

        // createImageGrid sets up the vector array itself
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.createImageGrid(), this.gl.STATIC_DRAW)
        this.gl.vertexAttribPointer(this.texCoordLocation, 2, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.texCoordLocation)
        // set up uniform variables (image)
        this.pictureProgram.u_image = this.gl.getUniformLocation(this.pictureProgram, "u_image")

        // set the texture to use
        this.gl.uniform1i(this.pictureProgram.u_image, 0)
      } catch(e) {
        // TODO: clean error handling
        console.warn(e)
      }

      // load image
      this.loadImage()
    },
    loadProgram(gl, vertexShader, fragmentShader) {
      // create a program object
      const program = gl.createProgram()

      // attach the two shaders
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)

      // link them together
      gl.linkProgram(program)

      // check link status
      const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
      if (!linked) {
        const lastError = gl.getProgramInfoLog(program)
        console.warn("Error in program linking: " + lastError)

        gl.deleteProgram(program)
        return null
      }

      return program
    },
    getShader(gl, id) {
      // get shader script from document
      const shaderScript = document.getElementById(id)

      // return null if script not found
      if (!shaderScript) return null

      /* if successfull, build a string representing
      the shader source */
      let str = ""
      let k = shaderScript.firstChild
      while(k) {
        if (k.nodeType == 3) str += k.textContent
        k = k.nextSibling
      }

      let shader

      // create shader based on type set
      if (shaderScript.type == 'x-shader/x-fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER) 
      } else if (shaderScript.type == 'x-shader/x-vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER)
      } else {
        return null
      }

      gl.shaderSource(shader, str)
      gl.compileShader(shader)
      

      // check compile status, return error if failed
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null

      return shader

    },
    createRedGrid() {
      // make a 0,0 to 1,1 triangle mesh, using n = resolution step
      let q = 0.001 // a fudge to ensure that the wireframe lines are renderen inside the canvas boundry
      let r = (1 - q * 2) / this.resolution
      // two numbers per coord. three coords per triangle. two triangles per square. resolution * resolution squares
      let c = new Float32Array(this.resolution * this.resolution * 20)
      // array index
      let i = 0

      // build the mesh top to bottom, left to right
      for (let xs = 0; xs < this.resolution; xs++) {
        for (let ys = 0; ys < this.resolution; ys++) {
          let x = r * xs + q
          let y = r * ys + q
          // top of square, first triangle
          c[i++] = x
          c[i++] = y
          c[i++] = x + r
          c[i++] = y

          // center line, hypotonose of triangles
          c[i++] = x
          c[i++] = y + r
          c[i++] = x + r
          c[i++] = y

          // bottom line of 2nd triangle
          c[i++] = x
          c[i++] = y + r
          c[i++] = x + r
          c[i++] = y + r

          // first triangle, left side
          c[i++] = x
          c[i++] = y
          c[i++] = x
          c[i++] = y + r

          // right side of the 2nd triangle
          c[i++] = x + r
          c[i++] = y
          c[i++] = x + r
          c[i++] = y + r
        }
      }
      return c
    },
    createImageGrid() {
      let q = 0.001
      let r = (1 - q * 2) / this.resolution
      let c = new Float32Array(this.resolution * this.resolution * 12)
      
      let i = 0

      for (let xs = 0; xs < this.resolution; xs++) {
        for (let ys = 0; ys < this.resolution; ys++) {
          let x = r * xs + q
          let y = r * ys + q

          c[i++] = x
          c[i++] = y

          c[i++] = x + r
          c[i++] = y

          c[i++] = x
          c[i++] = y + r

          c[i++] = x + r
          c[i++] = y

          c[i++] = x
          c[i++] = y + r

          c[i++] = x + r
          c[i++] = y + r
        }
      }
      return c
    },
    loadImage() {
      const image = new Image()
      image.crossOrigin = 'Anonymous'
      image.src = this.image
      image.onload = () => {
        this.imageToTexture(image)
      }
    },
    imageToTexture(image) {
      const canvas = this.$refs['2dcanvas']
      if (canvas) {
        const ctx = canvas.getContext('2d')
        const canvWidth = canvas.width 
        const canvHeight = canvas.height
        const imgWidth = image.width
        const imgHeight = image.height

        // calculate image ratio
        const hRatio = canvWidth / imgWidth,
        vRatio = canvHeight / imgHeight

        const ratio = Math.min(hRatio, vRatio)

        // calculate x, y to center image
        const centerShift_x = (canvWidth - imgWidth * ratio) / 2,
        centerShift_y = (canvHeight - imgHeight * ratio) / 2

        // put the image on the canvas
        ctx.drawImage(image, 0, 0, imgWidth, imgHeight,
          centerShift_x, centerShift_y, imgWidth * ratio, imgHeight * ratio
        )

        // TODO: check if this works without extra gl variable
        let gl = this.gl

        // create texture object that will contain the image
        const texture = gl.createTexture()

        // bind the texture the target (TEXTURE_2D) of the active texture unit
        gl.bindTexture(gl.TEXTURE_2D, texture)

        // flip the image y axis to match the WEBGL texture coordinate space
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

        // set the parameters so we can render any image size
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

        // upload the resized canvas image into the texture
        // note: a canvas is used here but can be replaced bu image object
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
        ctx.clearRect(0, 0, canvWidth, canvHeight)

        this.reset()
      }
    },
    reset() {
      this.moves = []
      this.render()
    },
    render() {
      // TODO: check if possible without extra variable
      const gl = this.gl

      // create two arrays to hold start and end point uniforms
      const p1 = new Float32Array(this.MAXMOVES * 2) // x and y
      const p2 = new Float32Array(this.MAXMOVES * 2) // x and y

      let index = 0
      for (let i = 0; i < this.MAXMOVES; i++) {
        // working values
        let x1, y1, x2, y2
        if (this.moves[i]) {
          x1 = this.moves[i].point1.x
          y1 = this.moves[i].point1.y
          x2 = this.moves[i].point2.x
          y2 = this.moves[i].point2.y
        } else {
          x1 = 1
          y1 = 1
          x2 = 0.9999999
          y2 = 0.9999999
        }

        p1[index] = x1
        p1[index + 1] = y1
        p2[index] = x2
        p2[index + 1] = y2
        index += 2
      }

      // Clear color buffer and set it to light gray
      gl.clear(this.gl.COLOR_BUFFER_BIT)

      // This controls to either draw the grid or the photo
      if (this.renderLines) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer2)
        gl.useProgram(this.lineProgram)

        gl.uniform2fv(gl.getUniformLocation(this.lineProgram, "p1"), p1)
        gl.uniform2fv(gl.getUniformLocation(this.lineProgram, "p2"), p2)

        gl.vertexAttribPointer(this.texCoordLocation2, 2, gl.FLOAT, false, 0, 0)

        gl.enableVertexAttribArray(this.texCoordLocation2)

        gl.drawArrays(gl.LINES, 0, this.resolution * this.resolution * 10)
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer)

        gl.useProgram(this.pictureProgram)

        gl.uniform2fv(gl.getUniformLocation(this.pictureProgram, "p1"), p1)
        gl.uniform2fv(gl.getUniformLocation(this.pictureProgram, "p2"), p2)

        gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0)

        gl.enableVertexAttribArray(this.texCoordLocation)

        gl.drawArrays(gl.TRIANGLES, 0, this.resolution * this.resolution * 2 * 3)
      }

      // Draw uniform points
      if (this.canvasMode === this.modeUniform) {
        const canvas = this.$refs['2dcanvas']
        let ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < this.MAXMOVES; i++) {
          if (this.moves[i]) {
            let x1 = (this.moves[i].point1.x + 1) * canvas.width / 2
            let y1 = (-this.moves[i].point1.y + 1) * canvas.height / 2
            let x2 = (this.moves[i].point2.x + 1) * canvas.width / 2
            let y2 = (-this.moves[i].point2.y + 1) * canvas.height / 2

            // the ratio is used here to show where the pixel started and ended
            let ratio = 1 
            x2 = x1 + (x2 - x1) * ratio
            y2 = y1 + (y2 - y1) * ratio

            let radius =  6
            ctx.beginPath() // start a fresh path

            // create a 2d gradient
            let grd = ctx.createLinearGradient(x1, y1, x2, y2)
            grd.addColorStop(0, "pink") // set one side to pink
            grd.addColorStop(1, "red") // the other side to red

            ctx.setLineDash([5, 5]) // use dotted line
            ctx.lineWidth = radius / 2
            ctx.moveTo(x1, y1) // create a line from start to end poing
            ctx.lineTo(x2, y2)
            ctx.strokeStyle = grd
            ctx.stroke()

            ctx.beginPath() // start a new path for pink dot
            ctx.arc(x1 , y1, radius, 0, 2 *  Math.PI, false) // full circle
            ctx.fillStyle = "pink"
            ctx.fill()

            ctx.beginPath() // start new path for red dot
            ctx.arc(x2, y2, radius, 0, 2 * Math.PI, false)
            ctx.fillStyle = "red"
            ctx.fill()    
          }
        }
      }
    },
    inputHandler() {
      const canvas = this.$refs['2dcanvas']
      // set up mouse events on the canvas object
      canvas.onmousedown = (e) => {
        e.preventDefault()
        this.stop = false
        this.move = this.newMove(this.getMousePoint(e))
      }

      canvas.ontouchstart = (e) => {
        this.stop = false
        this.move = this.newMove(this.getMousePoint(e))
      }

      canvas.onmouseup = (e) => {
        e.preventDefault()
        this.move = undefined
        this.render()
      }

      canvas.ontouchend = (e) => {
        e.preventDefault()
        this.move = undefined
        this.render()
      }

      window.onmouseup = (e) => {
        e.preventDefault()
        this.stop = true
        this.move = undefined
        this.render()
      }

      window.ontouchend = (e) => {
        e.preventDefault()
        this.stop = true
        this.move = undefined
        this.render()
      }

      canvas.onmousemove = (e) => {
        e.preventDefault()
        let point = this.getMousePoint(e)

        if (typeof this.move !== 'undefined' && !this.stop) {
          if (typeof point !== 'undefined') {
            this.move.move(point)
          }
          this.render()
        }
      }

      canvas.ontouchmove = (e) => {
        e.preventDefault()
        let point = this.getMousePoint(e)

        if (typeof this.move !== 'undefined' && !this.stop) {
          if (typeof point !== 'undefined') {
            this.move.move(point)
          }
          this.render()
        }
      }

      canvas.ondragstart = (e) => {
        e.preventDefault()
      }
    },
    getMousePoint(e) {
      let x, y

      // standard way to get mouse coordinates
      if (e.offsetX) {
        let pos = { x: e.clientX, y: e.clientY }
        const rect = e.target.getBoundingClientRect()
        const x_rel = pos.x - rect.left;
        const y_rel = pos.y - rect.top;
        x = Math.round((x_rel * e.target.width) / rect.width);
        y = Math.round((y_rel * e.target.height) / rect.height);
      }
      // mobile touch
      else if (e.touches) {
        let pos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        const rect = e.target.getBoundingClientRect();
        const x_rel = pos.x - rect.left;
        const y_rel = pos.y - rect.top;
        x = Math.round((x_rel * e.target.width) / rect.width);
        y = Math.round((y_rel * e.target.height) / rect.height);
      } else {
        return undefined // work around chrome
      }

      return this.normalizedPoint(x, y) // converts pixels to -1 to 1
    },
    normalizedPoint(x, y) {
      // converts screen coordinates from -1 to 1
      const canvas = this.$refs['2dcanvas']
      x = (x / (canvas.width / 1)) * 2 - 1
      y = (1 - (y / (canvas.height / 1))) * 2 - 1

      return new Point(x, y)
    },
    newMove(point) {
      let move = new Move(point)

      // add move to beginning of the moves array
      this.moves.unshift(move)
      
      return move
    }
  }
}
</script>