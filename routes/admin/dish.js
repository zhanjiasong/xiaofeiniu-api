// 菜品相关的路由
const express=require("express");
const pool=require("../../pool.js");
var router=express.Router();
module.exports=router;  

// API: GET /admind/dish
// 获取所有的菜品（按类别进行分类）
// 返回数据：
//     [
//         {cid:1,cname:"肉类",dishList:[{},{},{}...]}
//         {cid:2,cname:"菜类",dishList:[{},{},{}...]}
//          ...
//     ]


router.get("/",(req,res)=>{
    //查询所有菜品类别
    pool.query("select cid,cname from xfn_category",(err,result)=>{
        if(err)throw err;
        var categoryList=result;//菜品类别数组
        var finishCount=0;//已经查询完菜品类别的数量
        for(let c of categoryList){
            //循环查询每个类别下有哪些菜品
            pool.query("select * from xfn_dish where categoryId=? order by did desc",c.cid,(err,result)=>{
                if(err)throw err;
                c.dishList=result;
                // 必须保证所有菜品查询完成才能发送相应信息---这些查询都是异步请求
                finishCount++;
                if(finishCount==categoryList.length){
                    res.send(categoryList)
                }
            })
        }
    })
})



// POST /admin/dish/image
// 请求参数
// 接收客上传的菜品图片，存在服务器上，返回图片在服务器上的随机文件名
// 相应数据：
//     {code:200,msg:"upload success",fileName:"1354545645-2413.jpg"}


// 引入multer中间件
const multer=require("multer");
const fs=require("fs");
var upload=multer({
    dest:"tmp/"  //指定客户端上传文件的临时路径
});
//定义路由，使用文件上传中间件
router.post("/image",upload.single("disImg"),(req,res)=>{
    // console.log(req.body)   //客户端随同图片提交的字符数据
    // console.log(req.file)  //客户端上传的文件
    //把客户端上传的文件从临时目录转移到永久的图片路径下
    var tmpFile=req.file.path;//临时文件名
    var suffix=req.file.originalname.substring(req.file.originalname.lastIndexOf("."));//原始文件名的后缀部分
    var newFile=randFinleName(suffix);//目标文件名
    fs.rename(tmpFile,"img/dish/"+newFile,()=>{
        res.send({code:200,msg:"upload success",fileName:newFile})//把临时文件转移
    });
})

//生成一个随机文件名
//参数：suffix表示要生成的文件名后缀 
//形如：12345678978-8821.jpg
function randFinleName(suffix){
    var time=new Date().getTime();//当前系统时间戳
    //随机生成四位随机数
    //公式：Math.random()*(max-min)+min
    var num=Math.floor(Math.random()*(10000-1000)+1000);//4位随机数
    return time+'-'+num+suffix;

}



// POST /admin/dish/
// 请求参数：{title:"xxx",imgUrl:"xxx",price:xxx,detail:"xxxx",category:xx}
// 添加一个新的菜品
// 输出消息：
//     {code:200,msg:"dish added success",dishId:36}

router.post("/",(req,res)=>{
    var data=req.body
    console.log(data)
    pool.query("insert into xfn_dish set ?",req.body,(err,result)=>{
        if(err)throw err;
        // 将insertId语句产生的自增编号输出给客户
        res.send({code:200,msg:"dish added success",dishId:result.insertId})
    })
})





// DELETE  /admin/dish/:did
// 根据指定菜品的编号删除该菜品
// 输出数据
    // {code:200,msg:"dish delete success"}
    // {code:400,msg:"dish not exists"}





// PUT /admin/dish/
// 请求参数：{title:"xxx",imgUrl:"xxx",price:xxx,detail:"xxxx",category:xx}
// 添加一个新的菜品
// 输出消息：
//     {code:200,msg:"dish update success",dishId:36}
    // {code:400,msg:"dish not exists"}


