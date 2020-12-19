portal-cli
> 前端脚手架命令工具

如何安装
```
npm install portal-cli -g
```

初始化命令
```
portal-cli init <projectName>
// 直接回车

或者
portal-cli  i <projectName>
```

版本号查看
```
portal-cli -v
```

## 脚手架说明文档：前端脚手架CLI生成模版命令工具（包括，npm包的发布，脚手架的搭建，注意事项，优化等）
NodeJs的出现，让前端工程化的理念不断深入，正在向正规军靠近。先是带来了Gulp、Webpack等强大的构建工具，随后又出现了vue-cli和create-react-app等完善的脚手架，提供了完整的项目架构，让我们可以更多的关注业务，而不必在项目基础设施上花费大量时间。

平时我们都只专注在业务上的开发，拿起一套开箱即用的模板项目就直接干。但是，这些现成的脚手架未必就能满足我们的业务需求，也未必是最佳实践，这时我们就可以自己开发一个脚手架，那么我们使用的脚手架里面到底做了什么，如何自己搭建脚手架呢？

以下为正文，文章结构：

![](quiver-image-url/CC22E6C301F6BB7C330C520A9DE29C18.jpg)

## 提问

**1.脚手架需要实现什么？**
 答：初始化项目模版能力。

**2.脚手架需要什么功能？**
 答：1. 问询功能 2.下载模版（模版与脚手架分离，互不影响）3.写入模版 4.优化（git初始化，安装依赖等）

**3.用什么工具实现？**

* commander.js 命令行工具
* chalk 命令行输出样式美化
* Inquirer.js 命令行交互

当然还有，download-git-repo git仓库代码下载，ora 命令行加载中效果等优化依赖工具，都可以在此基础上，进行丰富。

以下分为两步完成：一，本地创建cli脚手架并测试 ；二，发布脚手架

**我们正常的流程是创建本地脚手架，绑定git仓库，发布包，从易到难，我们反过来，本文先讲怎么发一个最简单的npm包，然后把脚手架搭好了，走一遍发包流程，就OK了。**

## 一、发布npm包

### 本地创建项目

首先，我们需要创建一个项目，这里就叫portal-cli, 项目结构如下：

```
- commands  // 此文件夹用于放置自定义命令
- utils
- index.js  // 项目入口
- readme.md

```

为了测试，我们先在index.js放点内容：

```
#!/usr/bin/env node
// 必须在文件头添加如上内容指定运行环境为node
console.log('hello cli');

```

对于一般的nodejs项目，我们直接使用node index.js就可以了，但是这里是脚手架，肯定不能这样。我们需要把项目发布到npm，用户进行全局安装，然后就可以直接使用我们自定义的命令，类似portal-cli这样。

所以，我们需要将我们的项目做下改动，首先在package.json中添加如下内容：

```
 "bin": {
    "portal-cli": "index.js"
  },

```

这样就可以将portal-cli定义为一个命令了，但此时仅仅只能在项目中使用，还不能作为全局命令使用，这里我们需要使用npm link将其链接到全局命令，执行成功后在你的全局node\_modules目录下可以找到相应文件。然后输入命令测试一下，如果出现如下内容说明第一步已经成功一大半了：

```
anna@annadeMacBook-Air job % > portal-cli
 hello cli

```

*如果全局有bin相同名字的，会报错，需要把package.json里面bin起的名字修改一下

### 发布npm包注意事项：

1. npm官网注册一个npm账户，已有账户的可以跳过这一步
2. 使用`npm login`登录，需要输入`username`、`password`、`email`
3. `npm whoami` 检查自己是否成功登陆
4. `npm link`本地调试,上面已经调试的，跳过这一步
5. 使用`npm publish`发布
6. 每次发布npm包，都要修改版本号


