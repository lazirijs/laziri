<template>
  <store-app
    :loading="loading"
    :message="message"
    :search="search"
    :data="stores"
    type="stores"
  />
</template>

<script>
import storeApp from "@/components/fixed/collectionApp.vue";
import { user, geocollection } from "@/Firebase";
import { set, setJson, get } from "@/scripts/sc";
import * as loc from "@/scripts/location";
import { ldb } from "@/scripts/db";

export default {
  components: { storeApp },
  data() {
    return {
      user: user().uid,
      loading: null,
      message: null,
      search: {
        title: this.$t("store.group"),
        placeholder: this.$t("store.placeholder"),
      },
      stores: [],
    };
  },
  created() {
    this.localData();
  },
  methods: {
    async localData() {
      let saveStores = get("saveStores");
      if (saveStores > Date.now() || (saveStores && !navigator.onLine)) {
        try {
          let stores = await ldb.stores.where("distance").below(3.1).toArray();
          stores.sort((a, b) => a.distance - b.distance);
          if (stores.length == 0) {
            this.message = this.$t("store.empty");
          } else {
            this.stores = stores;
          }
        } catch (err) {
          this.getData();
        }
      } else {
        this.getData();
      }
    },
    async getData() {
      this.loading = true;
      let crd = await loc.ask();
      if (crd.lat) {
        geocollection
          .where("status", "in", ["مفتوح", "مغلق"])
          .near({ center: user("geopoint", [crd.lat, crd.lng]), radius: 3 })
          .get()
          .then((data) => {
            if (data.empty) {
              this.save();
            } else {
              let stores = [];
              const toSave = (index, length) => {
                if (index == length - 1) {
                  stores.sort((a, b) => a.distance - b.distance);
                  this.stores = stores;
                  this.save();
                }
              };
              for (let index = 0; index < data.docs.length; index++) {
                const get = data.docs[index];
                let store = get.data();
                let distance = loc.distance(
                  crd.lat,
                  store.g.geopoint._lat,
                  crd.lng,
                  store.g.geopoint._long
                );
                if (this.user != get.id && distance <= 3) {
                  store["id"] = get.id;
                  store["distance"] = distance;
                  store["userLocation"] = crd;
                  stores.push(store);
                  toSave(index, data.docs.length);
                } else {
                  toSave(index, data.docs.length);
                }
              }
            }
          });
      } else if (crd.err) {
        this.message = this.$t("location.stores.fail");
        this.loading = false;
      }
    },
    async save() {
      let stores = this.stores;
      let time = Date.now() + 300000;
      let saveS = [];
      const sava = () => {
        setJson("saveS", saveS);
        set("saveStores", time);
        this.loading = false;
      };
      await ldb.stores.clear();
      try {
        if (stores.length) {
          for (let i = 0; i < stores.length; i++) {
            const store = stores[i];
            await ldb.stores.put(store);
            if (!saveS.includes(store.id)) {
              saveS.push(store.id);
            }
            set(`store-${store.id}`, time);
            if (i == stores.length - 1) {
              sava();
            }
          }
        } else {
          sava();
        }
      } catch (err) {
        this.loading = false;
      }
      if (stores.length == 0) {
        this.message = this.$t("store.empty");
      }
    },
  },
};
</script>
