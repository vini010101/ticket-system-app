// src/core/services/store/auth/auth.module.js

import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";

// Mutation types
export const SET_AUTH = "SET_AUTH";
export const PURGE_AUTH = "PURGE_AUTH";
export const SET_ERROR = "SET_ERROR";

// Action types
export const LOGIN = "login";
export const LOGOUT = "logout";

const state = {
  errors: null,
  user: {},
  token: JwtService.getToken() || null,
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.user,
  authErrors: (state) => state.errors,
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("api/login-token/", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch((error) => {
          const message =
            error.response?.data?.detail || error.message || "Login failed";
          context.commit(SET_ERROR, message);
          reject(message);
        });
    });
  },

  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
};

const mutations = {
  [SET_AUTH](state, data) {
    state.user = {
      id: data.user_id,
      username: data.username,
      email: data.email,
      tipo: data.tipo,
    };
    state.token = data.token;
    state.errors = null;
    JwtService.saveToken(data.token);
  },

  [SET_ERROR](state, message) {
    state.errors = message;
  },

  [PURGE_AUTH](state) {
    state.user = {};
    state.token = null;
    state.errors = null;
    JwtService.destroyToken();
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
