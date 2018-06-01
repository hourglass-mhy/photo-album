//逻辑处理交给models完成
// 路由处理 -根据路由渲染相应的页面

var file = require('../models/file.js');
//首页 返回首页
exports.showIndex = function (req,res) {

    // 这里file.getAllAlbumName 是读文件操作，是一个异步的过程，不能使用返回值 ===》 回调的方式，将数据返回，数据返回之后再进行渲染
    file.getAllAlbumName(function (albums) {
        res.render('index',{
            albums: albums
        });
    })
}

//相册页 - 返回单个相册集
exports.showSingleAlbum = function (req,res) {
    var albumName = req.params.albumName;
    //根据相册名称获取所有图片
    file.getIamgesByAlbumName(albumName,function (images) {
        res.render('singleAlbum',{
            images: images,
            albumName: albumName
        })
    })
}

//404页面
exports.showErrorPage404 = function (req,res) {
    res.render('404')
}