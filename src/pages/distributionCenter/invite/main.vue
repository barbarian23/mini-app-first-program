<template>
    <div>
      <div class="h43 disflex jsbet pl15 pr15 align-cen">
        <p class="fs14 c78">已邀请</p>
        <p class="fs12 c78">注:这里统计的是邀请用户成为分销员的数据</p>
      </div>

      <div class="bgfff" v-if="recommendList.length !== 0">
        <div class="disflex pl15 pr15 bbf5f6 h55 align-cen jsbet">
          <p class="fs14 c38">共推荐成功<span class=" cblue">{{recommendList.length}}</span>名分销员</p>
          <div class="w125 disflex">
            <div class="pl10 pr10 pt7 pb7 fs12 c78 " 
                 v-for="(item,index) in date" 
                 :key="index"
                 :class="type == item.type ? 'isSelect cblue trans2' : 'b1fff trans2'"
                 @click="date_tap(item.type)">
              近{{item.time}}天
            </div>
          </div>
        </div>
        <div class="pl30 pr30">
          <div class="disflex pt20 pb20 bbf5f6 jsbet" 
               v-for="(item,index) in recommendList" 
               :key="index">
            <div class="disflex">
              <img :src="item.avatarUrl" class="w50 h50 bradius5 mr10">
              <div class="disflex jsbet flex-column">
                <p class="fs16 c38 fbold">{{item.nickeName}}</p>
                <p class="fs14 c78">{{item.levelName}}</p>
              </div>
            </div>
            <div class="disflex align-end">
              <p class="fs12 c38 pb3">邀请时间{{' ' + getTime(item.invitationDate)}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="pt85 flex-c-c flex-column" v-else>
        <img :src="icon_nodata" class="w170 h170a mb10">
        <p class="textc fs12 ca2">
          暂无内容，快去分享推广吧
        </p>
      </div>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request.js'
import tools from '@/utils/index.js'
export default {
  
  data(){
    return {
      date:[{
        time:7,
        type:2
      },{
        time:30,
        type:3
      }],
      type:2,
      pages:1, 
      recommendList:[],
      isLoading:true,
      icon_nodata:WXAJAX.imgBackUrl +'/yimai_photos/user/msg/Icon_nodata.png',
    }
  },
  created() {
    this.queryInvitationRecord()
  },
  computed:{
    getTime(time){
      return function(time){
        return time = tools.getdateA(time,'yy/mm/dd')
      }
    }
  },
  mounted() {
    
  },
  onReachBottom(){
    this.queryInvitationRecord()
  },
  methods:{
    date_tap(index){
      this.type = index
      this.pages = 1
      this.isLoading = true
      this.recommendList = []
      this.queryInvitationRecord()

    },
    queryInvitationRecord(){
      let than = this
      if(!than.isLoading){
        return
      }
      wx.showLoading({
        mask:true,
        title:'加载中'
      })
      let companyId = wx.getStorageSync('COMPANYID')
      let userId = wx.getStorageSync('userId')
      WXAJAX.POST({
        companyId:companyId,
        userId:userId,
        private:than.type,
        pageNum:than.pages
      },'','/distributor/queryInvitationRecord')
      .then(data=>{
        wx.hideLoading()
        if(data && data.pageInfo && data.pageInfo.list){
          data.pageInfo.list.forEach(v => {
            v.invitationDate = v.invitationDate.replace(/\s[\x00-\xff]*/g,'')
          });
          
          than.recommendList = [...than.recommendList, ...data.pageInfo.list]
          than.pages++ 

          setTimeout(function () {
            than.isLoading = false
          }, 1000)
        }
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    }
   
  }
};
</script>
<style scoped>
.isSelect{
  border:1upx solid #51CDCB;
  border-radius: 24upx;
}
</style>
