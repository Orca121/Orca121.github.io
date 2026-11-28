(function () {
  var KEY = "pw-lang";
  var copy = {
    "zh-CN": {
      lang: "zh-CN",
      label: "简体中文",
      intro: "活着，爱着，赴宴去。",
      description: "Patrick Wong 的个人主页。",
      switcher: "语言",
      creditPrefix: "照片：",
      briefings: "简报",
      writings: "文字",
      sections: "栏目",
      home: "首页",
      places: "页面",
      pinned: "置顶",
      pager: "分页",
      previousPage: "上一页",
      nextPage: "下一页",
      lockLabel: "答案",
      lockSubmit: "解锁",
      lockError: "答案不对。",
      comments: "评论"
    },
    "zh-HK": {
      lang: "zh-HK",
      label: "繁體中文",
      intro: "活著，愛著，赴宴去。",
      description: "Patrick Wong 的個人主頁。",
      switcher: "語言",
      creditPrefix: "相片：",
      briefings: "簡報",
      writings: "文字",
      sections: "欄目",
      home: "首頁",
      places: "頁面",
      pinned: "置頂",
      pager: "分頁",
      previousPage: "上一頁",
      nextPage: "下一頁",
      lockLabel: "答案",
      lockSubmit: "解鎖",
      lockError: "答案不對。",
      comments: "評論"
    },
    en: {
      lang: "en",
      label: "English",
      intro: "Living, Loving, Party Going.",
      description: "Personal site of Patrick Wong.",
      switcher: "Language",
      creditPrefix: "Photo: ",
      briefings: "Briefings",
      writings: "Writings",
      sections: "Sections",
      home: "Home",
      places: "Pages",
      pinned: "Pinned",
      pager: "Pagination",
      previousPage: "Previous",
      nextPage: "Next",
      lockLabel: "Answer",
      lockSubmit: "Unlock",
      lockError: "Wrong answer.",
      comments: "Comments"
    }
  };

  var root = document.querySelector(".lang");
  var button = root.querySelector(".lang-button");
  var value = root.querySelector(".lang-value");
  var list = root.querySelector(".lang-list");
  var options = Array.prototype.slice.call(list.querySelectorAll("[role='option']"));
  var activeIndex = 0;

  function preferredLanguage() {
    try {
      var saved = localStorage.getItem(KEY);
      if (copy[saved]) return saved;
    } catch (error) {
      /* Storage can be blocked; use the default. */
    }
    return "en";
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
      if (!text[key]) continue;
      if (nodes[i].tagName === "IMG") nodes[i].alt = text[key];
      else nodes[i].textContent = text[key];
    }

    var labelled = document.querySelectorAll("[data-i18n-label]");
    for (var n = 0; n < labelled.length; n += 1) {
      var labelKey = labelled[n].getAttribute("data-i18n-label");
      if (text[labelKey]) labelled[n].setAttribute("aria-label", text[labelKey]);
    }

    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", text.description);

    for (var j = 0; j < options.length; j += 1) {
      var selected = options[j].getAttribute("data-lang") === text.lang;
      options[j].setAttribute("aria-selected", selected ? "true" : "false");
    }
    button.setAttribute("aria-activedescendant", options[indexOf(text.lang)].id);
    refreshCredit();
    refreshLockPrompt();
    refreshGiscus();
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

  var refreshCredit = function () {};
  var FRAME = "pw-frame";
  var FRAME_PATH = "pw-frame-path";

  function readFrame(area, count) {
    try {
      var storage = window[area];
      var n = parseInt(storage.getItem(FRAME), 10);
      if (n >= 0 && n < count) return n;
    } catch (error) {
      /* Storage can be blocked. */
    }
    return null;
  }

  function readFramePath(area) {
    try {
      return window[area].getItem(FRAME_PATH) || "";
    } catch (error) {
      /* Storage can be blocked. */
    }
    return "";
  }

  function rememberFrame(area, n, path) {
    try {
      var storage = window[area];
      storage.setItem(FRAME, String(n));
      storage.setItem(FRAME_PATH, path);
    } catch (error) {
      /* Ignore private-mode storage failures. */
    }
  }

  function isHomePath(path) {
    return path === "" || path === "/" || path === "/index.html";
  }

  function initGround() {
    var ground = document.querySelector(".ground");
    if (!ground) return;
    var nodes = ground.querySelectorAll(".ground-photo");
    if (!nodes.length) return;
    var still = ground.classList.contains("is-still");

    var photos = [
      {
        file: "/images/orca-pittman-jumping.jpg",
        credit: "Robert Pittman / NOAA",
        commons: "https://commons.wikimedia.org/wiki/File:Killerwhales_jumping.jpg"
      },
      {
        file: "/images/orca-noaa-pair.jpg",
        credit: "NOAA Photo Library",
        commons: "https://commons.wikimedia.org/wiki/File:Anim1102_-_Flickr_-_NOAA_Photo_Library.jpg"
      },
      {
        file: "/images/orca-dorsal.jpg",
        credit: "Shannon Rankin / NOAA",
        commons: "https://commons.wikimedia.org/wiki/File:Orcinus_orca_NOAA_Photo_Library.jpg"
      },
      {
        file: "/images/orca-shimada-surface.jpg",
        credit: "Allen Shimada / NOAA",
        commons: "https://commons.wikimedia.org/wiki/File:Anim1133_-_Flickr_-_NOAA_Photo_Library.jpg"
      },
      {
        file: "/images/orca-shimada-birds.jpg",
        credit: "Allen Shimada / NOAA",
        commons: "https://commons.wikimedia.org/wiki/File:Anim1125_-_Flickr_-_NOAA_Photo_Library.jpg"
      },
      {
        file: "/images/orca-shimada-wake.jpg",
        credit: "Allen Shimada / NOAA",
        commons: "https://commons.wikimedia.org/wiki/File:Anim1130_-_Flickr_-_NOAA_Photo_Library.jpg"
      }
    ];
    var credit = document.querySelector(".credit");
    var index;
    if (still) {
      var sessionFrame = readFrame("sessionStorage", photos.length);
      var localFrame = readFrame("localStorage", photos.length);
      var storedFrame = sessionFrame;
      var storedArea = "sessionStorage";
      if (storedFrame === null) {
        storedFrame = localFrame;
        storedArea = "localStorage";
      }
      if (storedFrame === null) {
        index = Math.floor(Math.random() * photos.length);
      } else if (isHomePath(readFramePath(storedArea))) {
        index = storedFrame;
      } else {
        index = (storedFrame + 1) % photos.length;
      }
      rememberFrame("sessionStorage", index, location.pathname);
      if (sessionFrame === null && localFrame === null) {
        rememberFrame("localStorage", index, location.pathname);
      }
    } else {
      var previous = readFrame("localStorage", photos.length);
      if (previous === null) previous = readFrame("sessionStorage", photos.length);
      index = previous === null ? Math.floor(Math.random() * photos.length) : (previous + 1) % photos.length;
      rememberFrame("sessionStorage", index, "/");
      rememberFrame("localStorage", index, "/");
    }
    var shown = 0;
    var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var timer = 0;
    var hold = 18000;

    function paint(node, photo) {
      node.style.backgroundImage = 'url("' + photo.file + '")';
    }

    function preload(file) {
      var img = new Image();
      img.decoding = "async";
      img.src = file;
    }

    refreshCredit = function () {
      if (!credit) return;
      var photo = photos[index];
      var text = copy[document.documentElement.lang] || copy["zh-CN"];
      credit.textContent = text.creditPrefix + photo.credit;
      credit.setAttribute("href", photo.commons);
    };

    paint(nodes[0], photos[index]);
    nodes[0].classList.add("is-on");
    refreshCredit();
    preload(photos[index].file);
    if (still) return;

    var queue = [];
    var cursor = 0;
    for (var i = 1; i < photos.length; i += 1) queue.push(photos[(index + i) % photos.length].file);
    function preloadNext() {
      if (cursor >= queue.length) return;
      preload(queue[cursor]);
      cursor += 1;
      if (cursor < queue.length) window.setTimeout(preloadNext, 240);
    }
    window.setTimeout(preloadNext, 160);

    function advance() {
      var next = (index + 1) % photos.length;
      rememberFrame("sessionStorage", next, "/");
      rememberFrame("localStorage", next, "/");
      var incoming = shown === 0 ? 1 : 0;
      var outgoing = shown;
      paint(nodes[incoming], photos[next]);
      nodes[incoming].style.zIndex = "2";
      nodes[outgoing].style.zIndex = "1";
      nodes[incoming].classList.add("is-on");
      window.setTimeout(function () {
        nodes[outgoing].classList.remove("is-on");
        index = next;
        shown = incoming;
        refreshCredit();
      }, 3400);
    }

    function arm() {
      if (timer || motion.matches) return;
      timer = window.setInterval(advance, hold);
    }

    function disarm() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = 0;
    }

    if (!motion.matches) arm();
    if (motion.addEventListener) {
      motion.addEventListener("change", function () {
        if (motion.matches) disarm();
        else arm();
      });
    }
  }

  /* Article lock (soft gate for casual readers) */
  var lockArticle = document.querySelector("article[data-locked]");
  var unlockedState = !lockArticle;

  var pickedLockQuestion = null;
  var LOCK_BANK = [
    {
      id: "roman-poet",
      answer: "Catullus",
      prompts: {
        en: "Who is the site owner's favorite ancient Roman poet?",
        "zh-CN": "网站主人最爱的古罗马诗人是谁？",
        "zh-HK": "網站主人最愛的古羅馬詩人是誰？"
      }
    },
    {
      id: "italian-poet",
      answer: "Giacomo Leopardi",
      prompts: {
        en: "Who is the site owner's favorite Italian-language poet?",
        "zh-CN": "网站主人最爱的意大利语诗人是谁？",
        "zh-HK": "網站主人最愛的意大利語詩人是誰？"
      }
    }
  ];

  function decodeLock(value) {
    return decodeURIComponent(String(value || "").replace(/\+/g, "%20"));
  }

  function currentLang() {
    return document.documentElement.lang || "en";
  }

  function lockQuestionKey() {
    return "pw-lock-question:" + location.pathname;
  }

  function findLockQuestion(id) {
    for (var i = 0; i < LOCK_BANK.length; i += 1) {
      if (LOCK_BANK[i].id === id) return LOCK_BANK[i];
    }
    return null;
  }

  function chosenLockQuestion() {
    if (!lockArticle) return null;
    if (pickedLockQuestion) return pickedLockQuestion;
    var key = lockQuestionKey();
    var stored = null;
    try {
      stored = sessionStorage.getItem(key);
    } catch (error) {
      /* Storage can be blocked. */
    }
    var question = findLockQuestion(stored);
    if (!question) {
      question = LOCK_BANK[Math.floor(Math.random() * LOCK_BANK.length)];
    }
    pickedLockQuestion = question;
    try {
      sessionStorage.setItem(key, question.id);
    } catch (error) {
      /* Ignore private-mode storage failures. */
    }
    return question;
  }

  function refreshLockPrompt() {
    if (!lockArticle) return;
    var prompt = document.getElementById("lock-prompt");
    if (!prompt) return;
    var question = chosenLockQuestion();
    if (!question) return;
    var lang = currentLang();
    prompt.textContent = question.prompts[lang] || question.prompts.en || "";
  }

  function isUnlocked() {
    return unlockedState;
  }

  function revealLockedArticle() {
    if (!lockArticle || unlockedState) return;
    unlockedState = true;
    var body = document.getElementById("article-body");
    var payload = document.getElementById("locked-body");
    if (body && payload) {
      body.innerHTML = decodeLock(payload.textContent);
      body.hidden = false;
    }
    var lock = document.getElementById("lock");
    if (lock) lock.hidden = true;
    try {
      sessionStorage.setItem("pw-unlocked:" + location.pathname, "1");
    } catch (error) {
      /* Ignore private-mode storage failures. */
    }
    loadGiscus();
  }

  function initLock() {
    if (!lockArticle) return;
    var form = document.getElementById("lock-form");
    var input = document.getElementById("lock-answer");
    var error = document.getElementById("lock-error");
    if (!form || !input) return;

    var question = chosenLockQuestion();
    var expected = question ? decodeLock(question.answer) : "";

    var saved = false;
    try {
      saved = sessionStorage.getItem("pw-unlocked:" + location.pathname) === "1";
    } catch (error) {
      /* Storage can be blocked. */
    }
    if (saved) {
      revealLockedArticle();
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var given = (input.value || "").replace(/^\s+|\s+$/g, "").toLowerCase();
      var want = expected.replace(/^\s+|\s+$/g, "").toLowerCase();
      if (given === want) {
        revealLockedArticle();
      } else if (error) {
        error.hidden = false;
        input.select();
      }
    });

    refreshLockPrompt();
  }

  /* giscus comments */
  var commentsSection = document.getElementById("comments");
  var giscusLoaded = false;

  function giscusLang(lang) {
    if (lang === "zh-CN") return "zh-CN";
    if (lang === "zh-HK") return "zh-TW";
    return "en";
  }

  function giscusConfigured() {
    if (!commentsSection) return false;
    return (
      (commentsSection.getAttribute("data-giscus-repo-id") || "") !== "" &&
      (commentsSection.getAttribute("data-giscus-category-id") || "") !== ""
    );
  }

  function loadGiscus(force) {
    if (!commentsSection) return;
    if (!giscusConfigured() || !isUnlocked()) {
      commentsSection.hidden = true;
      return;
    }
    if (giscusLoaded && !force) return;
    commentsSection.hidden = false;
    commentsSection.innerHTML = "";
    var script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", commentsSection.getAttribute("data-giscus-repo"));
    script.setAttribute("data-repo-id", commentsSection.getAttribute("data-giscus-repo-id"));
    script.setAttribute("data-category", commentsSection.getAttribute("data-giscus-category"));
    script.setAttribute("data-category-id", commentsSection.getAttribute("data-giscus-category-id"));
    script.setAttribute("data-mapping", commentsSection.getAttribute("data-giscus-mapping"));
    script.setAttribute("data-strict", commentsSection.getAttribute("data-giscus-strict"));
    script.setAttribute("data-reactions-enabled", commentsSection.getAttribute("data-giscus-reactions-enabled"));
    script.setAttribute("data-emit-metadata", commentsSection.getAttribute("data-giscus-emit-metadata"));
    script.setAttribute("data-input-position", commentsSection.getAttribute("data-giscus-input-position"));
    script.setAttribute("data-theme", commentsSection.getAttribute("data-giscus-theme"));
    script.setAttribute("data-lang", giscusLang(currentLang()));
    commentsSection.appendChild(script);
    giscusLoaded = true;
  }

  function refreshGiscus() {
    loadGiscus(true);
  }

  apply(preferredLanguage());
  initGround();
  initLock();
})();
