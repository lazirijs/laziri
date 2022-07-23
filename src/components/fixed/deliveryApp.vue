<template>
  <div class="grid-1">
    <div class="grid-1">
      <div class="text-title">{{ $t("order.info") }}</div>
      <div v-if="quantity > 0" class="i-center">
        <div class="font-medium first-letter:uppercase">
          {{ $t("product.number") }} :
        </div>
        <div class="text-medium tracking-wide mx-2">{{ quantity }}</div>
      </div>
      <div class="i-center">
        <div class="font-medium first-letter:uppercase">
          {{ $t("order.delivery.distance") }} :
        </div>
        <div class="text-medium tracking-wide mx-2" dir="auto">
          {{
            distance * 1000 >= 500
              ? `${distance.toFixed(1)}  Km`
              : `${1000 * distance.toFixed(3)}  M`
          }}
        </div>
      </div>
      <div
        v-if="dPrice != null && dPrice != undefined && dPrice >= 0"
        class="i-center"
      >
        <div class="font-medium first-letter:uppercase">
          {{ $t("order.delivery.price") }} :
        </div>
        <div dir="auto" class="text-medium tracking-wide uppercase start mx-2">
          <span>{{ dPrice == 0 ? $t("fixed.free") : dPrice }}</span>
          <span v-if="dPrice" class="text-xs mx-1"> dzd </span>
        </div>
      </div>
      <div v-if="quantity > 0" class="i-center">
        <div class="font-medium first-letter:uppercase">
          {{ $t("product.priceGroup") }} :
        </div>
        <div dir="auto" class="text-medium tracking-wide uppercase start mx-2">
          <span>{{ total ? total - dPrice : total }}</span>
          <span class="text-xs mx-1"> dzd </span>
        </div>
      </div>
      <div v-if="quantity > 0 && dPrice >= 0" class="i-center">
        <div class="font-medium first-letter:uppercase">
          {{ $t("order.total") }} :
        </div>
        <div dir="auto" class="text-medium tracking-wide uppercase start mx-2">
          <span>{{ total }}</span>
          <span class="text-xs mx-1"> dzd </span>
        </div>
      </div>
      <div v-if="cart" class="grid-1">
        <div v-if="(note && !editNote) || (note && processing)" class="grid-1">
          <div class="text-sub-2">{{ $t("order.note.toStore") }}</div>
          <p class="text-dis">{{ note }}</p>
          <button-app
            v-if="!processing"
            @action="editInfo('note')"
            :text="$t('fixed.edit')"
            svg="edit"
          />
        </div>
        <div v-else-if="editNote && !processing" class="grid-1">
          <input-app
            :text="note"
            @sync="noteValue = $event"
            :title="$t('order.note.toStore')"
            svg="edit"
            type="textarea"
            :max="100"
          />
          <button-app
            @action="save('note')"
            :text="$t('fixed.save')"
            svg="save"
          />
          <div @click="editInfo('xNote')" class="text-sub tracking-widest">
            {{ $t("fixed.cancel") }} x
          </div>
        </div>
        <div
          v-else-if="!processing"
          @click="editInfo('note')"
          class="text-sub-2 center"
        >
          <h1 class="mx-1">{{ $t("order.note.toStore") }}</h1>
          <svg-app type="edit" theme="svg" />
        </div>
      </div>
    </div>
    <div class="grid-1">
      <hr class="divide" />
      <div class="text-title">{{ $t("order.delivery.info") }}</div>
      <div v-if="edit && cart" class="grid-1">
        <input-app
          :text="delivery.name"
          @sync="delivery.name = $event"
          :title="$t('fixed.name')"
          svg="user"
        />
        <input-app
          :text="delivery.phone"
          @sync="delivery.phone = $event"
          :title="$t('fixed.phone')"
          svg="phone"
          type="tel"
        />
        <input-app
          :text="delivery.place"
          @sync="delivery.place = $event"
          :title="$t('order.delivery.place')"
          svg="location"
          type="textarea"
          :placeholder="$t('order.delivery.placeHolder')"
        />
        <button-app @action="save()" :text="$t('fixed.save')" svg="save" />
        <div
          v-if="localData"
          @click="editInfo()"
          class="text-sub tracking-widest"
        >
          {{ $t("fixed.cancel") }} x
        </div>
      </div>
      <div v-else-if="delivery">
        <div class="grid-1">
          <div class="grid-1-2">
            <div class="text-sub-2">{{ $t("fixed.name") }}</div>
            <div class="text-dis">
              {{ delivery.name ? delivery.name : deliveryInfo.info.name }}
            </div>
          </div>
          <div class="grid-1-2">
            <div class="text-sub-2">{{ $t("fixed.phone") }}</div>
            <a
              :href="
                cart
                  ? false
                  : `tel:${
                      delivery.phone ? delivery.phone : deliveryInfo.info.phone
                    }`
              "
              class="text-dis"
            >
              {{ delivery.phone ? delivery.phone : deliveryInfo.info.phone }}
            </a>
          </div>
          <div class="grid-1-2">
            <div class="text-sub-2">{{ $t("order.delivery.place") }}</div>
            <p class="text-dis">
              {{ delivery.place ? delivery.place : deliveryInfo.info.place }}
            </p>
          </div>
          <button-app
            v-if="cart && !processing"
            @action="editInfo(true)"
            :text="$t('fixed.edit')"
            svg="edit"
          />
        </div>
      </div>
    </div>
    <div v-if="!cart" class="grid-1">
      <hr class="divide" />
      <div class="text-title">{{ $t("order.delivery.direction.info") }}</div>
      <button-app
        :link="`https://www.google.com/maps/dir/${loc.lat},${loc.lng}/${deliveryInfo.location.lat},${deliveryInfo.location.lng}`"
        target="_blank"
        :text="$t('order.delivery.direction.title')"
        svg="direction"
      />
      <div class="text-sub">{{ $t("order.delivery.direction.desc") }}</div>
    </div>
    <notice-app v-if="msg" :msg="msg" />
  </div>
