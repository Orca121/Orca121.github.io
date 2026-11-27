# Patrick Wong 的个人主页

这是 [Patrick Wong](https://github.com/Orca121)（GitHub：[@Orca121](https://github.com/Orca121)）的个人 GitHub Pages 站点。

线上地址：<https://orca121.github.io>

## 站点文件

页面是放在仓库根目录的纯静态文件，不需要安装依赖，也不需要构建：

| 文件 | 作用 |
| --- | --- |
| `index.html` | 首页 |
| `styles.css` | 样式 |
| `favicon.svg` | 浏览器标签图标 |
| `.nojekyll` | 让 GitHub Pages 按原样提供这些文件，不经过 Jekyll |

首页目前只放了名字、一段可以随时改写的简介，以及 GitHub 主页链接。直接编辑 `index.html` 里的文字即可。

## 如何发布

GitHub Pages 从默认分支 `master` 的根目录（`/`）发布。

1. 修改 `index.html` 或 `styles.css`。
2. 把改动提交并推送到 `master`。
3. GitHub 会自动重新发布。通常几分钟后可以在 <https://orca121.github.io> 看到更新。

发布状态在仓库的 **Settings → Pages**。来源应为 **Deploy from a branch**，分支选 `master`，文件夹选 `/ (root)`。

## 本地预览

在仓库根目录启动一个静态文件服务器：

```bash
python3 -m http.server 8080
```

然后打开 <http://localhost:8080>。
