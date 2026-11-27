(function () {
  var KEY = "pw-lang";
  var copy = {
    "zh-CN": {
      lang: "zh-CN",
      label: "简体中文",
      intro: "这段简介可以替换。",
      description: "Patrick Wong 的个人主页。",
      switcher: "语言"
    },
    "zh-HK": {
      lang: "zh-HK",
      label: "繁體中文",
      intro: "這段簡介可以替換。",
      description: "Patrick Wong 的個人主頁。",
      switcher: "語言"
    },
    en: {
      lang: "en",
      label: "English",
      intro: "This introduction can be replaced.",
      description: "Personal site of Patrick Wong.",
      switcher: "Language"
    }
  };

  var root = document.querySelector(".lang");
  var button = root.querySelector(".lang-button");
  var value = root.querySelector(".lang-value");
  var list = root.querySelector(".lang-list");
  var options = Array.prototype.slice.call(list.querySelectorAll("[role='option']"));
  var activeIndex = 0;

  function matchLanguage(tag) {
    var text = String(tag || "").toLowerCase().replace(/_/g, "-");
    if (text === "en" || text.indexOf("en-") === 0) return "en";
    if (
      text === "zh-hk" ||
      text.indexOf("zh-hk-") === 0 ||
      text === "zh-hant-hk" ||
      text.indexOf("zh-hant-hk-") === 0 ||
      text === "yue" ||
      text === "yue-hk" ||
      text.indexOf("yue-hk-") === 0 ||
      text === "yue-hant" ||
      text.indexOf("yue-hant-") === 0
    ) {
      return "zh-HK";
    }
    if (
      text === "zh" ||
      text === "zh-cn" ||
      text.indexOf("zh-cn-") === 0 ||
      text === "zh-hans" ||
      text.indexOf("zh-hans-") === 0
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

    var listOfLanguages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];
    for (var i = 0; i < listOfLanguages.length; i += 1) {
      var match = matchLanguage(listOfLanguages[i]);
      if (match) return match;
    }
    return "zh-CN";
  }

  function indexOf(lang) {
    for (var i = 0; i < options.length; i += 1) {
      if (options[i].getAttribute("data-lang") === lang) return i;
    }
    return 0;
  }

  function apply(lang) {
    var text = copy[lang] || copy["zh-CN"];
    document.documentElement.lang = text.lang;
    value.textContent = text.label;
    button.setAttribute("aria-label", text.switcher);
    list.setAttribute("aria-label", text.switcher);

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i += 1) {
      var key = nodes[i].getAttribute("data-i18n");
      if (text[key]) nodes[i].textContent = text[key];
    }

    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", text.description);

    for (var j = 0; j < options.length; j += 1) {
      var selected = options[j].getAttribute("data-lang") === text.lang;
      options[j].setAttribute("aria-selected", selected ? "true" : "false");
    }
    button.setAttribute("aria-activedescendant", options[indexOf(text.lang)].id);
  }

  function remember(lang) {
    try {
      localStorage.setItem(KEY, lang);
    } catch (error) {
      /* Ignore private-mode storage failures. */
    }
  }

  function setActive(index) {
    activeIndex = (index + options.length) % options.length;
    for (var i = 0; i < options.length; i += 1) {
      options[i].classList.toggle("is-active", i === activeIndex);
    }
    button.setAttribute("aria-activedescendant", options[activeIndex].id);
  }

  function openList() {
    list.hidden = false;
    button.setAttribute("aria-expanded", "true");
    setActive(indexOf(document.documentElement.lang));
  }

  function closeList() {
    list.hidden = true;
    button.setAttribute("aria-expanded", "false");
    for (var i = 0; i < options.length; i += 1) {
      options[i].classList.remove("is-active");
    }
  }

  function choose(lang) {
    if (!copy[lang]) return;
    remember(lang);
    apply(lang);
    closeList();
  }

  button.addEventListener("click", function () {
    if (list.hidden) openList();
    else closeList();
  });

  button.addEventListener("keydown", function (event) {
    if (list.hidden) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openList();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(options.length - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeList();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(options[activeIndex].getAttribute("data-lang"));
    } else if (event.key === "Tab") {
      closeList();
    }
  });

  options.forEach(function (option, index) {
    option.addEventListener("click", function () {
      choose(option.getAttribute("data-lang"));
    });
    option.addEventListener("mousemove", function () {
      if (!list.hidden) setActive(index);
    });
  });

  document.addEventListener("click", function (event) {
    if (!root.contains(event.target)) closeList();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !list.hidden) closeList();
  });

  apply(preferredLanguage());
})();
