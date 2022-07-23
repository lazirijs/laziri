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
import { dbOs, user } from "@/Firebase";

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
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      dbOs
        .where("store", "==", this.user)
        .where("status", "==", "الطلب")
        .orderBy("time")
        .startAt(new Date(Date.now() - 86400000))
        .endAt(new Date())
        .get()
        .then((data) => {
          if (data.empty) {
            this.message = this.$t("order.empty");
            this.loading = false;
          } else {
            for (let index = 0; index < data.docs.length; index++) {
              const get = data.docs[index];
              let order = get.data();
              let products = [];
              for (let i = 0; i < order.order.products.length; i++) {
                const product = order.order.products[i];
                products.push(product.name);
                if (i == order.order.products.length - 1) {
                  order["id"] = get.id;
                  order["products"] = products;
                  this.orders.push(order);
                  if (index - data.docs.length) {
                    this.orders.sort((a, b) => a.time.seconds - b.time.seconds);
                    this.loading = false;
                  }
                }
              }
            }
          }
        });
    },
  },
};
</script>
