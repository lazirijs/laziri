<template>
  <div class="grid-1">
    <content-app
      :title="$t('business.welcome')"
      :center="$t('business.ads.center')"
      :bg="$img('ads')"
      :description="$t('business.ads.description')"
    />
    <button-app
      @action="$router.push('/contactus')"
      :text="$t('contactUs.title')"
      theme="btnL2 w-7/12"
      svg="chat"
    />
    <div class="text-sub">{{ $t("business.ads.subDescription") }}</div>
  </div>
</template>

<script>
import contentApp from "@/components/fixed/contentApp.vue";
import buttonApp from "@/components/fixed/buttonApp.vue";

export default {
  components: { contentApp, buttonApp },
};
</script>
