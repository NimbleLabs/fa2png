<template>
  <div class="canvas-wrapper transparent-bg">
       <div class="size-info">
       <p>Icon: <span class="capitalize bold">{{currentIcon.name}}</span></p>
       <p>Whole size: <span class="bold">{{wholeWidth}}px</span> x <span class="bold">{{wholeHeight}}px</span></p>
       </div>
      	<canvas class="image-canvas"
      	        ref="canvas"
      	        :class="{'dashed':currentIcon.margin > 0}"
      	        width="128"
                height="128"></canvas>
      </div>
</template>

<script>
  import easele from './../easele'
  let easeleStage;
  import IconControl from '../controls/IconControl'

  export default {
    name: 'Stage',
    props: ['currentIcon', 'icon'],
    data() {
      return {
        model: easele.model,
        svg: null
      }
    },
    computed: {
      wholeHeight() {
        let marginTop = this.currentIcon.margin.top || this.currentIcon.margin
        let marginBottom = this.currentIcon.margin.bottom || this.currentIcon.margin
        return marginTop + marginBottom + this.currentIcon.size
      },
      wholeWidth() {
        let marginLeft = this.currentIcon.margin.left || this.currentIcon.margin
        let marginRight = this.currentIcon.margin.right || this.currentIcon.margin
        return marginLeft + marginRight + this.currentIcon.size
      }
    },
    methods: {
      getImageData() {
        return easeleStage.canvas.toDataURL()
      },
      renderImage() {
        easeleStage.removeAllChildren()

        if (!this.icon.glyph) {
          return
        }

        this.svg = new IconControl(this.currentIcon, this.icon)
        let container = this.svg.getContainer()
        easeleStage.addChild(container)
        // setting canvas width and height to fit icon size:
        easeleStage.canvas.width = this.wholeWidth
        easeleStage.canvas.height = this.wholeHeight
        easeleStage.update()
      }
    },
    mounted() {
      easeleStage = new window.createjs.Stage(this.$refs.canvas);
      if (this.icon.glyph) {
        this.renderImage(this.icon.glyph);
      }

      var component = this;

      easele.bus.$on('colorChanged', function (color) {
        component.currentIcon.color = color;
        component.renderImage();
      });

      easele.bus.$on('bgColorChanged', function (color) {
        component.currentIcon.background = color;
        component.renderImage();
      })

      easele.bus.$on('bgEnabled', function () {
        component.renderImage();
      })

    },
    updated() {
      this.renderImage()
    }
  }

</script>

<style scoped>
  .image-canvas {
    border-color:#333
  }
  
  .canvas-wrapper {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    overflow: auto;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    min-height: 20em;
    margin-bottom: 20px;
    height: 100%;
    box-shadow: rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px;
    border-radius: 2px;
    position: relative;
  }

  .canvas-wrapper:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  canvas {
    margin: auto;
    -webkit-box-flex: 0;
    -webkit-flex: none;
    -ms-flex: none;
    flex: none;
    z-index: 2;
  }

  .size-info {
    top: 0;
    left: 0;
    background: rgba(204, 204, 204, 0.68);
    color: #333;
    position: absolute;
    padding: 4px;
    z-index: 100
  }

</style>
