# Patrick Wong 的个人主页

这是 Patrick Wong 的个人网站，页面为简体中文、香港繁体中文和英文。第一次打开为英文。在语言菜单里选过的语言会记住。

线上地址：<https://orca121.github.io>

首页是白底黑字：名字靠左，一句简介，页眉角落里的语言下拉菜单和两个栏目名称，以及很淡的彩色全幅照片。照片是 NOAA 的公有领域作品，在首页缓缓交替。简报和文字用同一张海面，停在离开首页时的那一张；直接打开这些页面时，随机停在其中一张。页内用两行浮动的字回到首页或去往另一栏。页面上没有仓库或 Git 链接。

## 站点文件

GitHub Pages 用 Jekyll 从 `master` 根目录发布。首页仍是手写的 `index.html`。简报和文字的正文是 Markdown。

| 文件 | 作用 |
| --- | --- |
| `index.html` | 首页 |
| `styles.css` | 样式 |
| `site.js` | 语言下拉菜单、背景照片、文章上锁和 giscus 评论。语言选择保存在 `localStorage`（键名 `pw-lang`）。没有保存过的选择时，页面用英文。同一次访问里，当前照片记在 `sessionStorage`（键名 `pw-frame`）：首页交替时更新，阅读页只读取并停住。解锁状态记在 `sessionStorage`（键名 `pw-unlocked:路径`），刷新同一标签页不会再问 |
| `icon.svg` | 浏览器标签上的字母标记 |
| `images/` | 六张彩色照片，公有领域 |
| `_briefings/` | 简报的 Markdown。每篇需有标题、日期、作者 Stanley、`kind`（`daily` 或 `weekly`） |
| `_writings/` | 文字的 Markdown。每篇需有标题和日期 |
| `_layouts/` `_includes/` `_config.yml` | Jekyll 的版式 |

三种语言的界面文案在 `site.js` 的 `copy` 里。正文保持写作时的语言，不随界面翻译。名字 Patrick Wong 三种语言都保留。

## 如何新增一篇

在 `_briefings/` 或 `_writings/` 放一个 `.md` 文件，开头写上 front matter，然后提交并推送到 `master`。文件名会成为网址的一段，例如 `_briefings/2026-11-27-note.md` 对应 `/briefings/2026-11-27-note/`。不需要在本地先生成 HTML。

简报示例：

```yaml
---
title: 标题
date: 2026-11-27
author: Stanley
kind: daily
dek: 一句提要，可省略
lang: zh-CN
---
```

## 置顶

在 front matter 里写 `pinned: true`，这篇就会排在简报或文字列表的最前面。置顶之间仍按日期从新到旧，其余篇目照常按日期从新到旧。标题旁会有一个不起眼的「Pinned / 置顶 / 置頂」字样。

```yaml
---
title: 标题
date: 2026-11-25
pinned: true
---
```

## 上锁（软门槛）

在 front matter 里写一个非空字符串 `lock:`，并给出三种语言的问题 `lock_prompt`：

```yaml
---
lock: Catullus
lock_prompt:
  en: Who is the site owner's favorite ancient Roman poet?
  zh-CN: 网站主人最爱的古罗马诗人是谁？
  zh-HK: 網站主人最愛的古羅馬詩人是誰？
---
```

标题、日期和作者仍然可见，正文和评论区在答对问题前隐藏。答案按「去掉首尾空白、忽略大小写」比较；`lock: true` 这类 YAML 布尔值不是有效答案，空值或不写 `lock` 表示不上锁。

这不是真正的安全：仓库里仍然有原文和答案；构建出来的 HTML 只是把正文用 `url_encode` 混淆，View Source 看不到可读正文，但拿到源码的人仍能还原。它只是一个挡住随手读者的软门槛。

## giscus 评论

评论只出现在单篇文章页，首页和列表页没有。上锁的文章解锁后才加载评论。现在 `_config.yml` 的 `giscus` 里 `category` 和 `category_id` 还是空的，所以页面不会发出评论脚本，也不会出现坏掉的部件。要启用：

1. 在仓库开启 Discussions，并按 giscus 官网的引导安装 giscus GitHub App。
2. 新建（或选择）一个 Discussion 分类。
3. 把分类名和分类 ID 填进 `_config.yml` 的 `giscus` 下：`category` 填分类名，`category_id` 填分类 ID。
4. 提交并推送到 `master`，重新发布后即可生效。评论语言跟随站点语言：en → en，zh-CN → zh-CN，zh-HK → zh-TW（giscus 没有 zh-HK）。

## 如何发布

GitHub Pages 从默认分支 `master` 的根目录（`/`）发布，并由 Jekyll 生成简报和文字页面。

1. 修改页面或新增 Markdown。
2. 把改动提交并推送到 `master`。
3. 站点会自动重新发布。通常几分钟后可以在 <https://orca121.github.io> 看到更新。

发布状态在仓库的 **Settings → Pages**。来源应为 **Deploy from a branch**，分支选 `master`，文件夹选 `/ (root)`。

## 本地预览

安装 Jekyll 3.9 后，在仓库根目录运行：

```bash
jekyll serve
```

然后打开 <http://127.0.0.1:4000>。
