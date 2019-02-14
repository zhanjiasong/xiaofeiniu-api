// 管理员相关路由
const express=require("express");
const pool=require("../../pool.js");
var router=express.Router();
module.exports=router;


// GET有请求主体吗？
// API: GET/admin/login/:aname/:apwd
// 完成用户登录验证（有的项目此处选择POST请求）
// 用户登录验证
// 返回数据：
//     {code:200,msg:"login success"}
//     {code:400,msg:"aname or apwd err"}

router.get("/login/:aname/:apwd",(req,res)=>{
    var aname=req.params.aname;
    var apwd=req.params.apwd;
    // 需要对用户输入密码进行加密对比
    pool.query("select aid from xfn_admin where aname=? and apwd=PASSWORD(?)",[aname,apwd],(err,result)=>{
        if(err)throw err;
        if(result.length>0){
            res.send({code:200,msg:"login success"})
            console.log(result[0].aid)
        }else{
            res.send({code:400,msg:"aname or apwd err"})
        }
    })
})



// API: PATCH/admin/    修改部分数据用patch
// 请求数据：{aname:"xxx",oldpwd:"xxx",newpwd:"xxx"}
// 根据管理员名和密码修改管理员密码
// 返回数据：
//     {code:200,msg:"modifided success"}
//     {code:400,msg:"aname or apwd err"}
//     {code:401,msg:"apwd not modifided"}

router.patch("/",(req,res)=>{
    var data=req.body;//{aname:"xxx",oldPwd:"xxx",newPwd:"xxx"}
    // 首先根据aname/oldPwd查询用户是否存在
    pool.query("select aid from xfn_admin where aname=? and apwd=PASSWORD(?)",[data.aname,data.oldPwd],(err,result)=>{
        if(err)throw err;
        if(result.length==0){
            res.send({code:400,msg:"aname or apwd err"});
            return;
        }else{
            pool.query("update xfn_admin set apwd=PASSWORD(?) where aname=?",[data.newPwd,data.aname],(err,result)=>{
                if(err)throw err;
                if(result.changedRows>0){//密码修改完成
                    res.send({code:200,msg:"modifided success"});
                }else{//新旧密码一样，未做修改
                    res.send({code:401,msg:"apwd not modifided"});
                }
            })
        }
    })
    
});




