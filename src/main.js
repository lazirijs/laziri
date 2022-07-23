import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import "./registerServiceWorker";
import axios from "axios";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

Vue.config.productionTip = false;

Vue.prototype.$get = (key, type) => {
  if (type == "session") {
    return sessionStorage.getItem(key);
  } else {
    return localStorage.getItem(key);
  }
};

Vue.prototype.$getJson = (key, type) => {
  if (type == "session") {
    return JSON.parse(sessionStorage.getItem(key));
  } else {
    return JSON.parse(localStorage.getItem(key));
  }
};

Vue.prototype.$time = (time) => {
  let date = new Date(time);
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

Vue.prototype.$date = (time) => {
  let date = String(new Date(time).toLocaleDateString()).split("/");
  return `${date[1].padStart(2, "0")}/${date[0].padStart(2, "0")}/${date[2]}`;
};

Vue.prototype.$long = (text) => {
  return !text ? 0 : String(text).replace(/ /g, "").length;
};

Vue.prototype.$sendNotice = async (data) => {
  let result = await axios.post(
    "https://fcm.googleapis.com/fcm/send",
    {
      registration_ids:
        typeof data.tokens == "string" ? [data.tokens] : data.tokens,
      notification: {
        title: data.title,
        body: data.body,
        icon: data.icon,
      },
      data: {
        url: data.url,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "KEY=AAAAr-6LgFo:APA91bHBxKVO3FZp0BSLvn3juh9z1VZIRl40wTuVDsgGXmAzqbiOcGtcVqXbVe21k0IytNe3AxB-6SAbIrLjL_NTn4-c2Kb-C7c529fMtR4G6LtAdYmYxf-Asst8IdbmHLBEZglRtOeM",
      },
    }
  );
  return result;
};

Vue.prototype.$copy = (data) => {
  navigator.clipboard.writeText(data);
};

Vue.prototype.$doc = (data) => {
  return document.querySelector(data);
};

Vue.prototype.$path = () => {
  return window.location;
};

Vue.prototype.$img = (name) => {
  return require(`./assets/content/${name}.jpg`);
};

// Ready translated locale messages
const messages = {
  ar: {
    fixed: {
      hello: "مرحبا بك !",
      login: "الدخول",
      loading: "التحميل ...",
      search: "البحث في",
      ad: "إعلان",
      bigPhoto: "قم بإختيار صورة لا يتجاوز حجمها 5 ميغا بايت",
      done: "تهانينا !",
      add: "إضافة",
      edit: "التعديل",
      save: "حفظ",
      cancel: "إلغاء",
      update: "التحديث",
      upload: "الرفع",
      uploadFailed: "فشل الرفع",
      uploadFailedDesc: "حدثت مشكلة أثناء رفع البيانات",
      uploading: "تم رفع {value} %",
      notRequired: "غير إجباري",
      ok: "حسنا",
      skip: "لاحقا",
      yes: "نعم",
      no: "لا",
      activate: "التفعيل",
      start: "إنطلق",
      enter: "أدخل",
      create: "إنشاء",
      important: "مهم جدا",
      tryAgain: "قم بإعادة المحاولة لاحقا",
      fillAllData: "قم بملأ جميع البيانات الإجبارية",
      confirm: "التأكيد",
      confirmData: "هل أنت متأكد من المعلومات المدخلة ؟",
      install: "تثبيت التطبيق",
      installDesc: "يمكنك تثبيت تطبيق الويب كأي تطبيق على جهازك !",
      accountCreated: "تم إنشاء حسابك بنجاح",
      notSupported: "المتصفح غير مدعوم",
      notSupportedDesc:
        "هذا المتصفح غير قادر على تشغيل التطبيق, يرجى تغيير المتصفح",
      delay: "قد يستغرق ظهور {type} عند بعض المستخدمين بضع دقائق",
      createdTime: "تم إنشاء {type} بتاريخ",
      price: "السعر",
      uploaded: "تم {type} {class} بنجاح",
      free: "مجانا",
      back: "التراجع",
      name: "الإسم واللقب",
      phone: "رقم الهاتف",
      alert: {
        name: "ٌيجب إدخال إسمك الكامل",
        phone: "يبدو أن رقم هاتفك غير كامل أو غير صحيح",
      },
      email: "البريد",
      photoProces: "جاري معالجة الصورة ...",
      slowPhoto: "تجاوز حجم الصورة 1 ميغابايت قد يؤثر سلبا على أداء متجرك",
    },
    order: {
      single: "الطلب",
      group: "الطلبات",
      info: "معلومات الطلبية",
      current: "الطلبات الحالية",
      empty: "ليس هناك طلبات حاليا",
      created: "تم إنشاء الطلبية بنجاح",
      createdCode: "الطلبية تحمل الرمز {code}",
      new: "طلبية جديدة",
      createdNofice: "لديك طلبية جديدة تحمل الرمز {code}",
      code: "الرمز",
      price: "السعر",
      distance: "المسافة",
      delivery: {
        title: "التوصيل",
        price: "سعر التوصيل",
        distance: "مسافة التوصيل",
        info: "معلومات التوصيل",
        place: "مكان التوصيل",
        placeHolder: "قم بوصف مكان التوصيل جيدا",
        placeAlert: "قم بوصف مكان التوصيل بشكل إفضل",
        direction: {
          title: "الإتجاه",
          info: "معلومات الإتجاه",
          desc: "قد لا تكون الخرطية صحيحة أحيانا",
        },
      },
      total: "المبلغ الإجمالي",
      status: {
        canceled: "ألغي",
        delivered: "وصل",
      },
      confirm: {
        cancel: "هل حقا تود إلغاء الطلبية !",
        delivery: "هل حقا تم توصيل الطلبية بنجاح ؟",
      },
      note: {
        toStore: "ملاحظة للبائع",
        fromBuyer: "ملاحظة المشتري",
        fromYou: "ملاحظتك",
      },
      reject: "ليس لديك الإذن بالدخول للطلبية",
      error: "يبدو أن هناك خطأ في الشبكة أو أنه ليس لديك الإذن بالدخول للطلبة",
      notExist: "هذه الطلبية غير موجودة",
    },
    store: {
      single: "متجر",
      group: "المتاجر",
      mystore: "متجري",
      status: {
        title: "حالة المتجر",
        open: "مفتوح",
        close: "مغلق",
        privet: "خاص",
      },
      placeholder: "البحث في المتاجر المتوفرة في نطاقك",
      current: "المتاجر المتوفرة في نطاقك",
      empty: "ليس هناك متاجر في نطاقك",
      close: "المتجر مغلق حاليا",
      photo: "إضغط هنا لتغيير الصورة",
      name: "إسم المتجر",
      notAvailable: "هذا المتجر غير متوفر حاليا",
      notExist: "هذا المتجر غير موجود",
      privet: "المتجر في الوضع الخاص حاليا",
      contact: "التواصل مع المتجر",
      location: {
        title: "موقع المتجر",
        update: "تحديث إحداثيات المتجر",
        UpdateDesc:
          "لا تقم بتحديث الإحداثيات إلا إذا كنت في متجرك .. ينصح بإستعمال Google Maps للتأكد من ذلك",
      },
      sellerInfo: "معلومات البائع",
      create: {
        sub: "نحن في الفترة التجريبية حاليا إنشاء المتجر مجاني فقط تواصل معنا لتفعيله",
        alert: {
          background: "قم بإختيار خلفية لمتجرك",
          logo: "قم بإختيار شعار لمتجرك",
          name: "قم بإختيار إسم لمتجرك",
        },
        contactUs: "قم بالتواصل معنا لتفعيل متجرك",
        phoneUsage: "سيستعمل هذا الرقم في التواصل مع المتجر",
      },
      employee: {
        title: "موظفي المتجر",
        code: "رمز الموظف",
        name: "إسم الموظف",
      },
    },
    cart: {
      title: "السلة",
      empty: "لا توجد منتجات في سلة هذا المتجر",
      alert: {
        domain: "نطاق المتجر",
        domainDesc: "أنت بعيد جدا عن نطاق هذا المتجر لذلك لايمكنك الشراء منه",
        contact: "يمكنك الطلب من المتجر عن طريق رقم الهاتف",
        close: "المتجر مغلق لذلك لايمكنك الشراء منه حاليا",
      },
    },
    product: {
      single: "المنتج",
      group: "المنتجات",
      number: "عدد المنتجات",
      store: "منتجات المتجر",
      empty: "لا توجد منتجات في هذا المتجر حاليا",
      notAvailable: "المنتج غير متوفر حاليا",
      photo: "إضغط هنا لإختيار صورة للمنتج",
      choosePhoto: "قم بإختيار صورة للمنتج",
      notExist: "هذا المنتج غير موجود",
      privet: "المنتج خاص حاليا",
      quantity: "الكمية",
      total: "السعر الإجمالي لهذا المنتج",
      copyLink: "نسخ رابط المنتج",
      status: {
        title: "حالة المنتج",
        available: "متوفر",
        notAvailable: "غير متوفر",
        privet: "خاص",
      },
      name: "إسم المنتج",
      price: "سعر المنتج",
      priceGroup: "سعر المنتجات",
      description: "وصف المنتج",
      changeData: "قد تتغير المعلومات التالية عند توفر المنتج",
      unit: "الوحدة",
      unsplash: `قد يساعدك
      <a href="https://unsplash.com/" target="_blank">unsplash.com</a>
      بإختيار صور إحترافية لمنتجك`,
      errorLoading: "حدث مشكل ما عند تحميل بيانات المنتج",
      delete: {
        title: "حذف المنتج",
        confirm: "هل حقا تود حذف المنتج ؟ !",
        fail: "حدثت مشكلة أثناء حذف البيانات",
        process: "جاري حذف المنتج ...",
        done: "تم حذف المنتج بنجاح",
      },
    },
    location: {
      title: "تحديد الموقع",
      fail: "فشل تحديد الموقع",
      require: "يرجى السماح و تفعيل تحديد الموقع الجغرافي",
      reject:
        "لن نتمكن من تحديد المتاجر المتوفرة في نطاقك مالم  يتم السماح وتفعيل تحديد الموقع الجغرافي",
      stores: {
        fail: "تعذر تحديد المتاجر المتوفرة في نطاقك بسبب مشكلة ما في تحديد الموقع",
      },
      create: {
        confirm:
          "سيتم رفع إحداثيات موقعك الجغرافي الحالي لذلك تأكد أنك في متجرك عندما تقوم بإنشاء متجرك هنا",
        fail: "لن تتمكن من إنشاء متجرك مالم يتم السماح وتفعيل تحديد الموقع",
      },
      googleMaps: "ينصح بإستعمال Google maps للتأكد من ذلك",
    },
    notification: {
      title: "الإشعارات",
      ask: "هل تود تلقي الإشعارات حول طلبياتك ؟",
      cannot: "هذا الجهاز غير قادر على إستقبال إشعارات تطبيقات الويب",
      create: {
        fail: "هنا مشكلة في إستقبال الإشعارات",
        reject:
          "لن تتمكن من إنشاء متجرك مالم يتم السماح وتفعيل إستقبال الإشعارات",
        require: "يجب تفعيل إستقبال الإشعارات لإنشاء متجرك",
        notSupported:
          "هذا الجهاز غير قادر على إستقبال إشعارات تطبيقات الويب لذلك لن تصلك إشعارات حول الطلبات في متجرك على هذا الجهاز",
      },
      store: {
        reject:
          "لن تتمكن من الدخول لمتجرك مالم يتم السماح وتفعيل إستقبال الإشعارات",
        require: "يجب الموافقة و تفعيل إستقبال الإشعارات للدخول إلى متجرك",
      },
      askEmployee:
        "لقد قمت بتفعيل خاصية العمل على حسابك ... هل تود تلقي الإشعارات حول طلبات المتاجر",
    },
    business: {
      title: "الأعمال",
      welcome: "مرحبا بك معنا",
      store: {
        center: "المتجر",
        description:
          "إنضم إلينا وأنشئ متجرك الإلكتروني في ثوانٍ .. وسّع نطاقك  .. وتفاعل مع عملائك",
        why: {
          title: "لماذا يجب عليك إنشاء متجر إلكتروني لنشاطك التجاري",
          1: {
            title: "1 . الوصول إلى المزيد من العملاء",
            dis: `
            بإنشاء متجرك الإلكتروني يمكن لأي مستخدم
            على التطبيق الإطلاع على منتجاتك
            و تفقدها وهذا مايضاعف 
            إمكانية إرتفاع عدد عملائك
            وبالتالي توسيع نطاق العمل
            و زيادة مبيعاتك وبالتالي زيادة الأرباح. `,
          },
          2: {
            title: "2 . وفر الراحة التي يتوقعها العملاء",
            dis: `
            يختار المزيد من الأشخاص خدمة التوصيل أكثر من أي وقت مضى  
            ويجب أن يحذو نشاطك التجاري حذوها لتلبية توقعات العملاء المحتملين.
            و للبقاء قادرًا على المنافسة في الوقت الحالي يجب عليك 
            توفير الراحة التي يتوقعها عملائك منك.`,
          },
          3: {
            title: "3 . تعزيز تواجدك على الإنترنت ",
            dis: `
            نسبة مستخدمي الإنترنت للتسوق
            تزداد يوما بعد يوم وبات من 
            الإجباري خلق تواجد لنشاطك التجاري عليه.
            بالإضافة الى زيادة ثقت العملاء بك.`,
          },
          laziri: {
            title: "لماذا يجب عليك إستخدام ",
            problems: `
            إمتلاكك لمتجر إلكتروني يمر بعدة
            خطوات من توفير ميزانية كبيرة
            ثم إيجاد المبرمجين والمصممين والمسوقين
            الموثوقين إلى إكتساب ثقت العملاء 
            وهذا مايكلف الكثير من المال ,الجهد والوقت.`,
            solve: `
            هذه هي المشاكل التي قمنا بحلها, فيمكنك إنشاء متجرك في ثواني
            معدودة بالإضافة إلى أنك لن تحمل هم البحث عن
            العملاء فالتطبيق يحتوي على الكثير من المستخدين 
            النشطين الذين يمكنك أن تجعلهم عملاء لك.
            `,
          },
        },
      },
      employee: {
        center: "العمل",
        description: "نسعى لتوفير مناصب العمل وجعله أفضل من أي وقت مضى",
        subDescription:
          "سيتم إلغاء الخاصية في حالة لم يتم تسجيلك كعامل بعد 24 ساعة من تفعيلها",
        copyCode: 'قم بالظغط على " الرمز " لنسخ رمز العمل',
        quit: {
          title: "الإستقالة",
          confirm: "هل حقا تود الإستقالة من متجر {store}",
          process: "جاري الإستقالة ...",
        },
      },
      ads: {
        center: "الإعلانات",
        description: "أنت الأن في أفضل مكان لعرض إعلانك التجاري",
        subDescription:
          "نحن نعمل على إمكانية عرض إعلانك بشكل مباشر من المنصة ولكن هذا غير ممكن حاليا لذلك يرجى التواصل معنا لعرض إعلانك",
      },
    },
    login: {
      provider:
        'إضغط على " Google "  لتسجيل الدخول أو لإنشاء حساب جديد على التطبيق بإستعمال حسابك على جوجل',
      browser:
        "ينصح بإستعمال متصفح <br> <a class='uppercase'>G</a>oogle Chrome",
      policy: "بإنشاء حساب على هذا التطبيق فأنت موافق على سياسات إستعماله",
      logout: {
        title: "الخروج",
        confirm: "هل حقا تود تسجيل الخروج من حسابك ؟!",
        proces: "جاري الخروج ...",
      },
    },
    contactUs: {
      title: "التواصل معنا",
      toContactUs: "للتواصل معنا",
      desc: "نحن سعيدون بتواصلك معنا .. مرحبا بك في أي وقت",
      phone: "الهاتف",
    },
    homePage: {
      dis: "هو تطبيق يجمع لك المتاجر المتوفرة في منطقتك ويسمح لك بالشراء منها مباشرة عبر هاتفك",
    },
  },
  fr: {
    fixed: {
      hello: "Accueillir !",
      login: "entrée",
      loading: "Téléchargement ...",
      search: "rechercher dans",
      ad: "pub",
      bigPhoto: "choisissez une image dont la taille ne dépasse pas 5Mo",
      done: "félicitations !",
      add: "ajout",
      edit: "éditer",
      save: "enregistrer",
      cancel: "annuler",
      update: "mise à jour",
      upload: "charger",
      uploadFailed: "Échec de l'charger",
      uploadFailedDesc:
        "Un problème est survenu lors du chargement des données",
      uploading: "{value} % chargé",
      notRequired: "n'est pas obligatoire",
      ok: "ok",
      skip: "plus tard",
      yes: "oui",
      no: "no",
      activate: "activer",
      start: "Vas-y",
      enter: "entrez le",
      create: "créer",
      important: "Très important",
      tryAgain: "Réessayez plus tard",
      fillAllData: "Remplissez toutes les informations obligatoires",
      confirm: "confirmation",
      confirmData: "Êtes-vous sûr des informations saisies ?",
      install: "Installer l'application",
      installDesc:
        "Vous pouvez installer l'application Web comme n'importe quelle application sur votre appareil !",
      accountCreated: "Votre compte a été créé avec succès",
      notSupported: "Le navigateur n'est pas pris en charge",
      notSupportedDesc:
        "Ce navigateur ne peut pas exécuter l'application, veuillez changer de navigateur",
      delay:
        "L'apparition de {type} peut prendre quelques minutes pour certains utilisateurs",
      createdTime: "{type} créé le",
      price: "l'prix",
      uploaded: "{class} {type} avec succès",
      free: "Gratuite",
      back: "reculer",
      name: "nom et prénom",
      phone: "numéro de téléphone",
      alert: {
        name: "Vous devez entrer votre nom complet",
        phone: "Votre numéro de téléphone semble incomplet ou incorrect",
      },
      email: "e-mail",
      photoProces: "L'image est en cours de traitement...",
      slowPhoto:
        "Une taille d'image supérieure à 1 Mo peut affecter négativement les performances de votre boutique",
    },
    order: {
      single: "commande",
      group: "commandes",
      current: "commandes en cours",
      info: "Informations de la commande",
      empty: "il n'y a pas des commandes pour le moment",
      created: "la commande a été créée avec succès",
      createdCode: "la commande a le code {code}",
      new: "nouvelle commande",
      createdNofice: "vous avez une nouvelle commande avec le code {code}",
      code: "code",
      price: "prix",
      distance: "distance",
      delivery: {
        title: "Livraison",
        price: "Prix ​​de livraison",
        distance: "Distance de livraison",
        info: "Informations de livraison",
        place: "lieu de livraison",
        placeHolder: "Bien décrire le lieu de livraison",
        placeAlert: "Mieux décrire le lieu de livraison",
        direction: {
          title: "direction",
          info: "informations de direction",
          desc: "La carte peut parfois ne pas être correcte",
        },
      },
      total: "prix ​​total",
      status: {
        canceled: "annulé",
        delivered: "livré",
      },
      confirm: {
        cancel: "Voulez-vous vraiment annuler la commande ?!",
        delivery: "La commande a-t-elle vraiment été livrée avec succès ?",
      },
      note: {
        toStore: "Note au vendeur",
        fromBuyer: "Remarque de l'acheteur",
        fromYou: "votre note",
      },
      reject: "Vous n'êtes pas autorisé à accéder à la commande",
      error:
        "Il semble y avoir une erreur de réseau ou vous n'êtes pas autorisé à vous connecter aux étudiants",
      notExist: "Cette commande n'existe pas",
    },
    store: {
      single: "magasin",
      group: "magasins",
      mystore: "mon magasin",
      status: {
        title: "statut du magasin",
        open: "ouvert",
        close: "fermé",
        privet: "privé",
      },
      placeholder: "rechercher les magasins de votre zone",
      current: "magasins disponibles dans votre zone",
      empty: "il n'y a pas de magasins dans votre zone",
      close: "le magasin est actuellement fermé",
      photo: "cliquez ici pour changer l'image",
      name: "Nom du magasin",
      notAvailable: "cette magasin est actuellement indisponible",
      notExist: "ce magasin n'existe pas",
      privet: "la magasin est actuellement en mode privé",
      contact: "contacter le magasin",
      location: {
        title: "Emplacement du magasin",
        update: "Mettre à jour les coordonnées du magasin",
        UpdateDesc:
          "Ne mettez pas à jour les coordonnées sauf si vous êtes dans votre magasin .. Il est recommandé d'utiliser Google Maps pour vous en assurer",
      },
      sellerInfo: "information du vendeur",
      create: {
        sub: "Nous sommes actuellement en période d'essai, la création de la magasin est gratuite, il suffit de nous contacter pour l'activer",
        alert: {
          background: "Choisissez un arrière-plan pour votre magasin",
          logo: "Choisissez un logo pour votre magasin",
          name: "Choisissez un nom pour votre magasin",
        },
        contactUs: "Contactez nous pour activer votre magasin",
        phoneUsage: "Ce numéro sera utilisé pour contacter le magasin",
      },
      employee: {
        title: "employés du magasin",
        code: "code employé",
        name: "nom de l'employé",
      },
    },
    cart: {
      title: "panier",
      empty: "il n'y a aucun produit dans le panier de cette magasin",
      alert: {
        domain: "Portée du magasin",
        domainDesc:
          "Vous êtes trop loin de ce magasin donc vous ne pouvez pas y acheter",
        contact: "Vous pouvez commander au magasin par numéro de téléphone",
        close:
          "Le magasin est fermé donc vous ne pouvez pas en acheter pour le moment",
      },
    },
    product: {
      single: "produit",
      group: "produits",
      number: "nombre de produits",
      store: "produits du magasin",
      empty: "il n'y a aucun produit dans ce magasin pour le moment",
      notAvailable: "le produit n'est pas disponible actuellement",
      photo: "cliquez ici pour choisir une image du produit",
      choosePhoto: "Choisissez une image pour le produit",
      notExist: "ce produit n'est pas exist",
      privet: "Le produit est actuellement privé",
      quantity: "quantité",
      total: "prix ​​total pour ce produit",
      copyLink: "copier le lien du produit",
      status: {
        title: "état du produit",
        available: "disponible",
        notAvailable: "pas disponible",
        privet: "privé",
      },
      name: "nom du produit",
      price: "prix ​​du produit",
      priceGroup: "Prix ​​des produits",
      description: "description du produit",
      changeData:
        "les informations suivantes peuvent changer lorsque le produit sera disponible",
      unit: "unité",
      unsplash: `<a href="https://unsplash.com/" target="_blank">unsplash.com</a> peut vous aider à choisir des photos professionnelles pour votre produit`,
      errorLoading:
        "Un problème est survenu lors du téléchargement des données produit",
      delete: {
        title: "supprimer le produit",
        confirm: "Voulez-vous vraiment supprimer le produit ? !",
        fail: "Un problème est survenu lors de la suppression des données",
        process: "Produit en cours de suppression...",
        done: "Le produit a été supprimé avec succès",
      },
    },
    location: {
      title: "localiser le lieu",
      fail: "Échec de la localisation",
      require: "Veuillez autoriser et activer la géolocalisation",
      reject:
        "Nous ne serons pas en mesure de déterminer quels magasins sont disponibles dans votre zone à moins que la géolocalisation ne soit autorisée et activée",
      stores: {
        fail: "impossible de localiser les magasins disponibles dans votre zone en raison d'un problème de localisation",
      },
      create: {
        confirm:
          "Vos coordonnées de localisation actuelles seront chargées, alors assurez-vous que vous êtes dans votre magasin lorsque vous créez votre magasin ici",
        fail: "Vous ne pourrez pas créer votre magasin à moins que le positionnement ne soit autorisé et activé",
      },
      googleMaps:
        "Il est recommandé d'utiliser Google Maps pour vous assurer que",
    },
    notification: {
      title: "notification",
      ask: "Souhaitez-vous recevoir des notifications sur vos commandes ?",
      cannot:
        "Cet appareil ne peut pas recevoir de notifications d'applications Web",
      create: {
        fail: "Il y a un problème avec la réception des notifications",
        reject:
          "Vous ne pourrez pas créer votre magasin à moins d'autoriser et d'activer les notifications",
        require:
          "La réception des notifications doit être activée pour créer votre magasin",
        notSupported:
          "Cet appareil ne peut pas recevoir de notifications d'application Web, vous ne recevrez donc pas de notifications sur les commandes de votre magasin sur cet appareil",
      },
      store: {
        reject:
          "Vous ne pourrez pas entrer dans votre magasin si vous n'autorisez pas et n'activez pas la réception de notifications",
        require:
          "Vous devez accepter et activer la réception des notifications pour accéder à votre magasin",
      },
      askEmployee:
        "Vous avez activé la fonctionnalité d'emploie sur votre compte .. Souhaitez-vous recevoir des notifications sur les commandes en magasin ?",
    },
    business: {
      title: "Affaires",
      welcome: "Bienvenue parmi nous",
      store: {
        center: "Magasin",
        description:
          "Rejoignez-nous et créez votre magasin en ligne en quelques secondes .. Développez votre zone .. et interagissez avec vos clients",
        why: {
          title:
            "Pourquoi créer une magasin en ligne pour votre activité commerciale",
          1: {
            title: "1 . Atteignez plus de clients",
            dis: `
            En créant votre magasin en ligne, n'importe quel utilisateur 
            de l'application peut voir et inspecter vos produits, 
            ce qui double la possibilité d'augmenter le nombre de 
            vos clients et ainsi d'élargir la portée du travail et 
            d'augmenter vos ventes et donc d'augmenter les bénéfices.`,
          },
          2: {
            title: "2 . Offrir le confort que les clients attendent",
            dis: `
            Plus de personnes choisissent la livraison que jamais auparavant
            Et votre activité commerciale doit emboîter le pas pour 
            répondre aux attentes des clients potentiels.
            Et pour rester compétitif en ce moment, vous devez
            Offrir le confort que vos clients attendent de vous.`,
          },
          3: {
            title: "3 . Boostez votre présence en ligne",
            dis: `
            Pourcentage d'internautes à magasiner
            Il augmente de jour en jour et il est devenu plus
            Il est obligatoire d'y créer une présence pour votre activité commerciale.
            De plus, les clients voient que votre présence
            En ligne vous rend plus professionnel
            Cela augmente leur confiance en vous.`,
          },
          laziri: {
            title: "Pourquoi devriez-vous utiliser ",
            problems: `
            Posséder une magasin en ligne passe par plusieurs
            Étapes pour économiser un gros budget
            Trouvez ensuite des programmeurs, des concepteurs et des spécialistes du marketing
            Des personnes de confiance pour gagner la confiance des clients
            Cela coûte beaucoup d'argent, d'efforts et de temps.`,
            solve: `
            Ce sont les problèmes que nous avons résolus, vous 
            pouvez créer votre magasin en quelques secondes
            Numéroté plus vous n'aurez pas la peine de chercher
            Clients, l'application contient beaucoup d'utilisateurs
            Des personnes actives que vous pouvez faire de vos clients.`,
          },
        },
      },
      employee: {
        center: "Emploi",
        description:
          "Nous nous efforçons de fournir des emplois et de le rendre meilleur que jamais",
        subDescription:
          "La fonctionnalité sera annulée si vous n'êtes pas enregistré en tant que travailleur après 24 heures de son activation",
        copyCode: 'Cliquez sur "Code" pour copier le code de travail',
        quit: {
          title: "démissionner",
          confirm: "voulez-vous vraiment quitter {store}",
          process: "démissionnaire...",
        },
      },
      ads: {
        center: "Publicités",
        description:
          "Vous êtes maintenant au meilleur endroit que vous pouvez imaginer pour placer votre publicité",
        subDescription:
          "Nous travaillons sur la possibilité d'afficher votre annonce directement depuis la plateforme, mais cela n'est pas possible actuellement, veuillez donc nous contacter pour afficher votre annonce",
      },
    },
    login: {
      provider: `Cliquez sur " Google " pour vous connecter ou créez un nouveau compte sur l'application en utilisant votre compte Google`,
      browser:
        "Il est recommandé d'utiliser <br> <a class='uppercase'>G</a>oogle Chrome",
      policy:
        "En créant un compte sur cette application, vous acceptez ses politiques d'utilisation",
      logout: {
        title: "sortir",
        confirm: "Voulez-vous vraiment vous déconnecter de votre compte ? !",
        proces: "Sortie...",
      },
    },
    contactUs: {
      title: "Contactez-nous",
      toContactUs: "pour nous contacter",
      desc: "Nous sommes heureux de vous contacter .. vous êtes les bienvenus à tout moment",
      phone: "téléphone",
    },
    homePage: {
      dis: "Il s'agit d'une application qui collecte pour vous les magasins disponibles dans votre région et vous permet d'y acheter directement via votre téléphone",
    },
  },
};

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: localStorage.language ? localStorage.language : "ar", // set locale
  messages, // set locale messages
});

new Vue({
  router,
  render: (h) => h(App),
  i18n,
}).$mount("#app");
