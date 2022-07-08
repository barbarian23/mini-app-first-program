<template>
  <div class="mask" @click="close">
    <div
      class="spec-content animated"
      @click.stop=""
      :class="{ fadeInUps: isShowFadeIn, fadeOutDowns: !isShowFadeIn }"
    >
      <div class="pl15 pr15 pt15 pb15">
        <div class="goods-info disflex align-cen fs12">
          <img
            :src="goodsImg"
            alt=""
            class="goods-img mr10 bradius5"
            mode="aspectFill"
          />
          <div class="price-box">
            <div class="c78">
              价格
              <span class="ml10">
                <span class="corange">￥</span>
                <span class="corange fbold fs20" v-if="goodsInfo.isKill == 1">{{
                  goodsData.killPrice ? goodsData.killPrice.toFixed(2) : (typeLists[0].goodSpecModelList[0].killPrice/100).toFixed(2)
                }}</span>
                <span class="corange fbold fs20" v-else-if="buyType == 'alone'">{{
                  goodsData.goodsPrice ? goodsData.goodsPrice.toFixed(2) : (typeLists[0].goodSpecModelList[0].price).toFixed(2)
                }}</span>
                <span class="corange fbold fs20" v-else>{{
                  goodsData.assemblePrice ? goodsData.assemblePrice.toFixed(2) : (typeLists[0].goodSpecModelList[0].assemblePrice/100).toFixed(2)
                }}</span>
                <!-- <span v-else class="corange fbold fs20">{{
                  (typeLists[typeIdx] &&
                  typeLists[typeIdx].goodSpecModelList &&
                  typeLists[typeIdx].goodSpecModelList[specIdx]
                    ? typeLists[typeIdx].goodSpecModelList[specIdx].price
                    : 0) | formatMoney
                }}</span> -->
              </span>
            </div>
            <div class="=c38 mt14">库存：{{stockNum}}</div>
            <div class="c38 mt14 selectType">
              已选：
              <span>{{goodsData.typeName || '"' + typeLists[0].goodSpecModelList[0].specAttribute + '"'}}</span>
            </div>
          </div>
        </div>
        <!-- <div>
          <div class="pt15 pb10 ca8 fs14">类型</div>
          <div>
            <span
              v-for="(v, k) in typeLists"
              :class="{ active: typeIdx === k }"
              @click="choose('typeIdx', k)"
              class="size_item"
              :key="k"
            >
              {{ v.specName || "" }}
            </span>
          </div>
        </div>
        <div class="pb5">
          <div class="pt5 pb10 ca8 fs14">规格</div>
          <div>
            <span
              v-for="(v, k) in typeLists[typeIdx == -1 ? 0 : typeIdx]
                .goodSpecModelList"
              :class="{ active: specIdx === k }"
              @click="choose('specIdx', k)"
              class="size_item"
              :key="k"
            >
              {{ v.specAttribute || "" }}
            </span>
          </div>
        </div> -->
        <div>
          <div>
            <div class="pt5 ca8 fs14"
              v-for="(item, index1) in typeData"
              :key="index1"
            >
              {{ item.specName || "" }}
              <div>
                <span
                  v-for="(items, index2) in item.goodSpecModelList"
                  :class=" items.select ? 'active': '' "
                  @click="choose(item,items,index1,index2)"
                  class="size_item mt5"
                  :key="index2"
                >
                  {{ items.specAttribute || "" }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="pb5">
          <div>
            
          </div>
        </div>
        <div class="disflex jsbet align-cen pt15 bte8">
          <span class="ca8 fs14">数量</span>
          <div>
            <div class="counter disflex number-change-btn-group">
              <span
                class="textc be8 lh25 w25 minus ca8"
                @click.stop="prodChangeNum(-1)"
              >
                <img
                  src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190505113629.png"
                  class="w10 h10"
                />
              </span>
              <span class="bte8 bbe8 fs12 c68 w40 lh25 textc">
                <input type="number" v-model="num" class="lh22 h25" />
              </span>
              <span
                class="textc be8 lh25 w25 add ca8"
                @click.stop="prodChangeNum(1)"
              >
                <img
                  src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190505113647.png"
                  class="w10 h10"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="disflex btn-list">
        <div
          v-if="leftBtnText && goodsInfo.isKill == 0"
          class="flex1 left-btn disflex align-cen jscen"
          @click="clickButton('left')"
        >
          {{ leftBtnText }}{{goodsData.goodsPrice ? '(' + goodsData.goodsPrice.toFixed(2) + ')' : ''}}
        </div>
        <div
          v-else-if="leftBtnText && goodsInfo.isKill == 1"
          class="flex1 left-btn disflex align-cen jscen"
          @click="clickButton('left')"
        >
          {{ leftBtnText }}
        </div>
        <div
          v-if="rightBtnText && goodsInfo.isKill == 0"
          class="flex1 right-btn disflex align-cen jscen"
          @click="clickButton('right')"
        >
          {{ rightBtnText }}{{goodsData.assemblePrice ? '(' + goodsData.assemblePrice.toFixed(2) + ')' : ''}}
        </div>
        <div
          v-else-if="rightBtnText && goodsInfo.isKill == 1"
          class="flex1 right-btn disflex align-cen jscen"
          @click="clickButton('right')"
        >
          {{ rightBtnText }}
        </div>
        <div
          v-if="fullBtnText"
          class="flex1 right-btn disflex align-cen jscen"
          @click="clickButton('full')"
        >
          {{ fullBtnText }}
        </div>
      </div>
      <img
        src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/icon-close.png"
        @click="close"
        class="close-btn"
        alt=""
      />
      <LoginIntercept />
    </div>
  </div>
</template>

<script>
import LoginIntercept from "@/components/LoginIntercept";
export default {
  name: "GoodsSpecChoose",
  components: {
    LoginIntercept
  },
  props: {
    leftBtnText: {
      type: String,
      default: ""
    },
    rightBtnText: {
      type: String,
      default: ""
    },
    fullBtnText: {
      type: String,
      default: ""
    },
    // 商品信息
    goodsInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    goodsImg: {
      type: String,
      default: ""
    },
    // 商品型号
    typeLists: {
      type: Array,
      default() {
        return [];
      }
    },
    isShow: {
      type: Boolean,
      default: false
    },
    buyType: {
      default:'',
      type: String
    },
    typeIdx:{
      type:Number
    },
    specIdx:{
      type:Number
    },
    stockNum:{
      type:Number
    }
  },
  data() {
    return {
      num: 1,
      // typeIdx: 0, // 类型下标
      // specIdx: 0, // 规格下标
      //是否显示规格
      isShowFadeIn: false,
      isKill: false, // 是否是秒杀
      isAssemble: false, // 是否是拼团 
      selectArr:'',
      typeData:'',
      goodsData:{
        typeArr:[],
        goodsPrice:0,
        assemblePrice:0,
        killPrice:0,
        typeName:'',
        specsId:[],
        typeNames:''
      }
    };
  },
  mounted() {
    console.log(this.goodsInfo);
    console.log(this.typeLists)
    this.isShowFadeIn = this.isShow;
    this.isKill = this.goodsInfo.isKill;
    this.isAssemble = this.goodsInfo.isAssemble;
    this.typeData = this.typeLists
    this.typeArr = this.typeData[0].goodSpecModelList[0]
    
    this.typeName ='"' + this.typeData[0].goodSpecModelList[0].specAttribute  + '"'
    if(this.buyType == 'alone'){
      this.goodsPrice = this.typeData[0].goodSpecModelList[0].price
    }else{
      this.goodsPrice = (this.typeData[0].goodSpecModelList[0].assemblePrice)/100
      this.goodsPrice = this.goodsPrice.toFixed(2)
    }
  },
  methods: {
    // 选择后页面需要同步更新显示
    // choose(name, idx) {
    //   let lastIdx = this[name];
    //   this[name] = idx;
    //   console.log("点击的类型====》name",name, idx)
    //   if (name === "typeIdx") {
    //     if (lastIdx !== this.typeIdx) this.specIdx = -1;
    //     this.specIdx = 0
    //     this.$emit("changeChoose", {}, "spec",this.typeIdx, this.specIdx);
    //     this.$emit("changeChoose", this.typeLists[this.typeIdx], "type",this.typeIdx, this.specIdx);
    //   } else {
    //     this.$emit(
    //       "changeChoose",
    //       this.typeLists[this.typeIdx].goodSpecModelList[this.specIdx],
    //       "spec"
    //       ,this.typeIdx, this.specIdx
    //     );
    //     if (this.typeIdx === -1) {
    //       this.typeIdx = 0;
    //       this.$emit("changeChoose", this.typeLists[this.typeIdx], "type",this.typeIdx, this.specIdx);
    //     }
    //   }
    // },
    choose(item,items, index1,index2) {
      console.log(this.buyType)
      wx.showLoading();
      this.goodsData.typeArr = [];
      this.goodsData.goodsPrice = 0
      this.goodsData.assemblePrice = 0
      this.goodsData.killPrice = 0
      this.goodsData.typeName = ''
      this.goodsData.typeNames = ''
      this.goodsData.specsId = []
      this.selectArr = this.selectArr.concat([]);
      console.log(this.typeLists)
      if (items.select !== true) {
        item.goodSpecModelList.forEach(v => {
          v.select = false;
        });
        items.select = !items.select;
      } else {
        items.select = false;
      }
      console.log( this.buyType)
      for (var i in this.typeData) {
        let arr = this.typeData[i].goodSpecModelList.filter(v => {
          return v.select == true;
        });
        console.log(arr[0])
        if (arr.length > 0) {
          this.goodsData.typeName = this.goodsData.typeName + '"' + arr[0].specAttribute + '"';
          this.goodsData.typeNames = this.goodsData.typeNames  + arr[0].specAttribute + ";";
          if( this.buyType !== 'alone'){
            this.goodsData.assemblePrice +=   arr[0].assemblePrice/100;
            this.goodsData.killPrice += arr[0].killPrice/100;
            this.goodsData.goodsPrice +=  arr[0].price;
          }else{
            this.goodsData.goodsPrice +=  arr[0].price;
          }
          this.goodsData.specsId.push(arr[0].specId)
          this.goodsData.typeArr.push(arr);
        }
      }
      
      this.goodsData.goodsPrice = Number(this.goodsData.goodsPrice.toFixed(2))
      this.goodsData.assemblePrice = Number(this.goodsData.assemblePrice.toFixed(2))
      this.goodsData.killPrice = Number(this.goodsData.killPrice.toFixed(2))
      console.log(this.goodsData.goodsPrice)
      console.log(this.goodsData.assemblePrice)
      console.log(this.goodsData.killPrice)
      this.$emit('goodsChoose',this.goodsData)
      wx.hideLoading();
    },
    //点击触发按钮
    clickButton(type) {
      console.log(this.stockNum)
      //下单数量不能超过 9999
      if(this.stockNum == 0){
        wx.showToast({
          title: "商品数量已告罄",
          icon: "none"
        });
        return;
      }
      if(this.num > this.stockNum){
        wx.showToast({
          title: "订单数量不能大于库存！",
          icon: "none"
        });
        return;
      }
      this.$emit("clickButton", { sum: this.num, type });
    },
    emit(eventName) {
      this.$emit(eventName, {
        num: this.num,
        eventName: eventName
      });
    },
    prodChangeNum(flag) {
      this.num = parseInt(this.num) + flag;
    },
    close() {
      this.isShowFadeIn = false;
      setTimeout(() => {
        this.$emit("close");
      }, 500);
    }
  }
};
</script>

<style scoped>
.mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
}

