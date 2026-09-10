# Applicant Desk — U.S. Graduate Applications

一个面向美国硕士申请的个人资料台，以及一个可复用到其他网页表单的本地 Chrome 自动填表扩展。

## 适合当前申请组合的内容

- Columbia MSM
- USC MS Marketing
- Northwestern IMC
- M2M HEC–Yale
- Brown PRIME

## 功能

- Profile：姓名、联系方式、三类地址、当前所在地、美国签证状态
- Education：本科、交换经历、学位、专业、GPA 和成绩制
- Tests & English：GRE/GMAT、TOEFL/IELTS、送分记录
- References：推荐人联系方式、关系和使用场景
- Applications：项目、申请系统、目标轮次/截止日期、状态和备注
- Copy：单字段复制，方便粘贴到学校网申
- Save profile：保存在当前浏览器设备的 local storage
- Export / Import backup：导出或恢复 JSON 备份
- 通用字段规则：支持标准 `autocomplete`、标签和自定义字段 JSON

## 本地运行

在本目录运行：

```bash
python3 -m http.server 18765
```

然后打开 <http://127.0.0.1:18765/>。

也可以直接打开 `index.html`，但使用本地服务器更稳定。

## Chrome 自动填表扩展

项目同时包含 `extension/` 目录。安装一次后，在 Chrome 打开 `chrome://extensions`，打开右上角「开发者模式」，点击「加载已解压的扩展程序」，选择本项目的 `extension` 文件夹。

第一次使用时：

1. 在 Applicant Desk 点击 **Export backup**，导出 JSON。
2. 点击 Chrome 工具栏里的 Applicant Desk Autofill。
3. 选择 **Import Applicant Desk backup**，导入刚才的 JSON。
4. 打开学校网申页面，点击扩展里的 **Fill this page**。

扩展会根据字段名、标签、placeholder 和 autocomplete 识别常见的姓名、邮箱、电话、地址、国籍、教育、成绩和推荐人字段。其他场景可以在 **Custom field values (JSON)** 中添加自己的字段别名和值。已有内容默认跳过，避免覆盖你手动填写的答案。

扩展只在你点击 **Fill this page** 后访问当前页面，使用 `activeTab` 临时权限；它没有 `<all_urls>`、远程代码、后台服务器或分析脚本。

### 打包发布

运行：

```bash
./package-extension.sh
```

生成的 ZIP 可以用于 Chrome Web Store 上传，也可以作为 GitHub Release 附件。发布前请同步检查 [PRIVACY.md](PRIVACY.md) 与商店后台的 Privacy practices 声明。

如果启用 GitHub Pages，根目录的 [privacy.html](privacy.html) 可以作为 Chrome Web Store 的隐私政策链接。

## 隐私

资料默认只保存在当前浏览器设备，不会自动上传到网盘或第三方服务。导出备份后请把 JSON 文件当作个人敏感资料保存。

## 说明

项目表中的轮次和日期是申请规划用的初始值，提交前仍应以学校当年的官方页面为准。
