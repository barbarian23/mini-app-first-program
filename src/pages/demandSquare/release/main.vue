<template>
  <div class="bgfff disflex flex-column h100p">
    <div class="flex1 overauto">
      <div class="disflex align-cen">
        <picker class="w100p"  :range="demandClass" :value="index" @change="bindDateChange">
          <div class="disflex w100p borderbox jsbet align-cen pt10 pl18 pb10 pr15 h49">
            <div class="">
              选择分类
            </div>
            <div class="disflex align-cen">
              <p class="fs16 ca7 mr10">{{ demandClass[specificDate] || lang.text_0}}</p>
              <img :src="rightIcon" class="w10 h10 mt4">
            </div>
          </div>
        </picker>
      </div>
      <div class="pl15 pr15 pt  15 pb15 posre borderbox">
        <p class="fs16 fbold c38 mb15">{{ lang.text_1 }}</p>
        <textarea class="w100p pl15 pr15 pb15 pt15 pb28 bgf5f6 borderbox bradius5"
                  maxlength="200"
                  @blur="text_tap"
                  placeholder="请输入内容"></textarea>
        <p class="c78 textLength">{{text.length}}/200</p>
      </div>
      <div class="pl15 pr15">
        <div class="disflex jsbet">
          <p class="fs16 c38">{{ lang.text_2 }}</p>
          <p class="fs16 ca8">{{ lang.text_3 }}</p>
        </div>
        <div class="disflex wrap pt20 pb20 w290">
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
          <div v-if="self_photos.length < 9"
              class="bgfff bdash_a8 w80 h80 add_img bradius5 mr7"
              @click="uploadpic('self', 9)"></div>
        </div>
      </div>

      <div class="pl15 pr15 pt  15 pb15 posre borderbox">
        <p class="fs16 fbold c38 mb15">{{ lang.text_4 }}</p>
        <textarea class="w100p pl15 pr15 pb15 pt15 pb28 bgf5f6 borderbox h90 bradius5"
                  maxlength="50"
                  @blur="remarks_tap"
                  placeholder="请输入内容"></textarea>
        <p class="c78 textLength">{{remarks.length}}/200</p>
      </div>

      <div class="disflex jsbet h49 pl15 pr15">
        <p class="fs16 lh49 c38">{{ lang.text_5 }}</p>
        <div class="fs16 disflex align-cen ca8 flex-end" @click="position_tap">
          <p class="over_1 w170" :style="{textAlign:'right;'}">{{address || lang.text_0}}</p>
          <img :src="rightIcon" class="w10 h10 ml6">
        </div>
      </div>
      <div class="pl15 disflex h49 align-cen" @click="singleCurrent_tap">
        <div class="w20 h20 bradius10 b2e8 disflex jscen align-cen mr8 "
             style="transition: all .4s"
             :class="singleCurrent ? 'active' : ''">
          <span class="disblock w10 h10 bradius5" style="transition: all .4s"></span>
        </div>
        <div class="fs14 ca8">{{ lang.text_6 }}<span class="cblue ml6" @click.stop="agreemen_tap">{{ lang.text_8 }}</span></div>

      </div>
    </div>
    <div class="w100p h49 bg-gradient-green disflex jscen align-cen fs18 cfff" @click="confirm_tap">{{ lang.text_7 }}</div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import LangUtils from '../../../utils/LangUtils';

  export default {

    data(){
      return {
          lang: LangUtils.getLangSrc().demandSquare.release,
          currentnum:'',
          rightIcon:WXAJAX.imgBackUrl + '/yimai_photos/user/right.png',
          specificDate:'',
          text:'',
          self_photos:[],
          address:'',
          remarks:'',
          singleCurrent:false,
          demandClass:this.$store.state.demandClass.map(v=>{
            return v.name
          }),
          isLoging:true,

        }
    },
    onShow(){
      let add = uni.getStorageSync('company_address') || ''
      this.address = add.build
    },
    methods:{
      list_tap(item,index){
        this.currentnum = index
      },
      bindDateChange(e){
        this.specificDate = e.detail.value
      },
      text_tap(e){
        this.text = e.detail.value
      },
      remarks_tap(e){
        this.remarks = e.detail.value
      },
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
        if (str == "self" && this.self_photos.length >= 9) {
          wx.showToast({
            title: "最多选择9张！",
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
      position_tap(){
        wx.navigateTo({
          url:"../../companyAddr/main"
        })
      },
      singleCurrent_tap(){
        this.singleCurrent = !this.singleCurrent
      },
      agreemen_tap(){
        wx.navigateTo({
          url:'../agreement/main'
        })
      },
      confirm_tap(){
        if(!this.text || !this.specificDate){
          return uni.showToast({
            title:'未选择分类或填写需求内容',
            icon:'none'
          })
        }
        if(!this.singleCurrent){
          return uni.showToast({
            title:'请先同意用户协议',
            icon:'none'
          })
        }
        if(!this.isLoging){
          return uni.showToast({
            title:'已提交，请稍后再试',
            icon:'none'
          })
        }
        this.isLoging = false
        wx.showLoading({
          title:'加载中',
          mask:true
        })

        let data = {
          createdUserId:wx.getStorageSync('userId') || '',
          companyId:wx.getStorageSync('roleId') || '',
          description:this.text,
          settingId:this.$store.state.demandClass[this.specificDate].settingId,
          images:this.self_photos || '',
          note:this.remarks || '',
          address:this.address || '',
          isDraft:false
        }
        WXAJAX.POST(data,'','/demandSquare/addDemandSquare').then(data=>{
          uni.showToast({
            title:'已提交!'
          })
          setTimeout(()=>{
            uni.navigateBack({
              delta:1
            })
          },1000)
        })
        .catch(err => {
          setTimeout(()=>{
            this.isLoging = true
          },500)
          wx.hideLoading()
          wx.showToast({
            title:err,
            icon:'none'
          })
        });

      }
    },

    onReachBottom(){

    }
  }
</script>

<style scoped>
.textLength{
  position: absolute;
  right: 60upx;
  bottom: 50upx;
}
.active{
  transition: all .4s;
  border:2upx solid #51CDCB;
}
.active span{
  transition: all .4s;
  background: #51CDCB;
}
</style>
