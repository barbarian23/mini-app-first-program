<template>
  <div class="posre w100p h100p" @click="goback()">
    <img :src="invitePhoto" class="w100p h100p" mode="aspectFill" v-if="invitePhoto">
    <div class="btn" v-if="invitePhoto" @click.stop="saveImg">点击图片保存到相册</div>
  </div>
</template>
<script>
import WXAJAX from '@/utils/request.js'
import tools from '@/utils/index.js'
import promptBox from '../components/prompt_box'
export default {
  components:{
    promptBox
  },
  data(){
    return {
      invitePhoto:''
    }
  },
  created() {
    this.getUserPromote()
  },
  computed:{

  },
  methods:{

    getUserPromote(userId){
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      let data = {
        //当前名片的userId
        userId:wx.getStorageSync('currentUserId'),
        companyId:wx.getStorageSync('COMPANYID'),
      }
      WXAJAX.POST(data,'','/distributor/userPromote')
      .then(data=>{
        wx.hideLoading()
        console.log(data)
        this.invitePhoto = data
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },

    saveImg(){
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      let url = this.invitePhoto;
      //用户需要授权
      wx.getSetting({
      success: (res) => {
        console.log(res.authSetting['scope.writePhotosAlbum'])
        if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success:()=> {
            // 同意授权
            this.saveImg1(url);

          },
          fail: (res) =>{
            wx.hideLoading()
            console.log(res);
            }
          })
          }else{
          // 已经授权了

          this.saveImg1(url);
          }
        },
        fail: (res) =>{
          wx.hideLoading()
          console.log(res);
        }
        })
      },
    saveImg1(url){
      wx.hideLoading()
      wx.getImageInfo({
      src: url,
      success:(res)=> {
        let path = res.path;
        wx.saveImageToPhotosAlbum({
        filePath:path,
        success:(res)=> {
          console.log(res);
        },
        fail:(res)=>{
          console.log(res);
        }
        })
      },
      fail:(res)=> {
        console.log(res);
      }
      })
    },
    goback(){
      uni.navigateBack({
        delta:1
      })
    }
  }
};
</script>
<style>
page{
  background: #f5f5f6;
  overflow: hidden;
}
</style>
<style scoped>
.btn{
  position:absolute;
  width: 70%;
  height: 100rpx;
  top:66%;
  left: 0;
  bottom: 0;
  right: 0;
  margin:auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FCAD3D;
  font-size: 36upx;
  color: #ffffff;
  border-radius: 50upx;
}
</style>
