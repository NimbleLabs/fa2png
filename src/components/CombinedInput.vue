<template>
  <div class="row">
       	<div class="col-xs-12 col-sm-3 col-md-2">
       		<label>{{label}}</label>
       	</div>
       	<div class="col-sm-6 col-xs-9 col-md-8">
       		<range-slider
           			class="margin-input slider"
              	:value="value"
              	@input="onChange"
               	type="range"
               	:min="min"
               	:step="step"
               	:max="max">
          </range-slider>
       	</div>
       	<div class="col-xs-3 col-md-2">
       		<input type="number"
       					@change="onChange($event.target.value)"
       					:value="value"/>
       	</div>
       </div>
</template>

<script>
  import RangeSlider from 'vue-range-slider'
  import 'vue-range-slider/dist/vue-range-slider.css'

  export default {
    name: 'CombinedInput',
    props: ['value', 'label', 'max', 'min', 'step'],

    components: {
      RangeSlider
    },
    data () {
      return {}
    },
    methods: {
      onChange (val) {
        this.$emit('input', Number(val))
      }
    }
  }

</script>

<style>
  .range-slider-fill {
    background-color: #025aa5 !important;
  }

</style>

<style scoped>
  .row {
    margin-left: 0;
    margin-right: 0;
  }

  .range-slider {
    margin-left: 10px;
    margin-right: 10px;
    width: 90%
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
