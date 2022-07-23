<template>
  <div class="grid-1">
    <content-app
      :title="$t('business.welcome')"
      :center="$t('contactUs.title')"
      :bg="$img('contactus')"
      :description="$t('contactUs.desc')"
    />
    <div class="text-title">{{ $t("contactUs.toContactUs") }}</div>
    <div class="grid-2">
      <div class="grid-1">
        <button-app
          link="https://fb.com/laziri.fb"
          target="_blank"
          theme="btnL2 w-10/12"
          text="Facebook"
          svg="link"
        />
        <div
          class="text-center m-auto text-xs tracking-wide text-slate-500 dark:text-slate-400"
        >
          facebook.com/laziri.fb
        </div>
      </div>
      <div class="grid-1">
        <button-app
          link="mailto:laziri.com@gmail.com"
          theme="btnL2 w-10/12"
          :text="$t('fixed.email')"
          svg="@"
        />
        <div
          class="text-center m-auto text-xs tracking-wide text-slate-500 dark:text-slate-400"
        >
          laziri.com@gmail.com
        </div>
      </div>
      <div class="grid-1">
        <button-app
          link="tel:+213561585484"
          theme="btnL2 w-10/12"
          :text="$t('contactUs.phone')"
          svg="phone"
        />
        <div
          dir="rtl"
          class="text-center m-auto text-xs tracking-wide text-slate-500 dark:text-slate-400"
        >
          213561585484+
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import contentApp from "@/components/fixed/contentApp.vue";
import buttonApp from "@/components/fixed/buttonApp.vue";

export default {
  components: { contentApp, buttonApp },
};
</script>
