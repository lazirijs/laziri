<template>
  <div class="grid-1">
    <router-link
      v-for="item in array"
      :key="item.id"
      :to="`/business/${item.path}`"
      class="bg h-32 rounded-xl"
      :style="`background-image: url(${item.image})`"
    >
      <div
        class="w-full h-full bg-gray-800 text-white rounded-xl bg-opacity-60 center font-bold"
      >
        {{ item.title }}
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      array: [
        {
          title: this.$t("business.store.center"),
          image: this.$img("store"),
          path: "store",
        },
        {
          title: this.$t("business.employee.center"),
          image: this.$img("employee"),
          path: "employee",
        },
        {
          title: this.$t("business.ads.center"),
          image: this.$img("ads"),
          path: "ads",
        },
      ],
    };
  },
};
</script>
