const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
const jwt =require('jsonwebtoken')
router.use(express.urlencoded())

// 获取文章分类列表
router.get('/cates', (req, res) => {
  console.log(req.query);
  let sqlStr=`select * from  categories`
  conn.query(sqlStr, (err, result) => {
    if(err) {
      console.log(err)
      res.json({status: 500, msg: "服务器错误"})
      return
    }

    res.json({
      status: 0, msg: "获取文章分类列表成功",
      data:result
    })
  })
})
// 2新增文章分类
router.post('/addcates', (req, res) => {
  console.log(req.body);
  const{name ,slug} =req.body

  let sqlStr=`insert into categories (name,slug) values ('${name}','${slug}')`
  conn.query(sqlStr, (err, result) => {
    if(err) {
      console.log(err)
      res.json({status: 500, msg: "服务器错误"})
      return
    }

    res.json({
      status: 0, msg: "新增文章分类成功",
      data:result
    })
  }) 
})
// 删除文章分类
router.get('/deletecate', (req, res) => {
  console.log(req.query);
  const{id} =req.query

  let sqlStr=`delete from categories where id=${id}`
  conn.query(sqlStr, (err, result) => {
    if(err) {
      console.log(err)
      res.json({status: 500, msg: "服务器错误"})
      return
    }

    res.json({
      status: 0, msg: "删除文章分类成功",
      data:result
    })
  }) 
})
// 通过Id获取文章分类
router.get('/getCatesById', (req, res) => {
  console.log(req.query);
  const{id} =req.query

  let sqlStr=`select * from categories where id=${id}`
  conn.query(sqlStr, (err, result) => {
    if(err) {
      console.log(err)
      res.json({status: 500, msg: "服务器错误"})
      return
    }

    res.json({
      status: 0, msg: "获取文章分类成功",
      data:result
    })
  }) 
})

router.post('/getCatesById', (req, res) => {
  console.log(req.body);
  const{id,name,slug} =req.body

  let sqlStr=`update categories set name="${name}",slug="${slug}" where id=${id}`
  conn.query(sqlStr, (err, result) => {
    if(err) {
      console.log(err)
      res.json({status: 500, msg: "服务器错误"})
      return
    }

    res.json({
      status: 0, msg: "更新分类信息成功",
      data:result
    })
  }) 
})



module.exports = router