const LS_KEY_NAME = 'icon_user'
import easele from './../easele'

export default class UserService {

  constructor() {
    this.http = easele.http
    this.baseUrl = process.env.API_URL;
    this.getStoredUser()
    this.pendingRequest = null
  }

  getStoredUser() {

    if (window.localStorage) {
      let userObjString = window.localStorage.getItem(LS_KEY_NAME)
      if (userObjString) {
        try {
          let user = JSON.parse(userObjString)
          easele.model.user = user
        } catch (err) {}
      }
    }
  }

  current(authToken) {
    var serviceUrl = this.baseUrl + "api/v1/users/current.json";

    this.http.get(serviceUrl)
      .set('x-api-token', authToken)
      .set('Accept', 'application/json')
      .end(function (error, response) {
        if (response.status === 200) {
          var user = JSON.parse(response.text);
          easele.model.user = user;
        }
      });
  }

  login(email, password) {
    var serviceUrl = this.baseUrl + "api/v1/login.json";
    var postData = {
      user: {
        email: email,
        password: password
      }
    }

    return this.send(serviceUrl, postData);
  }

  signup(name, email, password, confirmPassword) {
    var serviceUrl = this.baseUrl + "api/v1/sign_up.json";
    var postData = {
      user: {
        full_name: name,
        email: email,
        password: password,
        password_confirmation: confirmPassword
      }
    }

    return this.send(serviceUrl, postData);
  }

  send(url, user) {
    let that = this
    let promise = new Promise((resolve, reject) => {
      if (!this.pendingRequest) {
        this.pendingRequest = this.http.post(url)
          .send(user)
          .set('Accept', 'application/json')
          .end((error, response) => {
            that.pendingRequest = null

            if (response.status == 201) {
              resolve(user)
              let user = JSON.parse(response.text);
              if (window.localStorage) {
                window.localStorage.setItem(LS_KEY_NAME, response.text)
              }
              easele.model.user = user;
              resolve(user)
            } else {

              let errorObj = JSON.parse(response.text)
              reject(errorObj)
              easele.model.user = null;
            }
          });
      }
    })

    return promise
  }

  logout() {
    if (window.localStorage) {
      window.localStorage.removeItem(LS_KEY_NAME)
    }

    easele.model.user = null
    var url = this.baseUrl + "api/v1/logout.json";
    this.http.get(url)
      .end(function (error, response) {

      });
  }
}
