var https = require('https');
var express = require('express');
var app = express();
var fs = require('fs');

var options = {
	key: fs.readFileSync('./cert/4577748_aireadall.com.key'),
	cert: fs.readFileSync('./cert/4577748_aireadall.com.pem')
};

https.createServer(options, app).listen(443, function() {
	console.log('https server listen at port 443 !');
})
// app.listen('80',function(){
// 	console.log('https server listen at port 80 !');
// })

// 守护进程，防止请求错误导致进程退出
process.on('uncaughtException', (reason, p) => {
	console.log('uncaught exception');
});

// 测试接口，测试服务是否正常
app.post('/test', function(req, res) {
	res.send('server is ok !')
});
app.get('/test', function(req, res) {
	res.send('server is ok !')
});

// 业务接口
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
	storage: storage
});

// 百度图像识别 API 配置
var AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;
var APP_ID = "11450679";
var API_KEY = "wQnG6OoNEH4gNlwvmm6IGzyS";
var SECRET_KEY = "NsKguLG8SVGMT9LDjdIeWjwp22ph4Ae2";
var client = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);
	
app.post('/uploadImg', upload.single('image'), function(req, res, next) {
	// 通过 buffer 获取客户端图片内容，并转成 base64 格式
	var buf = Buffer.from(req.file.buffer);
	var image = buf.toString('base64');
	
	// 调用百度 API 对应接口
	// logo、果蔬、植物、动物、车型、货币
	// var clientMethods = ['logoSearch', 'ingredient', 'plantDetect', 'animalDetect', 'carDetect', 'currency'];
	let method = JSON.parse(req.body.businessData).baiduApiName; 
	let options = {};
	options["baike_num"] = "1";		// 返回百度百科的结果数
	// console.log(method)
	client[method](image,options).then(function(result) {
		// console.log(JSON.stringify(result))
		res.send(JSON.stringify(result))
	}).catch(function(err) {
		res.send(JSON.stringify(err))
	});
});
