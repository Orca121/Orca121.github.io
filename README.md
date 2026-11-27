# Patrick Wong 的个人主页

这是 Patrick Wong 的个人网站，页面为简体中文、香港繁体中文和英文。

线上地址：<https://orca121.github.io>

对外页面是黑白的：名字、一段可替换的简介、页眉里的语言下拉菜单，以及一枚很小的虎鲸剪影。页面上没有仓库或 Git 链接。

## 站点文件

页面是放在仓库根目录的纯静态文件，不需要安装依赖，也不需要构建：

| 文件 | 作用 |
| --- | --- |
| `index.html` | 首页 |
| `styles.css` | 样式 |
| `site.js` | 语言下拉菜单。选择保存在 `localStorage`（键名 `pw-lang`）；第一次打开时，若浏览器语言明确是简体中文、香港中文或英文，则跟随浏览器 |
| `icon.svg` | 浏览器标签图标，一枚很小的虎鲸 |
| `.nojekyll` | 让 GitHub Pages 按原样提供这些文件，不经过 Jekyll |

三种语言的文案在 `site.js` 的 `copy` 里。名字 Patrick Wong 三种语言都保留。

## 如何发布

GitHub Pages 从默认分支 `master` 的根目录（`/`）发布。

1. 修改页面文件。
2. 把改动提交并推送到 `master`。
3. 站点会自动重新发布。通常几分钟后可以在 <https://orca121.github.io> 看到更新。

发布状态在仓库的 **Settings → Pages**。来源应为 **Deploy from a branch**，分支选 `master`，文件夹选 `/ (root)`。

## 本地预览

在仓库根目录启动一个静态文件服务器：

```bash
python3 -m http.server 8080
```

然后打开 <http://localhost:8080>。
