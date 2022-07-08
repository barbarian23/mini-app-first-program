<template>
  <div class="imgChoice bbe8 mb20">
      <div class="disflex mb20">
        <span class="w6 h18 bgblue mr13"></span>
        <p class="fs18 fbold lh1">{{title}}<span v-if="required" class="cdeeporange ml6">*</span></p>
      </div>
      <p class="fs14 ca7 mb20">{{ lang.text_0 }}</p>
      <div class="disflex wrap mb20">
        <div class="bgfff w80 h80 mr7 mb7 posre"
             v-for="(v,k) in self_photos"
             :key="k">
          <img mode="aspectFill"
               :src="v"
               alt=""
               class="w100p h100p">
          <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/del.png"
               alt=""
               class="w20 h20 posab right2 top2"
               @click="delImg(k)">
        </div>
        <div v-if="self_photos.length < 3"
             class="bgfff bdash_a8 w80 h80 add_img mr7"
             @click="uploadpic('self', 3)"></div>
      </div>
    </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import LangUtils from '../../utils/LangUtils';

export default {
  props:['datas','title','number','required'],
  data(){
    return{
      lang: LangUtils.getLangSrc().components.formModule.image,
      self_photos: [],
    }
  },
  methods:{
    delImg(index) {
      //删除图片
      wx.showLoading();
      this.self_photos.splice(index, 1);
      wx.hideLoading();
    },

    async uploadpic(str, count) {
      // let a = this.card_msg;

      console.log(this.self_photos.length)
      this.showPageStatus = "0";
      let path = await util.chooseImage("file", count);
      if (!(path instanceof Array)) return;
      this.uploadImgFun(path, 0, str);
    },
    // 递归上传
    async uploadImgFun(arr, index = 0, str) {

      await this.uploadImg(arr[index], str);
      if (index < arr.length - 1) {
        this.uploadImgFun(arr, index + 1, str);
      }
    },
    uploadImg(path, str) {
      if (str == "self" && this.self_photos.length >= 3) {
        wx.showToast({
          title: "最多选择3张！",
          duration: 1500,
          icon: "none"
        });
        return;
      }
      wx.showLoading({ mask: true });
      return WXAJAX.UploadImage(path)
        .then(data => {
          wx.hideLoading();
          data = JSON.parse(data);
          if (data.code == "200") {
             if (str == "self") {
              this.self_photos.push(`${WXAJAX.imgBackUrl}${data.data}`);
              this.$emit('img_tap',this.self_photos,this.number)
            }
          } else {
            wx.showToast({
              title: "网络异常",
              duration: 2000,
              icon: "none"
            });
          }
        })
        .catch(err => {
          wx.hideLoading();
          console.log("err -- ", err);
        });
    },
  }
}
</script>

<style scoped>
.starImg{
  transition: all .4s;
  display: block;
  width: 36upx;
  height: 36upx;
  background: url('https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmAdd/icon_star_unselected@2x.png');
  background-size: cover;
  margin-right: 30upx;
}
.selectStar{
  transition: all .4s;
  background: url('https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmAdd/icon_star@2x.png');
  background-size: cover;
}
</style>
