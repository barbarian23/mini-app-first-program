<template>
    <div class="pt64 h100p bgfff borderbox">
        <div class="disflex jsbet bgfff lh30 pl16 pr15 pt5 pb5 posfix top0 left0 w100p borderbox ">
            <div class="bgf5f6 bradius17 disflex pl15 flex1">
                <span class="disflex pl10 jscen align-cen">
                    <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/search.png" alt="" class="w16 h16 menu_more posab">
                </span>
                <input type="text" v-model="key" class="pl15 pha8 fs14 lh34 h34 w100p c38" :placeholder="searchType==1 ? '搜索用户姓名': '搜索行业'">
            </div>
            <span class="fs16 c38 lh34 pl15 bradius3 fbold" @click="search('input')">{{ lang.text_0 }}</span>
        </div>
        <div class="disflex pl15 mb15" v-if="searchType == 2">
            <div class="pt7 w110 pb7 pl10 pr10 be8 disflex jsbet align-cen borderbox bradius5 mr10 posre" @click="industry_tap('industry')">
                <p class="fs12 c80">{{industryTitle || lang.text_1}}</p>
                <img :src="leftIcon" class="w8 h10 leftIcon">
                <div class="DownOption" :class="downType.industry ? 'down' : 'up'">
                    <div class="list" v-for="(item,index) in industryArray" :key="index" @click="industryTitle_tap(item.industryName)">
                        {{item.industryName}}
                    </div>
                </div>
            </div>
            <div class="pt7 w110 pb7 pl10 pr10 be8 disflex jsbet align-cen borderbox bradius5 posre" @click="condition_tap('condition')">
                <p class="fs12 c80">{{conditionTitle || lang.text_2}}</p>
                <img :src="leftIcon" class="w8 h10 leftIcon">
                <div class="DownOption" :class="downType.condition ? 'down1' : 'up'">
                    <div class="list" @click="condition_tapA('最新',1)">
                        最新
                    </div>
                    <div class="list" @click="condition_tapA('人气',2)">
                        人气
                    </div>
                </div>
            </div>
        </div>
        <div class="pl15 pr15" v-if="searchList">
            <div class="disflex jsbet align-cen">
                <div class="fs16 c38 fbold">
                    历史搜索记录
                </div>
                <div class="disflex fs14 cblue"
                     @click="clean_history">
                    清空
                </div>
            </div>
            <div class="disflex wrap mb15 historybox">
                <div class="bgf5f6 bradius15 pl20 pr20 fs14 c78 lh30 mr8 mt15 "
                     v-for="(item,index) in searchList"
                     :key="index"
                     @click="history_tap(item)">
                    {{item}}
                </div>
            </div>
        </div>
        <div class="pt80 textc" v-if="popularity.length === 0">
            <template v-if="haveNoSearch">
                <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-www/photo/20190520/1558319783804.png" alt="" class="w170 h170">
                <p class="fs12 ca8 mt10">{{ lang.text_3 }}</p>
            </template>
            <template v-else>
                <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-www/photo/20190521/1558429867593.png" alt="" class="w170 h170">
                <div class="fs12 lh32 ca8">{{ lang.text_4 }}</div>
            </template>
        </div>

        <!-- <div class="disflex jsbet bgf5f6 pl15 pr16 wrap pb23" v-else>
            <getPhoneNumberGoods v-for="(v,k) in goodsList"
                :key="k"
                @next="toProdDetail"
                :goodInfo="v">
            </getPhoneNumberGoods>
        </div>
        <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata && goodsList.length > 0">{{ lang.text_5 }}</div> -->
        <div class="pl15 pr15 pb15">
            <div class="disflex bf5f6 jsbet pt20 pl15 pr15 pb15 bradius10 mb10"
                v-for="(item,index) in popularity"
                :key="index"
                @click="page_turn(item)">
                <div class="disflex">
                    <img :src="item.logo" class="w50 h50 bradius5">
                <div class="ml10 h50 disflex flex-column jsbet">
                    <div class="disflex">
                        <!-- <img :src="hotIocn" class="w20 h20 mr10" v-if="index <= 2 && currentType == 2"> -->
                        <p class="fs18 c38">{{item.name}}<span class="fs14 c78 ml10">{{item.position}}</span></p>
                    </div>
                    <p class="fs14 c78">{{item.companyName}}</p>
                    </div>
                </div>

                <div class="h50 disflex flex-column jsbet align-cen float-right" @click.stop="collection_tap(index,item.cardId,item.companyId)">
                    <img :src="(item.isBind || selfUserId == item.userId) ? likeSelectIocn : likeIocn" class="w20 h20">
                    <p class="ca8 fs12">{{ (item.isBind || selfUserId == item.userId) ? lang.text_6 : lang.text_7}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request'
import getPhoneNumberGoods from '@/components/getPhoneNumberGoods'
import { mapState} from "vuex";
import LangUtils from '../../../utils/LangUtils';

export default {
    components: { getPhoneNumberGoods },
    data () {
        return {
            lang: LangUtils.getLangSrc().contactsMarket.search,
            goodsList: [],
            haveNoSearch: true,
            pageNum: 1,
            key: '',
            isLoading : false, // 是否在加载
            companyId: '',
            nodata: false,
            leftIcon:WXAJAX.imgBackUrl + '/yimai_photos/crmAdd/Icon_back.png',
            array:[{
                title:'sdawseqwe'
            },{
                title:'sdawseqwe'
            },{
                title:'sdawseqwe'
            },{
                title:'sdawseqwe'
            },{
                title:'sdawseqwe'
            },{
                title:'sdawseqwe'
            },{
                title:'sdawseqwe'
            }],
            downType:{
                industry:false,
                condition:false
            }, //控制下拉状态
            industryTitle:'',
            conditionTitle:'',
            searchType:1,
            likeIocn:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/details_like.png',
            likeSelectIocn:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/details_like_select.png',
            popularity:'',//搜索结果
            searchList:[],//搜索历史
            queryType:'',
            selfUserId:wx.getStorageSync('userId') || '',
        }
    },
    onLoad(option){
        this.searchList = wx.getStorageSync('historySearch') || []
        this.searchType = option.type
        this.industryTitle = option.industry
        this.key = option.industry || ''
        if(option.queryType == 1){
            this.conditionTitle = '最新'
            this.queryType = 1
        }else{
            this.conditionTitle = '人气'
            this.queryType = 2
        }
        if(this.searchType == 2){

            this.search('input')
        }

    },
     computed: {
        ...mapState({
        industryArray: state => state.industryList
        })
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.pageNum = 1;
            this.goodsList = [];
            this.nodata = false;
            this.haveNoSearch = true;
            this.isLoading = false;
            this.companyId = this.$root.$mp.query.companyId;
        },
        toProdDetail(id){//进入详情
            let prod = this.goodsList.filter(prod => {return prod.goodsId === id})[0]
            wx.setStorageSync('prod', prod)
            wx.navigateTo({url:'../../prodDetail/main?goodId=' + id});
        },
        history_tap(item){
            this.key = item || ''
            this.search('input')
        },
        clean_history(){
            this.searchList = []
            wx.setStorageSync('historySearch',this.searchList )
        },

        search(type){
            if(this.searchList !== ""){
                if (this.searchList.indexOf(this.key) == -1 & this.key != '') {
                    this.searchList.unshift(this.key);
                }
            }else{
                this.searchList.unshift(this.key);
            }
            this.goodsList = [];
            this.nodata = false;
            this.pageNum = 1;
            this.getCardList(type);
        },
        getCardList(type){
            let v = this;
            wx.showLoading({
                title:'加载中',
                mask:true
            })
            //|| !this.companyId
            if(v.isLoading ){
                wx.hideLoading();
                return;
            }
            if(!v.key || type == 'input'){
                v.popularity = ''
            }
            v.isLoading = true ;
            let params = ''
            if(v.searchType == 1){
                params = {
                    companyId: 1,
                    queryType: v.queryType,
                    pageNum:v.pageNum,
                    name:v.key || ''
                }
            }else{
                params = {
                    companyId: 1,
                    queryType: v.queryType,
                    pageNum:v.pageNum,
                    industryName:v.key || ''
                }
            }

            WXAJAX.POST(params, '', '/market/searchBusinessCard')
            .then(data => {
                wx.setStorageSync('historySearch',this.searchList)
                wx.hideLoading();
                v.haveNoSearch = false;
                if(data.pageInfo.list){

                    v.popularity = [...v.popularity, ...data.pageInfo.list]
                    v.pageNum ++ ;
                    setTimeout(function () {
                        v.isLoading = false ;
                    },500);
                }else {
                    setTimeout(function () {
                        v.nodata = true ;
                        v.isLoading = false ;
                    },500);
                }
            })
            .catch(err => {
                wx.hideLoading();
                console.log(err)
                v.goodsList = [];
                v.haveNoSearch = false;
                setTimeout(function () {
                    v.isLoading = false ;
                },500);
            })
        },
        industry_tap(type){
            this.downType.condition = false
            this.downType.industry = !this.downType.industry
        },
        condition_tap(){
            this.downType.industry = false
            this.downType.condition = !this.downType.condition
        },
        condition_tapA(title,type){
            console.log(title)
            this.conditionTitle = title
            this.queryType = type
            this.search('input')
        },
        industryTitle_tap(title){
            this.industryTitle = title
            this.key = this.industryTitle
            this.search('input')
        },
        page_turn(item){
            wx.setStorageSync('COMPANYID',item.companyId);/*id*/
            wx.setStorageSync('CARDID',item.cardId);/*id*/
            wx.switchTab({url:'../../index/main?cardId='+item.companyId+'&companyId+'+item.cardId});
        },
        collection_tap(index,cardId,companyId){
            let url = "/businessCard/cardDetails";
            //获取数据
            //
            wx.showLoading({
            mask:true
            });
            WXAJAX.POST(
            {
                cardId: cardId,
            },
            "",
            url
            )
          .then((data, code) => {
            wx.hideLoading();
            if (data) {
                if(this.popularity[index].isBind == true){
                    uni.showToast({
                    title:'该名片已收藏！'
                    })
                }else{
                    this.popularity[index].isBind = true
                    uni.showToast({
                    title:'该名片已收藏！'
                    })
                }
            }
          })
          .catch(err => {
            ////console.log(err);
            wx.hideLoading();
          });
        }
    },
    onReachBottom() {
        if (this.nodata) {
            return ;
        }

        let v = this ;
        wx.showLoading({
            title : '加载中',
        });
        v.getCardList();
    },
}
</script>
<style scoped>
.leftIcon{
  transform:rotate(-90deg);
}
.DownOption{
  position: absolute;
  left: -1upx;
  top: 50upx;
  width: 220upx;
  background: #ffffff;
  z-index: 99;
  box-sizing: border-box;
  overflow: auto;
}
.DownOption .list{
  line-height: 60upx;
  border-bottom: 1upx solid #E8E8E8;
  padding-left: 20upx;
  font-size: 24upx;
  color:#787878;
}
.down{
  max-height: 300upx;
  border-top:1upx solid #ffffff;
  border-radius: 0px 0px 5upx 5upx;
  border: 1upx solid #E8E8E8;
  transition: all .4s;
}
.up{
  max-height: 0upx;
  transition: all .4s;
}
.down1{
  max-height: 120upx;
  border-top:1upx solid #ffffff;
  border-radius: 0px 0px 5upx 5upx;
  border: 1upx solid #E8E8E8;
  transition: all .4s;
}
.historybox{
  max-height: 272upx;
  overflow: hidden;
}
</style>
