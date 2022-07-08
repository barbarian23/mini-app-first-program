<template>
<div class="canvas_mask" v-if="signInSucceed">

  <div class="bgfff w232 h413 position-center mb20 " @click.stop="">
    <div class="flex-sb-c posab" style="top:-74rpx;width:100%">
      <div class="flex-c-c">
        <img :src="ic_nice" class="w20 h20">
        <p class="fs18 cfff fbold ml10">{{ lang.text_0 }}</p>
      </div>
      <img :src="ic_close" class="w30 h30" @click="close_canvas_tap">
    </div>
    <div class="flex-sb-c h60 bg38 pl15 pr15 position-center-top">
      <img :src="avatarUrl" class="w40 h40 bradius50p">
      <div class="disflex flex-column jsbet">
        <p class="fs16 fbold cfff textr">{{clockRecord.time}}</p>
        <p class="fs10 cfff">{{ lang.text_7 }}<span class="cblue">{{clockRecord.clockDay}}</span>{{ lang.text_8 }}<span class="cblue">{{clockRecord.beatNumPercentage}}</span>{{ lang.text_9 }}</p>
      </div>
    </div>
    <div class="posre" style="border-radius:10upx 10upx 0 0;" @click="edit_poster('poster')" >
      <img :src="posterImg" class="h320 w232" style="border-radius:10upx 10upx 0 0;">
      <img :src="img_edit" class="w20 h20 posab poster_edit">
    </div>
    <img :src="img_shade" class="position-center-shade">
    <div class="h93 disflex jsbet pl5 pr12">
      <div class="">
        <p class="fs25 cblue fbold pl8">{{clockRecord.greetings}}</p>
        <div class="fs9 c38 w142 h36 lh14 pt3 pl7 borderbox bdash_blue posre" @click="edit_poster('text')" >
          {{posterText || clockRecord.copywritingText || '最终使你脱颖而出的不是天赋异禀，而是持之以恒。'}}
          <img :src="img_edit"  class="w20 h20 posab" style="top:-1rpx;right:-2rpx;">
        </div>
      </div>
      <img :src="wxTwoCode" class="w68 h68">
    </div>
    <div class="w232 h44 bradius5 flex-c-c fs18 cfff bgblue posab" style="bottom:-150rpx" @click="getPoster">
      保存海报
    </div>
  </div>

  <!-- 修改弹窗 -->
  <div class="w100p h100p prod_choose_class borderbox disflex column-reverse"
                :class="{show : isShowAmend} "
                @click.stop="isShowAmend = false">
    <div class="bgfff inner textc lh44" v-if="amendTyep == 'poster'" >
      <div class="flex-c-c fs18 c38 fbold pt10">
        更改图片
      </div>
      <div class="share-box">
        <div style="margin-right: 136.5upx;margin-left: 0;background: #fff;">
          <cover-image class="share-img mb8"
                       :src="icon_photos" @click="choice_poster"></cover-image>
          <div class="share-title">{{ lang.text_1 }}</div>
        </div>
        <div style="margin-left: 136.5upx;"
                    @click="changePoster">
          <cover-image class="share-img mb8"
                       :src="icon_poster"></cover-image>
          <div class="share-title">{{ lang.text_2 }}</div>
        </div>
      </div>
    </div>

    <div v-else class="pl15 pr15 pt20 bgfff inner">
      <div class="disflex jsbet fs15 mb25 align-cen">
        <div class="c78">{{ lang.text_3 }}</div>
        <div class="c38 fs18 fbold">{{ lang.text_4 }}</div>
        <div class="cblue" @click="posterText = amendText">{{ lang.text_5 }}</div>
      </div>
      <div class="w100p h99a borderbox bge8 pt10 pr15 pb28 pl15 mb15 bradius5 posre overhidden" @click.stop="">
        <textarea placeholder-style="color:#A8A8A8;" :value="amendText" placeholder="请输入文案" maxlength="26" @input="amendText = $event.detail.value"/>
        <span class="posab fs12 ca8" style="bottom:30rpx;right:20rpx;">{{amendText.length || 0}}/26</span>
      </div>
      <div class="flex-c-c h27 pl10 pr10 bradius15 bblue w125" style="margin:0 auto;margin-bottom:30rpx" @click.stop="toChooseText(timeTyep)">
        <img :src="ic_add" class="w16 h16 mr3">
        <p class="cblue fs14">{{ lang.text_6 }}</p>
      </div>
    </div>
  </div>


  <div :class="createPoster ? 'canvas_show' : 'canvas_hidden'" @click.stop="">
    <div class="disflex flex-column align-cen jscen "  @click.stop="">
      <div><img src="" class=""></div>
    </div>
  </div>
