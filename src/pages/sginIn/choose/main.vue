<template>
<div class="pt10 pr15 pl15 pb15">
  <div class="bgfff pt20 pr20 pl20 pb20 mb10 bradius10" :class="timeTyep == 'morning' ? 'mb40' : '' " v-if="timeTyep == 'morning'">
    <img :src="icon_morning" class="w218 h25">
    <div class="b2e8 pt10 pl15 pr20 pb10 mb10 bradius5 posre" 
          v-for="(item,index) in morningArr" 
          @click="selected(item.title,index)"
          :class="currentText == index ? 'bblue_2 trans2' : 'b2e8 trans2'"
          :key="index">
      <div class="h70 lh27 fs16 c38">
            {{item.title}}
      </div> 
      <img :src="ic_selected" 
           :class="currentText == index ? 'opacity1 trans2' : 'opacity0 trans2'"
           class="w25 h25 posab" style="right:-2rpx;top:-2rpx">
    </div>
  </div>
  
  <div class="bgfff pt20 pr20 pl20 pb20 mb54 bradius10" v-else>
    <img :src="icon_night" class="w218 h25">
    <div class="b2e8 pt10 pl15 pr20 pb10 mb10 bradius5 posre" 
          v-for="(item,index) in eveningArr" 
          @click="selected(item.title,index)"
          :class="currentText == index ? 'bblue_2 trans2' : 'b2e8 trans2'"
          :key="index">
      <div class="h70 lh27 fs16 c38">
            {{item.title}}
      </div>
      <img :src="ic_selected" 
           :class="currentText == index ? 'opacity1 trans2' : 'opacity0 trans2'"
           class="w25 h25 posab" style="right:0;top:0">
    </div>
  </div>
  <div class="disflex fix_bottom ">
    <div class="w50p flex-c-c h49 bgfff fs18 ca8" @click="reset_tap">
      取消
    </div>
    <div class="w50p flex-c-c h49 fs18 cfff bgblue" @click="save_tap">
      保存
    </div>
  </div>
</div>
</template>
<script>
import WXAJAX from '@/utils/request';
import { mapMutations } from 'vuex';
export default {
  props:{
    timeTyep:{
      type: String,
      defualt: ''
    }
  },
  data(){
    return{
      morningArr:[],
      eveningArr:[],
      oldMorningWriter:[
        {
          title:'想一千次，不如去做一次；华丽的跌倒，胜过无畏的徘徊。',
          copywritingType:1
        },{
          title:'顽强的力量，可以征服世界上任何一座高峰。',
          copywritingType:1
        },{
          title:'没有绝对的运气，只有绝对的努力，要么出众，要么出局。',
          copywritingType:1
        },{
          title:'炽热人生，尽力而为是底线，全力以赴是上限。',
          copywritingType:1
        },{
          title:'时间不会辜负你的努力，梦想也不会遗忘你的付出。',
          copywritingType:1
        }
      ],
      oldEveningWriter:[
        {
          title:'最终使你脱颖而出的不是天赋异禀，而是持之以恒。',
          copywritingType:2
        },{
          title:'任何事情都会有皆大欢喜的结果，如果没有，就证明没到最后。',
          copywritingType:2
        },{
          title:'最好的风景一定在未知的前方，最好的生活在你前行的脚下。',
          copywritingType:2
        },{
          title:'只要路是对的，就不怕遥远，方向比里程更重要。',
          copywritingType:2
        },{
          title:'所有的绊脚石都是惊喜的铺垫，所有美好终将如期而至。',
          copywritingType:2
        }
      ],
      icon_morning:WXAJAX.imgBackUrl +'yimai_photos/signIn/img_title_morning@2x.png',
      icon_night:WXAJAX.imgBackUrl +'yimai_photos/signIn/img_title_night@2x.png',
      currentWriter:null,
      ic_selected:WXAJAX.imgBackUrl +'yimai_photos/signIn/ic_selected_l@2x.png',
      
      type:'', //添加文案显隐
      Writer:{
        title:''
      }, //文案
      currentText:0 ,//当前文案
      selectTitle:'' //选中文案
    }
  },
  onLoad(){
    this.getWriter()
  },
  mounted() {
    
  },
  methods:{
    ...mapMutations(['setPosterText']),
    getWriter(e){
      uni.showLoading({
        title:'保存中。。。',
        mask:true
      })
      let data = {
        companyId:uni.getStorageSync('SELFCOMPANYID') || '',
        userId:uni.getStorageSync('userId') || '',
      }
      WXAJAX.POST(data,'','/poster/queryCopywriting')
      .then((res)=>{
        uni.hideLoading()
        if(res){
          res.forEach((v,k)=>{
            switch(v.copywritingType){
              case('1'):
                this.morningArr.push(v)
                break;
              case('2'):
                this.eveningArr.push(v)
                break;
              default:
                return
            }
          })
        }else{
          this.morningArr = this.deepClone(this.oldMorningWriter)
          this.eveningArr = this.deepClone(this.oldEveningWriter)
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    },
    reset_tap(){
      this.morningArr = this.deepClone(this.oldMorningWriter)
      this.eveningArr = this.deepClone(this.oldEveningWriter)
    },
    save_tap(){
      if(this.timeTyep == 'morning'){
        this.setPosterText(this.selectTitle || this.morningArr[0].title)
      }else{
        this.setPosterText(this.selectTitle || this.eveningArr[0].title)
      }
      uni.navigateBack({
        delta:1
      })
    },
    //选择文案
    selected(title,index){
      console.log(title )
      this.currentText= index
      this.selectTitle = title
    },

    //深拷贝
    deepClone(value) {
      let obj = JSON.stringify(value),
        objClone = JSON.parse(obj);
      return objClone;
    }
    
  }
}
</script>
<style scoped>

</style>
