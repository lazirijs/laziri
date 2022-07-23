<template>
  <div>
    <div v-if="loading" class="screen animate-pulse">
      {{ $t("fixed.loading") }}
    </div>
    <div v-else-if="message" class="screen">
      {{ message }}
    </div>
    <div v-else-if="store" class="grid-1">
      <div
        v-if="error"
        class="text-center text-xs font-medium text-slate-500 dark:text-slate-400"
      >
        {{ error }}
      </div>
      <header-store :data="store" :user="user" />
      <router-view />
    </div>
    <alert-app :data="alert" :proces="proces" @action="action()" />
  </div>
</template>

<script>
import headerStore from "@/components/store/headerApp.vue";
import alertApp from "@/components/fixed/alertApp.vue";
import { user, srv, getToken } from "@/Firebase";
import { set, get, notice } from "@/scripts/sc";
import { ask } from "@/scripts/location";
import { ldb } from "@/scripts/db";

export default {
  components: { headerStore, alertApp },
  data() {
    return {
      user: user().uid,
      loading: null,
      message: null,
      proces: null,
      token: null,
      store: null,
      alert: null,
      error: null,
    };
  },
  watch: {
    token(newValue) {
      if (newValue == "default") {
        this.alert = {
          type: "notice",
          title: this.$t("notification.title"),
          svg: "notice",
          description: this.$t("notification.store.require"),
          action: "oky",
        };
      } else if (newValue == "denied") {
        let description = this.$t("notification.store.reject");
        this.show(description);
      } else {
        if (newValue == "notSupported") {
          this.error = this.$t("notification.cannot");
        } else if (newValue == "error") {
          this.error = this.$t("notification.fail");
        }
        if (!this.store) {
          this.getData();
        }
      }
    },
  },
  created() {
    if (get("saveMs") > Date.now() || (get("saveMs") && !navigator.onLine)) {
      this.localData();
    } else {
      this.getData();
    }
  },
  methods: {
    show(description) {
      this.loading = false;
      this.alert = {
        type: "notice",
        title: this.$t("notification.title"),
        svg: "notice",
        description: description,
        err: true,
      };
    },
    async action() {
      this.proces = true;
      let ntc = await notice();
      if (ntc == "granted") {
        let token = await getToken();
        this.token = token;
        this.alert = false;
        this.proces = false;
      } else {
        let description = this.$t("notification.store.reject");
        this.show(description);
      }
    },
    async localData() {
      try {
        const store = await ldb.mystore.get(this.user);
        if (store) {
          var note = null;
          if (store.status == "مغلق") {
            note = this.$t("store.close");
          } else if (store.status == "خاص") {
            note = this.$t("store.privet");
          }
          store["note"] = note;
          this.store = store;
          this.token = store.token;
        } else {
          this.getData();
        }
      } catch (err) {
        this.getData();
      }
    },
    async getData() {
      this.loading = true;
      let loc = await ask();
      if (this.token) {
        user("dbRefStore")
          .get()
          .then((get) => {
            if (get.exists) {
              let store = get.data();
              if (store.status != "جديد") {
                var note = null;
                if (store.status == "مغلق") {
                  note = this.$t("store.close");
                } else if (store.status == "خاص") {
                  note = this.$t("store.privet");
                }
                store["id"] = get.id;
                store["note"] = note;
                store["token"] = this.token;
                store["userLocation"] = loc;
                let employees = store.employees.filter((employe) => {
                  return store.employeesIds.includes(employe.id);
                });
                delete store.employees;
                store["employees"] = employees;
                this.store = store;
                this.save();
              } else {
                this.message = this.$t("store.create.contactUs");
                this.loading = false;
              }
            } else {
              this.$router.push("/business/store");
            }
          });
      } else {
        let token = await getToken();
        this.token = token;
      }
    },
    async save() {
      let token = this.token;
      const savetoLocal = async () => {
        try {
          await ldb.mystore.put(this.store, this.user);
          set("saveMs", Date.now() + 300000);
          this.loading = false;
        } catch (err) {
          this.loading = false;
        }
      };

      if (!this.store.tokens.includes(token)) {
        user("dbRefStore")
          .update({
            tokens: srv.arrayUnion(token),
          })
          .then(() => {
            this.store.tokens.push(token);
            savetoLocal();
          })
          .catch(() => {
            this.error = this.$t("notification.fail");
            this.loading = false;
          });
      } else {
        savetoLocal();
      }
    },
  },
};
</script>
