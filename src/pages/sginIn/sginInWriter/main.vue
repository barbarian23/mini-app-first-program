<template>
    <div class="pt10 pr15 pl15 pb15" @click="type = ''">
      <div class="bgfff pt20 pr20 pl20 pb20 mb10 bradius10">
        <img :src="icon_morning" class="w218 h25">
        <div class="b2e8 pt10 borderbox pl15 pr20 pb10 mb10 bradius5" 
             v-for="(item,index) in morningArr" 
             :key="index">
          <textarea placeholder="请输入文案" 
                    class="h60 mb10 w100p  lh27 fs16 c38" 
                    :value="item.title"
                    maxlength="26" 
                    @input="change_writer(item,$event.detail.value)">
          </textarea> 
          <div class="disflex flex-end">
            <img :src="icon_top" class="w20 h20" v-if="index !== 0" @click="up_tap(index,'morning')">
            <img :src="icon_del" class="w20 h20 ml25" @click="del_tap(index,'morning')">
          </div>
        </div>
        <div class="b2e8 pt10 pl15 pr20 pb10 mb10 bradius5 borderbox disflex flex-column bgf5f6" v-if="type == 'moring'" @click.stop="">
          <textarea placeholder="请输入文案" class="h60 mb10 lh27 fs16 ca8 w100p" maxlength="26" @input="Writer.title = $event.detail.value" @blur="addwriter_tap('morning')">
            
          </textarea> 
          <div class="disflex jsbet ">
            <div class="fs12 ca8">
              {{Writer.title.length}}/26
            </div>
            <!-- <div class="disflex">
              <img :src="icon_top" class="w20 h20" >
              <img :src="icon_del" class="w20 h20 ml25" @click="Writer.title = '';type = ''">
            </div> -->
          </div>
        </div>
        <div class="disflex jscen mt15" @click.stop="">
          <div class="disflex jscen align-cen bblue borderbox bradius20 pl10 pr10 pb5 pt5 lh1" @click="type == 'moring' ? type = '' : type ='moring'  ; Writer.title = ''">
            <img :src="icon_add" class="w16 h16 mr3">
            <p class="fs14 cblue">添加文案</p>
          </div>
          
        </div>
      </div>
      
      <div class="bgfff pt20 pr20 pl20 pb20 mb54 bradius10">
        <img :src="icon_night" class="w218 h25">
        <div class="b2e8 pt10 pl15 borderbox pr20 pb10 mb10 bradius5" 
             v-for="(item,index) in eveningArr" 
             :key="index">
          <textarea placeholder="请输入文案" 
                    class="h60 mb10 w100p lh27 fs16 c38" 
                    :value="item.title"
                    maxlength="26" 
                    @input="change_writer(item,$event.detail.value)">
            
          </textarea> 
          <div class="disflex flex-end">
            <img :src="icon_top" class="w20 h20" v-if="index !== 0" @click="up_tap(index,'night')">
            <img :src="icon_del" class="w20 h20 ml25" @click="del_tap(index,'night')">
          </div>
        </div>


        <div class="b2e8 pt10 pl15 pr20 pb10 mb10 bradius5 disflex borderbox flex-column bgf5f6" style="box-sizing: border-box" v-if="type == 'night'" @click.stop="">
          <textarea placeholder="请输入文案" class="h60 mb10 lh27 fs16 ca8 w100p" maxlength="26" @input="Writer.title = $event.detail.value" @blur="addwriter_tap('night')">
            
          </textarea>
          <div class="disflex jsbet ">
            <div class="fs12 ca8">
              {{Writer.title.length}}/26
            </div>
            <!-- <div class="disflex">
              <img :src="icon_top" class="w20 h20">
              <img :src="icon_del" class="w20 h20 ml25" @click="Writer.title = '';type = ''">
            </div> -->
          </div>
        </div>

        <div class="disflex jscen mt15" @click.stop="">
          <div class="disflex jscen align-cen bblue borderbox bradius20 pl10 pr10 pb5 pt5 lh1"  @click="type == 'night' ? type = '' : type ='night' ;Writer.title = ''">
            <img :src="icon_add" class="w16 h16 mr3">
            <p class="fs14 cblue">添加文案</p>
          </div>
          
        </div>
      </div>

      <div class="disflex fix_bottom " style="z-index：44">
        <div class="w50p flex-c-c h49 bgfff fs18 ca8" @click="reset_tap">
          默认还原
        </div>
        <div class="w50p flex-c-c h49 fs18 cfff bgblue" @click="save_tap">
         保存
        </div>
      </div>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request';
export default {
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
          icon_del:WXAJAX.imgBackUrl +'yimai_photos/signIn/ic_del@2x.png',
          icon_top:WXAJAX.imgBackUrl +'yimai_photos/signIn/ic_top@2x.png',
          icon_morning:WXAJAX.imgBackUrl +'yimai_photos/signIn/img_title_morning@2x.png',
          icon_night:WXAJAX.imgBackUrl +'yimai_photos/signIn/img_title_night@2x.png',
          icon_add:WXAJAX.imgBackUrl +'yimai_photos/signIn/btn_add@2x.png',
          currentWriter:null,
          type:'', //添加文案显隐
          Writer:{
            title:''
          }, //文案
        }
    },
    onLoad(){
      this.getWriter()
    },
    mounted() {
      
    },
    methods:{
      up_tap(index,type){
        if(type == 'morning'){
          let up = this.morningArr.splice(index,1)
          this.morningArr.unshift(up[0])
        }else{
          let up = this.eveningArr.splice(index,1)
          this.eveningArr.unshift(up[0])
        }
      },
      del_tap(index,type){
        if(type == 'morning'){
          this.morningArr.splice(index,1)
        }else{
          this.eveningArr.splice(index,1)
        }
      },
      addwriter_tap(type){
        if(this.Writer.title == ''){
          return
        }
        let text = this.deepClone(this.Writer)
        if(type == 'morning'){
          
          this.morningArr.unshift({
            title:text.title,
            copywritingType:1
          })
          this.type = ''
        }else{
          this.eveningArr.unshift({
            title:text.title,
            copywritingType:2
          })
          this.type = ''
        }
      },


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
        uni.showLoading({
          title:'保存中。。。',
          mask:true
        })
        let ApiParam = []
        this.morningArr.forEach(v=>{
          ApiParam.push(v)
        })
        this.eveningArr.forEach(v=>{
          ApiParam.push(v)
        })
        console.log(ApiParam)
        let data = {
          requestList:ApiParam,
          companyId:uni.getStorageSync('SELFCOMPANYID') || '',
          userId:uni.getStorageSync('userId') || '',
        }
        WXAJAX.POST(data,'','/poster/saveCopywriting')
        .then((res)=>{
          uni.showToast({
            title:'保存成功！'
          })
        })
        .catch((err)=>{
          console.log(err)
        })
      },
      //修改文案
      change_writer(item,text){
        item.title = text
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
