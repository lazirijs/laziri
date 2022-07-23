<template>
  <div class="grid-1">
    <div
      v-for="(product, index) in products"
      :key="product.id"
      dir="rtl"
      class="w-full h-24 between relative"
    >
      <div
        :dir="$doc('#theme').lang == 'ar' ? 'rtl' : 'ltr'"
        class="w-9/12 p-2"
      >
        <div class="w-full between">
          <span class="text-slate-400 text-xs">{{ $t("product.single") }}</span>
          <span
            dir="auto"
            :class="`w-full ${
              $doc('#theme').lang == 'ar' ? 'pr-2' : 'pl-2'
            } text-lg truncate`"
            >{{ product.name }}</span
          >
        </div>
        <div class="w-full between py-2">
          <div class="w-7/12 between">
            <span class="text-slate-400 text-xs">{{
              $t("product.quantity")
            }}</span>
            <span class="w-full text-center px-2 truncate between">
              <svg-app
                v-if="path[5] == 'cart'"
                @action="quantity(index, 'plus')"
                type="+"
                theme="svg text-slate-400"
                :auto="true"
              />
              <span
                :class="`w-3/12 text-center ${
                  path[5] != 'cart' ? 'm-auto' : ''
                }`"
                >{{ product.quantity }}</span
              >
              <svg-app
                v-if="path[5] == 'cart'"
                @action="quantity(index, 'minus')"
                type="-"
                theme="svg text-slate-400"
                :auto="true"
              />
            </span>
          </div>
          <div class="w-5/12 between">
            <span class="text-slate-400 text-xs">{{ $t("product.unit") }}</span>
            <div dir="rtl" class="start truncate">
              <span class="uppercase text-xs mx-1">dzd</span>
              <span>{{ product.price }}</span>
            </div>
          </div>
        </div>
        <div class="w-full between">
          <span class="w-6/12 text-slate-400 text-xs">{{
            $t("order.total")
          }}</span>
          <span class="w-full text-xl font-bold truncate">
            <div
              dir="rtl"
              :class="`${
                $doc('#theme').lang == 'ar' ? 'end' : 'start'
              } text-xl font-bold truncate`"
            >
              <span class="uppercase text-xs mx-1">dzd</span>
              <span>
                {{ (product.total = product.price * product.quantity) }}
              </span>
            </div>
          </span>
        </div>
      </div>
      <div
        class="w-3/12 min-h-full bg rounded-xl mr-1"
        :style="`background-image: url(${product.image})`"
      >
        <svg-app
          v-if="path[5] == 'cart'"
          @action="quantity(index, 'remove')"
          type="x"
          theme="w-5 absolute top-0 left-0 transform -translate-x-2 -translate-y-2 p-1 light3 rounded-xl"
          :auto="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import svgApp from "@/components/fixed/svgApp.vue";
import { ldb } from "@/scripts/db";

export default {
  components: { svgApp },
  props: {
    data: Array,
  },
  data() {
    return {
      path: window.location.href.split("/"),
      products: [],
    };
  },
  watch: {
    data(newData, oldData) {
      if (newData != oldData) {
        this.products = this.data;
      }
    },
  },
  created() {
    this.products = this.data;
  },
  methods: {
    async quantity(id, update) {
      if (this.path[5] == "cart") {
        let product = this.products[id];
        if (update == "minus" && product.quantity != 1) {
          await ldb.products.update(product.id, {
            quantity: product.quantity - 1,
          });
          this.$emit("get");
        } else if (update == "plus") {
          await ldb.products.update(product.id, {
            quantity: product.quantity + 1,
          });
          this.$emit("get");
        } else if (update == "remove") {
          await ldb.products.update(product.id, { cart: "false" });
          this.$emit("get");
        }
      }
    },
  },
};
</script>
