<template>
  <div class="grid-1">
    <content-app
      :title="$t('business.welcome')"
      :center="$t('business.employee.center')"
      :bg="$img('employee')"
      :description="$t('business.employee.description')"
    />
    <div v-if="stores && stores.length" class="grid-1 mb-6">
      <div class="text-title">{{ $t("store.group") }}</div>
      <div v-for="store in stores" :key="store.id" class="between">
        <div class="w-10/12 light2 between p-2 rounded-xl m-auto">
          <div class="tracking-widest between">
            {{ $date(store.time) }}
            <div class="px-2">|</div>
          </div>
          <router-link :to="`/store/${store.id}`" class="w-full text-center">{{
            store.name
          }}</router-link>
        </div>
        <div @click="show(store.name), (storeId = store.id)" class="btnL2">
          <svg-app type="x" theme="svg" :auto="true" />
        </div>
      </div>
    </div>
    <div v-if="employe">
      <div v-if="clipboard" class="grid-1">
        <button-app
          @action="
            $copy(user.split('').reverse().join(''));
            copied = true;
          "
          :text="$t('order.code')"
          :svg="!copied ? 'copy' : 'done'"
        />
        <div class="text-sub">{{ $t("business.employee.copyCode") }}</div>
      </div>
      <div v-else class="text-dis">
        {{ user.split("").reverse().join("") }}
      </div>
    </div>
    <div v-else class="grid-1">
      <button-app
        @action="toEmploye()"
        :text="$t('fixed.activate')"
        :svg="!processing ? 'done' : 'processing'"
      />
      <div class="text-sub">
        {{ $t("business.employee.subDescription") }}
      </div>
    </div>
    <div v-if="token == 'notSupported'" class="text-sub">
      {{ $t("notification.cannot") }}
    </div>
    <alert-app
      v-if="alert"
      :data="alert"
      :proces="processing"
      @skip="alert = false"
      @action="!processing ? action() : ''"
    />
  </div>
</template>

<script>
import contentApp from "@/components/fixed/contentApp.vue";
import buttonApp from "@/components/fixed/buttonApp.vue";
import alertApp from "@/components/fixed/alertApp.vue";
import { dbSs, getToken, srv, user } from "@/Firebase";
import { set, setJson, getJson } from "@/scripts/sc";
import svgApp from "@/components/fixed/svgApp.vue";

export default {
  components: { contentApp, buttonApp, alertApp, svgApp },
  data() {
    let employe = localStorage.employe == "true";
    return {
      user: user().uid,
      copied: false,
      alert: false,
      employe: employe,
      stores: employe ? getJson("stores") : [],
      processing: false,
      storeId: null,
      token: null,
      clipboard: typeof navigator.clipboard == "object",
    };
  },
  watch: {
    copied() {
      setTimeout(() => {
        this.copied = false;
      }, 3000);
    },
  },
  created() {
    getToken().then((token) => {
      this.token = token;
    });
  },
  methods: {
    toEmploye() {
      if (!this.processing) {
        this.processing = true;
        user("dbRefUser")
          .update({
            employe: true,
          })
          .then(() => {
            set("employe", true);
            set("toEmploye", Date.now() + 86400000);
            this.employe = true;
            this.processing = false;
          });
      }
    },
    show(name) {
      this.alert = {
        title: this.$t("business.employee.quit.title"),
        svg: "logout",
        description: this.$t("business.employee.quit.confirm", { store: name }),
        action: "confirm",
      };
    },
    async action() {
      this.processing = true;
      this.alert.action = "oky";
      this.alert.description = this.$t("business.employee.quit.process");
      let token = this.storeId == this.user ? "1" : await getToken();
      dbSs
        .doc(this.storeId)
        .update({
          employeesIds: srv.arrayRemove(this.user),
          tokens: srv.arrayRemove(token),
        })
        .then(() => {
          this.stores = this.stores.filter((item) => item.id !== this.storeId);
          setJson("stores", this.stores);
          if (this.stores.length == 0) {
            set("toEmploye", Date.now() + 86400000);
          }
          this.processing = false;
          this.alert = false;
        });
    },
  },
};
</script>
