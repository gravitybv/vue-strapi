import Vue from "vue";
import axios from "axios";

const TOKEN_KEY = "token";

const defaults = {
  url: process.env.STRAPI_URL || "http://localhost:1337",
  entities: []
};

class Strapi {
  constructor(options) {
    this.cancelTokenSource = axios.CancelToken.source();

    const instance = axios.create({
      baseURL: options.url || defaults.url,
      cancelToken: this.cancelTokenSource.token
    });

    this.state = Vue.observable({ user: null });
    this.$http = instance;
    this.setAuthorizationToken(this.getToken());
  }

  get user() {
    return this.state.user;
  }

  set user(user) {
    Vue.set(this.state, "user", user);
  }

  async register(input, storageEngine = localStorage) {
    this.clearToken();
    const {
      data: { user, jwt }
    } = await this.$http.post("/auth/local/register", input);

    this.setToken(jwt, storageEngine);
    this.setUser(user);

    return { user, jwt };
  }

  async login(input, storageEngine = localStorage) {
    this.clearToken();

    const {
      data: { user, jwt }
    } = await this.$http.post("/auth/local", input);

    this.setToken(jwt, storageEngine);
    this.setUser(user);

    return { user, jwt };
  }

  async forgotPassword(input) {
    this.clearToken();

    const { data } = await this.$http.post("/auth/forgot-password", input);

    return data;
  }

  async resetPassword(input) {
    this.clearToken();
    const {
      data: { user, jwt }
    } = await this.$http.post("/auth/reset-password", input);

    this.setToken(jwt);
    this.setUser(user);

    return { user, jwt };
  }

  async sendEmailConfirmation(input) {
    const { data } = await this.$http.post(
      "/auth/send-email-confirmation",
      input
    );

    return data;
  }

  logout() {
    this.setUser(null);
    this.clearToken();
  }

  async fetchUser() {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    this.setAuthorizationToken(token);

    try {
      const user = await this.findOne("users", "me");
      this.setUser(user);
    } catch (e) {
      this.clearToken();
    }

    return this.user;
  }

  setUser(user) {
    this.user = user;
  }

  async find(entity, params) {
    const { data } = await this.$http.get(`/${entity}`, { params });

    return data;
  }

  async count(entity, params) {
    const { data } = await this.$http.get(`/${entity}/count`, { params });

    return data;
  }

  async findOne(entity, id) {
    const { data } = await this.$http.get(`/${entity}/${id}`);

    return data;
  }

  async create(entity, input) {
    const { data } = await this.$http.post(`/${entity}`, input);

    return data;
  }

  async update(entity, id, input) {
    if (typeof id === "object") {
      input = id;
      id = undefined;
    }

    const path = [entity, id].filter(Boolean).join("/");

    const { data } = await this.$http.put(`/${path}`, input);

    return data;
  }

  async delete(entity, id) {
    const path = [entity, id].filter(Boolean).join("/");
    const { data } = await this.$http.delete(`/${path}`);

    return data;
  }

  async graphql(query) {
    const { data } = await this.$http.post(`/graphql`, query);

    return data;
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  setToken(token, storageEngine = localStorage) {
    this.setAuthorizationToken(token);
    storageEngine.setItem(TOKEN_KEY, token);
  }

  clearToken() {
    this.clearAuthorizationToken();
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  setAuthorizationToken(token) {
    if (token) {
      this.$http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  clearAuthorizationToken() {
    if (this.$http.defaults.headers && this.$http.defaults.headers.common) {
      delete this.$http.defaults.headers.common["Authorization"];
    }
  }

  cancelRequests() {
    this.cancelTokenSource.cancel("Operation canceled by the user.");
  }
}

const strapi = {
  install(Vue, options = defaults) {
    const strapi = new Strapi(options);

    options.entities.forEach(entity => {
      const type = "collection";

      if (Object.prototype.hasOwnProperty.call(strapi, entity)) {
        return;
      }

      Object.defineProperty(strapi, entity, {
        get() {
          const self = this;
          return {
            single: {
              find(...args) {
                return self.find(entity, ...args);
              },
              update(...args) {
                return self.update(entity, ...args);
              },
              delete(...args) {
                return self.delete(entity, ...args);
              }
            },
            collection: {
              find(...args) {
                return self.find(entity, ...args);
              },
              findOne(...args) {
                return self.findOne(entity, ...args);
              },
              count(...args) {
                return self.count(entity, ...args);
              },
              create(...args) {
                return self.create(entity, ...args);
              },
              update(...args) {
                return self.update(entity, ...args);
              },
              delete(...args) {
                return self.delete(entity, ...args);
              }
            }
          }[type];
        }
      });
    });

    if (strapi.state && !strapi.state.user && strapi.getToken()) {
      strapi.fetchUser();
    }

    Vue.prototype.$strapi = strapi;
  }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(strapi);
}

export default strapi;