</div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import LangUtils from '../utils/LangUtils';

export default {
  props:['signInSucceed','clockRecord','wxTwoCode','avatarUrl'],
  data(){
    return{
      lang: LangUtils.getLangSrc().components.posterCanvas,
      show:true,
      ic_add:WXAJAX.imgBackUrl + 'yimai_photos/signIn/btn_add@2x.png',
      img_shade:WXAJAX.imgBackUrl + 'yimai_photos/signIn/img_shade@2x.png',
      img_edit:WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_edit@2x.png',

      icon_photos:WXAJAX.imgBackUrl + 'yimai_photos/signIn/icon_photos@2x.png',
      icon_poster:WXAJAX.imgBackUrl + 'yimai_photos/signIn/icon_poster@2x.png',
      ic_close:WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_close@2x.png',
      ic_nice:WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_nice@2x.png',
      posterImg:'', //海报图片
      avatarImg:'', // 缓存至本地的头像
      qrcodeImg:'', // 缓存至本地的二维码

      qrcode:true, //是否展示二维码
      message:true, //是否展示个人信息
      context:'',
      poster:'',
      amendText:'', //修改文案
      canvasbg:'', // 缓存至本地的背景图
      posterImageId:'', // 海报id
      userInfo:'',// 名片信息
      isShowAmend: false,
      amendTyep:'', //修改类型
      posterText:'',// 海报文案
      createPoster: false,//海报显隐
      timeTyep:'morning',//文案type
      poster_morning:WXAJAX.imgBackUrl +'yimai_photos/signIn/poster_morning.png',
      poster_night:WXAJAX.imgBackUrl +'yimai_photos/signIn/poster_night.png',
    }
  },
  created(){



    // this.getImg(this.img_shade,'shade')
  },
  watch:{
    selectText(newVal,old){
      console.log(newVal)
      this.amendText = newVal
    },
    clockRecord(newVal,old){
      if(newVal){
        this.amendText = this.clockRecord.copywritingText
        // this.qrR()
        this.posterImg = this.clockRecord.clockImage
      }
    },
    selectPhoto(newVal,old){
      this.posterImg = newVal
    }

    // avatarUrl(newVal,old){
    //   this.getImg(newVal,'avatar')
    // },
    // wxTwoCode(newVal,old){
    //   this.getImg(newVal,'qr')
    // }
  },
  computed:{      //同步了store中state内的orderid值
    selectText(){
      return this.$store.state.posterText;
    },
    selectPhoto(){
      return this.$store.state.posterPhoto;
    }
  },
  methods: {
    // async qrR() {
    //   let than = this;

    //   // uni.showLoading({
    //   //   title:'加载中。。。',
    //   //   mask:'true'
    //   // })
    //   // than.getImg(than.clockRecord.clockImage,'canvas')
    //   // .then(res=>{
    //   //   uni.hideLoading()
    //   //   than.posterImg = res
    //   // })
    //   // .catch(err=>{
    //   //   console.log(err)
    //   // })
    // },

    //静默获取二维码、头像、背景图
    // getImg(path,type){
    //   let than = this
    //   return new Promise((resolve, reject)=>{
    //     if(type == 'canvas' && than.canvasbg){
    //       return resolve(than.canvasbg)
    //     }else{
    //       uni.getImageInfo({
    //       src: path,
    //       success(res) {
    //           switch(type){
    //             case 'canvas':
    //               than.canvasbg = res.path
    //               resolve(res.path)
    //               break;
    //             case 'avatar':
    //               than.avatarImg = res.path
    //               break;
    //             case 'qr':
    //               than.qrcodeImg = res.path
    //               break;
    //             case 'shade':
    //               than.img_shade = res.path
    //               break;
    //             default:
    //               return
    //           }
    //         },
    //         fail(error) {
    //           reject('获取图片失败')
    //         }
    //       });
    //     }

    //   })

    // },
    //修改canvas上所保留的信息
    //avatar 头像
    //qr 二维码
    // save_tap(){
    //   this.setCanvas(this.posterImg)
    //   this.createPoster = true
    // },
    async getPoster(){
      let than = this
      uni.showLoading({
        title:'加载中',
        mask:true
      })
      let data = {
        wxTwoCode:than.wxTwoCode, //二维码
        avatarUrl:than.avatarUrl, //头像
        beatNumPercentage:than.clockRecord.beatNumPercentage, //击败百分比
        clockImage:than.posterImg,//海报
        greetings:than.clockRecord.greetings, //早安晚安
        copywritingText:than.amendText || '最终使你脱颖而出的不是天赋异禀，而是持之以恒。', //鼓励语
        time:than.clockRecord.time, // 时间
        clockDay:than.clockRecord.clockDay , //打卡天数
        whiteShadow:than.img_shade, //图片下方阴影
      }
      WXAJAX.POST(data,'','/poster/createPosterImage')
      .then(res=>{
        console.log(res)

        wx.getImageInfo({
          src: res,
          success(data) {
            uni.hideLoading()

            uni.saveImageToPhotosAlbum({
              filePath: data.path,
              success: function() {
                uni.showToast({
                  title:'保存成功'
                })
                setTimeout(function(){

                than.$emit('close_canvas_tap')
                },1000)
                than.createPoster = false
              },
              fail(err){

              }
            });
          },
          fail(res) {
            console.log(err);
          }
        })

      })
      .catch(err=>{
        console.log(err)
      })
    },
    // setCanvas(res){
    //   let than = this,
    //       ctx = uni.createCanvasContext('firstCanvas',this),
    //       proverb = than.amendText
    //       console.log(than.amendText )
    //   ctx.drawImage(res, 0, uni.upx2px(120), uni.upx2px(464), uni.upx2px(520));



    //   // ctx.arc(uni.upx2px(287),  uni.upx2px(500), uni.upx2px(80), 0, Math.PI * 2);
    //   // ctx.setFillStyle('#ffffff')
    //   // ctx.fill()
    //   // // ctx.fill()//保证图片无bug填充
    //   // // ctx.clip();//画了圆 再剪切 原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内

    //   ctx.fillStyle = '#465B6E'
    //   ctx.fillRect(0,0,uni.upx2px(462),uni.upx2px(120));


    //   //文字
    //   ctx.beginPath();
    //   ctx.textAlign="end"
    //   ctx.font = 'bold 16px Arial';
    //   ctx.fillStyle = 'rgba(255,255,255,1)';
    //   ctx.fillText(`${than.clockRecord.time}`, uni.upx2px(432), uni.upx2px(60));

    //   ctx.beginPath();
    //   ctx.font = '10px Arial';
    //   ctx.fillStyle = 'rgba(255,255,255,1)';
    //   ctx.fillText(`打卡${than.clockRecord.clockDay}天,您已击败${than.clockRecord.beatNumPercentage}%的用户`, uni.upx2px(432), uni.upx2px(95));

    //   //渐变图片
    //   ctx.drawImage(than.img_shade, 0, uni.upx2px(616), uni.upx2px(464), uni.upx2px(24));


    //   //canvas下方色块
    //   ctx.fillRect(0,uni.upx2px(640),uni.upx2px(462),uni.upx2px(186));

    //   //二维码
    //   ctx.drawImage(than.qrcodeImg, uni.upx2px(287), uni.upx2px(650), uni.upx2px(154), uni.upx2px(154));

    //   ctx.beginPath();
    //   ctx.textAlign="start"
    //   ctx.font = 'bold 30px Arial';
    //   ctx.fillStyle = '#51CDCB';
    //   ctx.fillText(`${than.clockRecord.greetings}`, uni.upx2px(27), uni.upx2px(700));
    //   ctx.beginPath();

    //   than.drawText(ctx, '10px Arial',proverb, uni.upx2px(27),uni.upx2px(720),uni.upx2px(230))

    //   // 剪切后的圆
    //   ctx.arc(uni.upx2px(62),  uni.upx2px(62), uni.upx2px(40), 0, Math.PI * 2);
    //   ctx.setFillStyle()
    //   ctx.fill()//保证图片无bug填充
    //   ctx.clip();//画了圆 再剪切 原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    //   //填充后的图片
    //   ctx.drawImage(than.avatarImg, uni.upx2px(22),uni.upx2px(22),uni.upx2px(80),uni.upx2px(80)) // 推进去图片

    //   than.context = ctx
    //   ctx.draw(false,() => {
    //     setTimeout(function(){
    //       uni.canvasToTempFilePath({
    //         x: 0,
    //         y: 0,
    //         width: uni.upx2px(464),
    //         height: uni.upx2px(826),
    //         destWidth: uni.upx2px(464),
    //         destHeight: uni.upx2px(826),
    //         canvasId: 'firstCanvas',
    //         success: function(res) {
    //           uni.saveImageToPhotosAlbum({
    //             filePath: res.tempFilePath,
    //             success: function() {
    //               console.log('save success');
    //               than.createPoster = false
    //               let data = {
    //                 posterImageId:res.tempFilePath
    //               }
    //               WXAJAX.POST(data,'','/poster/updatePosterImageUserNum')
    //               .then(res=>{
    //                 console.log(res)
    //               })
    //               .catch(err=>{
    //                 console.log(res)
    //               })
    //             },
    //             fail(err){

    //             }
    //           });
    //         },
    //         fail(e) {
    //           console.log(e);
    //           uni.showToast({
    //             title: '生成海报失败',
    //             icon: 'none'
    //           });
    //         }
    //       },than);
    //     },1500)

    //   });
    // },
    //选择本地图片
    async choice_poster(){
      let photo = await util.chooseImage("file", 1 ,2)
      WXAJAX.UploadImage(photo[0])
      .then(res=>{
        res = JSON.parse(res);
        let path = `${WXAJAX.imgBackUrl}${res.data}`
        console.log(path  )
        this.$set(this,'posterImg',path)
      })

    },
    edit_poster(type){
      this.isShowAmend = true
      this.amendTyep = type
    },
    close_canvas_tap(){
      this.$emit('close_canvas_tap')
    },
    //选择文案页面
    toChooseText(){
      this.$emit('toChooseText',this.timeTyep)
    },

    //前往海报页面
    changePoster(){
      this.$emit('toGalleryPhotos','index')
    },

  }
}
</script>

