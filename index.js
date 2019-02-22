// 小肥牛点餐项目API子系统
console.log("准备启动API服务器...");
console.log(new Date().toLocaleString());


const PORT=8090;
const express=require("express");
const cors=require("cors");
const bodyParser = require('body-parser')
const categoryRouter=require("./routes/admin/category");
const adminRouter=require("./routes/admin/admin");
const dishRouter=require("./routes/admin/dish");
const setingsRouter=require("./routes/admin/setting");
const tableRouter=require("./routes/admin/table");

// 创建HTTP 应用服务器
var app=express();
app.listen(PORT,()=>{
    console.log("Server Linstening:"+PORT)
})

//使用中间件
app.use(cors());
app.use(bodyParser.json());//把application/JSON格式的请求主体解析出来放入req.body属性

//挂载管理后台必须路由器
app.use("/admin/category",categoryRouter);
app.use("/admin",adminRouter);
app.use("/admin/dish",dishRouter);
app.use("/admin/settings",setingsRouter);
app.use("/admin/table",tableRouter);
