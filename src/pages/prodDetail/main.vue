<template>
  <div class="pb50 posre">
    <!--  <swiper class="h375" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
    <div class="pb50">
     <swiper class="h375" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
              :duration="duration">
          <div v-for="(item, index) in images" :key="index">
              <swiper-item>
                  <img :src="img" class="w100p h100p" mode="aspectFill"/>
              </swiper-item>
          </div>
      </swiper>-->
    <div class="w100p hswiper posre">
      <SelfSwiper :imgUrls="images" :self_class="'hswiper'" @swipclick="preview">
      </SelfSwiper>
      <div style="bottom:40rpx;right:32rpx"
           class="posab bradius50p bgblue flex-c-c flex-column w58 h58"
           v-if="proData.isDistribution == 1 && proData.commissionAmount && !proData.isAssemble && !proData.isKill"
           @click="distribution_top_tap()">
        <p class="fs8 textc cfff lh18">{{ lang.text_21 }}<br>返佣{{proData.commissionAmount}}元</p>
      </div>
    </div>

    <!-- 拼团 -->
    <AssembleInfo ref="assembleInfo"
                  @changeTypeId="changeTypeId"
                  :groupAssembleId="groupAssembleId"
                  :isJoin="isJoin"
                  :cardId="cardId"
                  :currentCompany="currentCompany"
                  v-if="proData.isAssemble"
                  :proData="proData"
                  :stockNum="proData.stockNum"
                  @goodsChoose='goodsChoose'
                  @showShare="showShare"></AssembleInfo>
    <!-- 秒杀 -->
    <SpikeBox v-if="proData.isKill"
              :killType="proData.killType"
              :spikePrice="proData.killPrice || 0"
              :diffTime="proData.killEndTime"
              :originalPrice="proData.price"></SpikeBox>
    <SeckillInfo ref="seckillInfo"
                 @changeTypeId="changeTypeId"
                 v-if="proData.isKill"
                 :cardId="cardId"
                 @car="car"
                 :stockNum="proData.stockNum"
                 :currentCompany="currentCompany"
                 :proData="proData"
                 @showShare="showShare" />
    <!-- 非拼团 非秒杀 -->
    <div class="bgfff pl16 bbf5f6"
         v-else-if="!proData.isKill && !proData.isAssemble">
      <p class="lh45 prod-detall-price">
        <span class="corange fs20 mr10">¥{{ goodsPrice || goodsMsg.price || 0}}</span>
        <span class="c38 fs14 pr15">库存：{{proData.stockNum || 0}}</span>
        <!--<span class="fs12 ca8 line-through">¥199.9</span>-->
      </p>
      <div class="disflex jsbet">
        <p class="over_2 fs14 c38 fbold flex1">
          {{ goodsMsg.name ? goodsMsg.name : '' }}
          {{ typeName ? typeName : '' }}
        </p>
        <button
                class="w46 pl10 bgfff contentbox textr disflex align-cen textr detall-share"
                @click="isShowShare = true"
                open-type=""
                hover-class="other-button-hover">
          <img :src="shareIcon"
               alt=""
               class="w10 h10 mr7" />
          <b class="fs12 ca8">{{ lang.text_0 }}</b>
        </button>
      </div>
    </div>
    <!--规格-->
    <div class="pl16 pr16 bgfff mb10"
         v-if="!proData.isAssemble && !proData.isKill">

      <div class="h44 disflex align-cen jsbet" @click="show_pop_tap('buynow')">
        <div class="disflex">
          <p class="fs14 ca8 mr14">{{ lang.text_1 }}</p>
          <p class="fs14 c38">{{ lang.text_2 }}</p>
        </div>
        <img :src="foldIcon" class="w10 h10">
      </div>
    </div>
    <!-- 宝贝详情 -->
    <div class="pl15 pr15 bgfff">
      <p class="lh43 textc fs14 ca8">{{ lang.text_3 }}</p>
      <div class="bgfff"
           v-html="goodsMsg.goodsDetails"></div>
    </div>
    <p class="lh43 textc fs12 ca8">{{ lang.text_4 }}</p>
    <!--bottom-->
    <!--右边悬浮框-->
    <div class="index_float_right trans2 overhidden"
         v-if="proData.isAssemble == 0 && proData.isKill == 0">
       <RightFloat :isShow="isShow"
                  @clickRightRowEvent="clickRightRowEvent"
                  :bottom="60"
                  :intoType="1"
                  :specId="typeId"></RightFloat>
      <div :class="{ fadeInRight: !isShow, fadeOutRight: isShow }"
           style="border-top-left-radius: 10rpx;border-bottom-left-radius: 10rpx;width: 40rpx;right: 0; bottom: 60px;"
           class="animated posfix fs10 ca8 textc floats trans2 shadow_gray bgfff pb15">
        <div class="pt16"
             @click="clickRightRowEvent">
          <img src="you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/right_row.png"
               alt=""
               style="width: 30rpx;transform: rotate(180deg);height: 30rpx;" />
        </div>
      </div>
    </div>
    <!--购买-->
    <div class="disflex fix_bottom bte8"
         v-if="goodsMsg.name">
      <div class="disflex flex1 bgfff textc posre">
        <div class="w33p pt7"
            @click="toProductList">
          <img :src="shopIocn"
              alt=""
              class="w20 h20" />
          <b class="cblue fs12 textc mt-4">{{ lang.text_5 }}</b>
        </div>
        <div class="w33p pt7"
            @click="makePhone">
          <img src="you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/tel_gray.png"
              alt=""
              class="w20 h20" />
          <b class="ca8 fs12 textc mt-4">{{ lang.text_6 }}</b>
        </div>
        <div class="w33p pt7"
            @click="collect">
          <img :src="likeIocn"
              alt=""
              class="w20 h20"
              v-if="!isCollect" />
          <img :src="likeSelectIocn"
              alt=""
              class="w20 h20"
              v-else />
          <b class="fs12 textc mt-4"
            :class="isCollect ? 'cblue' : 'ca8'">{{ lang.text_7 }}</b>
        </div>
        <LoginIntercept />
      </div>
      <!-- 拼团 -->
      <div class="collage w220 disflex textc fs16 cfff borderbox bgfff posre"
           v-if="canbuy && proData.isAssemble">
        <div v-if="!isJoin"
             class="w50p bg_line_yellow flex-c-c flex-column"
             @click="buyCollage('alone')">
          <span class="textc fs16 lh18">¥{{ (proData.price / 100).toFixed(2) }}</span>
          <span class="textc fs14 lh18">{{ lang.text_8 }}</span>
        </div>
        <div v-if="!isJoin"
             class="w50p bg_line_orange flex-c-c flex-column"
             @click="buyCollage('group')">
          <span class="textc fs16 lh18">¥{{ (proData.assemblePrice / 100).toFixed(2) }}</span>
          <span class="textc fs14 lh18">{{ lang.text_9 }}</span>
        </div>
        <div v-if="isJoin"
             class="w100p bg_line_orange flex-c-c flex-column"
             @click="buyCollage('join')">
          <span class="textc fs16 lh18">¥{{ (proData.assemblePrice / 100).toFixed(2) }}</span>
          <span class="textc fs14 lh18">{{ lang.text_10 }}</span>
        </div>
        <LoginIntercept />
      </div>
      <!-- 非拼团 -->
      <div class="posre w220 disflex textc fs16 cfff pr15 pt5 pb5 borderbox bgfff lh40"
           v-if="canbuy && !proData.isAssemble">
        <span class="w50p bg_line_yellow add_to_card"
              @click="show_pop_tap('addToCart')">{{ lang.text_11 }}</span>
        <span class="w50p bg_line_orange buy_now"
              @click="show_pop_tap('buynow')">{{ lang.text_12 }}</span>
        <LoginIntercept />
      </div>
      <div class="w220 bg_line_orange textc fs18 cfff lh49 disflex align-cen jscen"
           @click="toIM"
           v-else-if="!canbuy && !proData.isAssemble"
          >
        <img src="you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/icon_message%403x.png"
             alt=""
             class="w24 h24 mr7" />
        <span>{{ lang.text_13 }}</span>
      </div>
    </div>
    <!-- <div v-if="showShareOrSave">
      <ShareOrSave :status="showShareOrSave"
                   @closeModal="closeModal"
                   @save="save">
      </ShareOrSave>
    </div> -->
    <!--全屏预览-->
    <div class="mask disflex align-cen jscen"
         v-if="isPreviewImg">
      <div class="disinblock">
        <div class="disflex flex-end ">
          <img @click="closePreviewImg"
               src="/static/close.png"
               style="height: 48rpx; width: 48rpx"/>
        </div>
        <img class="img-size bradius5"
             :src="maskImg" />
        <span @click="saveImg"
              class="bg_line_blue cfff textc fs18 fbold bradius5 lh44 mb15"
              style="width: 465rpx;display: block">{{ lang.text_14 }}</span>
      </div>
    </div>
    <LoginDialog :isShow="showLogin"
                 @loginSuccess="loginSuccess"
                 @cancelLogin="cancelLogin"/>
    <div v-if="isPopUp"
         class="bottom-pop-up-box posre" @click="pop_tap()">
      <div :class="isPopUp ? 'fadeInUps' : 'fadeOutDowns'"
           class="bottom-pop-up posab w100p bgfff bra_top_5 animated" @click.stop>
        <div class="pl15 pr15 pt15 borderbox">
          <div class="pop-up-top disflex">
            <img :src="images[0]" class="w110 h110 bradius5">
            <div class="pt40 pl15">
              <div class="pb19 text-bottom">
                <span class="lh1 c78 fs12 mr10">{{ lang.text_15 }}</span>
                <span class="lh1 fs12 corange mr3">¥ </span>
                <span class="fs20 corange lh1">{{ goodsPrice || goodsMsg.price || 0}}</span>
              </div>
              <div class="pb19 text-bottom">
                <p>
                  <span class="lh1 c78 fs12">{{ lang.text_16 }}</span>
                  <span class="lh1 c78 fs12">
                    {{ typeName ? typeName: '' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <div v-for="(items, index1) in types"
                :key="index1">
              <p class="fs14 ca8 pb10 mt10"
                v-if="items.goodSpecModelList">{{items.specName}}</p>
              <div>
                <span v-for=" (item,index2) in items.goodSpecModelList"
                      class="fs12 c38  pl10 pr11 mr10 bgf5f6 disinblock lh30 bradius3 bf5f6 size_item"
                      :class=" item.select ? 'active' : '' "
                      @click="typeChoice(item,items,index1,index2)"
                      :key="index2">{{ item.specAttribute }}</span>
              </div>
            </div>
          </div>
          <div style="background: #E8E8E8;height: 1px;margin: 30rpx 0;"
              class="disflex"></div>
          <div class="disflex jsbet align-cen">
            <div class="fs14 ca8">{{ lang.text_17 }}</div>
            <div class="counter disflex number-change-btn-group">
              <span class="textc be8 lh25 w25 minus ca8"
                    @click.stop="prodChangeNum(-1)">
                <img src="you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190505113629.png"
                    class="w10 h10" />
              </span>
              <span class="bte8 bbe8 fs12 c68 w40 lh25 textc">
                <input type="number"
                      v-model="num"
                      class="lh22 h25" />
              </span>
              <span class="textc be8 lh25 w25 add ca8"
                    @click.stop="prodChangeNum(1)">
                <img src="you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190505113647.png"
                    class="w10 h10" />
              </span>
            </div>
          </div>
        </div>
        <div class="pop-up-btn" v-if="canbuy && !proData.isAssemble" @click="pre_order">
            确认
        </div>
        <div class="pop-up-btn" v-else-if="!canbuy && !proData.isAssemble" @click="toIM">
            立即咨询
        </div>
      </div>
    </div>
    <!-- 分享弹窗 -->
    <cover-view class="w100p h100p prod_choose_class borderbox disflex column-reverse"
                :class="{show : isShowShare} "
                @click.stop="isShowShare = false">
      <cover-view class="bgfff inner textc pt20">
        <cover-view class="fs18 c38 fbold textc mb20">{{ lang.text_18 }}</cover-view>
        <cover-view class="share-box">
          <button style="margin-right: 60upx;margin-left: 0;background: #fff;"
                  class="flex-c-c flex-column"
                  open-type="share">
            <cover-image class="share-img mauto"
                         src="you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/weixin_share.png"></cover-image>
            <cover-view class="fs12 ca2">{{ lang.text_19 }}</cover-view>
          </button>
          <cover-view style="margin-left: 60upx;"
                      class="disflex align-cen flex-column"
                      @click="save">
            <cover-image class="share-img mb8"
                         src="you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/weixin_share2.png"></cover-image>
            <cover-view class="fs12 ca2">{{ lang.text_20 }}</cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
    </cover-view>
    <div v-if="dialog_show">
      <DialogBox type="hint4"
                 dialog_title="申请成为分销员"
                 dialog_ph="推荐商品给您的朋友，订单成功后即"
                 dialog_ph_2="可获得"
                 default_2="丰富现金奖励"
                 right="立即申请"
                 @distribution_close="distribution_close"
                 @distribution_tap="distribution_tap"
                 ></DialogBox>
    </div>
  </div>
</template>
<script>
import SelfSwiper from "@/components/swiper"; //
import RightFloat from "@/components/rightFloat"; // 订单项
import ShareOrSave from "@/components/shareOrSave";
import WXAJAX from "../../utils/request";
import util from "../../utils/index";
import { mapGetters, mapActions } from "vuex";
import AssembleInfo from "./components/AssembleInfo";
import SeckillInfo from "./components/SeckillInfo";
import SpikeBox from "./components/SpikeBox";
import LoginIntercept from "@/components/LoginIntercept";
import HandleLogin from "@/utils/handleLogin";
import { addShareRecord } from "@/utils/behavior";
import LoginDialog from "@/components/login";
import DialogBox from "@/components/dialogBox";
import LangUtils from '../../utils/LangUtils';

export default {
  name: "",
  components: {
    SelfSwiper,
    RightFloat,
    ShareOrSave,
    AssembleInfo,
    SpikeBox,
    LoginIntercept,
    SeckillInfo,
    LoginDialog,
    DialogBox
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().prodDetail,
      showShareOrSave: false, // 显示分享/保存下拉选框
      canbuy: true, //是否可以支付
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      img:
        "you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/food.jpg",
      images: [],
      types: [
        {
          title: "类型",
          lists: [
            {
              name: "系统租用",
              id: "0"
            },
            {
              name: "源码出售",
              id: 1
            }
          ],
          selectId: 0
        },
        {
          title: "规格",
          lists: [
            {
              name: "3000/年",
              id: 0
            },
            {
              name: "10个／15斤装",
              id: 1
            },
            {
              name: "一斤装",
              id: 2
            }
          ],
          selectId: 0
        }
      ],
      typeId: 0, //规格id
      goodsPrice: "",
      goodId: 0,
      goodsMsg: {
        goodsDetails: "",
        name: "",
        price: ""
      },
      isCollect: false, //是否收藏
      cardTel: "",
      type_id_1: 0, //
      type_index_1: 0,
      type2_index_1: 0, //二级分类id
      right_float_show: false, //右边悬浮框
      cardId: 0,
      num: 1, // 加入购物车/直接下单的数量
      placeOrder: false,
      forwardId: wx.getStorageSync("forwardId"),
      forwardGoodsId: wx.getStorageSync("forwardGoodsId"),
      shareForwardId: "", // 给别人分享生成的ID，onShareAppMessage中使用async函数后，自定义内容无效，所以移动至最开始调用获取分享id
      isPreviewImg: false,
      maskImg: "",
      isShow: true,
      userId: "",
      isLogin: HandleLogin.returnIsLogin() || false, //是否已经登录
      //拼团数据
      assembleData: null,
      //获取的数据详情
      proData: {},
      //是否是从参团页面过来的，只允许参团
      isJoin: false,
      //参团页面的参团ID
      groupAssembleId: -1,
      showLogin: false, //是否显示登录弹窗
      specName: "",
      selectArr: [],
      typeArr: [], // 选择商品类型数组
      typeName: "" ,//选择的商品类型名字
      stockNum:0, //库存数量
      specsId:[], //商品类型id数组
      messageIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/icon_message.png',
      shareIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/share_gray.png',
      likeIocn:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/details_like.png',
      likeSelectIocn:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/details_like_select.png',
      shopIocn:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/details_shop.png',
      foldIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_fold.png',
      isPopUp:false,
      btnType:'',
      queryType: false,
      isShowShare:false, //弹窗显隐
      dialog_show:false, //申请分销弹窗
      isSalesman:'', //是否为分销员
      parentId:''
    };
  },
  async onLoad(options) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = `/${currentPage.route}`;
    wx.setStorageSync('pages',url)
    // 重置页面部分显示数据
    /**this.showShareOrSave = false;
			this.maskImg = '';
			this.isPreviewImg = false;
			this.num = 1;
			this.images = [];
			this.goodsMsg = {
			  goodsDetails : '',
			  name : '',
			  price : ''
			};**/
    // 判断是否存在 storage -- prod
    console.log(options)
    let param = util.formatParams(decodeURIComponent(options.scene));
    console.log(param,param)
    let jumpParam = []
    if(param.f && param.cp &&  param.cp ){
      jumpParam = param
    }

    if(options.shareShow){
      this.isShowShare = true
    }
    console.log('options',options)
    if (wx.getStorageSync("prod")) {
      let prod = wx.getStorageSync("prod");
      this.images = prod.goodPhoto ? prod.goodPhoto.split(",") : [];
      this.goodsMsg = {
        goodsDetails: prod.goodsDetails,
        name: prod.goodsName,
        price: prod.price
      };
      wx.removeStorageSync("prod");
    }
    let query = this.$root.$mp.query;
    if(query.companyId){
      this.getcompany(query.companyId)
    }
    //获取是否有参团的逻辑
    this.isJoin = query.join || false;
    this.groupAssembleId = query.assembleId || -1;
    console.log("当前的query值", query);
    if (query.cardId) {
      //从分享的商品页面进入
      this.cardId = query.cardId;
      this.goodId = query.goodId;
      this.cardTel = query.tel;
      await this.findCompany(this.cardId);
    } else {
      this.cardTel = wx.getStorageSync("CARDTEL") || "";
      this.goodId = this.$root.$mp.query.goodId ? this.$root.$mp.query.goodId == 'undefined'  ? "" : this.$root.$mp.query.goodId  : "";
      this.cardId = wx.getStorageSync("CARDID") || 0;
    }
    this.checkCollect();

    this.judgeCompany(jumpParam);
    this.forwardId = jumpParam.f || wx.getStorageSync("forwardId");
    this.forwardGoodsId = wx.getStorageSync("forwardGoodsId");
    this.parentId = wx.getStorageSync("parentId")
    // let companyId = wx.getStorageSync("COMPANYID")
    // let forwardArr = wx.getStorageSync("forwardArr")

    if(this.goodId || this.forwardId || this.parentId){
      this.addGoodsForwardRecord(this.cardId, this.goodId, parentId).then(res => {
        this.shareForwardId = res;
        wx.setStorageSync("forwardId",this.shareForwardId)
      });
    }

    //this.getProdSize() ;
    if(query.type == 'demand'){
      this.queryType = true
    }else{
      this.queryType = false
    }
    wx.showShareMenu({
      withShareTicket : true,
      menus:['shareAppMessage','shareTimeline']
    })
  },
  async onShow(options) {
    this.getdistributorApp()

    this.getProdDetail();
  },
  async onPullDownRefresh() {
    this.checkCollect();
    this.getProdDetail();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1 * 1000);
  },
  onPageScroll() {
    this.right_float_show = false;
  },
  onShareAppMessage(e) {
    this.validGoodsForwardRecord();
    let url = this.goodsMsg.coverImg || "";
    let companyId = uni.getStorageSync('COMPANYID') || ''
    let uuid = this.cardId + "" + new Date().getTime();
    addShareRecord(this.currentCompany.companyId, 3, this.goodId, uuid).then(
      res => {},
      err => {}
    );
    let parentId = wx.getStorageSync('forwardId') || ''
    let path =
      "/pages/prodDetail/main?goodId=" +
      this.goodId +
      "&cardId=" +
      this.cardId +
      "&tel=" +
      this.cardTel +
      "&companyId=" +
      companyId +
      "&forwardId=" +
      this.shareForwardId +
      "&parentId=" +
      parentId +
      "&goType=1" +
      "&shareId=" +
      uuid;
    console.log("当前的path值", path);

    return {
      title: this.goodsMsg.name,
      path:
        "/pages/prodDetail/main?goodId=" +
        this.goodId +
        "&cardId=" +
        this.cardId +
        "&tel=" +
        this.cardTel +
        "&companyId=" +
        this.currentCompany.companyId +
        "&forwardId=" +
        this.shareForwardId +
        "&parentId=" +
         parentId +
        "&goType=1" +
        "&shareId=" +
        uuid,
      imageUrl: url
    };
  },
  onShareTimeline(e) {
    this.validGoodsForwardRecord();
    let url = this.goodsMsg.coverImg || "";
    let companyId = uni.getStorageSync('COMPANYID') || ''
    let uuid = this.cardId + "" + new Date().getTime();
    addShareRecord(this.currentCompany.companyId, 3, this.goodId, uuid).then(
      res => {},
      err => {}
    );
    let parentId = wx.getStorageSync('forwardId') || ''
    let query =
      "goodId=" +
      this.goodId +
      "&cardId=" +
      this.cardId +
      "&tel=" +
      this.cardTel +
      "&companyId=" +
      companyId +
      "&forwardId=" +
      this.shareForwardId +
      "&parentId=" +
      parentId +
      "&goType=1" +
      "&shareId=" +
      uuid;

    return {
      title: this.goodsMsg.name,
      query:query,
      imageUrl: url
    };
  },
  onUnload() {
    this.typeId = "";
  },
  computed: {},
  methods: {
    ...mapActions(["setCurrentCompany"]),
    //获取公司信息
    async findCompany(cardId) {
      wx.showLoading();
      let url = "/businessCard/cardDetails";
      //获取数据
      // wx.showLoading();
      try {
        let data = await WXAJAX.POST(
          {
            cardId,
            refresh: true || ""
          },
          "",
          url
        );
        this.setCurrentCompany(data);
        wx.hideLoading();
      } catch (error) {
        wx.hideLoading();
      }
    },
    loginSuccess() {
      // this.onReady();
    },
    //取消登录
    cancelLogin() {
      this.showLogin = false;
    },
    showShare() {
      if(!this.proData.goodSpecModelList && this.proData.goodSpecModelList[0].goodSpecModelList[0] ){
        wx.showToast({
          title: "请选择规格",
          duration: 1000,
          icon: "error",
          mask: true
        });
        return;
      }
      this.isShowShare = true;
    },
    clickRightRowEvent() {
      this.isShow = !this.isShow;
    },
    // 关闭预览图片
    closePreviewImg() {
      this.isPreviewImg = false;
      wx.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#ffffff",
        animation: {
          duration: 1
        }
      });
    },
    // 保存图片
    saveImg() {
      wx.saveImageToPhotosAlbum({
        filePath: this.maskImg,
        success: res => {
          wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#ffffff",
            animation: {
              duration: 1
            }
          });
          this.isPreviewImg = false;
          wx.showToast({
            title: "保存成功",
            duration: 1000,
            icon: "success",
            mask: true
          });
        },
        fail: res => {
          wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#ffffff",
            animation: {
              duration: 1
            }
          });
          this.isPreviewImg = false;
          wx.showToast({
            title: "保存失败",
            duration: 1000,
            icon: "none",
            mask: true
          });
        }
      });
    },
    // 生成太阳码

    // forwardArr.
    save() {
      wx.showLoading({
        mask:true,
        title:'加载中'
      });
      this.showShareOrSave = false;
      let forwardArr = wx.getStorageSync('forwardArr') || ''
      let currentCompanyId = wx.getStorageSync('COMPANYID')
      let parentId = ''
      if(forwardArr.cp == currentCompanyId){
        parentId  = forwardArr.f
      }
      if (this.maskImg !== "") {
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#848485",
          animation: {
            duration: 200
          }
        });
        this.isPreviewImg = true;
        wx.hideLoading();
        return;
      }

      //如果不是分销员就传普通的参数，不然就传分销id
      let data = data = {
          parentId: parentId || '',
          forwardId:this.shareForwardId,
          specId: this.proData.goodSpecModelList[0].goodSpecModelList[0].specId//取一个规格
        }
      // if(this.isSalesman !== 'pass'){
      //   data = {
      //     specId: this.proData.goodSpecModelList[0].goodSpecModelList[0].specId//取一个规格
      //   }
      // }else{
      //   data = {
      //     parentId: parentId || '',
      //     forwardId:this.shareForwardId,
      //     specId: this.proData.goodSpecModelList[0].goodSpecModelList[0].specId//取一个规格
      //   }
      // }
      WXAJAX.POST(
        data,
        "",
        "/goods/goodsCardV2"
      ).then(data => {
        const url = WXAJAX.imgBackUrl + data;
        console.log("太阳码地址:" + url);
        wx.getImageInfo({
          src: url,
          fail: err =>{
            console.log("err:",err)
            wx.hideLoading();
          },
          success: sres => {
            wx.hideLoading();
            this.validGoodsForwardRecord()
            this.maskImg = sres.path;
            wx.setNavigationBarColor({
              frontColor: "#000000",
              backgroundColor: "#848485",
              animation: {
                duration: 200
              }
            });
            this.isPreviewImg = true;
          }
        });
      });
    },
    validGoodsForwardRecord(parentId) {
      let data = {}
      if(parentId){
        data = {
          parentId:uni.getStorageSync('forwardId') || '',
          forwardId: this.shareForwardId
        }
      }else{
        data = {
          forwardId: this.shareForwardId
        }
      }
      // 将分销id转为
      WXAJAX.POST(
        data,
        "",
        "/record/validGoodsForwardRecord"
      ).then(res => {

      });
    },
    prodChangeNum: function(n) {
      let num = parseInt(this.num.toString().replace(/[^\d]/g, "") || 0);
      this.num = num + n > 0 ? num + n : 1;
    },
    toIM() {
      console.log(this.currentCompany,this.typeId)
      WXAJAX.ToIMPage(this.currentCompany, 1, this.typeId);
      // uni.navigateTo({
      //   url: `/pages/IM/main?type=1&cardId=${this.cardId}&userId=${this.currentCompany.userId}&logo=${this.currentCompany.logo}&specId=${this.typeId || ''}&name=${this.currentCompany.name}`
      // })
      // wx.navigateTo({
      //   url: '/pages/IM/main?type=1' +'&cardId=' + this.cardId +
      //     '&userId=' + this.userId +
      //     '&logo=' + this.currentCompany.logo +
      //     '&specId=' + (this.typeId || '') +
      //     '&name=' + this.currentCompany.name
      // });
    },
    getProdDetail(refresh) {
      if (!this.goodId) return;
      let v = this;
      const { parentId, specId } = this.$root.$mp.query;
      let url = ''
      //判断是否从产品中心来 切换请求url
      if(this.queryType){
        url = '/goods/getGoodsInfoDemand'
      }else{
        url = '/goods/getGoodsInfo'
      }
      WXAJAX.POST(
        {
          goodsId: v.goodId,
          cardId: this.cardId,
          refresh: refresh || ""
        },
        "",
        url
      )
        .then(data => {
          console.log(data)
          if (data && data.goodsId) {
            this.proData = data;
            if(data.phone){
              v.cardTel = data.phone
            }
            v.goodsMsg = {
              goodsDetails:v.formatRichText(data.goodsDetails)  || "",
              name: data.goodsName,
              // price: data.isKill ? (data.killPrice / 100) : (data.price / 100),
              price: data.price / 100,
              coverImg: data.coverImg
            };
            v.goodsMsg.price = v.goodsMsg.price.toFixed(2);
            v.canbuy = data.ispayment == 1;
            v.stockNum = data.stockNum
            var arrays = [];
            arrays.push(data.goodPhoto);
            data.goodPhoto &&
              (v.images =
                data.goodPhoto.indexOf(",") != -1
                  ? data.goodPhoto.split(",")
                  : arrays);
            if (!data.goodSpecModelList) {
              return false;
            }
            for (var i in data.goodSpecModelList) {
              for (var j in data.goodSpecModelList[i].goodSpecModelList) {
                data.goodSpecModelList[i].goodSpecModelList[j].select = false;
                data.goodSpecModelList[i].goodSpecModelList[j].price =
                  data.goodSpecModelList[i].goodSpecModelList[j].price / 100;
              }
            }
            v.types = data.goodSpecModelList;
            data.goodSpecModelList[0].goodSpecModelList[0].select = false;
            v.typeArr.push(data.goodSpecModelList[0].goodSpecModelList[0])
            // v.specsId.push(data.goodSpecModelList[0].goodSpecModelList[0].specId)
            v.goodsPrice = data.goodSpecModelList[0].goodSpecModelList[0].price;
            v.selectArr.push(data.goodSpecModelList[0].goodSpecModelList[0]);
            v.typeName = v.types[0].goodSpecModelList[0].specAttribute;
            //取默认规格用于咨询
            if(data && data.goodSpecModelList && data.goodSpecModelList[0].goodSpecModelList && data.goodSpecModelList[0].goodSpecModelList[0].specId){
              this.typeId = data.goodSpecModelList[0].goodSpecModelList[0].specId;
            }
            //获取拼团数据
            if (data.goodsAssembleModel) {
              this.assembleData = data.goodsAssembleModel;
            }
          }
        })
        .catch(err => {
          console.log(err)
          // v.goodsMsg = {};
          // v.images = [];
        });
    },
    getProdSize() {
      //查询产品规格
      let v = this;
      const { parentId, specId } = this.$root.$mp.query;
      WXAJAX.POST(
        {
          goodsId: v.goodId
        },
        "",
        "/goods/getGoodSpec"
      )
        .then(
          data => {
            if (data) {
              data.forEach(function(i, k) {
                if (i.goodSpecModelList) {
                  //有二级分类
                  i.selectId = i.goodSpecModelList[0].specId;
                  i.price = i.goodSpecModelList[0].price / 100;
                  i.specNum = i.goodSpecModelList[0].specNum;
                } else {
                  i.selectId = i.specId;
                  i.price = i.price / 100;
                }
              });
              v.types = data;
              v.type_id_1 = parentId || v.types[0].specId;
              v.goodsPrice = v.types[0].price;
              v.typeId = specId || v.types[0].selectId;
              if (parentId)
                v.type_index_1 = data.indexOf(
                  data.find(res => res.specId == parentId)
                );
              v.type_index_1 = v.type_index_1 == -1 ? 0 : v.type_index_1;
            }
            //获取拼团数据
            if (data.goodsAssembleModel) {
              this.assembleData = data.goodsAssembleModel;
            }
          },
          err => {
            if (err.code && err.code === 401) {
              this.showLogin = true;
            }
          }
        )
        .catch(err => {
          // v.goodsMsg = {};
          // v.images = [];
        });
    },
    getProdSize() {
      //查询产品规格
      let v = this;
      const { parentId, specId } = this.$root.$mp.query;
      WXAJAX.POST(
        {
          goodsId: v.goodId
        },
        "",
        "/goods/getGoodSpec"
      )
        .then(data => {
          if (data) {
            data.forEach(function(i, k) {
              if (i.goodSpecModelList) {
                //有二级分类
                i.selectId = i.goodSpecModelList[0].specId;
                i.price = i.goodSpecModelList[0].price / 100;
                i.specNum = i.goodSpecModelList[0].specNum;
              } else {
                i.selectId = i.specId;
                i.price = i.price / 100;
              }
            });
            v.types = data;
            v.type_id_1 = parentId || v.types[0].specId;
            v.goodsPrice = v.types[0].price;
            v.typeId = specId || v.types[0].selectId;
            if (parentId)
              v.type_index_1 = data.indexOf(
                data.find(res => res.specId == parentId)
              );
            v.type_index_1 = v.type_index_1 == -1 ? 0 : v.type_index_1;
          }
        })
        .catch(err => {
          v.typeId = 0;
          v.goodsPrice = "";
          v.types = [];
        });
    },
    //修改typeId及killPrice
    changeTypeId(id, type, price) {
      this.typeId = id;
      console.log("changeTypeId", id, type, price);
      if (type == "isKill") {
        if (price) {
          this.proData.killPrice = price;
        }
      } else if (type == "isAssemble") {
        this.proData.assemblePrice = price;
      }
    },
    checkCollect() {
      //
      WXAJAX.checkCollect({
        itemType: 1,
        itemId: this.goodId
      })
        .then(data => {
          this.isCollect = data.status;
          console.log(this.isCollect);
        })
        .catch(err => {});
    },
    //  之前商品类型选择的时间
    // type_tap_1(id_1, index_1) {
    //   //点击一级分类
    //   this.type_id_1 = id_1;
    //   this.type_index_1 = index_1;
    //   this.type_tap(
    //     this.type_index_1,
    //     0,
    //     this.types[this.type_index_1].goodSpecModelList[0].specId
    //   );
    // },
    // type_tap(index_1, index_2, id) {
    //   wx.showLoading();
    //   this.types[index_1].selectId = id;
    //   let price = (
    //       this.types[index_1].goodSpecModelList[index_2].price / 100
    //     ).toFixed(2),
    //     specNum = this.types[index_1].goodSpecModelList[index_2].specNum;
    //   this.$set(this.types[index_1], "price", price);
    //   this.$set(this.types[index_1], "specNum", specNum);
    //   this.goodsPrice = price;
    //   this.typeId = id;
    //   this.type2_index_1 = index_2;
    //   wx.hideLoading();select
    // },
    typeChoice(item, items, idex1, index2) {
      wx.showLoading();
      this.typeArr = [];
      this.goodsPrice = 0
      this.typeName = ''
      this.selectArr[idex1] = index2;
      this.specsId = []
      this.selectArr = this.selectArr.concat([]);
      console.log(this.selectArr)
      if (item.select !== true) {
        items.goodSpecModelList.forEach(v => {
          v.select = false;
        });
        item.select = !item.select;
      } else {
        item.select = false;
      }
      for (var i in this.types) {
        let arr = this.types[i].goodSpecModelList.filter(v => {
          return v.select == true;
        });
        if (arr.length > 0) {
          this.goodsPrice += arr[0].price;
          if(this.typeArr.length == 0){
            this.typeName = arr[0].specAttribute;
          }else{
           this.typeName =  this.typeName + '/' + arr[0].specAttribute;
          }
          this.specsId.push(arr[0].specId)
          this.typeArr.push(arr);
        }
      }
      this.goodsPrice = Number(this.goodsPrice.toFixed(2));
      this.typeId = this.specsId
      wx.hideLoading();
    },
    toProductList() {
      // 查询当前用户是否登录,未登录则引导登录
      if (this.isLogin == false) {
        this.showLogin = true;
      }
      wx.switchTab({
        url: "/pages/Products/main"
      });
    },
    page_turn(url) {
      wx.navigateTo({
        url: "../" + url + "/main?type=3"
      });
    },
    //选择了秒杀
    seckill(type) {
      this.$refs["seckillInfo"].seckill(type);
    },
    buynow() {
      //如果是秒杀,需要唤起选择类型和规格的弹框
      if(this.num > this.proData.stockNum){
        wx.showToast({
          title:'购买数量不可超过库存',
          icon:'none'
        })
        this.num = 1
        return
      }
      if (this.proData.isKill) {
        this.seckill("buy");
        return;
      }
      if(this.typeArr.length == 0){
        wx.showToast({
          title:'请先选择商品',
          icon:'none'
        })
        return false
      }

      // if(this.specsId.length < this.types.length){
      //   wx.showToast({
      //     title:'请选择你要的商品信息',
      //     icon:'none'
      //   })
      //   return
      // }

      console.log(this.specsId)
      if(this.specsId == ""){
        wx.showToast({
          title:'请先选择商品',
          icon:'none'
        })
        return
      }
      let currentGoods = this.types[0].goodSpecModelList[0]
      currentGoods = JSON.parse(JSON.stringify(currentGoods));

      currentGoods.goodsId = this.types[0].goodsId;
      currentGoods.goodsName = this.goodsMsg.name;
      currentGoods.num = this.num;
      currentGoods.photoUrl = this.images[0];
      currentGoods.cardId = this.cardId;
      currentGoods.price = this.goodsPrice.toFixed(2);
      currentGoods.allPrice = this.goodsPrice * currentGoods.num;
      currentGoods.specName =  this.typeName;
      currentGoods.specIds = this.specsId
      let tmpObj = {
        companyId: this.currentCompany.companyId,
        companyName: this.currentCompany.companyName,
        orderState: 1,
        allNum: 1,
        orderPrice: currentGoods.price * currentGoods.num,
        shopcartModelList: [currentGoods]
      };
      this.isPopUp = false
      wx.setStorageSync("orderInfo", [tmpObj]);
      wx.navigateTo({
        url: "../orderConfirm/main"
      });
    },
    //拼团购买
    buyCollage(type) {
      this.$refs["assembleInfo"].buyCollage(type);
    },
    collect() {
      //收藏

      wx.showLoading();
      let _url = "",
        _request = {};
      if (this.isCollect) {
        //取消收藏
        _url = "/personal/delCollection";
      } else {
        //添加收藏
        _url = "/personal/addCollection";
      }
      _request = {
        itemType: 1,
        itemId: this.goodId
      };
      WXAJAX.POST(_request, "", _url)
        .then(data => {
          if (data) {
            this.isCollect = !this.isCollect;
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    makePhone() {
      //拨打电话
      util.MakePhone(this.cardTel || "");
    },
    car(payload) {

      this.typeId = payload.specIds;
      this.num = payload.num;
      this.addToCart(true);
    },
    addToCart(isKill) {

      // 查询当前用户是否登录,未登录则引导登录
      if (this.isLogin == false) {
        this.showLogin = true;
      }
      //加入购物车
      if (this.proData.isKill) {
        if (typeof isKill !== "boolean") {
          this.seckill("car");
          return;
        }
      }

      if(this.typeId == 0){
        wx.showToast({
          title: "请选择商品规格！",
          icon: "none",
          duration: 1000
        });
        return;
      }
      let v = this;
      wx.showLoading();
      WXAJAX.POST(
        {
          goodsId: v.goodId,
          cardId: v.cardId,
          specIds: v.typeId, //规格ID
          specId:0,
          forwardId: v.goodId == v.forwardGoodsId ? v.forwardId : "",
          num: v.num
        },
        "",
        "/orders/addShopcart"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            wx.showToast({
              title: "成功！",
              icon: "success",
              duration: 1000
            });
          }
        })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: "none"
          });
        });
    },
    //选择商品后同步数据
    goodsChoose(data){

    },
    pop_tap(){
      this.isPopUp = false
    },
    show_pop_tap(type){
      if(this.proData.isKill !== 1){
        this.btnType = type
        this.isPopUp = true
      }else{
        this.$refs["seckillInfo"].showSpecChooseModel();
      }
    },
    pre_order(){
      if(this.btnType == 'addToCart'){
        this.addToCart()
      }else if(this.btnType == 'buynow'){
        this.buynow()
      }
    },
    getcompany(companyId) {
      //获取公司信息
      let v = this;
      WXAJAX.POST(
        {
          companyId: companyId
        },
        "",
        "/demandSquare/getCompanyUserInfo"
      )
        .then((data, code) => {
          if (data) {
            uni.setStorageSync('CARDID'.data.cardId)
            uni.setStorageSync('COMPANYID'.data.companyId)
          }
        })
        .catch(err => {
          this.company_msg = {};
        });
    },
    distribution_top_tap(){
      //this.isShowShare = true
      if(!this.proData.isDistribution){
        return
      }
      if(this.isSalesman == 'notPass'){
        uni.showToast({
          title:'申请还在审批，请耐心等待',
          icon:'none',
          mask:true
        })

      }else if(this.isSalesman =='notApply'){
        this.dialog_show = true
      }else{
        this.isShowShare = true
      }
    },
    distribution_tap(){
      this.dialog_show = false
      uni.navigateTo({
        url:'../distributionCenter/applyFor/main'
      })
    },
    distribution_close(){
      this.dialog_show =false
    },
    //海报


    //判断是哪个分销公司
    judgeCompany(jumpParam){
      if(this.$root.$mp.query.forwardId || jumpParam.f){
        let forwardId = this.$root.$mp.query.forwardId || jumpParam.f
        this.getShareGoodsInfoDetail(forwardId)
      }
    },
    //获取分享商品详情
    getShareGoodsInfoDetail(forwardId){
      let v = this;
      if(!forwardId){
        return
      }
      WXAJAX.POST(
        {
          forwardId: forwardId,
        },"",'/goods/getGoodsInfoDetail'
      )
      .then(data => {
        if (data) {
          this.proData = data;
          this.goodId = data.goodsId
          wx.setStorageSync('CARDID',data.cardId)
          wx.setStorageSync('COMPANYID',data.companyId)
          if(data.phone){
            v.cardTel = data.phone
          }
          if(v.goodId || v.forwardId || v.parentId){
            v.addGoodsForwardRecord(v.cardId, v.goodId, v.parentId).then(res => {
              this.shareForwardId = res;
              wx.setStorageSync("forwardId",v.shareForwardId)
            });
          }
          v.goodsMsg = {
            goodsDetails: data.goodsDetails || "",
            name: data.goodsName,
            // price: data.isKill ? (data.killPrice / 100) : (data.price / 100),
            price: data.price / 100,
            coverImg: data.coverImg
          };
          v.goodsMsg.price = v.goodsMsg.price.toFixed(2);
          v.canbuy = data.ispayment == 1;
          v.stockNum = data.stockNum
          console.log(v.stockNum)
          var arrays = [];
          arrays.push(data.goodPhoto);
          data.goodPhoto &&
            (v.images =
              data.goodPhoto.indexOf(",") != -1
                ? data.goodPhoto.split(",")
                : arrays);
          if (!data.goodSpecModelList) {
            return false;
          }
          for (var i in data.goodSpecModelList) {
            for (var j in data.goodSpecModelList[i].goodSpecModelList) {
              data.goodSpecModelList[i].goodSpecModelList[j].select = false;
              data.goodSpecModelList[i].goodSpecModelList[j].price =
                data.goodSpecModelList[i].goodSpecModelList[j].price / 100;
            }
          }
          v.types = data.goodSpecModelList;
          data.goodSpecModelList[0].goodSpecModelList[0].select = false;
          v.typeArr.push(data.goodSpecModelList[0].goodSpecModelList[0])
          // v.specsId.push(data.goodSpecModelList[0].goodSpecModelList[0].specId)
          v.goodsPrice = data.goodSpecModelList[0].goodSpecModelList[0].price;
          v.selectArr.push(data.goodSpecModelList[0].goodSpecModelList[0]);
          v.typeName = v.types[0].goodSpecModelList[0].specAttribute;
          //获取拼团数据
          if (data.goodsAssembleModel) {
            this.assembleData = data.goodsAssembleModel;
          }
        }
      })
      .catch(err => {
        // v.goodsMsg = {};
        // v.images = [];
      });
    },
    //查询是否为分销员
    getdistributorApp(){
      let data = {
        companyId:wx.getStorageSync('COMPANYID'),
        distributorUserId:wx.getStorageSync('userId')
      }
      WXAJAX.POST(data,'','/distributor/distributorApp')
      .then(data=>{
        if(!data){
          return uni.showToast({
            title:'未设置分销员申请开关',
            icon:"none"
          })
        }
        if(data.appStatus === 0){
          this.isSalesman = 'notPass'
        }else if(data.appStatus == undefined ){
          this.isSalesman = 'notApply'
        }else{
          this.isSalesman = 'pass'
        }
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },
    formatRichText(html){

      if(html){
        let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
          match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
          match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
          match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
          return match;
        });
        newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
          match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
          return match;
        });
        newContent = newContent.replace(/<br[^>]*\/>/gi, '');
        newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:10rpx auto;"');
        return newContent;
      }
      return "";

    },
    onShareEvent(){

    },
    preview(idx) {
      this.previewImages(this.images, this.images[idx]);

    }
  },
  computed: {
    ...mapGetters(["currentCompany"])
  }
};
</script>
<style>
page {
  width: 100%;
  height: 100%;
  background: #f5f5f6;
}

