<template>
  <orders-app
    :loading="loading"
    :message="message"
    :search="search"
    :data="orders"
    type="orders"
  />
</template>

<script>
import ordersApp from "@/components/fixed/collectionApp.vue";
import { set, get } from "@/scripts/sc";
import { dbOs, user } from "@/Firebase";
import { ldb } from "@/scripts/db";

export default {
  components: { ordersApp },
  data() {
    return {
      user: user().uid,
      loading: null,
      message: null,
      search: {
        type: "Number",
        title: this.$t("order.current"),
      },
      orders: [],
    };
  },
  created() {
    this.localData();
  },
  methods: {
    async localData() {
      if (
        get("saveOrders") > Date.now() ||
        (get("saveOrders") && !navigator.onLine)
      ) {
        try {
          const orders = await ldb.orders.toArray();
          orders.sort((a, b) => a.time.seconds - b.time.seconds);
          if (orders.length == 0) {
            this.message = this.$t("order.empty");
          }
          this.orders = orders;
        } catch (err) {
          this.getData();
        }
      } else {
        this.getData();
      }
    },
    getData() {
      this.loading = true;
      dbOs
        .where("user", "==", this.user)
        .where("status", "==", "الطلب")
        .orderBy("time")
        .startAt(new Date(Date.now() - 86400000))
        .endAt(new Date())
        .get()
        .then((data) => {
          if (data.empty) {
            this.save();
          } else {
            let orders = [];
            for (let index = 0; index < data.docs.length; index++) {
              const get = data.docs[index];
              let order = get.data();
              let products = [];
              order.order.products.forEach((product) => {
                products.push(product.name);
              });
              order["id"] = get.id;
              order["products"] = products;
              orders.push(order);
              if (index == data.docs.length - 1) {
                orders.sort((a, b) => a.time.seconds - b.time.seconds);
                this.orders = orders;
                this.save();
              }
            }
          }
        });
    },
    async save() {
      await ldb.orders.clear();
      try {
        let time = Date.now() + 300000;
        if (this.orders.length) {
          for (let i = 0; i < this.orders.length; i++) {
            const order = this.orders[i];
            await ldb.orders.put(order, order.id);
            if (i == this.orders.length - 1) {
              set("saveOrders", time);
              this.loading = false;
            }
          }
        } else {
          set("saveOrders", time);
          this.loading = false;
        }
      } catch (err) {
        this.loading = false;
      }
      if (this.orders.length == 0) {
        this.message = this.$t("order.empty");
      }
    },
  },
};
</script>
