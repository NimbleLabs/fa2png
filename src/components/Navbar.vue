<template>
<header class="navbar navbar-light navbar-static-top bd-navbar">
   <alert v-model="showAlert" :duration="2000" :type="alert.type" placement="top-right">
     {{alert.msg}}
   </alert>
    <div class="container-fluid">
      <nav>
        <div class="navbar-toggleable-xs" >
          <a class="navbar-brand" href="/">
            <h2 class="header"><i class="fa fa-magic" style="color: #0275d8;"></i> Icon Generator</h2>
          </a>
          <ul class="nav navbar-nav">
            <li>
              <a href="#" @click.prevent="openSavedIcons"><i class="fa fa-list"></i> Open</a>
            </li>
            <li>
              <a href="#" @click.prevent="saveIcon"><i class="fa fa-save"></i> Save</a>
            </li>
             <li>
              <a href="#" @click.prevent="aboutModal = true"><i class="fa fa-info-circle"></i> About</a>
            </li>
          </ul>
          <span v-show="loggedIn" class="welcome">
            Welcome, <strong>{{model.user && model.user.full_name}}</strong> <a class="logout-link" href="#" @click.prevent="logOut"><i class="fa fa-sign-out"></i>log out</a>
          </span>
          <ul class="nav navbar-nav navbar-right" v-show="!loggedIn">
             <li>
              <a href="javascript:void(0)" @click="showModal('logIn', $event)">Log in</a>
            </li>
            <li>
              <a href="javascript:void(0)" @click="showModal('signUp', $event)">Sign up</a>
            </li>
        </ul>
        </div>
      </nav>
    </div>
    <modal v-model="aboutModal" effect="fade" :show="aboutModal">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          About
        </h4>
      </div>
        <div>
          <p>First off we'd like to thank the Dave Gandy and the <a style="color: #619AF1;" href="http://fontawesome.io/" target="_blank">Font Awesome</a> team. Without their work this tool would not be possible.</p>
          <p>We'd also like to thank the guys behind <a style="color: #619AF1;" href="http://fa2png.io/" target="_blank">FA2png</a>.  Their work inspired this tool.</p>
          <p>We think this tool a step forward for quickly creating great looking favicons and general purpose ones too.  We hope you do to.</p>
          <p>Let us know what other features you'd like to see!</p>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button class="btn btn-secondary float-right" @click="aboutModal = false">Close</button>
        </div>
    </modal>
    <modal v-model="savedIconModalIsVisible" effect="fade" :show="savedIconModalIsVisible">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          <i class="fa fa-image"></i>Saved icons:
        </h4>
      </div>
        <div class="saved-icon-wrapper">
          <p v-if="!iconsLoaded" class="loading">Loading...</p>
          <p v-if="!model.savedIcons.length && iconsLoaded">You have no saved icons</p>
          <ul v-if="model.savedIcons.length" class="saved-icon-list">
            <li v-for="savedIcon in model.savedIcons" class="saved-icon">

              <a href="#" @click.prevent="selectSavedIcon(savedIcon)">
                <icon-tile :icon="getSvgObjectWithName(savedIcon.name)" :currentIcon="savedIcon"></icon-tile>
              </a>
            </li>
          </ul>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button class="btn btn-secondary float-right" @click="savedIconModalIsVisible = false">Cancel</button>
        </div>
    </modal>
    <modal v-model="loginModalIsVisible" effect="fade" :show="loginModalIsVisible">
     <div slot="modal-header" class="modal-header">
        <h4 class="modal-title"
         v-show="modals.logIn">
          <i class="fa fa-user"></i>Log in
        </h4>
        <h4 class="modal-title"
         v-show="modals.signUp">
          <i class="fa fa-user-plus"></i>Register
        </h4>
      </div>
      <div class="log-in" v-show="modals.logIn">

        <div class="row">
         <div class="col-sm-6 left-col">
          <form @submit.prevent="logIn" :class="{'disabled':this.formLoading}">
            <div class="form-group">
               <input class="form-control" @blur="checkValidationAndSetError('email', $event)"
                      @input="errors.email=''"
                      @focus="errors.email=''"
                       placeholder="email" type="email" v-model="email"/>
               <span class="error-msg" v-if="errors.email">{{errors.email}}</span>
            </div>
            <div class="form-group">
              <input class="form-control" @blur="checkValidationAndSetError('password', $event)"
                      @input="errors.password=''"
                      @focus="errors.password=''"
                      placeholder="Password" type="password" v-model="password" />
              <span class="error-msg" v-if="errors.password">{{errors.password}}</span>
              <span class="error-msg" v-if="errors.other">{{errors.other}}</span>
            </div>

           <button class="btn btn-success btn-block">Sign In</button>
           </form>
         </div>

          <div class="col-sm-6" style="text-align: center;">
            <i class="fa fa-thumbs-o-up" style="font-size: 6.8em;"></i>
            <a href="https://www.easele.com/users/auth/facebook"
                    class="btn btn-primary fb-btn btn-block">
               Or... Log in with Facebook
            </a>
          </div>
        </div>
      </div>
       <div class="sign-up" v-show="modals.signUp">
        <div class="row">
         <div class="col-sm-6 left-col">

            <form @submit.prevent="signUp" :class="{'disabled':this.formLoading}">
              <div class="form-group">
                <input class="form-control"
                      @blur="checkValidationAndSetError('full_name', $event)"
                      @input="errors.full_name=''"
                      @focus="errors.full_name=''"
                      :class="{'form-control-danger':errors.full_name}"
                      placeholder="Name"
                      v-model="full_name"/>
                <span class="error-msg" v-if="errors.full_name">{{errors.full_name}}</span>
              </div>
              <div class="form-group">
                <input class="form-control"
                     @blur="checkValidationAndSetError('email', $event)"
                      @input="errors.email=''"
                      @focus="errors.email=''"
                      placeholder="email"
                      type="email"
                      v-model="email"/>
                <span class="error-msg" v-if="errors.email">{{errors.email}}</span>
              </div>
              <div class="form-group">
               <input class="form-control" @blur="checkValidationAndSetError('password', $event)"
                      @input="errors.password=''"
                      @focus="errors.password=''"
                      placeholder="Password" type="password" v-model="password"/>
               <span class="error-msg" v-if="errors.password">{{errors.password}}</span>
              </div>
              <div class="form-group">
                <input class="form-control" @blur="checkValidationAndSetError('password_confirmation', $event)"
                      @input="errors.password_confirmation=''"
                      @focus="errors.password_confirmation=''"
                      placeholder="Confirm password" type="password" v-model="password_confirmation" />
                <span class="error-msg" v-if="errors.password_confirmation">{{errors.password_confirmation}}</span>
                <span class="error-msg" v-if="errors.other">{{errors.other}}</span>
              </div>

             <button class="btn btn-success btn-block" @click="signUp">Sign Up</button>
           </form>
         </div>

          <div class="col-sm-6" style="text-align: center;">
            <i class="fa fa-thumbs-o-up" style="font-size: 13.5em;"></i>
            <a href="https://www.easele.com/users/auth/facebook"
               class="btn btn-primary fb-btn btn-block">
              or... Sign up with Facebook
            </a>
          </div>

        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <ul>
           <li>
              <a href="#" v-if="this.modals.signUp"
                @click.prevent="errors={};showModal('logIn', $event)">Already Registered? Log in</a>
            </li>
            <li>
              <a href="#" v-if="this.modals.logIn"
              @click.prevent="errors={};showModal('signUp', $event)">New to Easele? Sign up Free!</a>
            </li>
        </ul>
      </div>
    </modal>
  </header>
