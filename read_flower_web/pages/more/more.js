const app = getApp()
Page({
  data: {
    imgInfo: {
      imgSrc: null,
      result: [],
    },
  },
  onReady() {
    let result = app.imgInfo.result;
    for (let i = 0; i < (result && result.length); i++) {
      result[i].score = (Number(result[i].score) * 100).toFixed(0);
      if (i < result.length - 1) {
        result[i].point = '、';
      } else {
        result[i].point = '';
      }
    };
    this.setData({
      imgInfo: {
        imgSrc: app.imgInfo.imgSrc,
        result: result
      },
    });
  },
})