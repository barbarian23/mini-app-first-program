<template>
  <div class="h100p bgfff pt103">

    <div class="pl15 fix_top w100p shadow_gray borderbox pt15 pb15 bgfff" v-if="!choose">
      <p class="fs16 c38 fbold pb20">{{ lang.text_0 }}</p>
    </div>

    <div class="pl15  w100p shadow_gray borderbox pt15 pb15 bgfff" v-if="choose">
      <p class="fs16 c38 fbold pb20">{{ lang.text_1 }}</p>

      <span class="disinblock fs12 pl15 pr16 cblue bradius5 bblue lh30">{{choose}}</span>
    </div>

    <div class="pl15 pr15 bgfff disflex wrap pt75">

      <div class="fs12 c38 pt15" v-for="(type1,index1) in profession" :key="index1">
        <div class="disflex wrap">
            <span class="be8 pl15 pr16 mb15 lh30 mr8 bradius5"
                  :class="choose_id == type1.industryId ? 'bge8' : '' "
                  @click="btn_tap(type1)"
            >{{type1.industryName}}</span>
        </div>
      </div>

    </div>



  </div>
</template>

<script>
  import WXAJAX from '@/utils/request'
  import LangUtils from '../../../utils/LangUtils';

  export default {
    name: '',
    components: {},

    data() {
      return{
        lang: LangUtils.getLangSrc().contactsMarket.chooseProfession,
        queryType:'',
        choose:'' ,
        choose_id:0,
        profession : this.$store.state.industryList,
      }
    },
    onLoad(option){
      this.queryType = option.queryType
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "选择行业"
      });

      let _a = wx.getStorageSync('choose_profession') || '';
      this.choose = _a.industryName;
      this.choose_id = _a.industryId ;
      //获取企业行业
      //this.inits();

    },
    methods: {
      // inits(){
      //   wx.showLoading();

      //   WXAJAX.GET({ }, '', '/industry/getList').then((data) => {

      //     wx.hideLoading();
      //     this.profession = data ;

      //   }).catch((err) => {
      //     console.log(err);
      //     wx.hideLoading();
      //   });
      // },
      btn_tap(item){
        this.choose = item.industryName ;
        wx.navigateTo({
          url:`../search/main?type=${2}&industry=${item.industryName}&queryType=${this.queryType}`
        });
        //wx.setStorageSync('choose_profession' , item);
      }
    }
  }
</script>

<style>

</style>
