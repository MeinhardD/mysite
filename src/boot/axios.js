import Vue from 'vue'
import axios from 'axios'

const wishlist = axios.create({
  baseURL: 'http://localhost/api/'
})

Vue.prototype.$axios = axios
Vue.prototype.$wishlist = wishlist
