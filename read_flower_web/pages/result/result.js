const app = getApp()
Page({
    data: {
        imgInfo:{
            imgSrc:null,
            result:[],
        },
		imgScrollTop:0,	
        canRead:null,
        errTip:'',
		isCurrency:false,	// 是否货币（货币接口的数据结构）
    },
    onReady() {
        let result = app.imgInfo.result;
		let isCurrency = app.businessData && app.businessData.name && app.businessData.name == "currency" || false;
		if (app.businessData && app.businessData.name && app.businessData.name == "currency"){
			let resultArr= [];
			if (result.currencyName){
				let msg = {
					name: result.currencyName,
					currencyCode: result.currencyCode,
					currencyDenomination: result.currencyDenomination,
				};
				resultArr.push(msg);
			};
			result = resultArr;
		}else{
			for (let i = 0; i < (result && result.length); i++) {
				if (result[i].score){
					result[i].score = Math.floor((Number(result[i].score) * 100));
				};
				if (result[i].probability){
					result[i].score = Math.floor((Number(result[i].probability) * 100));
				};
				
				if (i < result.length - 1) {
					result[i].point = '、';
				} else {
					result[i].point = '';
				}
			};
		};
        
        let canRead;
        let errTip;
		if (!(result && result.length) || result[0].name == '非植物' || result[0].name == '非果蔬食材' || result[0].name == '非动物' || result[0].name == '非车类'){
            canRead = false;
            let errTipList = [
				['不听不听，王八念经。'],
				['别动别动，趴下治病。'],
				['“客官,您是打尖还是住店?”','“我大便。”'],
				['我不下地狱，谁爱下谁下。'],
				['通往成功的路，总是在施工中。'],
				['我自横刀向天笑，笑完就睡觉！'],
				['别紧张，我不是什么好人！'],
				['少壮不努力，老王住隔壁。'],
            //   ['一见不日，如隔三秋。'],
				['感谢将我打倒的人，躺着真特么舒服。'],
				['世上无难事，只要肯放弃。'],
				['“人被逼急了是什么都做的出来吗？”','“数学题恐怕不行。”'],
				['“你有《时间简史》吗？”', '“我特么有时间我也不捡屎！”'],
				['只要我吃的够快，体重就追不上我。'],
				['吃得苦中苦，睡得心上人。'],
				['“其实我是个天才！”，“只可惜天妒英才。”'],
            ];
            let len = errTipList.length;
            let random = Math.ceil(Math.random() * (len - 1));
			errTip = errTipList[random];
        }else{
            canRead = true;
        };
        this.setData({
            imgInfo: {
                imgSrc: app.imgInfo.imgSrc,
                result: result
            },
            canRead: canRead,
            errTip: errTip,
			isCurrency: isCurrency,
        });
    },
	imgLoad(e){
		console.log(e.detail.height);
		this.setData({
			imgScrollTop:e.detail.height * 0.5 * 0.5 * 0.5,
		});
	},
    // 查看更多
    seeMore(){
        wx.navigateTo({
            url: '../more/more',
        });
    },
    // 返回重拍
    backRetake(){
		app.imgInfo.imgSrc = null;
		app.imgInfo.result = [];
		this.setData({
			imgInfo: {
				imgSrc: null,
				result: []
			},
			canRead: null,
			errTip: '',
		});

        wx.navigateBack({
            delta: 1,
        })
    },
    // 吟诗
    seePoetry(){
      wx.navigateTo({
        url: '../poetry/poetry',
      });
    }
})