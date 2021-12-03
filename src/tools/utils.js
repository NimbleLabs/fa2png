import easele from './../easele'
let utils = {};

utils.getCookie = function(cname) {
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

utils.removeAuthCookie = function() {
  document.cookie = "easele_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

utils.debounce = function( func , wait , immediate ){
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

utils.resize = function(){
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

export default utils
window.utils = utils
