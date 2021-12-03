<template>
  <div class="row main-wrapper" style="height: 100%;">
    <div class="col-md-3 col-sm-4 left-side">
     <div class="form-group">
      <div class="input-group">
        <icon-selector @select="onIconSelect" ref="sideIconSelector"></icon-selector>
         <a href="#" class="btn btn-primary border-radius-0 browse-btn" @click.prevent="iconModal = true">
           <i class="fa fa-search"></i>
         </a>
      </div>
      <modal v-model="iconModal" effect="fade" :show="iconModal">
         <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">
              All icons:
            </h4>
        </div>
        <icon-selector @select="onIconSelect" class="show-all-icons" ></icon-selector>
      </modal>
     </div>
      <div class="form-group">
        <combined-input
       		v-model="model.currentIcon.size"
       		min="8"
       		step="2"
      		:max="maxSize"
       		label="Size">
       	</combined-input>
        <a href="#"
           class="size-link"
           :class="{'badge badge-success tag tag-success disabled': size == model.currentIcon.size}"
           @click.prevent="model.currentIcon.size = size"
           v-for="size in popularSizes">
           {{size}}px
        </a>
      </div>
      <div class="form-group">
        <color-picker label="Color" is-background="false"
                      v-model="model.currentIcon">
        </color-picker>
      </div>
      <div class="form-group">
        <input type="checkbox"
               id="bgcolor-enable"
               @change="eventDispatcher.$emit('bgEnabled')"
               v-model="model.currentIcon.hasBackground" />
        <label> Background</label>
        <color-picker v-show="model.currentIcon.hasBackground" is-background="true"
                      v-model="model.currentIcon">
        </color-picker>
      </div>
      <div class="form-group">
       <combined-input
       		v-model="model.currentIcon.margin"
       		min="0"
       		step="1"
      		max="1024"
       		label="Margin">
       </combined-input>
       </div>
      <div class="form-group">
      	<button
             @click="downloadIcon('png')"
             type="button"
             class="btn btn-primary btn-block border-radius-0">
             <i class="fa fa-download"></i> Download icon
             </button>
	  </div>
    </div>
    <div class="col-md-9 col-sm-8 main">
      <stage ref="stage" :currentIcon="model.currentIcon" :icon="model.icon"></stage>
    </div>
    <!-- technical element, allows to download image with the defined name: -->
    <a ref="linkForDownload" href="" class="invisible-download-link" :download="model.currentIcon.name + '.png'">.</a>
  </div>
</template>

<script>
  import Stage from './Stage'
  import easele from './../easele'
  import {
    modal
  } from 'vue-strap'
  import ColorPicker from './ColorPicker'
  import settings from './../settings.json'
  import CombinedInput from './CombinedInput'
  import IconSelector from './IconSelector'

  export default {
    components: {
      Stage,
      ColorPicker,
      CombinedInput,
      IconSelector,
      modal
    },

    data() {
      return {
        eventDispatcher: easele.bus,
        model: easele.model,
        iconModal: false,
        popularSizes: settings.POPULAR_SIZES,
        maxSize: Number(settings.MAX_SIZE)
      }
    },

    watch: {
      'model.iconList': function() {
        // A little bit a workaround,
        // had a bug with selecting again the initial icon
        if (settings.DEFAULT_ICON) {
          this.model.iconList.some((el) => {
            if (el.name === ('fa-' + settings.DEFAULT_ICON)) {
              this.onIconSelect(el)
              return true
            }
          })
        } else {
          this.onIconSelect(this.model.iconList[0])
        }
      }
    },
    methods: {
      selectSavedIcon(icon) {
        this.model.currentIcon = icon
        this.$refs.sideIconSelector.onIconSelect(icon.name)
      },
      downloadIcon(type = 'png') {
        let d;
        if (type==='svg') {
          let _t = this.$refs.stage.getImageData('svg')
          var serializer = new window.XMLSerializer()
          var svgStr = serializer.serializeToString(_t)
          d = "data:image/svg+xml,\n"+encodeURIComponent(svgStr)
        } else {
          d = this.$refs.stage.getImageData()
        }
        if (this.$refs.linkForDownload.download) {
          // checking if download attribue is supported by the browser
          this.$refs.linkForDownload.setAttribute('href', d)
          this.$refs.linkForDownload.setAttribute('download', this.model.currentIcon.name + '.' + type)
          this.$refs.linkForDownload.click()
        } else {
          let w = window.open('about:blank', 'Generated image')
          setTimeout(() => {
            w.document.write("<img src='" + d + "' alt='from canvas'/>")
          }, 0)
        }
      },
      onIconSelect(iconObj) {
        this.model.currentIcon.name = iconObj.name
        this.model.icon.glyph = iconObj.glyph
        this.iconModal = false
      }
    },
    mounted() {
      this.$events.on('selectSavedIcon', this.selectSavedIcon)
    }
  }

</script>

<style scoped>
  .browse-btn {
    position:absolute;
    right:0;
    z-index:101
  }
</style>

<style lang="scss">
  /* Modal iconSelector */

  .show-all-icons {
    color: red;
    .icon-list {
      display: block !important;
      position: relative !important;
      li {
        display: inline-block !important;
      }
    }
  }

  .size-info p {
    margin: 0;
  }

  .invisible-download-link {
    position: relative;
    left: -999em
  }

</style>

<style>
  /*
 * Main content
 */


  .bg-changer {
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    padding: 0;
    list-style: none;
    border: 1px solid #333;
    z-index: 3;
  }

  .bg-changer>li {
    background: #fff;
    display: inline-block;
    float: right;
    padding: 4px;
    cursor: pointer;
  }

  .bg-changer>li[color="fff"]:before {
    background: #fff;
  }

  .bg-changer>li[color="000"]:before {
    background: #000;
  }

  .bg-changer>li[color="transparent"]:before {
    background: url(../assets/transparent-grid.png);
  }

  .bg-changer>li:before {
    content: '';
    width: 30px;
    height: 30px;
    display: block;
    border: 1px solid #333;
  }

  .color-picker {
    padding: 5px;
    border: 1px solid #333;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
  }

  .color-picker-inner {
    background: #000;
    width: 30px;
    height: 15px;
  }

  .image-size-input {
    width: 100%;
  }

  .popular-sizes,
  .search-input {
    width: 100%;
    border-radius: 0;
  }

  .size-link {
    display: inline-block;
    margin-right: 5px;
    font-size: .9rem;
  }

  .size-link.disabled {
    pointer-events: none;
  }

  .size-link:focus,
  .size-link:active {
    text-decoration: none;
  }

  @media (min-width:576px) {
    .main-wrapper {
      display: flex;
    }
    .main {
      display: flex;
      flex-direction: column;
    }
  }
  /*
   * Placeholder dashboard ideas
   */

  .placeholders {
    margin-bottom: 30px;
    text-align: center;
  }

  .placeholders h4 {
    margin-bottom: 0;
  }

  .placeholder {
    margin-bottom: 20px;
  }

  .placeholder img {
    display: inline-block;
    border-radius: 50%;
  }

  input {
    text-align: center
  }
</style>
