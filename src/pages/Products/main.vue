<template>
  <div class="posre borderbox wrapper h100p shopping-mall"
       :style="{height: mainHeight + 'px'}">
    <NavBarByUser @cancelLoginGuide="cancelLoginGuide"
                  :isLogin="isLogin"
                  :isShowLoginGuide="isShowLoginGuide"
                  :isShowCardCase="true"
                  @loginSuccess="loginSuccess"
                  @loginFailed="loginFailed"
                  :avatarUrl.sync="avatarUrl" />
    <div class="title-tabbar">
      <div class="column-title-box">
        <div class="column-title"
             :class="item.select == true ? 'title-active' : ''"
             v-for="item in titleList"
             :key="item"
             @click="selectColumn(item)">
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="product"
         v-if="switchType == 1">
      <scroll-view :style="{height: scrollContentHeight - 48 + 'px'}"
                   class="dynamic-content"
                   :scroll-y="true"
                   :enable-back-to-top="true"
                   :scroll-anchoring="true"
                   :upper-threshold="0"
                   :lower-threshold="0"
                   @scrolltoupper='scrolltoupper'
                   @scrolltolower="scrolltolower">
        <div class="w100p swiper-box">
          <SelfSwiper :imgUrls="banners"
                      :swiper_height_class="true"
                      :self_class="'h211'"
                      :isShowMask="true"
                      @swipclick="preview"
                      :isShowDots="false" />
        </div>

        <div class="bgfff">
          <div class="fs18 cfff disflex pl15 pr16 company-title">
            <img :src="slectedImg"
                 class="w20 h20"
                 @click="collect"
                 v-if="isCollect">
            <img :src="collectImg"
                 alt=""
                 class="w20 h20 posre"
                 @click="collect"
                 v-if="!isCollect">
            <div class="search-goods"
                 @click="toSearchGoods">
              <img :src="searchImg"
                   alt=""
                   class="w15 h15 mr8">{{ lang.text_0 }}</div>
            <image :src="discountImg"
                   class="w30 h34"
                   @click="couponCenter"></image>
          </div>
        </div>

        <div>
          <div class="nav_top">
            <div class="posre disflex pl15 pr15 bgfff">
              <scroll-view scroll-x
                           class="nav"
                           scroll-with-animation>
                <div class="">
                  <div class="nav-item"
                       v-for="(navItem,idx) in menu"
                       :key="idx"
                       :class="menu_id == navItem.goodstypeId ?'active':''"
                       @click="menu_tap(navItem.goodstypeId)">{{navItem.name}}
                  </div>

                </div>
              </scroll-view>
              <div class="flex1 disflex flex-end align-cen" @click="versionSwitching">
                <img :src="versionType == 'vertical' ?  icon_list_1 : icon_list_2" class="w15 h15">
              </div>
            </div>
          </div>

          <div class="disflex jsbet bgf5f6 pl15 pr16 wrap pb23"
               v-if="prod_lists.length">
            <getPhoneNumberGoods v-for="(v,k) in prod_lists"
                                 :key="k"
                                 :type="versionType"
                                 @next="toProdDetail"
                                 @loginGuide="loginGuide"
                                 :goodInfo="v">
            </getPhoneNumberGoods>
            <LoginIntercept @loginSuccess="loginInterceptSuccess"
                            class="login-intercept" />
          </div>
          <div v-else>
            <NoData>{{ lang.text_1 }}</NoData>
          </div>
          <!--lists end-->

        </div>

        <!--右边悬浮框-->
        <!--    <div class="posfix right11 add_white bottom10 w40 h40 bg_line_blue bradius50p textc lh40" @click="right_float_show = !right_float_show">-->

        <!--    </div>-->

        <!--bottom-->
        <div class="textc lh42 fs12 ca8 bgf5f6"
             v-if="nodata && prod_lists.length">{{ lang.text_3 }}</div>
      </scroll-view>
    </div>
    <div class="appointment"
         v-else>
      <scroll-view :style="{height: scrollContentHeight - 48 + 'px'}"
                   class="dynamic-content"
                   :scroll-y="true"
                   :enable-back-to-top="true"
                   :scroll-anchoring="true"
                   @scrolltoupper='scrolltoupperA'
                   @scrolltolower="scrolltolowerA">
        <div class="w100p swiper-box">
          <SelfSwiper :imgUrls="bannersA"
                      :self_class="'h211'"
                      :isShowMask="true"
                      @swipclick="preview"
                      :isShowDots="false" />
        </div>
        <div>
          <div class="nav_top">
            <div class="posre disflex pl15 pr15 bgfff">
              <scroll-view scroll-x
                           class="nav"
                           scroll-with-animation>
                <div class="nav-item"
                      v-for="(navItem,idx) in menuA"
                      :key="idx"
                      :class="menu_idA == navItem.productsTypeId ?'active':''"
                      @click="menu_tapA(navItem.productsTypeId)">{{navItem.productsTypeName}}
                </div>

              </scroll-view>

            </div>
          </div>
          <div class="bgf5f6 pl15 pr15 pb23"
               v-if="prod_listsA.length">
            <getPhoneNumberGoods v-for="(v,k) in prod_listsA"
                                 :key="k"
                                 goodsType="product"
                                 @next="toProdDetailA(v.productsId)"
                                 @loginGuide="loginGuide"
                                 :goodInfo="v">
            </getPhoneNumberGoods>

          </div>
          <div v-else>
            <NoData>{{ lang.text_1 }}</NoData>
          </div>
          <!--lists end-->

        </div>

        <!--右边悬浮框-->
        <!--    <div class="posfix right11 add_white bottom10 w40 h40 bg_line_blue bradius50p textc lh40" @click="right_float_show = !right_float_show">-->

        <!--    </div>-->

        <!--bottom-->
        <div class="textc lh42 fs12 ca8 bgf5f6"
             v-if="nodata && prod_listsA.length">{{ lang.text_3 }}</div>

        <!-- <div class="index_float_right trans2 overhidden">
          <RightFloat :isShow="isShow"  @clickRightRowEvent="clickRightRowEvent"></RightFloat>
          <div :class="{fadeInRight: !isShow, fadeOutRight: isShow}" style="width: 40rpx;right: 0;border-top-left-radius: 10rpx;border-bottom-left-radius: 10rpx"  class="animated posfix fs10 ca8 textc floats trans2 bottom30  shadow_gray bgfff pb15">
            <div class="pt16" @click="clickRightRowEvent">
              <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/right_row.png" alt="" style="width: 30rpx;transform: rotate(180deg);height: 30rpx;">
            </div>
          </div>
        </div> -->
      </scroll-view>
    </div>
    <!-- <button class='share-btn'
            open-type="share"
            hover-class="other-button-hover">
      <img :src="shareImg"
           class="w10 h10 mr5">
      <div>{{ lang.text_2 }}</div>
    </button> -->

    <FloatButtons class="index_float_right trans2 overhidden"
                  :isShowTalk="isShowTalk"
                  :avatarUrl="targetAvatarUrl"
                  :isLogin="isLogin"
                  :isBayWindow="isBayWindow"
                  @talk="talk"
                  @loginGuide="loginGuide"></FloatButtons>
    <!-- 商城优惠券 -->
    <shopCoupon ref="shopCoupon"
                @></shopCoupon>

  </div>
