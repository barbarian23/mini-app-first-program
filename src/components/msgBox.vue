<template>
    <div @click="row_tap">
        <div class="disflex bbf5f6 jsbet pl15 pr15 bgfff pt20 pb20" :class="bradius">
            <div class="pr10 posre">
                <!--头像-->
                <img :src="msg.logo || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/card1_user.png'" alt="" mode="aspectFill" class="w50 h50 bradius5">
                <!--根据消息状态判断是否显示头像旁的红点-->
                <span class="disblock posab top0 right5 bradius50p bg_line_orange w10 h10" v-if="msg.newestMessage.type== 0 && msg.newestMessage.sendId != myid"></span>
            </div>
            <div class="flex1 disflex jsbet flex-column borderbox fb500 pt3 pb3">
                <div class="disflex jsbet ">
                    <div>
                        <span class="fs18 c38 pr7">{{msg.name}}</span>
                        <span class="fs12 cfff lh15 pl6 pr5 bradius3 bgblue" v-if="isusertag">{{msg.newestMessage.type}}</span>
                        <span class="fs12 c78 lh15 pl7" v-if="isport">{{msg.position}}</span>
                    </div>
                    <span class="fs12 ca8" v-if="istime">{{dateTime}}</span><!--type == 1 || type == 3-->
                </div>
                <!--tel-->
                <div class="disflex align-cen pt6 phone" v-if="istel && !telReverse">
                    <span class="fs14 ca8">{{msg.phone}}</span>
                    <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/tel_2.png"
                         alt="" class="w16 h16 ml16"
                         @click.stop="makePhone(msg.phone)"
                    >
                </div>
                <div class="disflex align-cen pt6 phone" v-if="istel && telReverse">
                    <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/tel_2.png"
                         alt="" class="w16 h16"
                         @click.stop="makePhone(msg.phone)"
                    >
                    <span class="fs14 ca8 ml16">{{msg.phone}}</span>
                </div>
                <!--IM信息内容-->
                <div v-if="isImMsg" class="w267 over_1 disflex align-cen">
                    <span v-if="msg.newestMessage.type == 0 && msg.newestMessage.sendId==myid"
                          class="borderbox mr5 disinblock w34 lh15 fs12 textc bradius3 receive">{{ lang.text_0 }}</span>
                    <span v-if="msg.newestMessage.type == 1"
                          class="borderbox mr5 disinblock w34 lh15 fs12 textc bradius3 send">{{ lang.text_1 }}</span>
                    <!--显示的消息内容-->
                    <span v-if="msg.newestMessage.contentType && msg.newestMessage.contentType == 2"  class="fs14 ca8 disinblock" style="font-size: 28upx">{{ lang.text_2 }}</span>
                    <span v-else-if="msg.newestMessage.contentType && msg.newestMessage.contentType == 3" class="fs14 ca8 disinblock" style="font-size: 28upx">{{ lang.text_3 }}</span>
                    <span v-else-if="msg.newestMessage.contentType && msg.newestMessage.contentType == 4" class="fs14 ca8 disinblock" style="font-size: 28upx">{{ lang.text_4 }}</span>
                    <span class="fs14 ca8 disinblock" style="font-size: 28upx" v-else-if="msg.newestMessage.messageType==1">{{msg.newestMessage.message}}</span>
                    <span class="fs14 ca8 disinblock" style="font-size: 28upx" v-else-if="msg.newestMessage.messageType==2">我是{{msg.newestMessage.message.companyName}}的{{msg.newestMessage.message.name}},欢迎进入我的名片，有什么可以帮到你的吗？</span>
                </div>
            </div>
        </div>
        <!---->
        <!--<div class="btf5f6 pl16 pr15 fs14 cb8 lh34 bgfff disflex jsbet">&lt;!&ndash; v-if="type == 2 || type == 4"&ndash;&gt;-->
        <!--&lt;!&ndash;附加记录&ndash;&gt;-->
        <!--&lt;!&ndash;  <div>-->
        <!--<p v-if="islogtitle" class="c38 fbold fs16 lh1 pt15 pb5">{{ lang.text_5 }}</p>-->
        <!--<span v-if="issppend_record">{{msg.time}} 由 <span class="cblue">{{msg.by}}</span> 主动加入壹脉智能</span>-->
        <!--<span v-if="issppend_record">{{msg.time}} 由 <span class="cblue">{{msg.by}}</span> 主动加入壹脉</span>-->
        <!--</div>&ndash;&gt;-->

        <!--<div v-if="ismsg">-->
        <!--<span>{{msg.newestMessage.message}}</span>-->
        <!--</div>-->
        <!--<span @click.stop="page_turn('editLog' ,'?clientName='+msg.name + '&id='+msg.cardId)"-->
        <!--class="lh40 bblue cblue bradius5 pl20 pr21 h40 borderbox mt17"-->
        <!--v-if="isaddLog">{{ lang.text_6 }}</span>-->

        <!--</div>-->


    </div>
</template>

<script>
    import util from '../utils/index'
    import LangUtils from '../utils/LangUtils';

    export default {
        name: '',
        props: ['msg', 'type', 'bradius','isaddLog','isrightpoint','ismsg','isrank',
            'istime','istel','isaction','issppend_record','istags','isImMsg',
            'islogtitle','isport','isusertag','actionType','index' ,'telReverse'],
        // type :  1 -- 显示信息 ， 2 -- 不显示信息
        components: {},
        data(v) {
            return{
              lang: LangUtils.getLangSrc().components.msgBox,
              myid: '',
            }
        },
        computed: {
            dateTime() {
                //console.log(util.dateFormat(this.istime));
                return this.istime ? util.dateFormat(this.istime) : '';
            }
        },
        mounted() {
          this.myid = wx.getStorageSync('userId') || '';
        },
        methods: {
            row_tap() {
                this.$emit('row_tap' , this.msg.cardId , this.msg.userId)
            },
            page_turn(url,query){
                query = query || '' ;
                wx.navigateTo({url:'../'+url+'/main'+query});
            },
            makePhone(tel){
                util.MakePhone(tel || '');
            },
            dateT(data){
                console.log(util.dateFormat(data));

            }
        }
    }
</script>

<style>
  .send{
    color: #51CDCB;
    border:1upx solid #51CDCB;
  }
  .receive{
    color: #2BCF88;
    border: 1upx solid #2BCF88;
  }
</style>