```
//npm publish报错
npm notice integrity:     sha512-Jkfy0M/VyAkQb[...]B9Ifdw2hF2CGQ==
npm notice total files:   7                                       
npm notice 
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT http://registry.npmjs.org/portal-portal-cli-hourong - Forbidden
npm ERR! 403 In most cases, you or one of your dependencies are requesting
npm ERR! 403 a package version that is forbidden by your security policy.
```

我发布包的时候，调整了几次，报错，不是403就是404，那个捉急。
 下面总结了几个报错检查清单：

* 1. 检查npm包的名字跟已有的包名是否重复，要么就改个名字，或者加后缀
* 2. 如果用的是cnpm源，要改成npm，方法见下面说明registry
* 3. 如果还是报403，你的账号看是不是刚刚注册的，如果是的话，需要进入你的邮箱，验证一下邮箱。
* 4. 版本号是否更新
* 5. 如果以上3步修改了，还是报403错误，就连接手机4g热点再发布一下。

一般发布不了，按照以上5点进行检查，可以解决。

**检查第2步npm源的方法**
 `查看本地当前使用的registry npm config get registry 切换registry npm config set registry <http://registry.npmjs.org/> 临时切换registry npm publish --registry <http://registry.npmjs.org/> 设置完以后，再次查看当前源是否是http://registry.npmjs.org`
 注意： 国内目前发布组件时，必须切换为npmjs，否则npm publish也不会成功

\*\*\*\*\*\*\*\*\*\*\*\*\*\*
 科普npm registry
 简单来说，npm registry就相当于一个包注册管理中心。它管理着全世界的开发者们发布上来的各种插件，同时开发者们可以通过npm install的方式安装所需要的插件。
 npm官方registry为：<http://registry.npmjs.org/>
 国内速度较快的为：<https://registry.npm.taobao.org/>
 \*\*\*\*\*\*\*\*\*\*\*\*\*\*

以上涉及到的关键命令：

```
npm link  // 本地调试
npm publish  // 发布
npm whoami  //查看当前登陆的用户名

```

每次更新包需要同步更新版本号，发布的包需要发布72小时以后才可以废弃删除。

## 二、本地脚手架搭建

上文中，我们既然是搭建脚手架，肯定不能只让它输出一段文字吧，我们还需要定义一些命令，用户在命令行输入这些命令和参数，脚手架会做出对应的操作。这里不需要我们自己去解析这些输入的命令和参数，有现成的轮子(commander)可以使用，完全可以满足我们的需要。

1. 安装commander
 `npm install chalk commander download-git-repo inquirer ora --save`
2. 创建目录 bin/index.js
3. package.json 里面bin改为

```
  "bin": {
    "portal-cli": "bin/index.js"
  },

```

当然目录结构你可以随意定义，package.json里面bin从哪里起，主要文件就放哪儿。

4. 创建commander init命令

```
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); //命令行输出样式美化
const commander = require('commander'); //命令行工具
const inquirer = require('inquirer'); //命令行交互
const checkDire = require('./utils/checkDire.js');
const { exec } = require('child_process');
const { version } = require('../package.json');
const { promptTypeList } = require('./config');

function resolve(dir) {
  return path.join(__dirname,'..',dir);
}

//version 版本号
commander.version(version, '-v, --version')
  .command('init <projectName>')
  .alias("i")
  .description("输入项目名称，初始化项目模版")
  .action(async (projectName,cmd) => {
    await checkDire(path.join(process.cwd(),projectName),projectName);   // 检测创建项目文件夹是否存在
    inquirer.prompt(promptTypeList).then(result => { //inquirer 交互问答
      const {url, gitName, val} = result.type;
      console.log("您选择的模版类型信息如下：" + val);
      console.log('项目初始化拷贝获取中...');
      if(!url){
        console.log(chalk.red(`${val} 该类型暂不支持...`));
        process.exit(1);
      }
      exec('git clone ' + url, function (error, stdout, stderr) {  //git仓库代码下载
        if (error !== null) {
          console.log(chalk.red(
            `clone fail,${error}`
          ));
          return;
        }
        fs.rename(gitName, projectName, (err)=>{
          if (err) {
            exec('rm -rf '+gitName, function (err, out) {});
            console.log(chalk.red(`The ${projectName} project template already exist`));
          } else {
            console.log(chalk.green(`✔ The ${projectName} project template successfully create(项目模版创建成功)`));
          }
        });
      });
    })
  });
commander.parse(process.argv);
```

