import Dexie from "dexie";

const ldb = new Dexie("db");

ldb.version(1).stores({
  account: "",
  stores: "id, distance",
  products: "id, store, [store+cart+status]",
  orders: "",
  mystore: "",
  msproducts: "id",
});

let language = localStorage.language;

ldb.account.put({ language: language ? language : "ar" }, "userId");

export { ldb };
