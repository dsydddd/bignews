## MySql数据库复习

- 数据库服务端

  小皮-PHPStudy

  ![image-20210331084138621](markdownimg\image-20210331084138621.png)

- 数据库客户

  ![image-20210331084212681](F:\备课\Nodejs实战练习\bignews_server\markdownimg\image-20210331084212681.png)

- 数据库增，删，查，改sql语句

  - 插入数据语法

    ```mysql
    insert into user(username,password) values ('admin','123456')
    ```

  - 查询user表的所有数据

    ```mysql
    select * from user	
    ```

  - 更新一条数据

    ```mysql
    update user set `password` = '654321' where id = 1
    ```

  - 删除一条数据

    ```mysql
    DELETE from user where id = 1
    ```



## 英雄接口项目功能复习

- 访问数据库封装utils/sql.js 

  ```javascript
  module.exports = {
    query: function (sql, callback) {
      const mysql = require('mysql');
      const conn = mysql.createConnection({
        host     : 'localhost',   // 你要连接的数据库服务器的地址
        user     : 'root',        // 连接数据库服务器需要的用户名
        password : '123456',        // 连接数据库服务器需要的密码
        database : 'gz61'      //你要连接的数据库的名字
      });
      conn.connect();
      // 完成增删改查
      conn.query(sql, callback);
      // 手动关闭连接
      conn.end();
    }
  }
  ```

  注意点：

  1、通过 npm i mysql --save 安装好mysql这个包才能与mysql服务器进行通讯

  2、将createConnection中的相关参数修改成当前mysql的相关配置

  

- express启动服务器三句代码

  ```javascript
  const express = require("express")
  const server = express()
  
  server.listen(3000, () => {
    console.log("您的服务器已经在3000端口就绪了");
  })
  ```

  

- cros跨域设置

  ```javascript
  const cors = require('cors')
  server.use(cors())
  ```

  

- 静态资源设置

  ```javascript
  server.use('/uploads',express.static('uploads'))
  ```

  

- jwt生成token设置

  ```javascript
  const jwt = require('express-jwt');
  // app.use(jwt().unless());
  // jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
  // unless() 约定某个接口不需要身份认证
  server.use(jwt({
    secret: 'gz61', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
  }).unless({
    path: ['/user/login', '/user/register', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
  }));
  
  ```

  

- 错误中间件处理

  ```javascript
  server.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
      // res.status(401).send('invalid token...');
      res.status(401).send({ code: 1, message: '身份认证失败！' });
    }
  });
  ```

  

- 注册路由

  ```javascript
  const userRouter = require('./router/user_router.js')
  server.use('/hero', heroRouter)
  ```

  

- 路由分类文件 router/xxx_router.js

## 大事件后台项目接口

同学们自己开发

### 数据库准备

开发步骤：

1、在mysql中创建数据库: bignews1



2、将以下sql语句在mysql中执行生成表和数据

```mysql
/*
 Navicat MySQL Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50714
 Source Host           : localhost:3306
 Source Schema         : bignews

 Target Server Type    : MySQL
 Target Server Version : 50714
 File Encoding         : 65001

 Date: 31/03/2021 08:01:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `cover` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '封面图片路径',
  `date` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '新闻发表日期',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '新闻发表时间',
  `isDelete` tinyint(1) NOT NULL COMMENT '1：删除 0：未删除',
  `state` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '已发布还是未发布',
  `author` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '作者',
  `read` int(11) NULL DEFAULT NULL COMMENT '阅读次数',
  `categoryId` int(11) NULL DEFAULT NULL COMMENT '文章所属分类',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `categoryId`(`categoryId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 224 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

INSERT INTO `articles` VALUES (223, '测试333', 'f5fccb36cfe5ce07ee2914763c40b1e5', '2020-12-15', '&lt;p&gt;&lt;span&nbsp;style=&quot;color:&nbsp;#e03e2d;&quot;&gt;&lt;strong&gt;测试3333333333333&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;', 1, '草稿', '管理员', 0, 3);

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文章分类id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '分类名称',
  `slug` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '分类别名',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE,
  UNIQUE INDEX `slug`(`slug`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 23 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, '爱生活', '热爱生活');
INSERT INTO `categories` VALUES (2, '爱旅行', '热爱旅行');
INSERT INTO `categories` VALUES (3, '爱美食', '热爱美食');
INSERT INTO `categories` VALUES (4, '爱运动', '热爱运动');
INSERT INTO `categories` VALUES (5, '经济特区', '热爱经济');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论信息id',
  `author` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论人',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论内容',
  `date` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论日期',
  `time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论时间',
  `state` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '状态：已审核，待审核',
  `articleId` int(11) NULL DEFAULT NULL COMMENT '评论文章的id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `articleId`(`articleId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 8001 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

