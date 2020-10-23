const app = getApp();
Page({
    data: {
        cameraState:true,       // true：相机  false：预览照片
        imgSrc:'',              // 预览图片地址
        // viewWidth:0,            // 相机、预览图片宽度
        viewHeight: 0,          // 相机、预览图片高度
        cameraBtnState: false,  // 相机拍照按钮 icon 图，相机初始化完成后显示
    },
    onLoad(){
        wx.getSystemInfo({
            success:(res) => {
                this.setData({
                    // viewWidth: res.windowWidth * 0.96 ,
                    viewHeight: res.windowHeight * 0.75,
                    cameraBtnState: true,
                })
            }
        });
    },
	onShow(){
		this.setData({
			cameraState: true,
		});
	},
    // 拍照
    nowTake(){
        this.takePic();
    },
    // 重新拍照
    reTake(){
        this.setData({
            cameraState: true,
        });
    },
    takePic() {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
          	quality: 'high',
          	success: (res) => {
              	this.setData({
                  	cameraState: false,
                  	imgSrc: res.tempImagePath
              	});
          	}
        })
    },
    error(e) {
        console.log(e.detail)
    },
    submit(){
        let _this = this;
        wx.showLoading({
            title: '努力识别中...',
            mask:true,
        });
        wx.uploadFile({
			url: 'https://www.aireadall.com/uploadImg',
            filePath: _this.data.imgSrc,
            name: 'image',
            formData:{
              	businessData: JSON.stringify(app.businessData),
            },
            header:{
                'content-type':'multipart/form-data'
            },
            success: function (res) {
                app.imgInfo.result = JSON.parse(res.data).result;
            },
            fail:function(err){
                app.imgInfo.result = [];
            },
            complete:function(){
                app.imgInfo.imgSrc =  _this.data.imgSrc;
                wx.hideLoading();
                wx.navigateTo({
                    url: '../result/result'
                });
            }
        })
    }
})