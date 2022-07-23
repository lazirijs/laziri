<template>
  <div v-if="loading" class="screen animate-pulse">
    {{ $t("fixed.loading") }}
  </div>
  <div v-else-if="message" class="screen">
    {{ message }}
  </div>
  <div v-else-if="store" class="grid-1">
    <div class="center text-title z-10">
      <div @click="select = true" class="relative between">
        {{ $t("store.status.title") }}
        <div v-if="!select" class="mx-4">
          <div v-if="store.status == 'مفتوح'">
            {{ $t("store.status.open") }}
          </div>
          <div v-else-if="store.status == 'مغلق'">
            {{ $t("store.status.close") }}
          </div>
          <div v-else-if="store.status == 'خاص'">
            {{ $t("store.status.privet") }}
          </div>
        </div>
        <svg-app v-if="!select" type="down" theme="svg" />
      </div>
      <div
        v-if="select"
        @click="select = false"
        class="absolute w-full center translate-y-24"
      >
        <div
          class="grid-1 left-50 w-3/12 p-4 bg-slate-200 dark:bg-slate-300 text-slate-700 rounded-xl text-center shadow-gray-700 shadow-2xl"
        >
          <div @click="store.status = 'مفتوح'">
            {{ $t("store.status.open") }}
          </div>
          <div @click="store.status = 'مغلق'">
            {{ $t("store.status.close") }}
          </div>
          <div @click="store.status = 'خاص'">
            {{ $t("store.status.privet") }}
          </div>
        </div>
      </div>
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
      <hr class="divide" />
      <div class="text-title">{{ $t("order.delivery.price") }}</div>
      <div class="grid-3">
        <input-app
          :text="store.dPrice[0]"
          @sync="store.dPrice[0] = $event"
          title="1 Km"
          type="number"
          svg="location"
          :placeholder="`${$t('fixed.enter')} ${$t('fixed.price')}`"
        />
        <input-app
          :text="store.dPrice[1]"
          @sync="store.dPrice[1] = $event"
          title="2 Km"
          type="number"
          svg="location"
          :placeholder="`${$t('fixed.enter')} ${$t('fixed.price')}`"
        />
        <input-app
          :text="store.dPrice[2]"
          @sync="store.dPrice[2] = $event"
          title="3 Km"
          type="number"
          svg="location"
          :placeholder="`${$t('fixed.enter')} ${$t('fixed.price')}`"
        />
      </div>
      <hr class="divide" />
      <div class="text-title">{{ $t("store.contact") }}</div>
      <input-app
        :text="store.seller.phone"
        @sync="store.seller.phone = $event"
        :title="$t('fixed.phone')"
        type="tel"
        svg="phone"
      />
      <hr class="divide" />
      <div class="text-title">{{ $t("store.location.title") }}</div>
      <div class="between">
        <h1 class="w-6/12 font-medium">{{ $t("store.location.update") }}</h1>
        <button-app
          @action="updateLocation()"
          theme="btn w-5/12 light2"
          :text="$t('fixed.update')"
          :svg="updateLoc ? 'done' : 'location'"
        />
      </div>
      <div class="text-sub">{{ $t("store.location.UpdateDesc") }}</div>
      <hr class="divide" />
      <div class="text-title">{{ $t("store.employee.title") }}</div>
      <div v-if="store.employees.length" class="grid-1">
        <div v-for="emp in store.employees" :key="emp.id">
          <div class="between">
            <div class="w-10/12 light2 between p-2 rounded-xl m-auto">
              <div class="tracking-widest between">
                {{ $date(emp.time) }}
                <div class="px-2">|</div>
              </div>
              <div class="w-full text-center truncate">{{ emp.name }}</div>
            </div>
            <div @click="editEmp(emp.id)" class="btnL2">
              <svg-app type="x" theme="svg" :auto="true" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="newEmp" class="grid-1">
        <input-app
          :text="employe.name"
          @sync="employe.name = $event"
          :title="$t('store.employee.name')"
          svg="user"
        />
        <input-app
          :text="employe.id"
          @sync="employe.id = $event"
          :title="$t('store.employee.code')"
          svg="@"
        />
        <button-app @action="editEmp()" :text="$t('fixed.add')" svg="+" />
      </div>
      <div
        @click="newEmp ? (newEmp = false) : (newEmp = true)"
        class="text-sub tracking-widest"
      >
        {{ newEmp ? `${$t("fixed.cancel")} x` : `${$t("fixed.add")} +` }}
      </div>
    </div>
    <button-app
      @action="show('confirm')"
      :text="$t('fixed.save')"
      svg="upload"
    />
    <div class="text-sub grid-1">
      <h1>{{ $t("fixed.delay", { type: $t("fixed.update") }) }}</h1>
      <h1 v-if="store.time">
        {{
          `${$t("fixed.createdTime", { type: $t("store.single") })} ${$date(
            store.time.seconds * 1000
          )}`
        }}
      </h1>
    </div>

    <alert-app
      :data="alert"
      :proces="proces"
      @skip="alert = false"
      @action="action()"
    />
    <notice-app :msg="msg" />
  </div>
</template>

<script>
import headerStore from "@/components/store/headerApp.vue";
import buttonApp from "@/components/fixed/buttonApp.vue";
import noticeApp from "@/components/fixed/noticeApp.vue";
import alertApp from "@/components/fixed/alertApp.vue";
import inputApp from "@/components/fixed/inputApp.vue";
import svgApp from "@/components/fixed/svgApp.vue";
import { ask } from "@/scripts/location";
import { user, strg } from "@/Firebase";
import { get } from "@/scripts/sc";
import { ldb } from "@/scripts/db";

