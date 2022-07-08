<template>
	<div class="posre">
		<div class="flex-c-c bgblue_2 h39">
      <img :src="noticeIcon" class="w15 h15">
      <p class="fs14 cblue ml10">如想分享此海报，请保存海报再分享至好友或朋友圈</p>
    </div>
    <div class="flex-c-c pt15 pb170 ">
      <div class="share_img">
        <img :src="posterImg">
      </div>
    </div>
    <div class="flex flex-column h150a bgfff disflex fix_bottom bra_top_10">
      <div class="mt20 textc fs18 c38 fbold">保存和分享</div>
      <div class="w100p disflex flex1">
        <div class="w50p h100p flex-c-c flex-column" @click="getPoster()">
          <img :src="ic_save" class="w50 h50 mb10">
          <p class="fs12 c78">保存海报</p>
        </div>
        <div class="w50p h100p flex-c-c flex-column" @click="savePoster_tap">
          <img :src="ic_share" class="w50 h50 mb10">
          <p class="fs12 c78">使用图片打卡分享</p>
        </div>
      </div> 
    </div>
    <div class="fixed-mask flex-c-c canvasMask" v-if="createPoster" :class="createPoster ? 'show' : 'hidden' " @click=" createPoster = false">
      <div  class="disflex flex-column align-cen jscen"  @click.stop="">
        <img  class="w232 h320 bradius5 overhidden mb20" :src="posterImage"/>
        <div class="edit_canvas"> 
          <div class="flex-c-c">
            <img :src="message ? ic_selected : ic_unselected" class="w16 h16 mr5" @click="hidden_tap('message')">
            <p class="fs16 cfff lh1">个人和公司信息</p>
          </div>
          <div class="flex-c-c">
            <img :src="qrcode ? ic_selected : ic_unselected" class="w16 h16 mr5" @click="hidden_tap('qrcode')">
            <p class="fs16 cfff lh1">名片二维码</p>
          </div>
        </div>
        <div class="w232 h44 bradius5 flex-c-c fs18 cfff bgblue" @click="savePoster">
          保存海报
        </div>
      </div>
    </div>
	</div>
</template>



