const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

// 注册新用户
router.post('/register', (req, res) => {
  console.log('收到的参数是', req.body);
  const {
    name,
    password
  } = req.body
  //  先查验 用户名是否已经存在
  let sqlstr1 = `select  username  form users where username='${name}'`
  conn.query(sqlstr1, (err, result) => {
    console.log(result);
    //  服务器有错误则返回
    if (err) {
      console.log(err);
      res.json({
        status: 500,
        msg: "服务器错误"
      })
      return
    }
    //  判断数据表中是否存在同名 用查到的内容用length属性校验
    if (result.length > 1) {
      res.json({
        status: 1,
        msg: "用户名已被注册 请重新输入用户名"
      })
      return
    }
  })
  // 拼接数据库字符串
  let sqlstr2 = `insert into users(username,password ) values('${name}','${password}')`
  conn.query(sqlstr2, (err, result) => {
    console.log(result);
    if (err) {
      console.log(err);
      res.json({
        status: 500,
        msg: "服务器错误"
      })
      return
    }
    res.json({
      status: 0,
      msg: "注册成功"
    })
  })
})




//  新用户登录
router.post('/login', (req, res) => {
  console.log('收到的参数是', req.body);
  const {
   username,
    password
  } = req.body
  const sqlstr2 = `select * from users where username="${username}" and password="${password}"`
  conn.query(sqlstr2, (err, result) => {
    if (err) {
      console.log(err);
      res.json({
        status: 500,
        msg: "服务器错误"
      })
      return
    }
    if (result.length > 0) {
      console.log(result);
      const token = jwt.sign({
          name: username
        },
        'gz61', // 加密的密码，要与express-jwt中的验证密码一致
        {
          expiresIn: 2 * 60 * 60
        } // 过期时间，单位是秒
      )
      console.log(token);
      res.json({
        msg: "登陆成功", status: 200, token

      })
    } else {
      res.json({
        status: 400,
        msg: "登录失败"
      })
    }
  })
})

module.exports = router