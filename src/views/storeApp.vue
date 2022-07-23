<template>
  <div class="grid-1">
    <ad-app v-if="user" />
    <div v-if="loading" class="screen animate-pulse">
      {{ $t("fixed.loading") }}
    </div>
    <div v-else-if="message" class="screen">
      {{ message }}
    </div>
    <div v-else-if="store" class="grid-1">
      <header-store :data="store" :user="user" />
      <products-app
        :loading="loadingProducts"
        :message="messageProducts"
        :search="search"
        :data="products"
        type="products"
      />
    </div>
  </div>
</template>

<script>
import { set, setJson, get, getJson } from "@/scripts/sc";
import productsApp from "@/components/fixed/collectionApp.vue";
import headerStore from "@/components/store/headerApp.vue";
import { ask, distance } from "@/scripts/location";
import adApp from "@/components/fixed/adApp.vue";
import { db_path, user } from "@/Firebase";
import { ldb } from "@/scripts/db";

export default {
  components: { headerStore, productsApp, adApp },
  data() {
    let id = window.location.href.split("/")[4];
    let sS = get(`store-${id}`);
    let sP = get(`products-${id}`);
    return {
      id: id,
      user: user() ? user().uid : null,
      loading: null,
      message: null,
      store: null,
      loadingProducts: null,
      messageProducts: null,
      time: Date.now(),
      tSS: sS ? sS : 0,
      tSP: sP ? sP : 0,
      search: {
        title: this.$t("product.store"),
      },
      products: [],
    };
  },
  created() {
    if (this.id == this.user) {
      get("seller") == "true"
        ? this.$router.push("/ms")
        : this.$router.push("/business/store");
    } else {
      this.localStore();
    }
  },
  methods: {
    async localStore() {
      if (this.tSS > this.time || !navigator.onLine) {
        try {
          const store = await ldb.stores.get(this.id);
          if (store) {
            this.localProducts();
            var note;
            if (store.status == "مغلق") {
              note = this.$t("store.close");
            }
            store["note"] = note;
            this.store = store;
          } else {
            this.getStore();
          }
        } catch (err) {
          this.getStore();
        }
      } else {
        this.getStore();
      }
    },
    async getStore() {
      this.loading = true;
      this.tSP = 0;
      let crd;
      if (this.user) {
        crd = await ask();
      } else {
        crd = { lat: 1, lng: 1 };
      }
      if (crd.lat) {
        db_path("stores", this.id)
          .get()
          .then((get) => {
            if (get.exists) {
              let store = get.data();
              store["distance"] = distance(
                crd.lat,
                store.g.geopoint._lat,
                crd.lng,
                store.g.geopoint._long
              );
              store["id"] = get.id;
              store["userLocation"] = crd;
              var note;
              if (store.status == "مغلق") {
                note = this.$t("store.close");
              }
              store["note"] = note;
              this.store = store;
              if (store.status == "مفتوح" || store.status == "مغلق") {
                this.localProducts();
                this.loading = false;
              } else {
                this.message = this.$t("store.notAvailable");
                this.loading = false;
              }
            } else {
              this.message = this.$t("store.notExist");
              this.loading = false;
            }
          });
      }
    },
    async localProducts() {
      if (this.tSP > this.time || !navigator.onLine) {
        try {
          let products = await ldb.products.where({ store: this.id }).toArray();
          products.sort((a, b) => b.time.seconds - a.time.seconds);
          if (products.length == 0) {
            this.messageProducts = this.$t("product.empty");
          } else {
            this.products = products;
          }
        } catch (err) {
          this.getProducts();
        }
      } else {
        this.getProducts();
      }
    },
    getProducts() {
      this.loadingProducts = true;
      db_path("products")
        .where("store", "==", this.id)
        .where("status", "in", ["غير متوفر", "متوفر"])
        .get()
        .then((data) => {
          if (data.empty) {
            this.save();
          } else {
            const syncLocalData = async () => {
              const oldP = await ldb.products
                .where({ store: this.id })
                .toArray();
              const newP = this.products;
              if (oldP.length) {
                for (let i = 0; i < newP.length; i++) {
                  let currentP = newP[i];
                  let product = oldP.find((p) => p.id == currentP.id);
                  if (product) {
                    currentP.cart = product.cart;
                    currentP.quantity = product.quantity;
                  }
                  if (i == newP.length - 1) {
                    newP.sort((a, b) => b.time.seconds - a.time.seconds);
                    this.products = newP;
                    this.save();
                  }
                }
              } else {
                this.save();
              }
            };
            let products = [];
            for (let i = 0; i < data.size; i++) {
              const get = data.docs[i];
              let product = get.data();
              product["id"] = get.id;
              product["cart"] = "false";
              product["quantity"] = 1;
              if (product.status == "غير متوفر") {
                product["note"] = "product.notAvailable";
              }
              products.push(product);
              if (i == data.size - 1) {
                products.sort((a, b) => a.time + b.time);
                this.products = products;
                syncLocalData();
              }
            }
          }
        });
    },
    async save() {
      const save = () => {
        let time = this.time + 300000;
        set(`store-${this.id}`, time);
        let saveS = getJson("saveS");
        if (saveS) {
          if (!saveS.includes(this.id)) {
            saveS.push(this.id);
          }
        } else {
          saveS = [this.id];
        }
        setJson("saveS", saveS);

        set(`products-${this.id}`, time);
        let saveSP = getJson("saveSP");
        if (saveSP) {
          if (!saveSP.includes(this.id)) {
            saveSP.push(this.id);
          }
        } else {
          saveSP = [this.id];
        }
        setJson("saveSP", saveSP);

        this.loadingProducts = false;
      };
      try {
        await ldb.products.where({ store: this.id }).delete();
        await ldb.stores.put(this.store);
        if (this.products.length) {
          for (let index = 0; index < this.products.length; index++) {
            const product = this.products[index];
            await ldb.products.put(product);
            if (index == this.products.length - 1) {
              save();
            }
          }
        } else {
          save();
        }
      } catch (err) {
        this.loadingProducts = false;
      }
      if (this.products.length == 0) {
        this.messageProducts = this.$t("product.empty");
      }
    },
  },
};
</script>
