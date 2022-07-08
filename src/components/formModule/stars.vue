<template>
  <div class="starChoice bbe8 mb20">
    <div class="disflex mb20">
      <span class="w6 h18 bgblue mr13"></span> 
      <p class="fs18 fbold lh1">{{title}}<span v-if="required" class="cdeeporange ml6">*</span></p>
    </div>
    <div class="disflex flex-column">
      <div class="disflex mb15 pl18 jsbet" v-for="(item,index) in starArr" :key="index">
          <span class="fs16 ca7">{{item.title}}</span>
          <div class="disflex ">
            <span class="starImg"  
                v-for="(v,k) in star" 
                :key="k"
                :class="item.choice >= k ? 'selectStar' : ''" 
                @click="star_tap(k,item,index)"></span>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";

export default {
  props:['datas','title','number','required'],
  data(){
    return{
      starIcon:WXAJAX.imgBackUrl + '/yimai_photos/crmAdd/icon_star@2x.png',
      unStartIcon:WXAJAX.imgBackUrl + '/yimai_photos/crmAdd/icon_star_unselected@2x.png',
      starArr:this.datas,
      star:[0,1,2,3,4],
    }
  },
  methods:{
    star_tap(k,item,index){
      // let star = {}
      // item.choice = k
      // star.formId = item.formId
      // star.id = item.detailId
      // star.number = k
      // star.parentId = item.parentId
      
      // console.log(item.content)
      // this.$emit('star_tap',star)
      item.choice = k
      this.datas.forEach(v => {
       this.datas[index].content = k || '0'

      });
      console.log(this.datas)
      this.$emit('star_tap',this.datas,this.number)
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
