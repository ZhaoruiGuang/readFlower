const app = getApp();
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        typeList:[
          {
            id:'0',
            name:'logo',
            label:'logo',
			baiduApiName:'logoSearch',
          },
          {
            id: '1',
            name: 'fruit',
            label: '果蔬',
            baiduApiName: 'ingredient',
          },
          {
            id: '2',
            name: 'tree',
            label: '植物',
            baiduApiName: 'plantDetect',
          },
          {
            id: '3',
            name: 'animal',
            label: '动物',
            baiduApiName: 'animalDetect',
          },
          {
            id: '4',
            name: 'car',
            label: '车型',
            baiduApiName: 'carDetect',
          },
          {
            id: '5',
            name: 'currency',
            label: '货币',
            baiduApiName: 'currency',
          },
        ],
        tabIndex:'x',
    },
    onLoad() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        }else if(this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        }else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo(e){
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    showCamera(){
      if (this.data.tabIndex == 'x'){
        wx.showToast({
          title: '请先选择物品的类别',
          icon: 'none',
          duration: 2000
        });
        return;
      };
      wx.navigateTo({
          url: '../camera/camera',
          // url:'../result/result',
      })
    },
    itemTab(e){
      let num = e.currentTarget.dataset.num;
      this.setData({
        tabIndex:num,
      });
      app.businessData = this.data.typeList[num];
    }
})