<template>
  <div :class="theme ? theme : 'grid-1'">
    <div dir="auto" class="py-1 light2 rounded-xl">
      <div class="w-full px-3 py-2 between">
        <h1 class="font-semibold first-letter:uppercase">{{ search.title }}</h1>
        <div @click="show ? (show = false) : (show = true)">
          <svg-app type="menu" theme="w-4" :auto="true" />
        </div>
      </div>
      <div v-if="show" class="w-full px-3 py-2 between">
        <input
          :placeholder="
            search.placeholder
              ? search.placeholder
              : `${$t('fixed.search')} ${search.title}`
          "
          :type="search.type ? search.type : 'text'"
          v-model="textSearch"
          dir="auto"
          class="w-10/12 text-center m-auto outline-none bg-transparent"
        />
        <div class="w-1/12">
          <div>
            <svg-app type="search" theme="w-4" :auto="true" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="loading"
      class="h-16 g-center text-center text-sm font-medium animate-pulse"
    >
      {{ $t("fixed.loading") }}
    </div>
    <div
      v-else-if="message"
      class="h-16 g-center text-center text-sm font-medium w-7/12 m-auto"
    >
      {{ message }}
    </div>

    <div v-else-if="type == 'orders'" class="grid-1">
      <order-app
        v-for="order in filter"
        :key="order.id"
        :data="order"
        @action="$router.push(`/order/${order.id}`)"
      />
    </div>
    <div v-else-if="type == 'stores'" class="grid-2">
      <store-app
        v-for="store in filter"
        :key="store.id"
        :data="store"
        @action="$router.push(`/store/${store.id}`)"
      />
    </div>
    <div v-else-if="type == 'products'" class="grid-2">
      <product-app
        v-for="product in filter"
        :key="product.id"
        :data="product"
        @action="$router.push(`/store/${product.store}/product/${product.id}`)"
      />
    </div>
  </div>
</template>

<script>
import productApp from "@/components/fixed/productApp.vue";
import storeApp from "@/components/fixed/storeApp.vue";
import orderApp from "@/components/fixed/orderApp.vue";
import svgApp from "@/components/fixed/svgApp.vue";

export default {
  components: { svgApp, orderApp, storeApp, productApp },
  props: {
    loading: Boolean,
    message: String,
    search: Object,
    theme: String,
    type: String,
    data: Array,
  },
  data() {
    return {
      show: false,
      textSearch: "",
    };
  },
  computed: {
    filter() {
      return this.data.filter((item) => {
        if (item.code) {
          return item.code.toLowerCase().match(this.textSearch.toLowerCase());
        } else {
          return item.name.toLowerCase().match(this.textSearch.toLowerCase());
        }
      });
    },
  },
};
</script>
