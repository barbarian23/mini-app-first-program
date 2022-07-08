<template>
    <div class="posre">
      <div class="h44 disflex bgfff align-cen fix_top">
        <div class="w33p h100p flex-c-c " @click="type_tap(1)">
          <p class="fs16 " :class="queryType == 1 ? 'cblue fbold trans2' : 'c78 trans2' ">销量</p>
          <!-- <img :src="queryType == 1 ? down_select_icon : down_icon" class="w10 h10 ml10 pt3 trans2" :class="(queryType == 1)  ? 'rotate180' : ''"> -->
        </div>
        <div class="w33p h100p flex-c-c" @click="type_tap(2)">
          <p class="fs16" :class="queryType == 2 ? 'cblue fbold trans2' : 'c78 trans2' ">售价</p>
          <!-- <img :src="queryType == 2 ? down_select_icon : down_icon" class="w10 h10 ml10 pt3 trans2" :class="(queryType == 2)  ? 'rotate180' : ''"> -->
        </div>
        <div class="w33p h100p flex-c-c" @click="type_tap(true,1)">
          <p class="fs16" :class="filter_open == 1 ? 'cblue fbold trans2' : 'c78 trans2' ">筛选</p>
          <img :src="filter_open ? down_select_icon : down_icon" class="w10 h10 ml10 pt3 trans2" :class="filter_open ? 'rotate180' : ''">
        </div>
        <div class="posab fixed-mask mt44 w100p h100vh" v-if="filter_open" @click="filter_open = false">
          <div class="w100p bgfff pl30 pr15 pt20 pb15">
            <p class="c38 fs16 fbold mb15">筛选条件</p>
            <div class="disflex pr15">
              <div class="fs14 c78 pt3 pb5 pl10 pr10 bradius5 mr10" 
                   @click="sort_tap(1)"
                   :class="sortType == 1 ? 'bblue cblue  ' : 'c78 b78 ' ">
                   {{queryType == 1 ? '销量' : '售价'}}由高到低
              </div>
              <div class="fs14 c78 pt3 pb5 pl10 pr10 bradius5" 
                   @click="sort_tap(2)"
                   :class="sortType == 2 ? 'bblue cblue  ' : 'c78 b78' ">
                   {{queryType == 1 ? '销量' : '售价'}}由低到高
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pt57 pr15 pl15 pb10">
        <div class="bgfff bradius10 pt15 mb10" 
             v-for="(item,index) in orderList" 
             :key="index">
          <div class="disflex pb15 pr15 pl15 bbf5f6">
            <img :src="item.images[0]" class="w90 h90 bradius5 overhidden mr15" mode="aspectFill">
            <div class="pt7">
              <p class="fs14 c38 fbold mb10">{{item.goodsName}}</p>
              <p class="fs12 ca8 mb8">销量 {{item.salesNum || 0}}</p>
              <p class="fs12 c38">售价<span class="corange fbold">￥{{item.price || 0}}</span></p>
            </div>
          </div>
          <div class="pl28 pr60 flex-sb-c h44">
            <p class="cblue fs14">分享最高返佣{{item.commissionAmount || 0}}元</p>
            <div class="flex-c-c"  @click="toProdDetail(item.goodsId)">
              <img :src="share_icon" class="w15 h15 mr10">
              <p class="fs14 ca8">分享</p>
            </div>
          </div>
        </div>
      </div>
      <div class="pt85 flex-c-c flex-column"  v-if="orderList.length == 0">
        <img :src="icon_nodata" class="w170 h170a mb10">
        <p class="textc fs12 ca2">
          暂无分销商品
        </p>
      </div>

      <div v-if="showShareOrSave">
        <ShareOrSave :status="showShareOrSave"
                      @closeModal="closeModal"
                      @save="save">
        </ShareOrSave>
      </div>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request.js'
import tools from '@/utils/index.js'
import ShareOrSave from "@/components/shareOrSave";

export default {
  components:{
    ShareOrSave
  },
  data(){
    return {
      date:[{
        time:7,
      },{
        time:30,
      }],
      type:0,
      orderList:[],
      isShow:null,
      rightIcon:WXAJAX.imgBackUrl + '/yimai_photos/user/right.png',
      icon_nodata:WXAJAX.imgBackUrl +'/yimai_photos/user/msg/Icon_nodata.png',
      down_icon:WXAJAX.imgBackUrl +'/yimai_photos/distributionCenter/ic_down@2x.png',
      down_select_icon:WXAJAX.imgBackUrl +'/yimai_photos/distributionCenter/ic_down_selected@2x.png',
      share_icon:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/ic_share@2x.png',
      sortType:1,
      filter_open:false,
      queryType:1 ,// 排序参数
      page:1,
      isLoading:true,
      showShareOrSave:false //分享弹窗
    }
  },
  created() {

  },
  onReachBottom(){
    this.getGoods()
  },  
  mounted() {
    this.getGoods()
  },
  methods:{
    //查询分销商品
    
    getGoods(){
      let than = this
      if(than.isLoading == false){
        return
      }
       wx.showLoading({
        title:'加载中',
        mask:true
      })
      
      than.isLoading = false
      let data = {
        companyId:wx.getStorageSync('COMPANYID'),
        distributorUserId:wx.getStorageSync('userId'),
        isDistribution:1, 
        queryType:than.queryType,
        sortType:than.sortType,
        pageNum:than.page
      }
      WXAJAX.POST(data,'','/distributor/queryByGoods')
      .then(data=>{
        wx.hideLoading()
        if(data && data.pageInfo &&data.pageInfo.list ){
          console.log(data)
          than.orderList = [...than.orderList, ...data.pageInfo.list];
          var arrays = [];
          than.orderList.forEach(v=>{
            v.price = ( v.price/100).toFixed(2)
            var arrays = [];
              arrays.push(v.goodPhoto);
              v.goodPhoto &&
                (v.images =
                  v.goodPhoto.indexOf(",") != -1
                    ? v.goodPhoto.split(",")
                    : arrays);
          })
          than.page++
          setTimeout(function(){
            than.isLoading = true
          },1000)
        }else{
          than.isLoading = false
        }
        
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },
    //排序
    sort_tap(type){
      this.sortType = type
      this.orderList = []
      this.isLoading = true
      this.page = 1
      this.getGoods()
    },
    date_tap(index){
      this.type = index
    },
    unfold_tap(index){
      this.isShow = index
    },
    type_tap(type,type2){
      console.log(type)
      if(type2){
        this.filter_open = !this.filter_open
      }else{
        this.sortType = 1
        this.orderList = []
        this.page = 1
        this.queryType = type
        this.isLoading =true
        this.getGoods()
        this.filter_open = 0
      }
    },
    //开启分享弹窗
    showShare_tap(item){
      this.showShareOrSave = true
      let goodId = item
    },
    //关闭分享弹窗
    closeModal() {
      this.showShareOrSave = false;
    },
    toProdDetail(id) {
      wx.navigateTo({ url: "../../prodDetail/main?goodId=" + id + '&shareShow=true' });
    }
  }
};
</script>
<style scoped>
.isSelect{
  border:1upx solid #51CDCB;
  border-radius: 30upx;
}
.hideFold{
  transition:all .2s;
  height: 0upx;

}
.showFold{
  transition:all .2s;
}
</style>