</template>

<script>
import appointment from "@/components/appointments/main";
import shopCoupon from "@/components/shopCoupon"; // 商城优惠券
import RightFloat from "@/components/rightFloat"; // 订单项
import getPhoneNumberGoods from "@/components/getPhoneNumberGoods"; //
import AuthenticationTag from "@/components/AuthenticationTag"; //
import WXAJAX from "../../utils/request";
import NoData from "@/components/noData";
import utils from "@/utils";
import { authSubscribeOrder, authSubscribeMessage } from "../../utils/auth.js";
import SelfSwiper from "@/components/swipers"; //
import { mapState, mapGetters } from "vuex";
import FloatButtons from "@/components/FloatButtons.vue";
import NavBarByUser from "@/components/NavBarByUser.vue";
import HandleLogin from "@/utils/handleLogin";
import LoginIntercept from "@/components/LoginIntercept";
import { addShareRecord } from "@/utils/behavior";
import LangUtils from '../../utils/LangUtils'

export default {
  name: "",
  components: {
    RightFloat,
    NoData,
    getPhoneNumberGoods,
    SelfSwiper,
    AuthenticationTag,
    FloatButtons,
    NavBarByUser,
    LoginIntercept,
    shopCoupon,
    appointment
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().Products,
      canClickStar: true, // 是否可以点击star按钮
      menu: [{ name: "全部", goodstypeId: "-10" }],
      menu_id: "-10",
      menuA: [{ name: "全部", goodstypeId: "-10" }],
      menu_idA: "-10",
      prod_lists: [],
      prod_listsA: [],
      nodata: false, //是否已经没有数据
      COMPANYID: 0,
      company_msg: {
        admin_logo: "",
        company_logo: "",
        company_name: ""
      },
      currentPage: 1,
      isCollect: false, //是否收藏
      collectionId: 0,
      page: 1,
      pageA: 1,
      isLoading: false, //是否在加载
      right_float_show: false, //右边悬浮框
      nav_top: false,
      banners: [
        "http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png"
      ],
      bannersA: [
        "http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png"
      ],
      isShow: true,
      avatarUrl: "", //用户的头像地址,
      isLogin: HandleLogin.returnIsLogin() || false, //是否已经登录
      isShowTalk: true, //是否显示右边侧边栏的聊一聊
      isShowLoginGuide: true, //是否显示登录引导页,
      targetAvatarUrl: "", //当前目标的人物头像
      scrollContentHeight: 0, //中间滚动区域的高度
      mainHeight: 0, //整体高度
      versionType:wx.getStorageSync('version') || 'vertical',//商品列表横竖切换
      titleList: [
        {
          name: "产品商城",
          select: true
        },
        {
          name: "预约服务",
          select: false
        }
      ],
      switchType: 1,
      collectImg: WXAJAX.imgBackUrl + "one-stand/products/icon_collect.png",
      slectedImg:
        WXAJAX.imgBackUrl + "one-stand/products/icon_collect_slected.png",
      discountImg: WXAJAX.imgBackUrl + "one-stand/products/icon_discount.png",
      searchImg: WXAJAX.imgBackUrl + "one-stand/products/icon_search.png",
      shareImg: WXAJAX.imgBackUrl + "one-stand/products/share_gray.png",
      icon_list_1:WXAJAX.imgBackUrl + "yimai_photos/crmRevision/icon_list_1.png",
      icon_list_2:WXAJAX.imgBackUrl + "yimai_photos/crmRevision/icon_list_2.png",
      isCollected:wx.getStorageSync('showBayWindow') || '',
      isBayWindow:false,//飘窗显隐
    };
  },
  onLoad(options){
    console.log(options)
    //分享进入
    if(options.shareId){

      uni.setStorageSync('CARDID',options.cardId)
      uni.setStorageSync('COMPANYID',options.companyId)
    }
  },
  /** tab点击 */
  onTabItemTap(item) {
    //订阅授权 信息相关
    authSubscribeOrder(this.subscriptionNew);
  },
  onHide() {
    this.$refs.shopCoupon.showCouponModel = false;
  },
  onUnload() {
    this.$refs.shopCoupon.showCouponModel = false;
  },
  onShow() {
    this.isLogin = HandleLogin.returnIsLogin() || false;
    this.$refs.shopCoupon.showCouponModel = false;
    //获取当前的公司
    let lastCompanyid = this.COMPANYID;
    let couponCompanyId = wx.getStorageSync("couponCompanyId") || 0;
    if(couponCompanyId){
      this.COMPANYID = couponCompanyId
    }else{
      this.COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    }
    //this.getProds();

    if (lastCompanyid != this.COMPANYID || !this.COMPANYID) {
      this.prod_lists = [];
      this.page = 1;
      this.pageA = 1
      this.getcompany();
      this.getTypeMenus();
      this.menu_tap("-10");
      this.menu_tapA("-10");
      this.getAd();
    }
    this.isLogin = HandleLogin.returnIsLogin() || false;
    this.isBayWindow = wx.getStorageSync("showBayWindow")
    this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    this.$refs.shopCoupon.getCompanyCoupon(wx.getStorageSync("COMPANYID"));

    wx.showShareMenu({
      withShareTicket : true,
      menus:['shareAppMessage','shareTimeline']
    })
  },
  async mounted() {
    let a = await utils.systemIfo();
    let navHeight = getApp().globalData.navHeight;
    this.mainHeight = a.windowHeight;
    this.scrollContentHeight = a.windowHeight - navHeight;
  },
  computed: {
    ...mapState({
      currentCompany: state => state.currentCompany
    }),
    ...mapGetters(["subscriptionNew"])
  },
  watch: {
    currentCompany: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal) {
          if (newVal.userId === wx.getStorageSync("userId")) {
            this.isShowTalk = false;
          } else {
            this.isShowTalk = true;
            this.targetAvatarUrl = newVal.logo;
          }
        }
      }
    }
  },

  onShareAppMessage(e) {
    let COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    let CARDID = wx.getStorageSync("CARDID") || 0;

    this.addGoodsForwardRecord(CARDID);
    let uuid = CARDID + "" + new Date().getTime();
    addShareRecord(COMPANYID, 2, "", uuid).then(
      res => {},
      err => {}
    );
    return {
      path:
        "/pages/Products/main?cardId=" +
        CARDID +
        "&companyId=" +
        COMPANYID +
        "&goType=1&shareId=" +
        uuid,
      success(e) {
        wx.showShareMenu({
          withShareTicket: true
        });
      },
      fail(e) {
        console.log("Failed to share business card--- ", e);
      }
    };
  },
  onShareTimeline(e) {
    let COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    let CARDID = wx.getStorageSync("CARDID") || 0;

    this.addGoodsForwardRecord(CARDID);
    let uuid = CARDID + "" + new Date().getTime();
    let query = "cardId=" + CARDID +"&companyId=" +COMPANYID +"&goType=1&shareId=" +uuid;
    console.log(query)
    return {
      title:'商城',
      query:query,
      success(e) {
        console.log(query)
      },
      fail(e) {
      }
    };
  },
  onPageScroll(e) {
    // if (e.scrollTop > 200) {
    //   wx.setNavigationBarColor({
    //     frontColor: '#000000',
    //     backgroundColor: '#ffffff',
    //     animation: {
    //       duration: 200,
    //       timingFunc: 'easeIn'
    //     }
    //   })
    // } else {
    //   wx.setNavigationBarColor({
    //     frontColor: '#ffffff',
    //     backgroundColor: '#ffffff',
    //     animation: {
    //       duration: 200,
    //       timingFunc: 'easeIn'
    //     }
    //   });
    // }
  },
  async onPullDownRefresh() {
    // to doing..
    // 停止下拉刷新
    wx.showNavigationBarLoading();
    this.page = 1;
    this.pageA = 1;
    this.nodata = false;
    this.isLoading = false;
    //this.getProds();
    //this.getMeuns();
    this.getcompany();
    this.getAd();
    this.menu_tap(this.menu_id || "-10");
    this.menu_tapA(this.menu_idA || "-10");
    wx.showLoading();
    wx.stopPullDownRefresh();
    setTimeout(function() {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
    }, 300);
  },
  methods: {
    couponCenter() {
      console.log("Coupon Center");
      wx.navigateTo({
        url: "/pages/coupon/couponlist/main"
      });
    },
    //下拉刷新
    scrolltoupper(e) {
      this.page = 1;
      this.nodata = false;
      this.isLoading = false;
      this.getcompany();
      this.getAd();
      this.menu_tap(this.menu_id || "-10");
      wx.showLoading();
    },
    scrolltoupperA(e){
      this.pageA = 1;
      this.nodata = false;
      this.isLoading = false;
      this.getAd();
      this.menu_tapA(this.menu_idA || "-10");
      this.getTypeMenus();
    },

    //上拉加载更多

    scrolltolower(e) {
      console.log(this.page)
      let v = this;
      v.getProds();
    },
    scrolltolowerA() {
      this.getProdsA();
    },
    //隐藏登录引导
    cancelLoginGuide() {
      this.isShowLoginGuide = false;
    },
    //需要登录引导的回调
    loginGuide() {
      this.isShowLoginGuide = true;
    },
    // 其他监听事件登录 成功回调
    loginInterceptSuccess() {
      console.log("Login interception callback");
      this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    },
    //聊一聊
    talk() {
      authSubscribeMessage(this.subscriptionNew);
      wx.navigateTo({
        url:
          "../IM/main?userId=" +
          this.currentCompany.userId +
          "&logo=" +
          this.currentCompany.logo +
          "&type=2&cardId=" +
          this.currentCompany.cardId +
          "&name=" +
          this.currentCompany.name +
          "&wxCode=" +
          (this.currentCompany.personalWx || "") +
          "&phone=" +
          this.currentCompany.phone
      });
    },
    //头像登录成功的回调
    loginSuccess(url) {
      this.isLogin = true;
      this.hasCard = wx.getStorageSync("hasCard") || false;
      this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    },
    loginFailed() {
      this.isShowLoginGuide = true;
    },
    toSearchGoods() {
      console.log("toSearchGoods");
      wx.navigateTo({ url: "../searchGoods/main?companyId=" + this.COMPANYID });
    },
    preview(idx) {
      this.previewImages(this.banners, this.banners[idx]);
    },

    clickRightRowEvent() {
      authSubscribeOrder(this.subscriptionNew);
      this.isShow = !this.isShow;
      console.log("Put away the floating window");
    },
    getAd() {
      this.getPlateAds(1)
      .then(res => {
        this.banners = res
          ? res.map(val => val.photo)
          : [
            "http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png"
          ];
      })
      .catch(() => {
        this.banners = [
          "http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png"
        ];
      });
      this.getPlateAds(2)
      .then(res => {
        this.bannersA = res
          ? res.map(val => val.photo)
          : [
              "http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png"
            ];
      })
      .catch(() => {
        this.bannersA = [
          "http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png"
        ];
      });
    },
    getcompany() {
      //获取公司信息
      let v = this;
      WXAJAX.POST(
        {
          companyId: v.COMPANYID
        },
        "",
        "/goods/getCompanyInfo/V2"
      )
        .then((data, code) => {
          if (data) {
            v.company_msg = {
              admin_logo: data.userLogo || "",
              company_logo: data.companyLogo || "",
              company_name: data.companyName || ""
            };
            v.company_msg = {
              company_logo: data.companyLogo,
              company_name: data.companyName
            };
            v.isCollect = data.isCollection == 1;
            if (data.goodstypeModelList) {
              // v.menu_id = data.goodstypeModelList[0].goodstypeId ;
              v.menu = [
                { name: "全部", goodstypeId: -10 },
                ...data.goodstypeModelList
              ];
              //获取分类下的产品
            } else {
              v.menu_id = "";
              v.menu = "";
              v.prod_lists = [];
            }
          }
        })
        .catch(err => {
          this.company_msg = {};
        });
    },
    getMeuns() {
      //获取所有的分类
      let v = this;
      wx.showLoading();
      WXAJAX.POST(
        {
          companyId: v.COMPANYID
        },
        "",
        "/goods/getGoodsType"
      )
        .then((data, code) => {
          // wx.hideLoading();
          if (data) {
            v.company_msg = {
              company_logo: data[0].companyLogo,
              company_name: data[0].companyName
            };
            v.menu_id = data[0].goodstypeId;
            v.menu = data;
            v.isCollect = data[0].isCollection == 1;
            //获取分类下的产品
            v.menu_tap(v.menu_id);
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
          v.menu = [];
        });
    },
    // 获取预约分类
    getTypeMenus() {
      WXAJAX.POST(
        {
          companyId: this.COMPANYID
        },
        "",
        "/products/selectProductsTypeList/V2"
      ).then(res => {
        if (res) {
          this.menuA = [
            { productsTypeName: "全部", productsTypeId: -10 },
            ...res
          ];
        } else {
          this.menuA = [{ productsTypeName: "全部", productsTypeId: -10 }];
        }
      });
    },
    checkCollect() {
      //
      authSubscribeOrder(this.subscriptionNew);
      WXAJAX.checkCollect({
        itemType: 3,
        itemId: this.COMPANYID
      })
        .then(data => {
          this.isCollect = data.status;
          this.collectionId = data.collectionId || 0;
        })
        .catch(err => {});
    },
    getProds() {
      //获取产品
      let v = this;
      if (v.isLoading || !wx.getStorageSync('COMPANYID')) {
        wx.hideLoading();
        return;
      }
      v.isLoading = true;
      WXAJAX.POST(
        {
          goodstypeId: v.menu_id,
          pageNum: v.page,
          companyId: wx.getStorageSync("COMPANYID"),
          cardId: wx.getStorageSync("CARDID"),
          isPutOn:true//只查询上架的商品
        },
        "",
        "/goods/getGoodsList/V2"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            if(v.page === 1){
              v.prod_lists = []
            }
            data.forEach(function(i, k) {
              if (i.goodPhoto) {
                i.prodLogo = i.goodPhoto.split(",")[0];
              } else {
                i.prodLogo = "";
              }
              if (i.price) {
                i.price /= 100;
                i.price = i.price.toFixed(2);
              } else {
                i.price = "";
              }

              if (i.isKill) {
                i.killPrice = i.killPrice / 100;
                i.killPrice = i.killPrice.toFixed(2);
                i.originPrice = i.price;
              }
            });
            v.prod_lists = [...v.prod_lists, ...data];
            v.page++;
            setTimeout(function() {
              v.isLoading = false;
            }, 500);
          } else {

          }
        })
        .catch(err => {
          console.log(err);
          v.prod_lists = [];
          wx.hideLoading();
          if (err.code == 204) {
            v.nodata = true;
          }
          setTimeout(function() {
            v.isLoading = false;
          }, 500);
        });
    },
    getProdsA() {
      //获取产品
      let v = this;
      if (v.isLoading || !wx.getStorageSync('COMPANYID')) {
        wx.hideLoading();
        return;
      }
      if(v.page === 1){
        v.prod_listsA = []
      }
      v.isLoading = true;
      WXAJAX.POST(
        {
          productsTypeId: v.menu_idA == -10 ? "" : v.menu_idA,
          pageNum: v.pageA,
          companyId: wx.getStorageSync("COMPANYID"),
          cardId: wx.getStorageSync("CARDID")
        },
        "",
        "/products/selectProductsPage/V2"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            v.prod_listsA = [];
            data.pageInfo.list.forEach(function(i, k) {
              if (i.productsPhoto) {
                i.prodLogo = i.productsPhoto.split(",")[0];
              } else {
                i.prodLogo = "";
              }
              if (i.price) {
                let price;

                try {
                  price = JSON.parse(i.price);
                } catch (e) {
                  price = parseInt(i.price) || 0;
                }

                if (
                  Object.prototype.toString.call(price).toLowerCase() ===
                  "[object number]"
                ) {
                  i.price = price.toFixed(2);
                } else {
                  i.price = price.map(val => parseInt(val)).join("~");
                }
              } else {
                i.price = "";
              }
            });

            v.prod_listsA = [...v.prod_listsA, ...data.pageInfo.list];
            v.pageA++;
            setTimeout(function() {
              v.isLoading = false;
            }, 500);
          } else {

          }
        })
        .catch(err => {
          console.log(err);
          v.prod_lists = [];
          wx.hideLoading();
          if (err.code == 204) {
            v.nodata = true;
          }
          setTimeout(function() {
            v.isLoading = false;
          }, 500);
        });
    },
    menu_tap(id) {
      this.menu_id = id || "";
      this.page = 1;
      this.nodata = false;
      this.isLoading = false;
      this.prod_lists = [];
      wx.showLoading();
      this.getProds();
    },
    menu_tapA(id) {
      authSubscribeMessage(this.subscriptionNew);
      this.menu_idA = id || "";
      this.pageA = 1;
      this.nodata = false;
      this.isLoading = false;
      this.prod_listsA = [];
      // wx.showLoading() ;
      this.getProdsA();
    },
    toProdDetail: utils.throttle(function(id) {
      let prod = this.prod_lists.filter(prod => {
        return prod.goodsId === id;
      })[0];
      wx.setStorageSync("prod", prod);
      wx.navigateTo({ url: "../prodDetail/main?goodId=" + id });
    }, 1000),
    toProdDetailA: utils.throttle(function(id) {
      wx.navigateTo({
        url: "/pages/appointmentPack/productDetail/main?goodId=" + id
      });
    }, 1000),
    collect() {
      //收藏企业
      // 没有登录，提醒登录
      if (!HandleLogin.returnIsLogin()) {
        this.loginGuide();
        return;
      }
      if (this.canClickStar) {
        this.canClickStar = false;
        let _url = "",
          _request = {};
        if (this.isCollect) {
          //取消收藏
          _url = "/personal/delCollection";
          _request = {
            itemType: 3,
            itemId: this.COMPANYID
          };
        } else {
          //添加收藏
          _url = "/personal/addCollection";
          _request = {
            itemType: 3,
            itemId: this.COMPANYID
          };
        }
        WXAJAX.changeCollect(_request, _url)
          .then(data => {
            console.log(data);
            if (data) {
              this.isCollect = !this.isCollect;
              wx.showToast({
                // 这玩意要不要，跟产品协商一下，感觉体验不好
                title: this.isCollect ? "收藏成功！" : "取消收藏！",
                icon: "none",
                duration: 2000
              });
            }
            setTimeout(() => {
              // 防止用户多次点击，具体时间咨询产品
              this.canClickStar = true;
            }, 200);
          })
          .catch(err => {
            setTimeout(() => {
              this.canClickStar = true;
            }, 200);
          });
      }
    },
    selectColumn(item) {
      for (var i in this.titleList) {
        this.titleList[i].select = false;
      }
      item.select = true;
      if (item.name == "产品商城") {
        this.switchType = 1;
      } else if (item.name == "预约服务") {
        this.switchType = 2;
      }
    },
    versionSwitching(){
      if(this.versionType == 'vertical'){
        this.versionType =  'transverse'
        wx.setStorageSync('version','transverse')
      }else{
        this.versionType = 'vertical'
        wx.setStorageSync('version','vertical')
      }

    }
  }
  // onReachBottom() {
  //   this.showCompany = false;
  //   wx.showLoading({
  //     title : '加载中...',
  //   });
  //   let v = this ;
  //   v.getProds();
  // },
};
</script>

