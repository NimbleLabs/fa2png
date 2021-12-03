<template>
  <div v-on-clickaway="toggleVisible.bind(this, false)" class="inline-block">
    <label v-if="label">{{label}}:</label>
    <div class="color-picker" @click="toggleVisible">
      <div class="transparent-bg">
        <div class="color-picker-inner" :style="{backgroundColor:colorValue}"></div>
      </div>
    </div>
    <input :value="colorValue" @input="onInputChange($event.target.value)" class="inline-block input-hex" type="text" />
    <div class="absolute chrome-picker-wrapper" v-show="showColorPicker">
      <chrome-picker :value="colorValue" @input="onChange"></chrome-picker>
      <input :value="colorValue" @input="onInputChange($event.target.value)" class="input-hex" type="text" />
    </div>
  </div>
</template>

<script>
  import easele from './../easele'
  import {
    Chrome as ChromePicker
  } from 'vue-color'
  import {
    directive as onClickaway
  } from 'vue-clickaway2'

  const isHex = (h) => {
    let a = parseInt(h, 16);
    return (a.toString(16) === h.toLowerCase())
  }

  export default {
    name: 'ColorPicker',
    props: ['value', 'label', 'isBackground'],

    components: {
      ChromePicker
    },
    directives: {
      onClickaway
    },
    computed: {
      colorValue() {
        return this.isBackground == "true" ? this.value.background : this.value.color
      }
    },
    data() {
      return {
        showColorPicker: false
      }
    },
    methods: {
      toggleVisible(newVal) {
        if (typeof newVal === 'undefined') {
          newVal = !this.showColorPicker
        }
        this.showColorPicker = newVal
      },
      onInputChange(val) {

        console.log('onInputChange******************************************')
        console.log(val)

        if (/^#/.test(val)) {
          val = val.substring(1)
        }
        if (isHex(val)) {
          this.$emit('input', '#' + val)
        }
      },
      onChange(val) {
        console.log('onChange******************************************')
        console.log(val)
        // this.$emit('input', val.hex);

        if( this.isBackground == "true") {
          this.value.background = val.hex
          easele.bus.$emit('bgColorChanged', val.hex);
        }
        else {
          this.value.color = val.hex
          easele.bus.$emit('colorChanged', val.hex);
        }
      }
    }
  }

</script>

<style>
  .range-slider-fill {
    background-color: #025aa5 !important;
  }

  .vue-color__chrome__fields-wrap {
    display: none !important
  }

  .vue-color__chrome__alpha-wrap {
    display: none !important
  }

  .vue-color__chrome__color-wrap {
    margin-top: -9px !important
  }


</style>

<style scoped>
  .input-hex.inline-block {
    max-width: 80px;
    margin: 0 0 0 10px
  }
  .input-hex {
    margin: 10px;
    width: calc(100% - 20px)
  }

  .chrome-picker-wrapper {
    background: #fff;
    box-shadow: 0 0 2px rgba(0, 0, 0, .3), 0 4px 8px rgba(0, 0, 0, .3);
  }

  .vue-color__chrome {
    box-shadow: none !important
  }

  .row {
    margin-left: 0;
    margin-right: 0;
  }

  .row>* {
    padding-left: 0;
    padding-right: 0;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

</style>
