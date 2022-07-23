<template>
  <div v-if="loading" class="screen animate-pulse">
    {{ $t("fixed.loading") }}
  </div>
  <div v-else-if="message" class="screen">
    {{ message }}
  </div>
  <div v-else-if="order" class="grid-1">
    <div
      v-if="user == store"
      dir="rtl"
      class="between light2 rounded-xl p-2 z-10"
    >
      <div>
        <svg-app
          @action="toDelivery = true"
          type="right"
          :auto="true"
          :theme="`w-4 ${toDelivery ? 'opacity-0' : ''}`"
        />
      </div>
      <div class="font-semibold m-auto">
        {{ $t(toDelivery ? "order.delivery.title" : "product.group") }}
      </div>
      <div>
        <svg-app
          @action="toDelivery = false"
          type="left"
          :auto="true"
          :theme="`w-4 ${!toDelivery ? 'opacity-0' : ''}`"
        />
      </div>
    </div>
    <div class="w-full px-3 py-2 rounded-xl light2">
      <div class="between">
        <div class="center">
          <div class="text-xs text-gray-400">{{ $t("order.code") }} :</div>
          <div class="text-lg tracking-widest font-medium mx-1">{{ code }}</div>
        </div>
        <div>{{ $time(time.seconds * 1000) }}</div>
      </div>
    </div>
    <div v-if="!toDelivery" class="grid-1">
      <products-app :data="order.products" />
      <hr v-if="order.note" class="divide" />
      <div v-if="order.note" class="grid-1">
        <div class="text-sub-2">
          {{
            user == store
              ? $t("order.note.fromBuyer")
              : $t("order.note.fromYou")
          }}
        </div>
        <p class="text-dis">
          {{ order.note }}
        </p>
      </div>
    </div>
    <delivery-app
      v-else
      :deliveryInfo="delivery"
      :distance="delivery.distance"
      :quantity="order.products.length"
      :dPrice="delivery.dPrice"
      :total="order.total"
      :note="order.note"
    />
    <footer dir="rtl" class="bottom light between">
      <div v-if="!processing && status == 'الطلب'" class="m-auto">
        <div @click="show = null" class="btnL2">
          <svg-app type="menu" theme="svg" :auto="true" />
        </div>
        <div
          :class="`bottom between dark1 rounded-t-xl ${show} transition duration-500`"
        >
          <div @click="show = 'transform-y-full'" class="btnL w-5/12">
            <h1 class="btnTxt">{{ $t("fixed.back") }}</h1>
            <svg-app type="down" theme="svg" :auto="true" />
          </div>
          <div @click="confirm('إلغاء')" class="btnD w-5/12">
            <h1 class="btnTxt">{{ $t("fixed.cancel") }}</h1>
            <svg-app type="x" theme="svg" :auto="true" />
          </div>
        </div>
      </div>
      <div
        v-if="!toDelivery || user != store || status != 'الطلب'"
        :class="`btnL2 w-4/12 ${processing ? 'opacity-50' : ''}`"
      >
        <div v-if="status == 'الطلب'" dir="auto" class="btnTxt">
          {{ $t("order.single") }}
        </div>
        <div v-else-if="status == 'وصل'" dir="auto" class="btnTxt">
          {{ $t("order.status.delivered") }}
        </div>
        <div v-else-if="status == 'ألغي'" dir="auto" class="btnTxt">
          {{ $t("order.status.canceled") }}
        </div>

        <svg-app
          v-if="status == 'الطلب'"
          :type="processing ? 'processing' : 'clock'"
          theme="svg"
          :auto="true"
        />
        <svg-app
          v-else-if="status == 'ألغي'"
          :type="processing ? 'processing' : 'x'"
          theme="svg"
          :auto="true"
        />
        <svg-app
          v-else-if="status == 'وصل'"
          :type="processing ? 'processing' : 'done'"
          theme="svg"
          :auto="true"
        />
      </div>
      <div
        v-else
        @click="confirm('وصل')"
        :class="`btnL2 w-4/12 ${processing ? 'opacity-50' : ''}`"
      >
        <h1 dir="auto" class="btnTxt">{{ $t("order.status.delivered") }}</h1>

        <svg-app
          :type="processing ? 'processing' : 'done'"
          theme="svg"
          :auto="true"
        />
      </div>
      <div class="w-6/12 p-1.5 light2 rounded-xl center m-auto">
        <div class="start text-xl font-bold m-auto">
          <span class="uppercase text-xs mx-1">dzd</span>
          <span>{{ order.total }}</span>
        </div>
      </div>
    </footer>
    <alert-app
      :data="alert"
      @skip="
        alert = false;
        show = 'transform-y-full';
      "
      @action="action()"
    />
  </div>
