<template>
  <div class="grid-1">
    <content-app
      :title="$t('business.welcome')"
      :center="$t('business.store.center')"
      :bg="$img('store')"
      :description="$t('business.store.description')"
    />
    <button-app
      v-if="$get('seller') != 'true'"
      @action="$router.push('/business/store/create')"
      theme="btnB2 w-5/12"
      :text="$t('fixed.start')"
      svg="done"
    />
    <h6 v-if="$get('seller') != 'true'" class="text-sub pb-12">
      {{ $t("store.create.sub") }}
    </h6>
    <h1 class="text-title pb-6">{{ $t("business.store.why.title") }}</h1>
    <h2 class="font-bold">{{ $t("business.store.why.1.title") }}</h2>
    <p class="pb-6">{{ $t("business.store.why.1.dis") }}</p>
    <h2 class="font-bold">{{ $t("business.store.why.2.title") }}</h2>
    <p class="pb-6">{{ $t("business.store.why.2.dis") }}</p>
    <h2 class="font-bold">{{ $t("business.store.why.3.title") }}</h2>
    <p class="pb-6">{{ $t("business.store.why.3.dis") }}</p>
    <h1 class="text-title grid-1 pb-6">
      <a>{{ $t("business.store.why.laziri.title") }}</a>
      <a class="font-logo uppercase tracking-widest">laziri</a>
    </h1>
    <p class="text-cenhter">{{ $t("business.store.why.laziri.problems") }}</p>
    <p class="text-cenhter">{{ $t("business.store.why.laziri.solve") }}</p>
  </div>
</template>

<script>
import contentApp from "@/components/fixed/contentApp.vue";
import buttonApp from "@/components/fixed/buttonApp.vue";

export default {
  components: { contentApp, buttonApp },
};
</script>
