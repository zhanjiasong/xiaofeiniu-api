// 全局设置路由器
const express=require("express");
const pool=require("../../pool.js");
var router=express.Router();
module.exports=router;

// GET /admin/settings
// 获取所有的全局设置信息
//返回数据：
// {appName:"xxx",apiUrl:"xxx"...}
router.get("/",(req,res)=>{
    pool.query("select * from xfn_settings limit 1",(err,result)=>{
        if(err) throw err;
        res.send(result[0]);
    })
})



// PUT /admin/settings
// 修改所有的全局设置信息
//返回数据：
// {code:200,msg:"settings update success"}
router.put("/",(req,res)=>{
    var data=req.body;
    pool.query("update xfn_settings set ?",data,(err,result)=>{
        if(err) throw err;
        res.send({code:200,msg:"settings update success"});
    })
})