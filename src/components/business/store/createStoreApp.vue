<template>
  <div class="grid-1">
    <div
      v-if="notSupported"
      class="text-center text-xs font-medium text-slate-500 dark:text-slate-400"
    >
      {{ $t("notification.cannot") }}
    </div>
    <header-store
      :edit="true"
      :data="store"
      :msg="msg"
      @msg="msg = $event"
      @background="store.background = $event"
      @logo="store.logo = $event"
      @name="store.name = $event"
      @slogan="store.slogan = $event"
      @file="file = $event"
    />
    <div class="grid-1 my-6">
      <div class="text-title">{{ $t("store.sellerInfo") }}</div>
      <input-app
        :text="store.seller.name"
        @sync="store.seller.name = $event"
        :title="$t('fixed.name')"
        svg="user"
      />
      <input-app
        :text="store.seller.phone"
        @sync="store.seller.phone = $event"
        :title="$t('fixed.phone')"
        svg="phone"
        type="tel"
      />
      <div class="text-sub">{{ $t("store.create.phoneUsage") }}</div>
    </div>
    <button-app
      @action="show('confirm')"
      theme="btnB2 w-5/12"
      :text="$t('fixed.create')"
      svg="done"
    />
    <h1 class="text-sub">{{ $t("store.create.sub") }}</h1>

    <alert-app
      :data="alert"
      :proces="proces"
      @skip="(alert = false), (proces = false)"
      @action="action()"
    />
    <notice-app :msg="msg" />
  </div>
</template>

<script>
import headerStore from "@/components/store/headerApp.vue";
import { user, srv, strg, getToken } from "@/Firebase";
import buttonApp from "@/components/fixed/buttonApp.vue";
import noticeApp from "@/components/fixed/noticeApp.vue";
import alertApp from "@/components/fixed/alertApp.vue";
import inputApp from "@/components/fixed/inputApp.vue";
import { get, notice } from "@/scripts/sc";
import { ask } from "@/scripts/location";

