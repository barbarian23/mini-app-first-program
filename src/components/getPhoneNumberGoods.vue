<template>
  <div class="posre">
  <GetPhoneNumber class="posre" @next="$emit('next', goodInfo.goodsId,goodInfo.companyId,goodInfo)">
        <FormId >
          <div v-if="goodsType==='goods'">
            <div class="bradius10 w168 h270  mt10 bgfff prod_item" v-if="type !== 'transverse'">
                <div class="w100p posre h168a">
                  <img :lazy-load="true" :src="goodInfo.prodLogo" mode="aspectFill" alt="" class="w100p h168a pro-img">
                  <div style="bottom:10rpx;right:10rpx"
                       class="posab bradius50p bgblue flex-c-c flex-column w58 h58"
                       v-if="goodInfo.isDistribution == 1 && goodInfo.commissionAmount && !goodInfo.isAssemble && !goodInfo.isKill">
                    <p class="fs8 cfff lh18 textc" v-if="goodInfo.commissionAmount">{{ lang.text_0 }}<br>返佣{{goodInfo.commissionAmount}}元</p>
                  </div>
                </div>

                <!-- <img v-if="goodInfo.isDistribution"  src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/icon13.png" class="isDistribution" style=""  /> -->
                <img v-if="goodInfo.isAssemble" :src="assembleIcon" class="isAssemble"/>
                <img v-if="goodInfo.isKill" :src="KillIcon" class="isAssemble"/>

                <p class="fs14 lh15 minh30 c38 over_2 pl16 pr22 pt7 mb7 goods-name">{{goodInfo.goodsName}}</p>
                <p class="fs12 pl16">
                <span class="corange pr7">
                  <b class="disinblock">￥</b>
                  <b class="fs20 fbold disinblock" v-if="goodInfo.isKill">{{goodInfo.killPrice || '0.00'}}</b>
                  <b
                    class="fs20 fbold disinblock"
                    v-if="goodInfo.isAssemble"
                  >{{goodInfo.assemblePrice/100 || '0.00'}}</b>
                  <b
                    class="fs20 fbold disinblock"
                    v-if="!goodInfo.isKill&&!goodInfo.isAssemble"
                  >{{goodInfo.price || '0.00'}}</b>
                </span>
                <span class="ca8 pr7 fs12" v-if="goodInfo.isKill||goodInfo.isAssemble">
                  <b class="fbold disinblock line-through">￥{{goodInfo.price}}</b>
                </span>
                <!-- isAssemble -->
                <!--<span class="ca8 line-through">￥198</span>-->
                <!-- goodInfo.isAssemble ||  -->
                </p>
            </div>
            <div v-else>
              <ProductTransverse
                  :goodInfo="goodInfo"
              >
              </ProductTransverse >
            </div>
          </div>
          <ProductCard v-else
                       :imgUrl="goodInfo.prodLogo"
                       :title="goodInfo.productsName"
                       :desc="goodInfo.describe"
                       :type="'transverse'"
                       :typeName="goodInfo.productsTypeName"
                       :price="goodInfo.price"
                       :goodsName="goodInfo.goodsName"
          >
          </ProductCard>
      </FormId>

  </GetPhoneNumber>
    <LoginIntercept class="login-intercept"/>
  </div>
</template>

<script>
  import FormId from "@/components/formId";
  import GetPhoneNumber from '@/components/getPhoneNumber'
  import ProductCard from '@/components/ProductCard'
  import LoginIntercept from "@/components/LoginIntercept";
  import ProductTransverse from "@/components/ProductTransverse";
  import WXAJAX from "@/utils/request";
  import LangUtils from '../utils/LangUtils';

  export default {
    name: "getPhoneNumberGoods",
    props:{
      goodInfo:{
        type: Object,
        default(){return{}},
      },
      goodsType: {
        type: String,
        default: 'goods',  // goods商城中商品， product预约中商品
      },
      type:{
        type:String,
        default:'vertical'
      }
    },
    data(){
      return{
        lang: LangUtils.getLangSrc().components.getPhoneNumberGoods,
        KillIcon: WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_label_2.png',
        assembleIcon: WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_label_3.png'
      }
    },
    components: { GetPhoneNumber, ProductCard, FormId, LoginIntercept,ProductTransverse },
    methods:{
        loginGuide(){
            this.$emit('loginGuide');
        }
    },
    mounted(){

    },
  }
</script>

<style scoped>
.prod_item {
  position: relative
}
  .prod_item>img{
    border-radius:20upx 20upx 0 0;
  }
  .goods-name{
    height:30upx;
    overflow:hidden;
    text-overflow: ellipsis;
    display:-webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

.isDistribution {
  position: absolute;
  left: 0;
  top: 276upx;
  width: 160upx;
  height: 60upx;
  border-radius: 0 !important;
}
.isAssemble {
  position: absolute;
  top:290upx;
  left: 0upx;
  width: 127upx;
  height: 46upx;
  border-radius: 0 !important;
}
</style>