以上代码解析：

1）. `checkDire`检查创建项目文件夹是否存在
```
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

module.exports = function (dir,name) {
  let isExists = fs.existsSync(dir);
  if (isExists) {
    console.log(chalk.red(
      `The ${name} project already exists in  directory. Please try to use another projectName`
    ));
    process.exit(1); //存在则跳出
  }
};
```
2）. `commander init` 命令行进入交互问答
3）. 交互问答用`inquirer`命令交互工具

* question 数组为交互命令配置，数组中每一个对象都对应一个执行命令时候的一个问题
* type为该提问的类型，name为该问题的名字，可以在后面通过name拿到该问题的用户输入答案
* message为问题的提示
* default则为用户没输入时的默认为其提供一个答案
* validate方法可以校验用户输入的内容，返回true时校验通过，若不正确可以返回对应的字符串提示文案
* transformer为用户输入问题答案后将对应的答案展示到问题位置，需要有返回值，返回到字符串为展示内容

具体使用文档：<https://github.com/SBoudrias/Inquirer.js>

4）. 问答结束的回调`prompt`方法中then里的参数是一个对象，从配置里面拉取git仓库代码。后面你们使用的时候，拉不下来，看不是不是没有仓库代码权限。

```
module.exports  = {
  npmUrl: 'https://registry.npmjs.org/portal-cli',
  promptTypeList:[{
      type: 'list',
      message: '请选择拉取的模版类型:',
      name: 'type',
      choices: [{
        name: 'portal前端框架',
        value: {
          url: 'http://192.168.3.51/xxx/portal-frame.git', //框架git仓库
          gitName: 'portal-frame',
          val:'portal前端框架'
   
        }
      }]
  }],
};
```
5）.git clone下载前端框架。也可以用[download-git-repo](https://github.com/flipxfx/download-git-repo) git仓库代码下载

以上，就是全部前端脚手架内容，总共四个文件，index.js是最重要的（引用另外两个配置文件），加上一个package.json。

执行以下命令发布：

```
npm link // 本地调试
npm publish // 发布

```

## 三、如何使用？

在需要用到框架的时候，新建空文件夹，执行：

```
npm install portal-cli -g  //全局安装portal-cli
portal-cli init <projectName\>  //portal-cli init test ，test就是你放文件夹的名称，可以自己定义

```

这样前端脚手架生成模版命令工具就完成了。如果想更个性化，可以把npm包完善一下，包括包的版本说明，readme；丰富脚手架交互问询内容，美化操作提示等。

![](quiver-image-url/8390BDE99634EECE9084E4D1E1A679B8.jpg)

![](quiver-image-url/62183D4860FEF933061C55CFD3B1F089.png)

以上代码公司git仓库上有portal-frame，npm包地址<https://www.npmjs.com/package/portal-cli>

## 结语

node.js，本质还是js，js熟悉以后，结合node依赖和语法，各种试错，调试，需要耐心和细心。

另外，开始做一个实例的时候，构思思路，注意流转顺序。主要以官方文档为主，网上博客文章为辅。

官方的还是靠谱一点，博客各种坑，不是过时了，就是讲的不连贯，没有可执行性。

总的来说，学习也是一个探索的过程，共同进步！

以上【完】

## 参考：

<https://www.cnblogs.com/cangqinglang/p/11225166.html>

<https://segmentfault.com/a/1190000021390776>

Inquirer.js：<https://github.com/SBoudrias/Inquirer.js>

npm包生命周期：<https://segmentfault.com/a/1190000017461666>