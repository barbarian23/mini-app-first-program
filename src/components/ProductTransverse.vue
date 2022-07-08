<template>
  <div class="product-card posre" :style="outStyle">
    <img :src="goodInfo.prodLogo" alt="" class="thumbnail" mode="aspectFill">
    <img v-if="goodInfo.isAssemble" :src="assembleIcon" class="isAssemble"/>
    <img v-if="goodInfo.isKill" :src="KillIcon" class="isAssemble"/>
    <div class="synopsis borderbox w200">
      <div class="w100p">
        <div class="title fs14 w100p over_1">
          {{goodInfo.goodsName}}
        </div>
      </div>
      <div class="footer">
        <div class="price-type disflex jsbet align-cen">
          <div class="price">
            <span class="corange pr7">
              <b class="disinblock fs12">￥</b>
              <b class="fs18 fbold disinblock" v-if="goodInfo.isKill">{{goodInfo.killPrice || '0.00'}}</b>
              <b
                class="fs18 fbold disinblock"
                v-if="goodInfo.isAssemble"
              >{{goodInfo.assemblePrice/100 || '0.00'}}</b>
              <b
                class="fs18 fbold disinblock"
                v-if="!goodInfo.isKill&&!goodInfo.isAssemble"
              >{{goodInfo.price || '0.00'}}</b>
            </span>
            <span class="ca8 pr7 fs12" v-if="goodInfo.isKill||goodInfo.isAssemble">
              <b class="fbold disinblock line-through">￥{{goodInfo.price}}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
export default {
  name: "ProductCard",
  props:{
    goodInfo:{
      type: Object,
      default(){return{}},
    },
  },
  data(){
    return{
      KillIcon: WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_label_2.png',
      assembleIcon: WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_label_3.png'
    }
  },
  methods(){
    console.log(this.goodInfo)
  },
}
</script>

<style scoped>
  .product-card{
    padding: 30upx;
    display: flex;
    background: white;
    border-radius: 20upx;
    margin-top: 22upx;
  }

  .product-card .thumbnail{
    flex:  0 0 216upx;
    width:216upx;
    height:220upx;
    border-radius:10upx;
    margin-right: 30upx;
  }

  .synopsis{
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    align-content: space-between;
  }

  .synopsis .title{
    font-size:28upx;
    color: #373737;
    line-height: 56upx;
    word-break: break-all;
  }

  .synopsis .desc{
    font-size:24upx;
    color:rgba(168,168,168,1);
    line-height: 40upx;
  }

  .synopsis .footer{
    width: 100%;
  }

  .price-type{
  }

  .price-type .price{
    color: #FD634E;
    font-size: 24upx;
  }

  .price-type .price span{
 
  }

  .price-type .tag{
    height:40upx;
    border: 1upx solid rgba(232,232,232,1);
    border-radius: 10upx;
    font-size: 20upx;
    color:rgba(168,168,168,1);
    padding: 0 14upx;
  }
</style>
<style scoped>
.isAssemble{
  position: absolute;
  width: 127upx;
  height: 46upx;
  left: 0;
  top: 0;
}
</style>>