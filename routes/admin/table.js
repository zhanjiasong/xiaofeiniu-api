// 桌台相关路由器
const express=require("express");
const pool=require("../../pool.js");
var router=express.Router();
module.exports=router;

// GET /admin/table
// 获取所有的桌台信息
//返回数据：
// {tid:xx,tname:"xxx"...}

router.get("/",(req,res)=>{
    pool.query("select * from xfn_table order by tid",(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})