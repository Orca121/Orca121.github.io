(function () {
  var KEY = "pw-lang";
  var copy = {
    "zh-CN": {
      lang: "zh-CN",
      eyebrow: "个人主页",
      intro: "这段简介可以替换。",
      description: "Patrick Wong 的个人主页。",
      switcher: "语言"
    },
    "zh-HK": {
      lang: "zh-HK",
      eyebrow: "個人主頁",
      intro: "這段簡介可以替換。",
      description: "Patrick Wong 的個人主頁。",
      switcher: "語言"
    },
    en: {
      lang: "en",
      eyebrow: "Personal site",
      intro: "This introduction can be replaced.",
      description: "Personal site of Patrick Wong.",
      switcher: "Language"
    }
  };

  function matchLanguage(tag) {
    var value = String(tag || "").toLowerCase().replace(/_/g, "-");
    if (value === "en" || value.indexOf("en-") === 0) return "en";
    if (
      value === "zh-hk" ||
      value.indexOf("zh-hk-") === 0 ||
      value === "zh-hant-hk" ||
      value.indexOf("zh-hant-hk-") === 0 ||
      value === "yue" ||
      value === "yue-hk" ||
      value.indexOf("yue-hk-") === 0 ||
      value === "yue-hant" ||
      value.indexOf("yue-hant-") === 0
    ) {
      return "zh-HK";
    }
    if (
      value === "zh" ||
      value === "zh-cn" ||
      value.indexOf("zh-cn-") === 0 ||
      value === "zh-hans" ||
      value.indexOf("zh-hans-") === 0
    ) {
      return "zh-CN";
    }
    return "";
  }

  function preferredLanguage() {
    try {
      var saved = localStorage.getItem(KEY);
      if (copy[saved]) return saved;
    } catch (error) {
      /* Storage can be blocked; fall through to the browser language. */
    }

    var list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];
    for (var i = 0; i < list.length; i += 1) {
      var match = matchLanguage(list[i]);
      if (match) return match;
    }
    return "zh-CN";
  }

  function apply(lang) {
    var text = copy[lang] || copy["zh-CN"];
    document.documentElement.lang = text.lang;

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i += 1) {
      var key = nodes[i].getAttribute("data-i18n");
      if (text[key]) nodes[i].textContent = text[key];
    }

    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", text.description);

    var switcher = document.querySelector(".langs");
    if (switcher) switcher.setAttribute("aria-label", text.switcher);

    var buttons = document.querySelectorAll(".langs button");
    for (var j = 0; j < buttons.length; j += 1) {
      var selected = buttons[j].getAttribute("data-lang") === text.lang;
      buttons[j].setAttribute("aria-pressed", selected ? "true" : "false");
    }
  }

  function remember(lang) {
    try {
      localStorage.setItem(KEY, lang);
    } catch (error) {
      /* Ignore private-mode storage failures. */
    }
  }

  var buttons = document.querySelectorAll(".langs button");
  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener("click", function (event) {
      var lang = event.currentTarget.getAttribute("data-lang");
      if (!copy[lang]) return;
      remember(lang);
      apply(lang);
    });
  }

  apply(preferredLanguage());
})();
