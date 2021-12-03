<template>
  <div class="relative z-100" v-on-clickaway="() => {show = false}">
    <input
          type="text"
          class="search-input form-control"
          v-model="search"
          @click="show=true"
          placeholder="Search for icon" />
    <div class="relative">
           <ul class="icon-list"
            v-show="show">
      <li :class="{'active':(iconObj==selectedIcon)}"
          @click="()=>{show = false}"
          v-for="iconObj in model.iconList">
        <a href="#" @click.prevent="onIconSelect(iconObj)">
          <i class="fa" :class="iconObj.name"></i>
          <span class="icon-name">{{iconObj.name}}</span>
        </a>
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
 import easele from './../easele'
 import {
   directive as onClickaway
 } from 'vue-clickaway2'

 export default {
   name: 'IconSelector',
   data () {
     return {
       model: easele.model,
       selectedIcon: null,
       search: '',
       show: false
     }
   },
   directives: {
     onClickaway
   },
   methods: {
     onIconSelect (iconObjOrIconName) {
       let iconObj
       if (typeof iconObjOrIconName === 'string') {
         this.model.iconList.some(el => {
           if (el.name === iconObjOrIconName) {
             iconObj = el
             return true
           }
         })
       } else {
         iconObj = iconObjOrIconName
       }
       this.selectedIcon = iconObj
       this.$emit('select', iconObj)
       this.model.showSelectIconScreen = false
     }
   },
   encodeFont: function (unicode) {
     if (unicode === undefined) {
       return ''
     }
     return unicode.toString()
   }
 }

</script>

<style scoped lang="scss">
  input {
    text-align: left
  }

  .icon-list {
    position: absolute;
    right: 0;
    left: 0;
    background: #fff;
    border: 1px solid #ccc;
    border-top: 0;
    padding: 0;
    list-style: none;
    max-height: 300px;
    overflow: auto;
    overflow-x: hidden;
    width: 100%;
    li {
      display: block;
      margin: 4px 2px;
      a {
        display: block;
        &:hover {
          background: #5bc0de;
          color: #fff;
        }
        &:hover,
        &:active,
        &:focus {
          text-decoration: none;
        }
      }
      &.active {
        a {
          background: #0064FF;
          color: #fff;
        }
      }
    }
    .fa:before {
      margin-right: 5px;
    }
    a {
      color: #333;
      padding: 5px 10px 5px 5px;
      border-radius: 4px;
      vertical-align: middle;
    }
  }

</style>
