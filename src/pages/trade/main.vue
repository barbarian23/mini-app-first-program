<template>
  <section class="dl-blurbs">
    <dl v-for="article in articles">
      <ArticleRssItem :title="article.title" :content="article.content" :key="article.guid" />
    </dl>
  </section>
</template>

<script>
import LangUtils from "../../utils/LangUtils";
import ArticleRssItem from "../../components/articleRssItem.vue";

export default {
  name: "",
  components: {
    ArticleRssItem
  },
  data() {
    return {
      articles: [],
      lang: LangUtils.getLangSrc().collect,
      menu_id: 1, //1产品，2文章，3企业
      prods: [],
      page: 1,
      isLoading: false, //是否在加载
      nodata: false, //是否已经没有数据
    };
  },
  async onPullDownRefresh() {
    // to doing..
    // 停止下拉刷新
    wx.showNavigationBarLoading();
    // 开始重新请求
    this.prods = [];
    this.page = 1;
    this.inits();
    wx.stopPullDownRefresh();
    setTimeout(function () {
      wx.hideNavigationBarLoading();
    }, 300);
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "trade",
    });
    this.prods = [];
    this.page = 1;
    this.inits();
  },
  onShow(){

  },
  methods: {
    async inits() {
        wx.showLoading();
        const tradeRss = await this.$rssFeeder("https://vnexpress.net/rss/kinh-doanh.rss");
        this.articles = tradeRss.items;
        wx.hideLoading();
        console.log("tradeRss",tradeRss);
    },
  }
};
</script>

<style>
dl {
  counter-reset: count;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.04) 20%,
    rgba(255, 255, 255, 0) 0%
  );
  padding-left: 4vw;
  padding-right: 4vw;
  margin: 0;
  padding-left: 2vw;
  padding-top: 3vw;
  padding-bottom: 3vw;
}
dl + dl {
  counter-reset: counter 4;
}
dt {
  counter-increment: count;
  color: #4f6d7aff;
  font-family: "Montserrat", sans-serif;
  font-size: 4vw;
  text-transform: uppercase;
}
dt::before {
  content: counter(count, decimal-leading-zero) ".";
  font-family: "Abril Fatface", cursive;
  color: "#5ea5b8ff";
  margin-left: -1vw;
  padding-right: 12px;
}

dd {
  margin-left: 5vw;
  margin-bottom: 2vh;
}
</style>