</template>

<script>
import buttonApp from "@/components/fixed/buttonApp.vue";
import noticeApp from "@/components/fixed/noticeApp.vue";
import inputApp from "@/components/fixed/inputApp.vue";
import { getJson, setJson } from "@/scripts/sc";
import svgApp from "@/components/fixed/svgApp.vue";
import { ask } from "@/scripts/location";

export default {
  components: { noticeApp, inputApp, buttonApp, svgApp },
  props: {
    deliveryInfo: Object,
    distance: Number,
    quantity: Number,
    dPrice: Number,
    total: Number,
    note: String,
    processing: Boolean,
  },
  data() {
    return {
      cart: window.location.href.split("/")[5] == "cart" ? true : false,
      localData: getJson("delivery"),
      delivery: {
        name: null,
        phone: null,
        place: null,
      },
      edit: null,
      editNote: null,
      noteValue: null,
      loc: {
        lat: null,
        lng: null,
      },
      msg: null,
    };
  },
  async created() {
    this.noteValue = this.note;
    let data = getJson("delivery");
    if (this.cart) {
      data ? (this.delivery = data) : this.editInfo(true);
    } else {
      this.loc = await ask();
    }
  },
  methods: {
    editInfo(edit) {
      if (edit == "note") {
        this.editNote = true;
        this.$emit("update", true);
      } else if (edit == "xNote") {
        this.editNote = false;
        if (!this.edit) {
          this.$emit("update", false);
        }
      } else if (edit) {
        this.edit = true;
        this.$emit("update", true);
      } else {
        this.edit = false;
        this.delivery = getJson("delivery");
        if (!this.editNote) {
          this.$emit("update", false);
        }
      }
    },
    save(event) {
      const ntc = (text) => {
        this.msg == text ? (this.msg = text + " ") : (this.msg = text);
      };
      if (event == "note") {
        this.$emit("note", this.noteValue);
        this.editInfo("xNote");
      } else {
        let d = this.delivery;
        let a = [d.name, d.phone, d.place];
        if (a.includes(null) || a.includes("")) {
          ntc(this.$t("fixed.fillAllData"));
        } else if (this.$long(d.name) < 5) {
          ntc(this.$t("fixed.alert.name"));
        } else if (this.$long(d.phone) != 10 || !d.phone.startsWith("0")) {
          ntc(this.$t("fixed.alert.phone"));
        } else if (this.$long(d.place) < 20) {
          ntc(this.$t("order.delivery.placeAlert"));
        } else {
          setJson("delivery", d);
          this.$emit("save", d);
          this.delivery = getJson("delivery");
          this.editInfo();
        }
      }
    },
  },
};
</script>
