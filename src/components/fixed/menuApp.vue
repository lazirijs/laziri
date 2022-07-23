<template>
  <menu :dir="language == 'ar' ? 'rtl' : 'ltr'">
    <div
      v-if="user"
      @click="getData(), menu()"
      class="bg w-6 h-6 rounded-full"
      :style="`background-image: url(${user.photoURL})`"
    ></div>
    <svg-app
      v-else-if="processing || user == false"
      @action="processing ? '' : menu()"
      :type="processing ? 'processing' : 'menu'"
      theme="w-6"
    />
    <menu
      id="menu"
      class="right w-6/12 dark2 z-10 relative transform-x-full transition duration-500 overflow-y-auto"
    >
      <div class="grid-1 p-4">
        <div v-if="user" class="grid-1">
          <div
            class="avatar"
            :style="`background-image: url(${user.photoURL})`"
          ></div>
          <h1
            class="text-center first-letter:uppercase text-lg font-medium tracking-wider truncate"
          >
            {{ user.displayName }}
          </h1>
          <div v-if="user" dir="rtl" class="text-sub-2 between">
            <div @click="translate()" class="first-letter:uppercase">
              {{ language == "fr" ? "Fr" : "Ar" }}
            </div>
            /
            <div @click="theme()" class="first-letter:uppercase">
              {{ dark ? "Dark" : "Light" }}
            </div>
          </div>
        </div>
        <svg-app
          v-if="user && loading"
          type="processing"
          theme="w-5 text-slate-400"
          :auto="true"
        />
        <div v-else @click="menu()" class="grid-1">
          <div v-if="user" class="grid-1">
            <div class="between">
              <svg-app type="user" theme="w-4 text-slate-400" />
              <hr class="w-full border-slate-400 mx-4" />
            </div>
            <router-link class="first-letter:uppercase" to="/account">{{
              $t("order.group")
            }}</router-link>
            <router-link class="first-letter:uppercase" to="/account/stores">{{
              $t("store.group")
            }}</router-link>
          </div>
          <div v-if="user && seller" class="grid-1">
            <div class="between">
              <svg-app type="store" theme="w-4 text-slate-400" />
              <hr class="w-full border-slate-400 mx-4" />
            </div>
            <router-link class="first-letter:uppercase" to="/ms">{{
              $t("store.mystore")
            }}</router-link>
          </div>
          <div v-if="user && stores.length != 0" class="grid-1">
            <div class="between">
              <svg-app type="order" theme="w-4 text-slate-400" />
              <hr class="w-full border-slate-400 mx-4" />
            </div>
            <div
              v-for="store in stores"
              :key="store.id"
              class="truncate first-letter:uppercase"
            >
              <router-link :to="`/orders/${store.id}`">
                {{ $t("store.single") + " " + store.name }}
              </router-link>
            </div>
          </div>
          <div v-else-if="user == false" class="grid-1">
            <div dir="rtl" class="text-sub-2 between">
              <div @click="translate()" class="first-letter:uppercase">
                {{ language == "fr" ? "Fr" : "Ar" }}
              </div>
              /
              <div @click="theme()" class="first-letter:uppercase">
                {{ dark ? "Dark" : "Light" }}
              </div>
            </div>
            <div class="between">
              <svg-app type="login" theme="w-4 text-slate-400" />
              <hr class="w-full border-slate-400 mx-4" />
            </div>
            <router-link class="first-letter:uppercase" to="/login">{{
              $t("fixed.login")
            }}</router-link>
          </div>
          <div class="grid-1">
            <div class="between">
              <svg-app type="#" theme="w-4 text-slate-400" />
              <hr class="w-full border-slate-400 mx-4" />
            </div>
            <router-link class="first-letter:uppercase" to="/business">{{
              $t("business.title")
            }}</router-link>
            <router-link class="first-letter:uppercase" to="/contactus">{{
              $t("contactUs.title")
            }}</router-link>
            <div
              v-if="user"
              @click="show('logout')"
              class="first-letter:uppercase"
            >
              {{ $t("login.logout.title") }}
            </div>
          </div>
        </div>
      </div>
    </menu>
    <div
      @click="menu()"
      id="back"
      class="left w-full bg-slate-800 opacity-50 hidden transition duration-500"
    ></div>
    <alert-app
      v-if="alert"
      :data="alert"
      :proces="proces"
      @skip="(alert = false), (loading = false)"
      @action="action()"
    />
  </menu>
</template>

<script>
import alertApp from "@/components/fixed/alertApp.vue";
import { db, auth, getToken, msg } from "@/Firebase";
import svgApp from "@/components/fixed/svgApp.vue";
import { setJson, notice } from "@/scripts/sc";

