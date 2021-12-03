import http from 'superagent'
import X2JS from 'x2js'
import faNamesMap from './assets/font-awesome/fa-map.json'
import settings from './settings'
import Vue from 'vue'
import utils from "@/tools/utils";

var easele = {
  http,
  bus: new Vue(),
  stage: null,
  model: {
    user: null,
    viewport: 1,
    showSelectIconScreen: false,
    iconList: [],
    icon: {
      glyph: null,
      bounds: {
        width: 0,
        height: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      },
      scale: 0.1
    },
    currentIcon: {
      id: null,
      name: '',
      margin: 0,
      hasBackground: false,
      color: settings.DEFAULT_COLOR,
      background: '#fff',
      size: Number(settings.DEFAULT_SIZE)
    },
    savedIcons: []
  },

  utils: {}
}

easele.utils.getCookie = function(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

easele.utils.removeAuthCookie = function() {
  document.cookie = "easele_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

easele.utils.debounce = function( func , wait , immediate ){
  var timeout;
  return function(){
    var context = this, args = arguments;
    var later = function(){
      timeout = null;
      if( !immediate ){
        func.apply( context , args );
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout( timeout );
    timeout = setTimeout( later , wait );
    if( callNow ){
      func.apply( context , args );
    }
  };
};

easele.utils.resize = function(){
  var w = document.body.clientWidth || window.innerWidth;
  var h = document.body.clientHeight || window.innerHeight;
  var viewport = easele.model.viewport;
  if( w < 737 ){
    if( viewport !== 0 ){
      easele.model.viewport = 0;
    }
  } else{
    if( viewport !== 1 ){
      easele.model.viewport = 1;
    }
  }
  easele.model.width = w;
  easele.model.height = h;
};

// easele.utils = import('./tools/utils')
window.addEventListener('resize', easele.utils.debounce(easele.utils.resize, 50))

easele.http.get('/static/font-awesome/fonts/fontawesome-webfont.svg')
        .end(function (error, response) {
       if (response.status === 200) {
         let data = response.text
         let x2js = new X2JS()
         let json = x2js.xml2js(data)
         json.svg.defs.font.glyph.map((glyph) => {
           if (glyph._unicode && glyph._unicode !== ' ') {
             let normalizedUnicode = escape(glyph._unicode).replace(/%uf/i, '').toLowerCase()
             if (faNamesMap[normalizedUnicode]) {
               // Sometimes there are several names
               // for the same icon, for example .fa-usd and .fa-dollar
               let iconNames = faNamesMap[normalizedUnicode].split(',')
               iconNames.forEach((name) => {
                 let iconObj = {
                   glyph,
                   unicode: glyph._unicode,
                   name: 'fa-' + name
                 }
                 easele.model.iconList.push(iconObj)
               })
             }
           }
         })
       }
     })
export default easele
// for debugging only, can be removed from global scope:
window.easele = easele
