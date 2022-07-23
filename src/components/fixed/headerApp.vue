<template>
  <header>
    <div
      dir="rtl"
      class="top between dark2 dark:border-b-[1px] dark:border-slate-700 z-50"
    >
      <menu-app
        v-if="!alert || (alert && alert.type != 'notSupported')"
        :user="user"
        :processing="processing"
      />
      <router-link
        to="/account"
        :class="`${
          alert && alert.type == 'notSupported' ? 'logo m-auto' : 'logo'
        }`"
        translate="no"
      >
        Laziri
      </router-link>
    </div>

    <alert-app
      v-if="user || (alert && alert.type == 'notSupported')"
      :data="alert"
      :proces="proces"
      @skip="skip()"
      @action="action()"
    />
  </header>
</template>

<script>
import { set, get, remove, notice } from "@/scripts/sc";
import alertApp from "@/components/fixed/alertApp.vue";
import menuApp from "@/components/fixed/menuApp.vue";
import * as loc from "@/scripts/location";
import { auth } from "@/Firebase";

export default {
  components: { menuApp, alertApp },
  data() {
    return {
      user: null,
      alert: null,
      watch: null,
      proces: null,
      processing: true,
      appInstalled: null,
    };
  },
  watch: {
    alert(newValue) {
      if (
        this.watch == null &&
        (newValue == false || newValue.type == "noLocation")
      ) {
        this.watch = setInterval(() => {
          this.loc();
        }, 3000);
        this.proces = false;
      } else if (newValue.type == "location") {
        clearInterval(this.watch);
        this.watch = null;
      }
    },
  },
  created() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      if (!get("skipInstallApp") || get("skipInstallApp") < Date.now()) {
        this.appInstalled = e;
      }
    });
    auth().onAuthStateChanged((user) => {
      if (
        !navigator.geolocation ||
        !window.indexedDB ||
        typeof localStorage == undefined ||
        typeof sessionStorage == undefined
      ) {
        this.show("notSupported");
      } else if (user) {
        this.user = user;
        if (get("newUser")) {
          this.show("newUser");
        } else if (navigator.permissions) {
          this.stt();
        } else {
          if (this.appInstalled) {
            this.show("installApp");
          } else {
            this.loc();
          }
        }
      } else {
        this.user = false;
      }

      this.processing = false;
    });
  },
  methods: {
    show(type) {
      if (type == "location") {
        this.alert = {
          type: "location",
          title: this.$t("location.title"),
          svg: "location",
          description: this.$t("location.require"),
          action: "oky",
        };
      } else if (type == "noLocation") {
        this.alert = {
          type: "noLocation",
          title: this.$t("location.title"),
          svg: "location",
          description: this.$t("location.reject"),
          err: true,
        };
      } else if (type == "installApp") {
        this.alert = {
          type: "installApp",
          title: this.$t("fixed.install"),
          svg: "code",
          description: this.$t("fixed.installDesc"),
          action: true,
        };
      } else if (type == "notice") {
        this.alert = {
          type: "notice",
          title: this.$t("notification.title"),
          svg: "notice",
          description: this.$t("notification.ask"),
          action: true,
        };
      } else if (type == "newUser") {
        this.alert = {
          type: "newUser",
          title: this.$t("fixed.done"),
          svg: "done",
          description: this.$t("fixed.accountCreated"),
          action: "oky",
        };
      } else if (type == "notSupported") {
        this.alert = {
          type: "notSupported",
          title: this.$t("fixed.notSupported"),
          svg: "error",
          description: this.$t("fixed.notSupportedDesc"),
          err: true,
        };
      }
    },
    async action() {
      if (this.alert.type == "location") {
        this.proces = true;
        this.loc();
      } else if (this.alert.type == "newUser") {
        remove("newUser");
        this.show("location");
      } else if (this.alert.type == "installApp") {
        this.proces = true;
        this.appInstalled.prompt().then(() => {
          this.skip();
        });
      } else if (this.alert.type == "notice") {
        this.proces = true;
        await notice();
        this.alert = false;
      }
    },
    skip() {
      if (this.alert.type == "installApp") {
        set("skipInstallApp", Date.now() + 259200000);
      } else if (this.alert.type == "notice") {
        set("skipNotice", Date.now() + 259200000);
      }
      this.alert = false;
    },
    async stt() {
      let stt = await loc.state();
      if (stt == "prompt") {
        this.show("location");
      } else if (this.appInstalled) {
        this.show("installApp");
      } else if (
        stt == "granted" &&
        Notification.permission == "default" &&
        (!get("skipNotice") || get("skipNotice") < Date.now())
      ) {
        this.show("notice");
      } else {
        this.loc();
      }
    },
    loc() {
      navigator.geolocation.getCurrentPosition(
        () => {
          if (
            this.alert == null ||
            this.alert.type == "noLocation" ||
            this.alert.type == "location"
          ) {
            this.alert = false;
          }
        },
        () => {
          this.show("noLocation");
        }
      );
    },
  },
};
</script>
