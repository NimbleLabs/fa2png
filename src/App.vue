<template>
  <div id="app">
    <navbar></navbar>
    <div class="container-fluid" style="height: 100%;">
      <main-element v-if="!model.showSelectIconScreen"></main-element>
      <div v-if="model.showSelectIconScreen">
        <label>Icon:</label>
        <icon-selector></icon-selector>
      </div>
    </div>
    <footer id="footer"><a href="http://www.nimblelabs.com/">© Nimble Labs {{new Date().getFullYear()}}</a></footer>
  </div>
</template>

<script>
import easele from './easele'
import Navbar from './components/Navbar'
import MainElement from './components/Main'
import IconSelector from './components/IconSelector'

export default {
  data () {
    return {
      model: easele.model
    }
  },

  components: {
    MainElement,
    Navbar,
    IconSelector
  },
  mounted () {
    easele.utils.resize()
  }
}

</script>

<style>
html,
body {
  height: 100%;
}

h1,
h2 {
  font-family: 'Roboto Slab', serif;
  font-weight: bold;
}

#app {
  color: #2c3e50;
  font-family: 'Raleway', sans-serif;
  height: 100%;
}

#footer {
  padding-top: 10px;
  padding-bottom: 10px;
  color: #fff;
  background: #333333;
  text-align: center;
}

#footer a,
#footer a:hover {
  color: #fff;
  text-decoration: none;
}

input {
  max-width: 100%;
}

</style>
