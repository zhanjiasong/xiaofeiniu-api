// 菜品类别相关的路由
const express=require("express");
const pool=require("../../pool.js");
var router=express.Router();
module.exports=router;  

// API: GET /admin/category
// 含义：客户端拉取所有的菜品了类别，按编号升序排列
// 返回值形如下：
//     [{cid:1,cname:"..."},{...}]

router.get("/",(req,res)=>{
    pool.query("SELECT * FROM xfn_category order by cid",(err,result)=>{
        if(err) throw err;
        var jsonData=JSON.stringify(result);
        res.send("doData("+jsonData+")");
    })
})


// API:DELETE /admin/category/:cid
// 含义：根据餐单编号的路由参数，删除菜品
// 返回值如下：
//     {code:200,msg:"1 category deleted"}
//     {code:400,msg:"0 category deleted"}


router.delete("/:cid",(req,res)=>{
    // 注意：删除菜品类别前必须把属于该类别的菜品的类别编号设置为null
    pool.query("update xfn_dish set categoryId=NULL where categoryId=?",req.params.cid,(err,result)=>{
        if(err) throw err;
        // 至此指定类别的菜品已经修改完毕
        pool.query("delete from xfn_category where cid=?",req.params.cid,(err,result)=>{
            if(err)throw err;
            // 判断影响的行数
            if(result.affectedRows>0){
                res.send({code:200,msg:"1 category deleted"})
            }else{
                res.send({code:400,msg:"0 category deleted"})
            }
        })
    })

    
});


// API: POST /admin/category
// 请求参数：{cname:"xxx"}
// 含义：添加新的菜品类别
// 返回值形式如：
//     {code:200,msg:"1 category added",cid:x}

router.post("/",(req,res)=>{
    var data=req.body;
    console.log(req.body);
    pool.query("insert into xfn_category set ?",data,(err,result)=>{
        if(err)throw err;
        res.send({code:200,msg:"1 category added"});
    });
})



// API: PUT /admin/category
// 请求参数：{cid:xx,cname:"xxx"}
// 含义：根据菜品类别编号修改该类别
// 返回值形式如：
// {code:200,msg:"1 category modified"}
// {code:400,msg:"0 category modified,not exists"}
// {code:200,msg:"0 category modified,no modification"}

router.put("/",(req,res)=>{
    var data=req.body;//请求数据{cid:xx,cname:xxx}
    //TODO:对数据进行验证
    pool.query("update xfn_category set ? where cid=?",[data,data.cid],(err,result)=>{
        if(err)throw err;
        if(result.changedRows>0){
            res.send({code:200,msg:"1 category modified"})
        }if(result.affectedRows==1 && result.changedRows==0){
            res.send({code:401,msg:"0 category modified,no modification"})
        }else if(result.affectedRows==0){
            res.send({code:400,msg:"0 category modified,not exists"})
        }
    })
})