export default {
  components: { headerStore, alertApp, buttonApp, inputApp, noticeApp, svgApp },
  data() {
    return {
      user: user().uid,
      store: null,
      select: null,
      file: {
        background: null,
        logo: null,
      },
      alert: null,
      proces: null,
      loading: null,
      message: null,
      uploading: {
        background: 0,
        logo: 0,
      },
      msg: null,
      updateLoc: null,
      newEmp: null,
      employe: {
        id: null,
        name: null,
        time: Date.now(),
      },
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
  created() {
    this.localData();
  },
  methods: {
    async localData() {
      if (get("saveMs") > Date.now()) {
        try {
          const store = await ldb.mystore.get(this.user);
          if (store) {
            delete store.note;
            delete store.token;
            this.store = store;
            let loc = store.g.geopoint;
            this.updateLocation(loc._lat, loc._long);
          } else {
            this.getData();
          }
        } catch (err) {
          this.getData();
        }
      } else {
        this.getData();
      }
    },
    getData() {
      this.loading = true;
      user("dbRefStore")
        .get()
        .then((get) => {
          if (get.exists) {
            let store = get.data();
            let employees = store.employees.filter((employe) => {
              return store.employeesIds.includes(employe.id);
            });
            delete store.employees;
            store["employees"] = employees;
            let loc = store.g.geopoint;
            this.updateLocation(loc._lat, loc._long);
            if (store.status == "جديد") {
              this.message = this.$t("store.create.contectUs");
            } else {
              this.store = store;
            }
            this.loading = false;
          } else {
            this.$router.push("/business/store");
          }
        });
    },
    show(type) {
      if (type == "confirm") {
        const ntc = (text) => {
          this.msg == text ? (this.msg = text + " ") : (this.msg = text);
        };
        if (this.$long(this.store.name) < 1) {
          ntc(this.$t("store.create.alert.name"));
        } else if (
          this.$long(this.store.seller.phone) != 10 ||
          !this.store.seller.phone.startsWith("0")
        ) {
          ntc(this.$t("fixed.alert.phone"));
        } else {
          this.alert = {
            title: this.$t("fixed.confirm"),
            svg: "doc",
            description: this.$t("fixed.confirmData"),
            action: "confirm",
          };
        }
      } else if (type == "uploading") {
        let uploading = this.uploading.background + this.uploading.logo;
        this.alert = {
          type: "uploading",
          title: this.$t("fixed.upload"),
          svg: "upload",
          description: this.$t("fixed.uploading", { value: uploading }),
          err: true,
        };
      } else if (type == "failedUploading") {
        this.alert = {
          title: this.$t("fixed.uploadFailed"),
          svg: "error",
          description: this.$t("fixed.uploadFailedDesc"),
          action: "oky",
          err: true,
        };
      }
      this.proces = false;
    },
    action() {
      if (this.alert.action == "confirm") {
        this.show("uploading");
        this.upload();
      } else if (this.alert.svg == "error") {
        this.alert = false;
      } else {
        this.$router.back();
      }
    },
    editEmp(id) {
      if (id) {
        this.store.employees = this.store.employees.filter(
          (item) => item.id != id
        );
        this.store.employeesIds = this.store.employeesIds.filter(
          (item) => item != id
        );
      } else if (this.user.split("").reverse().join("") != this.employe.id) {
        this.employe.id = this.employe.id.split("").reverse().join("");
        this.store.employees.push(this.employe);
        this.store.employeesIds.push(this.employe.id);
        this.employe = {
          id: null,
          name: null,
          time: Date.now(),
        };
        this.newEmp = false;
      }
    },
    async updateLocation(lat, lng) {
      let loc = await ask(lat, lng);
      let geo = {
        geohash: loc.query,
        geopoint: user("geopoint", [loc.lat, loc.lng]),
      };
      this.store.g = geo;
      if (!lat && !lng) {
        this.updateLoc = true;
        setTimeout(() => {
          this.updateLoc = false;
        }, 3000);
      }
    },
    upload() {
      let background = this.file.background;
      let logo = this.file.logo;
      const uploadImg = (type) => {
        let total = (background ? background.size : 0) + (logo ? logo.size : 0);
        let file = type == "logo" ? logo : background;
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
          () => {
            this.show("failedUploading");
          },
          () => {
            storage.snapshot.ref.getDownloadURL().then((url) => {
              if (background && logo) {
                type == "logo"
                  ? (this.store.logo = url)
                  : (this.store.background = url);
                type == "logo" ? uploadData() : uploadImg("logo");
              } else {
                logo ? (this.store.logo = url) : (this.store.background = url);
                uploadData();
              }
            });
          }
        );
      };
      const uploadData = () => {
        delete this.store.id;
        delete this.store.time;
        delete this.store.userLocation;
        if (this.store.g.geopoint._lat && this.store.g.geopoint._long) {
          user("dbRefStore")
            .update(this.store)
            .then(async () => {
              await ldb.mystore.update(this.user, this.store);
              this.alert = {
                title: this.$t("fixed.done"),
                svg: "done",
                description: this.$t("fixed.uploaded", {
                  class: this.$t("store.single"),
                  type: this.$t("fixed.edit"),
                }),
                action: "oky",
                err: true,
              };
            })
            .catch(() => {
              this.show("failedUploading");
            });
        }
      };
      if (background || logo) {
        background ? uploadImg("background") : uploadImg("logo");
      } else {
        uploadData();
      }
    },
  },
};
</script>