.spec-content {
  background: rgba(255, 255, 255, 1);
  border-radius: 10upx 10upx 0 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(100%);
  transition: all 0.5s;
}
.fadeInUps {
  transform: translateY(0);
}
.fadeOutDowns {
  transform: translateY(100%);
}
.close-btn {
  width: 40upx;
  height: 41upx;
  position: absolute;
  right: 30upx;
  top: 30upx;
}

.goods-img {
  width: 220upx;
  height: 216upx;
  flex: 0 0 220upx;
}

.size_item {
  box-sizing: border-box;
  height: 60upx;
  padding: 0 20upx;
  background: rgba(245, 245, 246, 1);
  border: 1upx solid rgba(245, 245, 246, 1);
  border-radius: 6upx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24upx;
  margin-right: 20upx;
  margin-bottom: 20upx;
  color: #383838;
}

.size_item:last-child {
  margin-right: 0;
}

.size_item.active {
  background: rgba(229, 248, 247, 1);
  border: 1upx solid rgba(81, 205, 203, 1);
  color: #51cdcb;
}

.btn-list .left-btn,
.btn-list .right-btn {
  height: 98upx;
  color: white;
  font-size: 36rpx;
}

.btn-list .left-btn {
  background: linear-gradient(
    90deg,
    rgba(252, 173, 61, 1),
    rgba(255, 161, 51, 1)
  );
}

.btn-list .right-btn {
  background: linear-gradient(
    90deg,
    rgba(254, 117, 99, 1),
    rgba(253, 99, 78, 1)
  );
}
.selectType{
  width: 400upx;
  overflow: hidden;
  text-overflow: ellipsis;
	white-space: nowrap; 
}
</style>
