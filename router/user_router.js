const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
const jwt =require('jsonwebtoken')
router.use(express.urlencoded())

// 处理文件上传
const multer = require('multer')
// const upload = multer({dest: 'uploads'})
// 精细化去设置，如何去保存文件
const storage = multer.diskStorage({
  // 保存在哪里
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    // console.log('file', file)
    // 目标： 新名字是时间戳+后缀名
    const filenameArr = file.originalname.split('.');
    // filenameArr.length-1是找到最后一个元素的下标
    const fileName = Date.now() + "." + filenameArr[filenameArr.length-1]
    cb(null, fileName) //
  }
})
const upload = multer({ storage })


// 1.0 获取用户的基本信息
router.get('/userinfo', (req, res) => { 
  let { username } = req.query;
  console.log(username)
  const sqlStrSelect = `select * from users where username="${username}"`
  conn.query(sqlStrSelect, (err, result) => { 
     // 说明查询出错
     if(err) {
      console.log(err)
      res.json({status: 500, msg: "服务器错误"})
      return
    }
    res.json({
      status: 0, msg: "获取用户基本信息成功",
      data:result[0]
    })
  })
})

// 更新用户
router.post('/userinfo', (req, res) => {
  console.log(req.body);
  
  let { id,nickname,email,userPic } = req.body;
 
  
  const sqlStrSelect =  `update users set nickname="${nickname}",email="${email}",userPic="${userPic}"  where id="${id}"`
  console.log(sqlStrSelect);
  
  conn.query(sqlStrSelect, (err, result) => {
     // 说明查询出错
     if(err) {
      console.log(err)
      res.json({status: 500, msg: "服务器错误"})
      return
    }
    res.json({
      status: 0, msg: "修改用户基本信息成功",
     
    })
  })
})
// 重置密码
router.post('/updatepwd', (req, res) => {
  console.log(req.body);
  
  let {oldPwd,newPwd,id  } = req.body;
 
  
  const sqlStrSelect =  `select password from users where id=${id}`
  console.log(sqlStrSelect);
  
  conn.query(sqlStrSelect, (err, result) => {
     // 说明查询出错
     if(err) {
      console.log(err)
      res.json({status: 500, msg: "服务器错误"})
      return
    }
    if ((result[0].password !== oldPwd)) {
      console.log(err)
      res.json({status: 1, msg: "旧密码错误"})
      return
    }
    const sqlStrSelect1 = `update users set password="${newPwd}"  where id="${id}"`
    conn.query(sqlStrSelect1, (err, result) => { 
      // 说明查询出错
      if(err) {
       console.log(err)
       res.json({status: 500, msg: "服务器错误"})
       return
     }
 
     res.json({
       status: 0, msg: "更新密码成功"
     })
   })
  })
})

// 上传用户头像
router.post('/uploadPic', upload.single('file_data'), (req,res) => {
  // 如果文件上传成功
  console.log('本次上传的文件是', req.file)
  // 后面再做：错误处理
  res.json({
    "code":200, 
    "msg":"上传成功", 
    "src": "http://127.0.0.1:3000/uploads/" + req.file.filename})
})




module.exports = router