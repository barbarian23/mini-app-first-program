<template>
  <div class="h100p bgfff borderbox disflex flex-column pl15 pr15 pt15 pb15">
    <div class="flex1">
      <p class="fs16 c38 fbold mb25 " :style="{textIndent:'2em'}">
        本小程序用户的言行不得违反《计算机信息网络国际联网安全保护管理办法》、《互联网信息服务管理办法》、《互联网电子公告服务管理规定》、《维护互联网安 全的决定》等相关法律规定，不得在此发布含有下列内容之一的信息。
      </p>
      <div class="pl15">
        <p class="mb15">{{ lang.text_0 }}</p>
        <p class="mb15">{{ lang.text_1 }}</p>
        <p class="mb15">{{ lang.text_2 }}</p>
        <p class="mb15">{{ lang.text_3 }}</p>
        <p class="mb15">{{ lang.text_4 }}</p>
        <p class="mb15">{{ lang.text_5 }}</p>
        <p class="mb15">{{ lang.text_6 }}</p>
        <p class="mb15">{{ lang.text_7 }}</p>
        <p class="mb15">{{ lang.text_8 }}</p>
        <p class="mb15">{{ lang.text_9 }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import LangUtils from '../../../utils/LangUtils';

  export default {

    data(){
      return {
        lang: LangUtils.getLangSrc().demandSquare.agreement
      };
    },
    methods:{

    },
  }
</script>

<style scoped>

</style>
