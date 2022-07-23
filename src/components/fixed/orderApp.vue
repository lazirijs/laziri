<template>
  <div @click="$emit('action')" class="w-full px-3 py-2 rounded-xl dark1">
    <div class="between">
      <div class="center">
        <div class="text-xs text-slate-400">{{ $t("order.code") }} :</div>
        <div class="text-lg tracking-widest font-medium mx-1">
          {{ data.code }}
        </div>
      </div>
      <div>{{ $time(data.time.seconds * 1000) }}</div>
    </div>
    <div class="w-10/12 text-center my-2 m-auto text-lg truncate">
      {{ data.products.join(" , ") }}
    </div>
    <div class="between">
      <div class="center">
        <div class="text-xs text-slate-400">{{ $t("order.distance") }} :</div>
        <div dir="rtl" class="center mx-1">
          <span class="text-xs mx-1">
            {{ data.delivery.distance * 1000 >= 500 ? "Km" : "M" }}
          </span>
          <span>{{
            data.delivery.distance * 1000 >= 500
              ? data.delivery.distance.toFixed(1)
              : data.delivery.distance.toFixed(3) * 1000
          }}</span>
        </div>
      </div>
      <div class="center">
        <div class="text-xs text-slate-400 mx-1">{{ $t("order.price") }} :</div>
        <div dir="rtl" class="start">
          <span class="text-xs uppercase mx-1"> dzd </span>
          <span>{{ data.order.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },
};
</script>