.size_item.active {
  color: #51cdcb;
  background: #e5f8f7;
  border: 1upx solid #51cdcb;
}

.add_to_card {
  border-radius: 40upx 0 0 40upx;
}

.buy_now {
  border-radius: 0 40upx 40upx 0;
}

.prod_detail_float > div {
  bottom: 200upx;
}

.number-change-btn-group > span:first-child {
  line-height: 46upx;
  border-radius: 10upx 0 0 10upx;
}

.number-change-btn-group > span:last-child {
  line-height: 46upx;
  border-radius: 0 10upx 10upx 0;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.img-size {
  width: 465upx;
  height: 827.08upx;
  margin-top: 30upx;
  margin-bottom: 60upx;
}

.collage {
  height: 98upx;
}
.prod-detall-price{
  display: flex;
  justify-content: space-between;
}
</style>
<style scoped>
.detall-share{
  border-radius:22upx 0 0 22upx;
  background: #F5F5F6;
  line-height: 2;
  padding-right: 20upx;
}
.bottom-pop-up-box{
  transition: all 0.5s;
  position: fixed;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}
.bottom-pop-up{
  transition: all 0.5s;
  box-sizing:border-box;
  bottom: 0;
  transform: translateY(100%);
}
.pop-up-top{
  margin-bottom: 50upx;
}
.pop-up-btn{
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #FE7563, #FD634E);
  color: #ffffff;
  font-size: 36upx;
  height: 98upx;
  margin-top: 30upx;
}
.fadeInUps {
  transition: all 0.5s;
  transform: translateY(0);
}
.fadeOutDowns {
  transition: all 0.5s;
  transform: translateY(100%);
}
.prod_choose_class {
  position: fixed;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  bottom: -100%;
  /* transition: all 0.2s linear; */
}
.prod_choose_class .inner {
  border-radius: 10upx 10upx 0 0;
}
.prod_choose_class .inner {
  border-radius: 10upx 10upx 0 0;
}
.show {
  bottom: 0;
  z-index: 1000;
}
.share-box {
  display: flex;
  padding-left: 50rpx;
  padding-right: 50rpx;
  justify-content: space-around;
  margin-top: 20upx;
  margin-bottom: 30upx;
}
.share-img {
  width: 100upx;
  height: 100upx;
}

</style>
