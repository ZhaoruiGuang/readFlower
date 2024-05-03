var https = require('https');
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 静态目录，首页
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/web_assets'));

var options = {
	key: fs.readFileSync('./cert/www.aireadall.com.key'),
	cert: fs.readFileSync('./cert/www.aireadall.com.pem')
};

https.createServer(options, app).listen(443, function() {
	console.log('https server listen at port 443 !');
})

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
	client[method](image,options).then(function(result) {
		res.send(JSON.stringify(result))
	}).catch(function(err) {
		res.send(JSON.stringify(err))
	});
});

// 请求 chatgpt
app.post('/chatgpt/search', function(req, res) {
	if(!(req.body&&req.body.content)) {
		res.send({
			code: 400,
			msg: '提问信息不能为空'
		})
	}
	var chatReqData = JSON.stringify({
	    "model": "gpt-3.5-turbo",
		"messages": req.body.content,
		"temperature": 0.2,
		"n": 1, // 生成答案的个数
		"max_tokens": 2000,
		"frequency_penalty": 0,
		"presence_penalty": 0,
		"stop": [" Human:", " AI:"]
	});
	var chatReqOptions = {
	    // hostname: 'api.openai.com',
	    hostname: 'openai.wefce.com',
	    port: 443,
	    path: '/v1/chat/completions',
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json',
	        'Authorization': 'xxxxx---xxxx',
	    }
	};
	var chatReq = https.request(chatReqOptions, (chatRes) => {
	    var data = '';
	    chatRes.on('data', (chunk) => {
	        data += chunk;
	    });
	    chatRes.on('end', () => {
			var buf = Buffer.from(data, 'UTF-8');
			res.send({
				code: 200,
				data: buf.toString('UTF-8')
			})
	    });
	}).on("error", (err) => {
		res.send({
			code: 500,
			msg: err.message
		})
	});
	chatReq.write(chatReqData);
	chatReq.end();
})