export default {
  components: { headerStore, alertApp, buttonApp, inputApp, noticeApp },
  data() {
    return {
      user: user().uid,
      example: [
        {
          background: "https://bit.ly/3zmFySe",
          logo: "https://bit.ly/3meA703",
        },
        {
          background: "https://bit.ly/3NTH0j1",
          logo: "https://bit.ly/3mgcR1D",
        },
        {
          background: "https://bit.ly/3xj4bOa",
          logo: "https://bit.ly/3mmZD2Z",
        },
        {
          background: "https://bit.ly/3xhkeME",
          logo: "https://bit.ly/3GRuRZI",
        },
        {
          background: "https://bit.ly/3ze9v73",
          logo: "https://bit.ly/3PZiyyB",
        },
        {
          background: "https://bit.ly/3MeNRT7",
          logo: "https://bit.ly/3GQQFEF",
        },
        {
          background: "https://bit.ly/3GPeJI0",
          logo: "https://bit.ly/3MsiHI4",
        },
      ],
      store: {
        background: null,
        logo: null,
        name: null,
        slogan: "",
        g: null,
        seller: {
          name: null,
          phone: null,
          email: user().email,
          picture: user().photoURL,
          displayName: user().displayName,
          emailVerified: user().emailVerified,
        },
        tokens: [],
        status: "جديد",
        dPrice: [0, 0, 0],
        time: srv.serverTimestamp(),
        employeesIds: [],
        employees: [],
        subStartAt: null,
        subEndAt: null,
      },
      file: {
        background: null,
        logo: null,
      },
      alert: null,
      proces: null,
      uploading: {
        background: null,
        logo: null,
      },
      msg: null,
      notSupported: null,
    };
  },
  watch: {
    uploading: {
      handler() {
        this.show("uploading");
      },
      deep: true,
    },
  },
  beforeCreate() {
    get("seller") == "true" ? this.$router.push("/ms") : "";
  },
  async created() {
    let example = this.example[Math.floor(Math.random() * this.example.length)];
    var loc = await ask();
    if (!loc.err) {
      delete loc.err;
      this.store.g = {
        geohash: loc.query,
        geopoint: user("geopoint", [loc.lat, loc.lng]),
      };
      this.store.background = example.background;
      this.store.logo = example.logo;
      this.example = null;
      this.getToken();
    } else {
      this.alert = {
        type: "location",
        title: this.$t("location.fail"),
        svg: "location",
        description: this.$t("location.create.fail"),
        err: true,
      };
    }
  },
  methods: {
    show(type) {
      if (type == "location") {
        this.alert = {
          type: "location",
          title: this.$t("fixed.important"),
          svg: "location",
          description: this.$t("location.create.confirm"),
          miniDescription: this.$t("location.googleMaps"),
          action: "oky",
        };
      } else if (type == "confirm") {
        let data = [
          this.file.background,
          this.file.logo,
          this.store.name,
          this.store.seller.name,
          this.store.seller.phone,
        ];
        const ntc = (text) => {
          this.msg == text ? (this.msg = text + " ") : (this.msg = text);
        };
        if (this.$long(this.store.g.geopoint._lat) < 1) {
          ntc(
            `${this.$t("fixed.tryAgain")} ${this.$t("location.create.fail")}`
          );
        } else if (this.$long(this.store.tokens) < 1) {
          ntc(
            `${this.$t("fixed.tryAgain")} ${this.$t(
              "notification.create.fail"
            )}`
          );
        } else if (data[0] == null) {
          ntc(this.$t("store.create.alert.background"));
        } else if (data[1] == null) {
          ntc(this.$t("store.create.alert.logo"));
        } else if (this.$long(data[2]) < 1) {
          ntc(this.$t("store.create.alert.name"));
        } else if (this.$long(data[3]) < 5) {
          ntc(this.$t("fixed.alert.name"));
        } else if (this.$long(data[4]) != 10 || !data[4].startsWith("0")) {
          ntc(this.$t("fixed.alert.phone"));
        } else if (data.includes(null) || data.includes("")) {
          ntc(this.$t("fixed.fillAllData"));
        } else {
          this.alert = {
            type: "confirm",
            title: this.$t("fixed.confirm"),
            svg: "doc",
            description: this.$t("fixed.confirmData"),
            action: "confirm",
          };
        }
      } else if (type == "noNotice") {
        this.alert = {
          type: "noNtice",
          title: this.$t("notification.title"),
          svg: "notice",
          description: this.$t("notification.create.reject"),
          err: true,
        };
      } else if (type == "uploading") {
        let uploading = this.uploading.background + this.uploading.logo;
        this.alert = {
          type: "uploading",
          title: this.$t("fixed.upload"),
          svg: "upload",
          description: this.$t("fixed.uploading", { value: uploading }),
          err: true,
        };
      }
      this.proces = false;
    },
    async action() {
      if (this.alert.type == "notice") {
        this.proces = true;
        let ntc = await notice();
        if (ntc == "granted") {
          this.getToken();
        } else {
          this.show("noNotice");
        }
      } else if (this.alert.type == "confirm") {
        this.upload();
        this.show("uploading");
      } else if (this.alert.type == "noFcm") {
        this.show("location");
      } else {
        this.alert = false;
      }
    },
    async getToken() {
      let token = await getToken();
      if (token == "default") {
        this.alert = {
          type: "notice",
          title: this.$t("notification.title"),
          svg: "notice",
          description: this.$t("notification.create.require"),
          action: "oky",
        };
      } else if (token == "denied") {
        this.show("noNotice");
      } else if (token == "error") {
        this.alert = {
          type: "notice",
          title: this.$t("notification.title"),
          svg: "notice",
          description: `${this.$t("fixed.tryAgain")} ${this.$t(
            "notification.create.fail"
          )}`,
          err: true,
        };
      } else {
        if (token == "notSupported") {
          this.notSupported = true;
          this.alert = {
            type: "noFcm",
            title: this.$t("notification.title"),
            svg: "error",
            description: this.$t("notification.create.notSupported"),
            action: "oky",
          };
        } else {
          this.show("location");
        }
        this.store.tokens.push(token);
      }
    },
    upload() {
      const uploadImg = (type) => {
        let total = this.file.background.size + this.file.logo.size;
        let file = type == "logo" ? this.file.logo : this.file.background;
        let storage = strg()
          .ref(`users/${this.user}/store/profile/${type}`)
          .put(file);
        storage.on(
          `state_changed`,
          (snapshot) => {
            let progres = Number(
              (
                (snapshot.bytesTransferred / snapshot.totalBytes) *
                ((snapshot.totalBytes * 99) / total)
              ).toFixed(0)
            );
            type == "logo"
              ? (this.uploading.logo = progres)
              : (this.uploading.background = progres);
          },
          () => {},
          () => {
            storage.snapshot.ref.getDownloadURL().then((url) => {
              type == "logo"
                ? (this.store.logo = url)
                : (this.store.background = url);
              type == "logo" ? uploadData() : uploadImg("logo");
            });
          }
        );
      };
      const uploadData = () => {
        if (this.store.tokens.length == 1 && this.store.g.geohash) {
          user("dbRefStore")
            .set(this.store, { merge: true })
            .then(() => {
              this.alert = {
                title: this.$t("fixed.done"),
                svg: "done",
                description: this.$t("fixed.uploaded", {
                  class: this.$t("store.single"),
                  type: this.$t("fixed.create"),
                }),
                miniDescription: this.$t("store.create.contactUs"),
                err: true,
              };
            });
        }
      };
      uploadImg("background");
    },
  },
};
</script>
