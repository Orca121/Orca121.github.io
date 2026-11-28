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

  function readFrame(count) {
    try {
      var n = parseInt(sessionStorage.getItem(FRAME), 10);
      if (n >= 0 && n < count) return n;
    } catch (error) {
      /* Storage can be blocked. */
    }
    return null;
  }

  function rememberFrame(n) {
    try {
      sessionStorage.setItem(FRAME, String(n));
    } catch (error) {
      /* Ignore private-mode storage failures. */
    }
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
    var stored = readFrame(photos.length);
    var index = stored === null ? Math.floor(Math.random() * photos.length) : stored;
    rememberFrame(index);
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
      rememberFrame(next);
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

  function decodeLock(value) {
    return decodeURIComponent(String(value || "").replace(/\+/g, "%20"));
  }

  function currentLang() {
    return document.documentElement.lang || "en";
  }

  function refreshLockPrompt() {
    if (!lockArticle) return;
    var prompt = document.getElementById("lock-prompt");
    if (!prompt) return;
    var lang = currentLang();
    prompt.textContent =
      lockArticle.getAttribute("data-lock-prompt-" + lang) ||
      lockArticle.getAttribute("data-lock-prompt-en") ||
      "";
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

    var expected = decodeLock(lockArticle.getAttribute("data-lock-answer"));

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
