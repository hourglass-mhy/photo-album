// 入口文件
var  express = require('express');
var app = express();

//设置模板引擎
app.set('view engine','ejs');

//设置静态服务的路径
app.use(express.static('./public'));
app.use(express.static('./uploads'));

//处理路由的controller
var router = require('./controller/router.js');

//首页
app.get('/',router.showIndex);

//相册页
app.get('/:albumName',router.showSingleAlbum);

// 404页面
app.use(router.showErrorPage404)

app.listen(3000);

