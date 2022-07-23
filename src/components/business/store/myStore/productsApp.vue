<template>
  <products-app
    :loading="loading"
    :message="message"
    :search="search"
    :data="products"
    type="products"
  />
</template>

<script>
import { set, setJson, get, getJson } from "@/scripts/sc";
import productsApp from "@/components/fixed/collectionApp.vue";
import { dbPs, user } from "@/Firebase";
import { ldb } from "@/scripts/db";

export default {
  components: { productsApp },
  data() {
    let sP = get(`products-${user().uid}`);
    return {
      user: user().uid,
      loading: null,
      message: null,
      tSP: sP ? sP : 0,
      search: {
        title: this.$t("product.store"),
      },
      products: [],
    };
  },
  created() {
    this.localData();
  },
  methods: {
    async localData() {
      if (this.tSP > Date.now() || !navigator.onLine) {
        try {
          let products = await ldb.msproducts.toArray();
          products.sort((a, b) => b.time.seconds - a.time.seconds);
          this.products = products;
          if (products.length == 0) {
            this.message = this.$t("product.empty");
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
      dbPs
        .where("store", "==", this.user)
        .where("status", "in", ["غير متوفر", "متوفر", "خاص"])
        .get()
        .then((data) => {
          if (data.empty) {
            this.save();
          } else {
            let products = [];
            for (let i = 0; i < data.docs.length; i++) {
              const get = data.docs[i];
              let product = get.data();
              product["id"] = get.id;
              product["cart"] = "false";
              product["quantity"] = 1;
              if (product.status == "غير متوفر") {
                product["note"] = "product.notAvailable";
              } else if (product.status == "خاص") {
                product["note"] = "product.privet";
              }
              products.push(product);
              if (i === data.docs.length - 1) {
                products.sort((a, b) => b.time.seconds - a.time.seconds);
                this.products = products;
                this.save();
              }
            }
          }
        });
    },
    async save() {
      const save = () => {
        set(`products-${this.user}`, Date.now() + 300000);
        let saveSP = getJson("saveSP");
        if (saveSP) {
          if (!saveSP.includes(this.user)) {
            saveSP.push(this.user);
          }
        } else {
          saveSP = [this.user];
        }
        setJson("saveSP", saveSP);
        this.loading = false;
      };
      try {
        await ldb.msproducts.clear();
        if (this.products.length) {
          for (let index = 0; index < this.products.length; index++) {
            const product = this.products[index];
            await ldb.msproducts.put(product);
            if (index == this.products.length - 1) {
              save();
            }
          }
        } else {
          save();
        }
      } catch (err) {
        this.loading = false;
      }
      if (this.products.length == 0) {
        this.message = this.$t("product.empty");
      }
    },
  },
};
</script>