</template>

<script>
import productsApp from "@/components/fixed/productsApp.vue";
import deliveryApp from "@/components/fixed/deliveryApp.vue";
import alertApp from "@/components/fixed/alertApp.vue";
import svgApp from "@/components/fixed/svgApp.vue";
import { dbOs, user } from "@/Firebase";
import { ldb } from "@/scripts/db";

export default {
  components: { productsApp, deliveryApp, svgApp, alertApp },
  data() {
    return {
      id: window.location.href.split("/")[4],
      user: user().uid,
      loading: true,
      message: null,
      toDelivery: null,
      order: null,
      delivery: null,
      status: null,
      store: null,
      storeName: null,
      buyer: null,
      code: null,
      time: null,
      show: "transform-y-full",
      processing: null,
      alert: null,
    };
  },
  watch: {
    async status(newValue) {
      if (
        (newValue == "ألغي" || newValue == "وصل") &&
        this.user == this.buyer
      ) {
        await ldb.orders.delete(this.id);
      }
    },
    alert(newValue) {
      if (newValue == null) {
        this.show = "transform-y-full";
      }
    },
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      dbOs
        .doc(this.id)
        .get()
        .then((get) => {
          if (get.exists) {
            let data = get.data();
            if (
              data.employeesIds.includes(this.user) ||
              data.store == this.user ||
              data.user == this.user
            ) {
              data.employeesIds.includes(this.user) && data.user != this.user
                ? (this.user = data.store)
                : "";
              this.order = data.order;
              this.delivery = data.delivery;
              this.status = data.status;
              this.store = data.store;
              this.storeName = data.storeName;
              this.buyer = data.user;
              this.code = data.code;
              this.time = data.time;
              this.loading = false;
            } else {
              this.message = this.$t("order.reject");
              this.loading = false;
            }
          } else {
            this.message = this.$t("order.notExist");
            this.loading = false;
          }
        })
        .catch(() => {
          this.message = this.$t("order.error");
          this.loading = false;
        });
    },
    confirm(event) {
      if (event == "إلغاء") {
        this.alert = {
          type: "cancel",
          title: this.$t("fixed.cancel"),
          svg: "order",
          description: this.$t("order.confirm.cancel"),
          action: "confirm",
        };
      } else if (event == "وصل") {
        this.alert = {
          type: "delivery",
          title: this.$t("order.delivery.title"),
          svg: "order",
          description: this.$t("order.confirm.delivery"),
          action: "confirm",
        };
      }
    },
    action() {
      this.alert.type == "cancel" ? this.update("ألغي") : this.update("وصل");
    },
    update(event) {
      this.alert = false;
      this.processing = true;
      dbOs
        .doc(this.id)
        .update({
          status: event,
        })
        .then(() => {
          this.status = event;
          if (event == "ألغي") {
            this.$sendNotice({
              tokens:
                this.user == this.store
                  ? this.order.userToken
                  : this.order.storeToken,
              title:
                this.user == this.store
                  ? "storeCanceledOrder"
                  : "userCanceledOrder",
              body: this.code + this.storeName,
              icon: "../../assets/logo.png",
              url: `${window.location.origin}/order/${this.id}`,
            });
          } else {
            this.$sendNotice({
              tokens: this.order.userToken,
              title: "orderDelivered",
              body: this.code + this.storeName,
              icon: "../../assets/logo.png",
              url: `${window.location.origin}/order/${this.id}`,
            });
          }
          this.processing = false;
        });
    },
  },
};
</script>
