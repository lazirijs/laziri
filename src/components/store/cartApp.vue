<template>
  <div class="grid-1">
    <div dir="rtl" class="between light2 rounded-xl p-2 z-10">
      <div>
        <svg-app
          v-if="!processing"
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
          v-if="!processing"
          @action="toDelivery = false"
          type="left"
          :auto="true"
          :theme="`w-4 ${!toDelivery ? 'opacity-0' : ''}`"
        />
      </div>
    </div>
    <div
      v-if="message && !toDelivery"
      class="top h-full g-center text-center font-medium z-0"
    >
      {{ message }}
    </div>
    <products-app
      v-else-if="products && !toDelivery"
      :data="products"
      @get="localData()"
    />
    <delivery-app
      v-if="toDelivery"
      :deliveryInfo="delivery"
      :distance="store.distance"
      :quantity="quantity"
      :dPrice="dPrice"
      :total="total"
      :note="note"
      :processing="processing"
      @save="delivery = $event"
      @update="edit = $event"
      @note="note = $event"
    />
    <footer dir="rtl" class="bottom light between">
      <button-app
        @action="toOrder()"
        :theme="`btnB2 w-5/12 ${
          toDelivery && (edit || products.length == 0 || store.distance > 3)
            ? 'opacity-50'
            : ''
        }`"
        :text="$t('order.single')"
        :svg="!processing ? 'done' : 'processing'"
      />
      <div class="w-6/12 p-1.5 light2 rounded-xl center m-auto">
        <div class="start text-xl font-bold m-auto">
          <span class="uppercase text-xs mx-1">dzd</span>
          <span>{{ total }}</span>
        </div>
      </div>
    </footer>
    <alert-app :data="alert" @skip="alert = false" @action="action()" />
  </div>
</template>

<script>
import productsApp from "@/components/fixed/productsApp.vue";
import deliveryApp from "@/components/fixed/deliveryApp.vue";
import { dbOs, srv, user, getToken } from "@/Firebase";
import buttonApp from "@/components/fixed/buttonApp.vue";
import { remove, get, getJson } from "@/scripts/sc";
import alertApp from "@/components/fixed/alertApp.vue";
import svgApp from "@/components/fixed/svgApp.vue";
import { ask } from "@/scripts/location";
import { ldb } from "@/scripts/db";

export default {
  components: { productsApp, deliveryApp, alertApp, svgApp, buttonApp },
  data() {
    const randomCode = () => {
      var code = "";
      for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
      }

      return code;
    };
    let id = window.location.href.split("/")[4];
    let sS = get(`store-${id}`);
    let sP = get(`products-${id}`);

    return {
      id: id,
      user: user().uid,
      tSS: sS ? sS : 0,
      tSP: sP ? sP : 0,
      products: [],
      store: null,
      toDelivery: null,
      location: null,
      token: null,
      quantity: null,
      dPrice: null,
      total: 0,
      delivery: null,
      edit: null,
      note: null,
      processing: null,
      alert: null,
      code: randomCode(),
      message: null,
    };
  },
  watch: {
    toDelivery(newData, oldData) {
      if (newData > oldData) {
        this.total >= 0 ? (this.total += this.dPrice) : "";
      } else {
        this.total >= 0 ? (this.total -= this.dPrice) : "";
      }
    },
  },
  created() {
    if (this.id != this.user) {
      this.localData();
    } else {
      this.$router.push("/ms");
    }
  },
  methods: {
    async localData() {
      if (
        (this.tSS > Date.now() && this.tSP > Date.now()) ||
        !navigator.onLine
      ) {
        const store = await ldb.stores.get(this.id);
        if (store) {
          let price = store.dPrice;
          if (store.distance <= 1) {
            this.dPrice = price[0];
          } else if (store.distance <= 2) {
            this.dPrice = price[1];
          } else if (store.distance <= 3) {
            this.dPrice = price[2];
          }
          this.store = store;
          let products = await ldb.products
            .where({ store: this.id, cart: "true", status: "متوفر" })
            .toArray();
          if (products.length == 0) {
            this.message = this.$t("cart.empty");
          }
          this.products = products;
          this.total = this.products.reduce((a, b) => {
            return a + b.price * b.quantity;
          }, 0);
          this.quantity = products.length;
        } else {
          this.$router.push(`/store/${this.id}`);
        }
        if (getJson("delivery")) {
          this.delivery = getJson("delivery");
        }
      } else {
        this.$router.push(`/store/${this.id}`);
      }
    },
    toOrder() {
      if (!this.toDelivery) {
        this.toDelivery = true;
      } else if (!this.processing && !this.edit) {
        if (this.store.status == "مغلق") {
          this.alert = {
            type: "oky",
            title: this.$t("store.close"),
            svg: "store",
            description: this.$t("cart.alert.close"),
            action: "oky",
          };
        } else if (
          this.store.distance <= 3 &&
          this.products.length != 0 &&
          navigator.onLine
        ) {
          this.alert = {
            type: "confirm",
            title: this.$t("fixed.confirm"),
            svg: "doc",
            description: this.$t("fixed.confirmData"),
            action: "confirm",
          };
        } else if (this.store.distance > 3) {
          this.alert = {
            type: "distance",
            title: this.$t("cart.alert.domain"),
            svg: "location",
            description: this.$t("cart.alert.domainDesc"),
            miniDescription: this.$t("cart.alert.contact"),
            action: "oky",
          };
        }
      }
    },
    action() {
      if (this.alert.type == "confirm") {
        this.upload();
      } else {
        this.alert = false;
      }
    },
    async upload() {
      this.alert = null;
      this.processing = true;

      let token = await getToken();
      let location = await ask();

      if (!location.err) {
        delete location.err;
        delete location.query;

        let products = [];

        for (let i = 0; i < this.products.length; i++) {
          const product = this.products[i];
          delete product.id;
          delete product.cart;
          delete product.time;
          delete product.store;
          delete product.status;
          delete product.description;
          products.push(product);
          if (i == this.products.length - 1) {
            dbOs
              .add({
                order: {
                  products: products,
                  total: this.total,
                  storeToken: this.store.tokens,
                  userToken: token,
                  note: this.note,
                },
                delivery: {
                  location: location,
                  distance: this.store.distance,
                  dPrice: this.dPrice,
                  info: this.delivery,
                },
                employeesIds: this.store.employeesIds,
                code: this.code,
                store: this.store.id,
                storeName: this.store.name,
                status: "الطلب",
                time: srv.serverTimestamp(),
                user: this.user,
              })
              .then((doc) => {
                this.$sendNotice({
                  tokens: this.store.tokens.length ? this.store.tokens : ["1"],
                  title: "newOrder",
                  body: this.code,
                  icon: "../../assets/logo.png",
                  url: `${window.location.origin}/order/${doc.id}`,
                }).then(async () => {
                  remove("saveOrders");
                  await ldb.orders.clear();
                  this.alert = {
                    title: this.$t("fixed.done"),
                    svg: "done",
                    description: this.$t("order.created"),
                    miniDescription: this.$t("order.createdCode", {
                      code: this.code,
                    }),
                    err: true,
                  };
                });
              });
          }
        }
      }
    },
  },
};
</script>