<style scoped>
.shopping-mall {
  position: relative;
}
.company-title {
  height: 70rpx;
  align-items: center;
  display: flex;
}
.menu_more {
  right: 32upx;
  top: 0;
  bottom: 0;
  margin: auto;
}
.nav {
  height: 90upx;
  width: 90%;
  line-height: 88upx;
  font-size: 28upx;
  white-space: nowrap;
  /* position: sticky;
    top: 0; */
  /*   position: fixed;
       top: 0;
       left: 0;
       z-index: 99;*/
}
.nav_top {
  position: sticky;
  background: white;
  /* padding-top: 140upx; */
  /* margin-top: -140upx; */
  top: 0;
  z-index: 100;
}
.nav-item {
  /*width: 20%;*/
  display: inline-block;
  text-align: center;
  margin-right: 48upx;
}

.nav-item.active {
  border-bottom: 4upx solid #51cdcb;
  color: #51cdcb;
  font-weight: bold;
}

.prod_float_right > div {
  bottom: 120upx;
}

/* 商城头部切换 */
.title-tabbar {
  height: 88upx;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  box-sizing: border-box;
  align-items: center;
  padding: 0 30upx;
}
.column-title-box {
  box-sizing: border-box;
  width: 448upx;
  height: 78upx;
  display: flex;
  background-color: #f8f8f8;
  border: 1upx solid #e8e8e8;
  border-radius: 39upx;
}
.column-title {
  transition: all 0.4s;
  width: 224px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a2a0a0;
  border-radius: 39upx;
}
/* .column-title p{
  font-size: 36upx;
  color:#D1D1D1;
  font-weight:bold;
} */
.title-active {
  transition: all 0.4s;
  color: #ffffff !important;
  background-color: #51cdcb;
}
.column-title span {
  display: block;
  position: absolute;
  width: 60upx;
  height: 6upx;
  border-radius: 3upx;
  background-color: #51cdcb;
  bottom: 0;
  margin: 0 auto;
}
.swiper-box {
  box-sizing: border-box;
  padding: 20upx 30upx;
  background-color: #ffffff;
  color: #a8a8a8;
  font-size: 28rpx;
  align-items: center;
}
.search-goods {
  margin-left: 20upx;
  margin-right: 21upx;
  box-sizing: border-box;
  width: 550upx;
  height: 68upx;
  border-radius: 34upx;
  background-color: #f5f5f6;
  color: rgba(168, 168, 168, 1);
  display: flex;
  font-size: 28upx;
  align-items: center;
  padding: 0 41upx 0 41upx;
}
.share-btn {
  position: fixed;
  border-top-left-radius: 20upx;
  border-bottom-left-radius: 20upx;
  line-height: 1;
  top: 300upx;
  right: -6upx;
  width: 118upx;
  height: 40upx;
  background: rgba(245, 245, 246, 1);
  color: rgba(168, 168, 168, 1);
  display: flex;
  font-size: 24upx;
  justify-content: space-between;
  padding: 0upx 21upx;
  align-items: center;
  z-index: 99;
}
</style>