<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
export default {
  data() {
    return {
      noticeIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/icon_notice.png',
      ic_share: WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_share@2x.png',
      ic_save: WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_save@2x.png',
      ic_selected:WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_selected@2x.png',
      ic_unselected:WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_unselected@2x.png',
      createPoster:false,
      posterImg:'', //海报图片
      poster:'',
      canvasbg:'', // 缓存至本地的背景图
      avatarImg:'', // 缓存至本地的头像
      qrcodeImg:'', // 缓存至本地的二维码
      posterImageId:'', // 海报id
      userInfo:'',// 名片信息
      message:true, //是否显示信息
      qrcode:true, //是否显示二维码
      posterImage:''
    }
  },
  onLoad(options){
    this.posterImageId = options.posterImageId
    
    this.queryPagePosterImage(this.posterImageId)
    this.getCardDetails()
    //this.qrR()
  },
  onReady() {
	this.context = uni.createCanvasContext('poster');
	},
  computed:{
    
  },
  methods:{
    
    //静默获取二维码、头像、背景图
   
    //修改canvas上所保留的信息
    //avatar 头像
    //qr 二维码 
    save_tap(type){ 
      
      this.context.clearRect(0, 0, uni.upx2px(464), uni.upx2px(640));
      console.log(this.context)
      this.context.draw(true);
      if(type == 'avatar'){
        this.message = !this.message
        this.setCanvas(this.canvasbg)
      }else{
        this.qrcode = !this.qrcode
        this.setCanvas(this.canvasbg)
      }
    },
    getPoster(){
      uni.showLoading({
        title:'加载中',
        mask:true
      })
      let data = ''
      if(!this.message){
        if(!this.message && !this.qrcode){
          data= {
            clockImage:this.posterImg, //海报
          }
        }else{
          data= {
            clockImage:this.posterImg, //海报
            wxTwoCode:this.qrcodeImg, //二维码
          }
        }
        
      }else if(!this.qrcode){
        data= {
          avatarUrl:this.avatarUrl, //头像
          clockImage:this.posterImg, //海报
          name:this.userInfo.name, //用户名称
          companyName:this.userInfo.companyName, //公司名称
        }
      }else{
        data= {
          avatarUrl:this.avatarUrl, //头像
          clockImage:this.posterImg, //海报
          name:this.userInfo.name, //用户名称
          companyName:this.userInfo.companyName, //公司名称
          wxTwoCode:this.qrcodeImg, //二维码
        }
      }
      console.log(data)
      WXAJAX.POST(data,'','/poster/sharePosterImage')
      .then(res=>{
        uni.hideLoading()
        console.log(res)
        this.posterImage = res
        this.createPoster = true
      })
      .catch(err=>{
        console.log(err)
      })
    },
    // setCanvas(res){
    //   console.log(res)
    //   let than = this
    //   let ctx = uni.createCanvasContext('firstCanvas');
    //   ctx.drawImage(res, 0, 0, uni.upx2px(464), uni.upx2px(640));
    //   if(than.qrcode){
        
    //     // ctx.arc(uni.upx2px(287),  uni.upx2px(500), uni.upx2px(80), 0, Math.PI * 2);
    //     // ctx.setFillStyle('#ffffff')
    //     // ctx.fill()
    //     // // ctx.fill()//保证图片无bug填充
    //     // // ctx.clip();//画了圆 再剪切 原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    //     ctx.drawImage(than.qrcodeImg, uni.upx2px(287), uni.upx2px(462), uni.upx2px(154), uni.upx2px(154));
    //   }
      
    //   if(than.message){
    //     ctx.fillStyle = 'rgba(0,0,0,0.6)'
    //     ctx.fillRect(0,0,464,70);
        
    //     ctx.font = 'bold 18px Arial';
    //     ctx.fillStyle = 'rgba(255,255,255,1)';
    //     ctx.fillText(than.userInfo.name, uni.upx2px(113), uni.upx2px(60));
        
    //     ctx.font = '13px Arial';
    //     ctx.fillStyle = 'rgba(255,255,255,1)';
    //     ctx.fillText(than.userInfo.companyName, uni.upx2px(113), uni.upx2px(95));
        
    //     ctx.arc(uni.upx2px(62),  uni.upx2px(62), uni.upx2px(40), 0, Math.PI * 2);
    //     ctx.setFillStyle('#ffffff')
    //     ctx.fill()//保证图片无bug填充
    //     ctx.clip();//画了圆 再剪切 原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    //     ctx.drawImage(than.avatarImg, uni.upx2px(20),uni.upx2px(20),uni.upx2px(80),uni.upx2px(80)) // 推进去图片
    //   }
      
    //   than.context = ctx
    //   ctx.draw(true, () => {
    //     uni.canvasToTempFilePath({
    //       x: 0,
    //       y: 0,
    //       width: uni.upx2px(464),
    //       height: uni.upx2px(640),
    //       destWidth: uni.upx2px(464),
    //       destHeight: uni.upx2px(640),
    //       canvasId: 'firstCanvas',
    //       success: function(res) {
    //         console.log(res)
    //         than.poster = res.tempFilePath
    //       },
    //       fail(e) {
    //         console.log(e);
    //         uni.showToast({
    //           title: '生成海报失败',
    //           icon: 'none'
    //         });
    //       }
    //     });
    //   });
    // },
    //获取名片信息
    //获取海报图片
    getCardDetails(){
       WXAJAX.POST(
        {
          cardId: uni.getStorageSync('SELFCARDID') || ''
        },
        "",
        "/businessCard/cardDetails"
      )
        .then(data => {
          console.log('data',data)
          this.userInfo =  data
          this.avatarUrl = uni.getStorageSync('avatarUrl')
          this.qrcodeImg = data.wxTwoCode
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    //获取海报图片
    queryPagePosterImage(id){
      let data = {
        posterImageId:id
      }
      WXAJAX.POST(data,'','/poster/queryPagePosterImage')
      .then(res=>{
        
        this.posterImg = res.pageInfo.list[0].imagePath
      })
      .catch(err=>{
        
      })
    },
    // 保存海报图片
    savePoster_tap(){
      uni.showLoading({
        title:'保存中。。。',
        mask:'true'
      })
      let data = {
        posterImageId:this.posterImageId
      }
      WXAJAX.POST(data,'','/poster/setClockImage')
      .then(res=>{
        uni.showToast({
          title:'设置成功',
          mask:true
        })
        let data = {
          posterImageId:this.posterImageId
        }
        WXAJAX.POST(data,'','/poster/updatePosterImageUserNum')
        .then(res=>{
          setTimeout(() => {
            uni.navigateBack({
              delta:1
            })
          }, 1500);
        })
        .catch(err=>{

        })
      })
      .catch(err=>{
        uni.hideLoading
        console.log(err)
      })
    },
    // 保存canvas
    async savePoster(){
      
      let than = this
      let imginfo = await util.getImginfo(than.posterImage)
      console.log(imginfo.path)
      uni.saveImageToPhotosAlbum({
        filePath: imginfo.path,
        success: function() {
          than.createPoster = false
          let data = {
             posterImageId:than.posterImageId
           }
          WXAJAX.POST(data,'','/poster/updatePosterImageUserNum')
          .then(res=>{
            uni.navigateBack({
              delta:1
            })
          })
          .catch(err=>{
            
          })
        },
        fail(err){
          
        }
      });
    
    },
    hidden_tap(type){
      if(type == 'message'){
        this.message = !this.message 
        this.getPoster()
      }else{
        this.qrcode = !this.qrcode 
        this.getPoster()
      }
    }
  }
}
</script>

<style scoped>
.share_img{
  padding: 20upx;
  background: #FFFFFF;
  box-shadow: 0px 12px 20px 0px rgba(6, 0, 1, 0.1);
  border-radius: 20px;
}
.share_img img{
  width: 650upx;
  height: 896upx;
  border-radius: 10upx;
}
.canvasMask{
  width: 100vw;
  height: 100vh;
}
.hidden{
  z-index: -111;
  opacity: 0;
}
.show{
  z-index: 200;
  opacity: 1;
}
.edit_canvas{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 524upx;
  height: 112upx;
  margin-bottom: 20upx;
}
</style>


