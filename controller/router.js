//逻辑处理交给models完成
// 路由处理 -根据路由渲染相应的页面
var path = require('path');
var fs = require('fs');

var file = require('../models/file.js');
// 处理文件上传
var formidable = require('formidable');

//首页 返回首页
exports.showIndex = function (req,res) {
    if (req.url == '/favicon.ico') {
        return
    }
    // 这里file.getAllAlbumName 是读文件操作，是一个异步的过程，不能使用返回值 ===》 回调的方式，将数据返回，数据返回之后再进行渲染
    file.getAllAlbumName(function (albums) {
        res.render('index',{
            albums: albums
        });
    })
}

//相册页 - 返回单个相册集
exports.showSingleAlbum = function (req,res) {
    if (req.url == '/favicon.ico') {
        return
    }
    var albumName = req.params.albumName;
    //根据相册名称获取所有图片
    file.getIamgesByAlbumName(albumName,function (images) {
        res.render('singleAlbum',{
            images: images,
            albumName: albumName
        })
    })
}

//上传页面
exports.showUploadPage = function (req,res) {
    if (req.url == '/favicon.ico') {
        return
    }
    file.getAllAlbumName(function (albums) {
        res.render('uploadPage',{
            albums: albums
        })
    })

}

//处理上传文件
exports.handleUpload = function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize( __dirname + '/../' + 'tmp');//文件保存的临时目录为当前项目下的tmp文件夹 使用../ 能够进行路径的回退
    form.keepExtensions = true; //使用文件的原扩展名
    form.parse(req, function(err, fields, files) {
        if (err) {
            next();
            return;
        }

        var wenjianjia = fields.wenjianjia; // 用户要上传的相册
        var filePath = ''; // 用户上传的图片路径
        if (files.tupian) {
            filePath = files.tupian.path
        }
        var fileExtName = path.extname(files.tupian.name); // 文件拓展名

        //后端限制上传的文件大小 1M  超过阈值，将图片从临时文件夹中删除
        var maxSize = 2*1024*1024;
        if (files.tupian.size > maxSize) {
            fs.unlink(filePath,function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
            })
            res.send('文件过大')
        } if ( ('.jpg.jpeg.png.gif').indexOf(fileExtName.toLowerCase()) === -1 ) { // 判断文件类型是否允许上传
            fs.unlink(filePath,function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
            })
            res.json({code:-1, message:'此文件类型不允许上传'});
        } else  {
            //文件移动的目标文件夹，不存在则创建目标文件夹
            var targetDir = path.normalize(__dirname + '/../' + 'uploads');
            if (!fs.existsSync(targetDir)) {
                fs.mkdir(targetDir);
            }
            //目标目录存在  临时文件更名 保存到目标文件目录对应的相册中
            var fileName = new Date().getTime() + fileExtName; //以当前时间戳对上传文件进行重命名
            var targetPath = targetDir + '/' + wenjianjia + '/' + fileName;
            fs.rename(filePath, targetPath,function (err) {
                if (err) {
                    res.json({
                        code: -1,
                        message:'更名失败'
                    });
                    return
                }
                res.json({
                    code: 200,
                    message:'上传成功'
                });
            })
            console.log(files)
        }
    });
}

//404页面
exports.showErrorPage404 = function (req,res) {
    res.render('404')
}