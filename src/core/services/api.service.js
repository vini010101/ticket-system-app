import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/jwt.service";

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    console.log("Base URL:", process.env.VUE_APP_URL_API_DEV); // DEBUG
    Vue.axios.defaults.baseURL = process.env.VUE_APP_URL_API_DEV;
  },

  setHeader() {
    Vue.axios.defaults.headers.common.Authorization = `Bearer ${JwtService.getToken()}`;
  },

  get(resource, slug = "") {
    return Vue.axios.get(`${resource}/${slug}`).catch((error) => {
      throw new Error(`ApiService GET ${error} - ${resource}/${slug}`);
    });
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params).catch((error) => {
      throw new Error(`ApiService ${error} - ${resource}`);
    });
  },

  put(resource, params) {
    return Vue.axios.put(`${resource}`, params).catch((error) => {
      throw new Error(`ApiService PUT ${error} - ${resource}`);
    });
  },

  delete(resource) {
    return Vue.axios.delete(resource).catch((error) => {
      throw new Error(`ApiService DELETE ${error} - ${resource}`);
    });
  },
};

export default ApiService;