<style scoped>
.canvas_mask{
  position:fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.canvas_hidden{
  z-index: -111;
  opacity: 0;
}
.canvas_show{
  z-index: 200;
  opacity: 1;
}
.position-center{
  position:absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 99;
  border-radius: 10upx;
  flex-direction: column;
}
.position-center-top{
  position:absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #383838;
  box-sizing: border-box;
  opacity: 0.7;
  border-radius:10upx 10upx 0 0;
  z-index: 7;
}
.position-center-shade{
  position:absolute;
  margin: auto;
  top:636upx;
  left: 0;
  width: 464upx;
  height: 25upx;
}
.prod_choose_class {
  position: fixed;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  bottom: -100%;
  /* transition: all 0.2s linear; */
}
.share-box {
  display: flex;
  justify-content: center;
  margin-top: 20upx;
  margin-bottom: 30upx;
}
.share-img {
  width: 100upx;
  height: 100upx;
}
.show {
  bottom: 0;
  z-index: 100;
}
.share-title {
  font-size: 24upx;
  color: #a8a8a8;
  /* line-height:14upx; */
}

.prod_choose_class .inner {
  border-radius: 10upx 10upx 0 0;
}
.canvas-center{
  z-index: 0;
}
.poster_edit{
  top: 120upx;
  right: 0;
}
</style>