</template>

<script>
  import easele from './../easele'
  import settings from './../settings'
  import UserService from '../tools/UserService'
  import IconService from '../tools/IconService'
  import IconTile from './IconTile'
  import {
    modal,
    alert
  } from 'vue-strap'

  const MAX_ICON_SIZE_IN_MODAL_VIEW = 128
  const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


  export default {
    data() {
      return {
        model: easele.model,
        alert: {},
        formLoading: false,
        errors: {},
        iconsLoaded: false,
        loginModalIsVisible: false,
        savedIconModalIsVisible: false,
        email: "",
        password: "",
        password_confirmation: "",
        full_name: "",
        aboutModal: false,
        modals: {
          logIn: false,
          signUp: false
        },
        iconService: new IconService(),
        userService: new UserService()
      }
    },
    computed: {
      showAlert() {
        return !!this.alert.msg
      },
      loggedIn() {
        return false
        // let user = easele &&
        //   easele.model &&
        //   easele.model.user;
        // if (user) {
        //   // Change placement of this block (?)
        //   this.loginModalIsVisible = false
        // }
        // else if( easele.utils.getCookie("easele_auth_token") ) {
        //   this.userService.current( easele.utils.getCookie("easele_auth_token") )
        // }
        // return user && user.auth_token
      }
    },
    components: {
      IconTile,
      modal,
      alert
    },
    methods: {
      getSvgObjectWithName(name) {
        let obj
        this.model.iconList.some((el) => {
          if (el.name === name) {
            obj = el;
            return true
          }
        })
        return obj
      },

      getWidth(iconObj) {
        let width = iconObj.size + iconObj.margin
        if (width > MAX_ICON_SIZE_IN_MODAL_VIEW) {
          width = MAX_ICON_SIZE_IN_MODAL_VIEW
        }
        return width
      },

      selectSavedIcon(icon) {
        this.$events.emit('selectSavedIcon', icon)
        this.savedIconModalIsVisible = false
      },

      openSavedIcons() {
        if (!this.loggedIn) {
          this.showModal('logIn');
          return;
        }
        this.savedIconModalIsVisible = true
        if (!this.iconsLoaded) {
          this.iconService.list()
            .then((data) => {
              if (Array.isArray(data)) {
                this.model.savedIcons = data
                this.iconsLoaded = true
              }
            })
        }
      },

      saveIcon() {

        if (!this.loggedIn) {
          this.showModal('signUp');
          return;
        }

        let that = this
        this.iconService.save(this.model.currentIcon)
          .then((iconObj) => {
          that.alert = {
            msg:'Icon saved',
            type:'success'
          }
          setTimeout(() => that.alert={} ,2500)
        })
          .catch((errText) => {
            that.alert = {
              msg: errText,
              type: 'danger'
            }
            setTimeout(() => that.alert = {}, 2500)
          })
      },

      checkValidationAndSetError(fieldNames, e) {

        let validated = true
        if (typeof fieldNames === 'string') {
          fieldNames = [fieldNames]
        }
        let errors = Object.assign({}, this.errors)

        fieldNames.forEach((el) => {

          if (settings.VALIDATION_RULES[el].required && !this[el]) {
            validated = false
            errors[el] = settings.VALIDATION_RULES[el].required
          } else if (settings.VALIDATION_RULES[el].email && !EMAIL_REGEXP.test(this[el])) {
            validated = false
            errors[el] = settings.VALIDATION_RULES[el].email
          } else if (settings.VALIDATION_RULES[el].match && this[el] !== this.password) {
            validated = false
            errors[el] = settings.VALIDATION_RULES[el].match
          } else if (settings.VALIDATION_RULES[el].short && this[el].length < settings.MIN_PASSWORD_LENGTH) {
            validated = false
            errors[el] = settings.VALIDATION_RULES[el].short
          }
        })

        this.errors = errors
        return validated
      },

      validated(formType) {
        let validated = true
        if (formType === 'signUp') {
          validated = this.checkValidationAndSetError(['full_name', 'email', 'password', 'password_confirmation'])
        } else if (formType === 'logIn') {
          validated = this.checkValidationAndSetError(['email', 'password'])
        }
        return validated
      },

      logOut() {
        this.email = ''
        this.password = ''
        this.password_confirmation = ''
        this.full_name = ''
        this.modals.logIn = true
        this.savedIcons = []
        this.iconsLoaded = false
        this.userService.logout();
        easele.utils.removeAuthCookie();
      },

      handleErrorsFromServer(errorsFromObj) {
        let obj = {}
        for (let errorType in errorsFromObj) {
          if (errorsFromObj.hasOwnProperty(errorType)) {
            obj[errorType] = errorsFromObj[errorType].join(', ')
          }
        }
        return obj;
      },

      logIn() {
        let that = this
        if (this.validated('logIn')) {
          that.formLoading = true
          this.userService.login(this.email, this.password)
            .then(() => {
              that.formLoading = false
            })
            .catch(errorObj => {
              that.formLoading = false
              if (errorObj.errors) {
                that.errors = this.handleErrorsFromServer(errorObj.errors)
              } else if (errorObj.error) {
                let errors = Object.assign({}, this.errors)
                errors.other = errorObj.error
                this.errors = errors
              }

            })
        }
      },

      signUp() {
        let that = this
        if (this.validated('signUp')) {
          that.formLoading = true
          this.userService.signup(this.full_name, this.email, this.password, this.password_confirmation)
            .then(() => {
              that.formLoading = false
            })
            .catch(errorObj => {
              that.formLoading = false
              if (errorObj.errors) {
                this.errors = this.handleErrorsFromServer(errorObj.errors)

              } else if (errorObj.error) {
                let errors = Object.assign({}, this.errors)
                errors.other = errorObj.error
                this.errors = errors
              }
            })
        }
      },

      showModal(type, e) {
        if (e) {
          e.preventDefault()
        }

        this.loginModalIsVisible = true
        for (let modal in this.modals) {
          if (this.modals.hasOwnProperty(modal)) {
            if (modal === type) {
              this.modals[modal] = true
            } else {
              this.modals[modal] = false
            }
          }
        }
        this.modals[type] = true
      }
    }
  }

