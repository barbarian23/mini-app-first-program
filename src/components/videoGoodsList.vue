<template>
<view>
  <view class="cover_screen" @click="hideBuyModal" v-if="showModalStatus"></view>
  <view class="buy_box" v-if="showModalStatus"  :class="showModalStatus ? 'show' : 'hide'">
    <div class="buy_box_wrap">
      <div class="disflex bgfff h50 w100p jsbet borderbox pr30 align-cen" style="position:absolute;top:0;z-index:99;">
        <div>
          <p class="fbold fs16 c38">{{ lang.text_0 }}</p>
        </div>
        <div class="disflex  ">
          <div class="disflex align-cen" @click="orderLists">
            <img :src="icon_order" class="w15 h15 mr5">
            <p class="fs14 ca8">{{ lang.text_1 }}</p>
          </div>
          <!-- <div class="disflex align-cen">
            <img :src="icon_car" class="w15 h15 mr5">
            <p class="fs14 ca8">{{ lang.text_2 }}</p>
          </div> -->
        </div>
      </div>
      <div class="newdetaildivider">

      </div>

        <div class="disflex align-cen bbf5f6 " v-for="(item,index) in goodsData" :key="index" @click="toProdDetail(item.goodsId)">
          <img :src="item.url" class="w60 h60 mr10">
          <div class="flex1 disflex flex-column jsbet h90 borderbox pt15 pb15">
            <p class="w280 fs14 fbold over_1 c38">{{item.name}}</p>
            <div class="flex-sb-c ">
              <p class="fs14  over_1 corange fbold">
                ￥{{item.price}}
              </p>
              <div class="flex-sb-c add_to_cart">
                <!-- <div class="add_to_cart_icon" @click="addCard()">
                  <img :src="icon_add_car" class="w15 h15">
                </div> -->
                <div class="add_to_cart_btn">
                  去抢购
                </div>
              </div>
            </div>
          </div>
        </div>
      <div class="title" @tap="primary">{{ lang.text_3 }}</div>
    </div>
  </view>
</view>
</template>

<script>
import WXAJAX from "../utils/request";
import LangUtils from '../utils/LangUtils';

  export default {
    props:{
			isShowImgTitle:{
				type:Boolean,
				value:false
			},
			title:{
				type:String,
				value:'上传头像'
			}
		},
		data() {
			return {
			  lang: LangUtils.getLangSrc().components.videoGoodsList,
				showModalStatus: false,
        icon_car:WXAJAX.imgBackUrl + '/yimai_photos/videoGoods/icon_car.png',
        icon_add_car:WXAJAX.imgBackUrl + '/yimai_photos/videoGoods/icon_add_car.png',
        icon_order:WXAJAX.imgBackUrl + '/yimai_photos/videoGoods/icon_order.png',
			}
		},
		methods: {
			show(){
				this.showModalStatus = true
			},
			hide(){
				this.showModalStatus = false
			},
			hideBuyModal:function(){
				this.hide()
			},
			primary:function(){
				this.$emit('primary')
			},
      //去商品详情
      toProdDetail(id){
        this.showModalStatus = false
        wx.navigateTo({
          url: "../prodDetail/main?goodId=" + id
        });
      },
      orderLists(id){
        this.showModalStatus = false
          wx.navigateTo({
            url: "../orderLists/main"
          });
        }

		},
    computed:{
      goodsData(){
        let data = this.$store.state.videoGoods
        if(data){
          data.forEach(i => {
            i.price = (i.price/100).toFixed(2)
          });
        }
        return data
      }
    }
  }
</script>

<style scoped>
.buy_box {
  width: 100%;
  max-height: 40vh;
  box-sizing: border-box;
  padding:0 30upx;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2000;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
}
.buy_box_wrap::-webkit-scrollbar{
  display: none;
}
.newdetaildivider {
  height: 1px;
  background: #eaeaea;
  display: block;
}

.titleImg {
  flex-direction: column;
  display: flex;
  background-color: #eeeeee;
}

.titleImg text{
  margin-top: 12rpx;
  display: flex;
  font-size: 36rpx;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.imgs {
  margin-top: 12rpx;
  display: flex;
  justify-content: space-between;
  margin-left: 30rpx;
  margin-right: 30rpx;
  margin-bottom: 12rpx;
}

.cover_screen {
  width: 100%;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.2;
  overflow: hidden;
  z-index: 1000;
  color: #fff;

}
.show{
  animation: slideContentUp 0.2s ease-in both;
}
.hide{
  animation: slideContentUp 0.2s ease-in both;
}
@keyframes slideContentUp {
  from {
    transform: translateY(100%); /*设置为正数则底部弹出来，负数则相反*/
  }

  to {
    transform: translateY(0%);
  }
}

@keyframes slideContentDown {
  from {
    transform: translateY(0%);
  }

  to {
    transform: translateY(100%);
  }
}
.buy_box_wrap{
  flex: 1;
  overflow-y: auto;
  padding-top: 100upx;
}
.add_to_cart{
  border-radius: 30upx;
  height: 60upx;
  width: 200upx;
  position: relative;
}
.add_to_cart_icon{
  height: 100%;
  background: rgba(255, 243, 240, 0.9);
  width: 100%;
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding-left: 20upx;
}
.add_to_cart_btn{
  position: absolute;
  right: 0;
  height: 100%;
  width: 100%;
  text-align: center;
  background: #FD634E;
  border-radius: 30upx;
  line-height: 60rpx;
  font-size: 28upx;
  color: #fff;
}
</style>