INSERT INTO `comments` VALUES (1, '唐磊', '业声又必应做马体听第它光九多件合自方大设改着象省是把即起计。', '2020-6-29', '05:02:11', '已拒绝', 223);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `userPic` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户头像路径',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '李思思', 'sisili@qq.com', 'eafdd8cbe73f3b048ebb2714c61a7b5e', '123456');
INSERT INTO `users` VALUES (2, 'ivan', 'dd', 'dd', 'dd', '1');
INSERT INTO `users` VALUES (3, 'test1', 'test1', 'test1@qq.com', 'http://127.0.0.1:3000/uploads/1617113030043.jpg', '123456');
INSERT INTO `users` VALUES (4, 'test2', 'test2', 'email@qq.com', 'http://127.0.0.1:3000/uploads/1617113030043.jpg', '4321');

SET FOREIGN_KEY_CHECKS = 1;

```



### 项目结构准备

完整代码在码云：https://gitee.com/ivanyb/bitnews_test_61

3、下载 [01-项目初始化文件-所有空文件](https://gitee.com/ivanyb/bitnews_test_61/commit/4558bd12f4ba65f86dc8e72d4c02e271d3dbe751) 对应的代码，执行 `npm install`  完成项目初始化工作

4、在utils中的sql.js中写入以下代码

创建数据库连接以及定义sql语句执行方法

```javascript
// 创建数据库连接以及定义sql语句执行方法
module.exports = {
    query: function (sql, callback) {
      const mysql = require('mysql');
      const conn = mysql.createConnection({
        host     : 'localhost',   // 你要连接的数据库服务器的地址
        user     : 'root',        // 连接数据库服务器需要的用户名
        password : '123456',        // 连接数据库服务器需要的密码
        database : 'bignews1'      //你要连接的数据库的名字
      });
      conn.connect();
      // 完成增删改查
      conn.query(sql, callback);
      // 手动关闭连接
      conn.end();
    }
  }
```



5、按照如下代码版本依次编写代码

- [02-在app.js中用3行代码创建服务器器](https://gitee.com/ivanyb/bitnews_test_61/commit/761fd692a737f9a7f3d6f183f6348620a12f03c9)

- [03-开启cros跨域](https://gitee.com/ivanyb/bitnews_test_61/commit/034393ae6124e423087576d5d49d0d9e213bfe74)

- [04-设置uploads为静态资源目录](https://gitee.com/ivanyb/bitnews_test_61/commit/9b3e6263c6dc2ef03b06a54e62d74b6f710a7945)

- [05-设置express-jwt第三方包用于token生成和验证](https://gitee.com/ivanyb/bitnews_test_61/commit/1846ab191bfa43968960525a6482b06e350d0420)

- [06-通过路由中间件来 加载不同的路由](https://gitee.com/ivanyb/bitnews_test_61/commit/59f0e5570e3def61a78e022eb4acfecc1533d172)

- [07-错误处理中间件用来检查token合法性](https://gitee.com/ivanyb/bitnews_test_61/commit/19a9d8f4dcc540a5213a214ff1f7c03ec82e9dab)

- [08-初始化3个roluter文件](https://gitee.com/ivanyb/bitnews_test_61/commit/99e2149cb93803e6fdaf2de5e7f95fbfcdd361ff)

- [09- 实现注册用户接口 /api/reguser](https://gitee.com/ivanyb/bitnews_test_61/commit/bae152db0cb58a1ec9e6e0f348ba30ec83409805)

- [10-实现登录用户接口代码/api/login](https://gitee.com/ivanyb/bitnews_test_61/commit/18a6c9275b5496b1e0977f34aabed817c6662655)

- [11-获取用户的基本信息接口/my/userinfo](https://gitee.com/ivanyb/bitnews_test_61/commit/f1960150091be3b41330a8fc11de6952309bd93c)

- [12-上传用户头像接口代码/my/uploadPic](https://gitee.com/ivanyb/bitnews_test_61/commit/63b394863ed72bbee5b523121bec7efc1e4ad65f)

- [13-实现更新用户接口代码/my/userinfo](https://gitee.com/ivanyb/bitnews_test_61/commit/13bfb35304e39c4ecccb514ebb4254116681443f)

- [14-实现重置用户密码接口代码/my/updatepwd](https://gitee.com/ivanyb/bitnews_test_61/commit/8b7d7f9ee90ba72a9503f4eabae831d8e4656445)

- [15-实现获取文章分类列表接口代码/my/article/cates](https://gitee.com/ivanyb/bitnews_test_61/commit/9fba1965f61afb8426c61ce0859b5d917138d810)

- [16-实现新增文章分类接口代码/my/article/addcates](https://gitee.com/ivanyb/bitnews_test_61/commit/a4105b53ec1996da61e4a0c904764dc2486de991)

- [17-实现根据id删除分类接口代码/my/article/deletecate](https://gitee.com/ivanyb/bitnews_test_61/commit/3f4498e7f2cd7c3993af22a23caa43a14b9a663b)

- [18-实现根据id获取分类数据接口代码/my/article/getCatesById](https://gitee.com/ivanyb/bitnews_test_61/commit/fe9e1c31b0a4064221c4da6eea9f0026c69397fb)

- [19-实现更新分类数据接口代码/my/article/updatecate](https://gitee.com/ivanyb/bitnews_test_61/commit/c4b29dbd9fee0dadc62fc2b9f817c0cd846f45e5)

  