export default {
  components: { svgApp, alertApp },
  props: {
    user: [Object, Boolean, null],
    processing: Boolean,
  },
  data() {
    return {
      loading: true,
      seller: null,
      stores: [],
      dark: document.querySelector("html").classList.contains("dark")
        ? true
        : false,
      alert: null,
      proces: null,
      language: localStorage.language,
      token: null,
    };
  },
  methods: {
    menu() {
      if (!this.proces) {
        let menu = document.getElementById("menu").classList;
        let back = document.getElementById("back").classList;
        if (menu.contains("transform-x-full")) {
          menu.remove("transform-x-full");
          back.remove("hidden");
        } else {
          menu.add("transform-x-full");
          back.add("hidden");
        }
      }
    },
    getData() {
      if (this.loading) {
        db()
          .collection("users")
          .doc(this.user.uid)
          .get()
          .then((get) => {
            let user = get.data();
            this.seller = user.seller;
            localStorage.seller = String(user.seller);
            localStorage.employe = String(user.employe);
            return user.employe;
          })
          .then((isEmploye) => {
            if (isEmploye) {
              this.getEmployeeData();
            } else {
              this.loading = false;
            }
          });
      }
    },
    async getEmployeeData() {
      let token = await getToken();
      this.token = token;
      let tokenErrors = ["denied", "error", "notSupported", null, undefined];
      const save = (index, length, stores) => {
        if (index == length - 1) {
          this.stores = stores;
          setJson("stores", stores);
          localStorage.toEmploye = Date.now() + 86400000;
          this.loading = false;
        }
      };
      if (!localStorage.toEmploye) {
        localStorage.toEmploye = Date.now() + 86400000;
      }
      if (token == "default") {
        this.alert = {
          title: this.$t("notification.title"),
          svg: "notice",
          description: this.$t("notification.askEmployee"),
          action: true,
        };
      } else {
        db()
          .collection("stores")
          .where("employeesIds", "array-contains", this.user.uid)
          .get()
          .then((get) => {
            if (get.empty) {
              this.stores = [];
              setJson("stores", []);
              if (localStorage.toEmploye < Date.now()) {
                db()
                  .collection("users")
                  .doc(this.user.uid)
                  .update({ employe: false })
                  .then(() => {
                    localStorage.employe = false;
                    this.loading = false;
                  });
              } else {
                this.loading = false;
              }
            } else {
              let stores = [];
              let data = get.docs;
              let size = data.length;
              for (let i = 0; i < size; i++) {
                const store = data[i];
                stores.push({
                  id: store.id,
                  name: store.data().name,
                  time: store
                    .data()
                    .employees.find((x) => x.id === this.user.uid).time,
                });
                if (i === size - 1) {
                  if (
                    !tokenErrors.includes(token) &&
                    !store.data().tokens.includes(token)
                  ) {
                    db()
                      .collection("stores")
                      .doc(store.id)
                      .update({
                        tokens: db.FieldValue.arrayUnion(token),
                      })
                      .then(() => {
                        save(i, size, stores);
                      });
                  } else {
                    save(i, size, stores);
                  }
                }
              }
            }
          });
      }
    },
    theme() {
      let app = document.querySelector("html").classList;
      if (!this.dark) {
        app.add("dark");
        this.dark = true;
        localStorage.theme = "dark";
      } else {
        this.dark = false;
        app.remove("dark");
        localStorage.theme = "light";
      }
    },
    translate() {
      let app = document.querySelector("html");
      localStorage.language = app.lang == "ar" ? "fr" : "ar";
      window.location.reload();
    },
    show(type) {
      if (type == "logout") {
        this.alert = {
          title: this.$t("login.logout.title"),
          svg: "logout",
          description: this.$t("login.logout.confirm"),
          action: "confirm",
        };
      }
    },
    async action() {
      if (this.alert.svg == "logout") {
        this.logout();
      } else {
        this.alert.action = "oky";
        this.proces = true;
        let ntc = await notice();
        if (ntc) {
          this.getEmployeeData();
          this.alert = false;
          this.proces = false;
        }
      }
    },
    logout() {
      this.alert.description = this.$t("login.logout.proces");
      this.alert.action = "oky";
      this.proces = true;
      let app = document.querySelector("html");
      const remove = () => {
        auth()
          .signOut()
          .then(() => {
            localStorage.clear();
            localStorage.theme = app.classList.contains("dark")
              ? "dark"
              : "light";
            localStorage.language = app.lang;
            this.loading = true;
            this.proces = null;
            this.seller = null;
            this.alert = null;
            this.token = null;
          });
      };
      if (this.seller && msg) {
        db()
          .collection("stores")
          .doc(this.user.uid)
          .update({
            tokens: db.FieldValue.arrayRemove(this.token),
          })
          .then(() => {
            msg()
              .deleteToken()
              .then(() => {
                remove();
              });
          });
      } else {
        remove();
      }
    },
  },
};
</script>
