<template>
  <div class="h100p bgfff disflex flex-column">
    <div class=" flex1">
      <div class="w100p h60 disflex jscen align-cen fs18 c38 fbold bbf5f6 trans2"
           :class="currentnum == index ? 'bg-gradient-green cfff trans2' : ''"
           v-for="(item,index) in list" :key="index" @click="list_tap(item,index)">
          {{item}}
      </div>
    </div>

    <div class="w100p h49 bg-gradient-green disflex jscen align-cen fs18 cfff" @click="report_tap">{{ lang.text_0 }}</div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import LangUtils from '../../../utils/LangUtils';

  export default {

    data(){
      return {
          lang: LangUtils.getLangSrc().demandSquare.report,
          list:['重复发布','涉黄信息','不实信息','有害信息','内容抄袭','违法信息','诈骗信息','其他'],
          currentnum:-1,
          createdUserId:'',
          squareId:'',
          reporting:''
        }
    },
    onLoad(option){
      console.log(option)
      this.createdUserId = option.createdUserId
      this.squareId = option.squareId
    },
    methods:{
     list_tap(item,index){
       this.currentnum = index
       this.reporting = item
     },
     report_tap(){
       if(!this.reporting){
         return uni.showToast({
                  title:'请先选择举报原因',
                  icon:'none'
                })
       }
       let v = this;
       wx.showLoading({
            title:'加载中',
            mask:true
          });
       WXAJAX.POST(
        {
          squareId: v.squareId,
          createdUserId: this.createdUserId,
          reporting:this.reporting || ''
        },
        "",
        "/demandSquare/addReport"
      )
        .then(data => {
          wx.hideLoading();
          uni.showToast({
            title:'提交成功！',
            mask:true
          })
          setTimeout(()=>{
            uni.navigateBack({
              delta:2
            })
          },2000)
        })
        .catch(err => {
          console.log(err);
          wx.hideLoading();
        });
      }
    },
    onReachBottom(){

    }
  }
</script>

<style scoped>

</style>
