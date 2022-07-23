<template>
  <div class="grid-1">
    <div class="fixed top-0 right-0 w-full h-full">
      <div
        class="bg w-full h-full duration-700"
        :style="`background-image: url('./img/content/${name}.jpg');`"
      >
        <div class="h-full g-center bg-slate-800 text-white bg-opacity-60">
          <div class="grid-1 text-center">
            <h1
              class="font-logo font-medium uppercase text-xl tracking-widest mb-6"
            >
              laziri
            </h1>
            <h2 class="w-7/12 text-sm m-auto pb-12">
              {{ $t("homePage.dis") }}
            </h2>
            <button-app
              @action="$router.push('/login')"
              :text="$t('fixed.start')"
              theme="btn w-4/12 bg-gray-600 m-auto"
              svg="done"
            />
            <router-link to="/business/store" class="text-sub">{{
              $t("business.title")
            }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import buttonApp from "@/components/fixed/buttonApp.vue";

export default {
  components: { buttonApp },
  data() {
    return {
      name: "covid",
    };
  },
  created() {
    let imgs = ["stores", "home", "order", "covid"];
    let count = 0;
    setInterval(() => {
      this.name = imgs[count];
      count = count == imgs.length - 1 ? 0 : count + 1;
    }, 5000);
  },
};
</script>
