<template>
  <div class="icon-tile">
    <div class="svg-wrapper transparent-bg">
      <img :src="svg" class="svg-thumb" />
    </div>
    <div class="info-layer">
     <ul>
       <li><strong>Name:</strong> {{currentIcon.name}}</li>
       <li><strong>Size: </strong>{{currentIcon.size}}px</li>
       <li><strong>Margin: </strong>{{currentIcon.margin}}px</li>
     </ul>
    </div>
  </div>
</template>

<script>
  import getSvg from './../tools/getSvg'
  export default {
    name: 'IconTile',
    props: ['icon', 'currentIcon'],
    computed: {
      svg() {
        return getSvg(this.currentIcon, this.icon)
      }
    },
    mounted() {
      getSvg(this.currentIcon, this.icon)
    },
    data() {
      return {}
    },
    methods: {}
  }

</script>


<style scoped>
  
  .saved-icon {
    border-radius: 2px;
  }
  
  .svg-thumb {
    max-width:100%;
  }
  .icon-tile {
    overflow:hidden;
    position:relative
  }
  .svg-wrapper {
    display: inline-block;
    vertical-align:top;
    
    width:128px;
    height:128px;
  }
  
  .svg-wrapper {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    box-shadow: rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px;
    border-radius: 2px;
    position: relative;
  }
  
  .info-layer {
    overflow: hidden;
    border-radius: 2px;
    z-index:3;
    position:absolute;
    top:0;
    right:0;
    left:0;
    bottom:0;
    background:rgba(0, 0, 0, 0.9);
    opacity:0;
    transition:0.3s opacity ease-in;
    padding:10px;
  }
  
  .info-layer:hover {
    opacity:1;
  }
  
  .info-layer > ul {
    list-style: none;
    padding:0;
  }

  .svg-thumb {
    margin: auto;
    -webkit-box-flex: 0;
    -webkit-flex: none;
    -ms-flex: none;
    flex: none;
    z-index: 2;
  }

</style>
