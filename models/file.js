//文件操作的方法
var  fs = require('fs');

// 从uploads中获取所有的相册名称 - 从uploads中获取所有的文件夹名称
exports.getAllAlbumName = function (callback) {
    //fs.readdir 获取一个目录中所有的内容，files 是目录中不包括 '.' 和 '..' 的文件名的数组
    fs.readdir('./uploads',(err,files) => {
        var albums = [];
        if (err) {
            throw err;
            return
        }
        //判断当前文件是不是文件夹
        //由于判断文件夹是否存在是一个异步的过程，为了保证一个文件判断完成之后再进行下一个问价的判断，使用闭包
        (function iterator(i) {
            if (i === files.length) {
                callback(albums)
                return 
            }
            fs.stat('./uploads/' + files[i],(err,stats) => {
                if (err) {
                    throw err;
                    return
                }
                if (stats.isDirectory()) {
                    albums.push(files[i])
                }
                //执行下一个
                iterator(i+1);
            })
        })(0);
    })
}

exports.getIamgesByAlbumName = function (albumName,callback) {
    fs.readdir('./uploads/' + albumName,(err,files) => {
        var images = [];
        if (err) {
            throw err;
            return
        }
        //判断是否存在文件
        (function iterator(i) {
            if (i === files.length) {
                callback(images)
                return
            }
            fs.stat('./uploads/' + albumName + '/' + files[i],(err,stats) => {
                if (err) {
                    throw err;
                    return
                }
                if (stats.isFile()) {
                    images.push({
                        name: files[i],
                        imageUrl:'/' + albumName + '/' + files[i]
                    })
                }
                iterator(i+1);
            })
        })(0)
    })
    
}