</script>
<style scoped lang="scss">
  .header {
    color: #ffffff;
  }

  .disabled {
    input,
    button {
      pointer-events: none;
      cursor: not-allowed;
      opacity: .65;
    }
  }

  .fb-auth a {
    color: white;
  }

  .fb-auth a:hover {
    color: #0064FF;
  }

  nav a:active,
  nav a:focus {
    text-decoration: none
  }

  nav a:hover {
    text-decoration: none;
    border-bottom: 1px solid #014c8c
  }

  a.navbar-brand:hover {
    border: none
  }

  .logout-link {
    margin-left: 10px
  }

  .welcome {
    float: right;
    padding: 15px 0 15px 15px;
  }

  .error-msg {
    font-size: 0.8em;
    margin: 0;
    color: red
  }

  .saved-icon-wrapper {
    text-align: center
  }

  .saved-icon-list {
    margin:0;
    padding:0;
  }

  .saved-icon {
    margin: 5px;
    text-align: left;
    display: inline-block;
    .icon-with-margin {
      display: inline-block
    }
    .icon-wrapper {
      width: 128px;
      height: 128px;
    }

  }

  .navbar-nav {
    float: left
  }

  .navbar-right {
    float: right;
  }

  .navbar-nav>li {
    display: inline-block;
    padding: 15px 0 15px 15px;
  }

  .fb-btn {
    margin-bottom: 15px;
  }

  .sign-up,
  .log-in {
    .left-col {
      @media (min-width: 576px) {
        border-right: 1px solid #ccc;
        padding-right: 15px;
      }
      input {
        text-align: left;
      }
    }
  }

  .modal-footer {
    text-align: center;
    ul {
      padding-left: 0;
      text-align: center;
      list-style: none;
      li {
        padding: 5px;
        display: inline-block;
      }
    }
  }

  .form-control-danger {
    border-color: #d9534f;
  }

  .modal-title {
    text-align: center;
    .fa {
      margin-right: .5em;
      color: #0064FF;
    }
  }

</style>
