<template>
  <div class="grid-1">
    <div
      class="bg h-28 rounded-xl"
      :style="`background-image: url(${$img('employee')})`"
    ></div>
    <h1 class="text-title pt-6">{{ $t("fixed.hello") }}</h1>
    <p class="text-dis text-sm py-6 tracking-wider">
      {{ $t("login.provider") }}
    </p>
    <button-app
      @action="googleAuth()"
      text="Google"
      :svg="!processing ? 'google' : 'processing'"
    />
    <h1 class="text-sub" v-html="$t('login.browser')"></h1>
    <h1 class="text-sub pt-6">{{ $t("login.policy") }}</h1>
  </div>
</template>

<script>
import buttonApp from "@/components/fixed/buttonApp.vue";
import { user, auth, srv } from "@/Firebase";
import { set } from "@/scripts/sc";

export default {
  components: { buttonApp },
  data() {
    return {
      processing: null,
    };
  },
  methods: {
    googleAuth() {
      this.processing = true;
      let google = new auth.GoogleAuthProvider();
      this.login(google);
    },
    login(provider) {
      auth()
        .signInWithPopup(provider)
        .then((get) => {
          if (get.additionalUserInfo.isNewUser) {
            set("newUser", true);
            set("seller", false);
            set("employe", false);
            set("stores", []);
            user("dbRefUser").set(
              {
                seller: false,
                employe: false,
                time: srv.serverTimestamp(),
              },
              { merge: true }
            );
          }
        })
        .catch(() => {
          this.processing = false;
        });
    },
  },
};
</script>
