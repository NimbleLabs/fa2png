import easele from './../easele.js'

export default class IconService {

  constructor( model ) {
    this.model = model;
    this.http = easele.http
    this.baseUrl = process.env.API_URL;
  }

  /**
   * Returns any icons for a user
   */
  list() {

    return new Promise((resolve, reject) => {

      let serviceUrl = this.baseUrl + "api/v1/icons.json";
      let authToken = easele && easele.model &&
        easele.model.user &&
        easele.model.user.auth_token
      if (!authToken) {
        reject('user not authorized')
        return
      }

      this.http.get(serviceUrl)
        .set('x-api-token', authToken)
        .set('Accept', 'application/json')
        .end(function (error, response) {
          if (response.status === 200) {
            var icons = JSON.parse(response.text);

            // normalize the Icon model objects
            for( var i = 0; i < icons.length; i++ ) {
              if( icons[i].name.indexOf( 'fa-') != 0 ) {
                icons[i].name = 'fa-' + icons[i].name
              }

              if( icons[i].background == null ) {
                icons[i].background = 'transparent';
              }

              icons[i].hasBackground = icons[i].background != 'transparent';
            }

            easele.model.savedIcons = icons;
            resolve(icons)
          } else if (response.status == 401) {
            reject("user not authorized");
          } else {
            reject('status: ' + (response.status || 'undefined'))
          }
        })
    })
  }

  save(icon) {
    var serviceUrl = this.baseUrl + "api/v1/icons.json";
    var httpMethod = this.http.post

    if (icon.id) {
      serviceUrl = this.baseUrl + "/api/v1/icons/" + icon.id + ".json";
      httpMethod = this.http.put
    }

    var iconService = this;

    let promise = new Promise((resolve, reject) => {

      let authToken = easele && easele.model &&
        easele.model.user &&
        easele.model.user.auth_token
      if (!authToken) {
        reject ('user not authorized')
      }

      httpMethod(serviceUrl)
        .send(icon)
        .set('x-api-token', authToken)
        .set('Accept', 'application/json')
        .end(function (error, response) {
          if (response.status == 201) {
            resolve(JSON.parse(response.text))
            iconService.list();
          } else if (response.status == 401) {
            reject("user not authorized")
          } else if (response.status == 422) {
            reject("unprocessable entity")
          }
        })
    })
    return promise
  }

  //update(icon) {
  //  var serviceUrl = this.baseUrl + "/api/v1/icons/" + icon.id + ".json";
  //  // var httpService = this;
  //
  //  console.log('update')
  //
  //  this.http.put(serviceUrl)
  //    .send(icon)
  //    .set('x-api-token', this.authToken)
  //    .set('Accept', 'application/json')
  //    .end(function (error, response) {
  //
  //      if (response.status == 200) {
  //        // TODO
  //        //var icon = JSON.parse(response.text);
  //        //easele.model.currentIcon = icon;
  //        //httpService.list();
  //      } else if (response.status == 401) {
  //        console.log("user not authorized");
  //      } else if (response.status == 422) {
  //        console.log("unprocessable entity");
  //        console.log(response);
  //      }
  //    });
  //}
}
