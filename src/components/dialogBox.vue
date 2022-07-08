<template>
    <div class="fix_top h100p dialog_box" @click="distribution_close">
        <div class="dialog_con bgfff bradius5" >
            <p class="textc fs18 c38 pt25 pb25 fbold">{{dialog_title}}</p>
            <div class="pl25 pr25" v-if="type != 'hint' && type != 'hint2' &&  type!='hint4' && type!='hint5'">
                <input type="text" class="pha8 bradius5" :placeholder="dialog_ph" v-model="text">
                <input type="text" class="pha8 bradius5" :placeholder="dialog_ph_2" v-model="text_2" v-if="type == 'input_2'">
            </div>

          <div v-if="type == 'hint2'" class="fs14 c78 pl35 pr31 pb36">
            {{dialog_ph}}
          </div>
          <div v-if="type == 'hint4'" class="fs14 c78 pl35 pr31 pb36 textc">
            <p>{{dialog_ph}}</p>
            <p>{{dialog_ph_2}}<span class="cblue">{{default_2}}</span></p>
          </div>

          <div v-if="type == 'hint5'" class="fs14 c78 pl35 pr31 pb36">
            <p>{{dialog_ph}}<span class="cblue">{{default_1}}</span>{{dialog_ph_2}}<span class="cblue">{{default_2}}</span>{{dialog_ph_3}}</p>
          </div>

            <div class="disflex fs18 textc lh44 btf5f6 dialog_bottom" v-if=" type!='hint4' ">
                <span class="w50p ca8 bgfff" @click="btn_tap('cancel')">{{left}}</span>
                <span class="w50p bg_line_blue cfff" @click="btn_tap('save')">{{right}}</span>
            </div>
            <div class="disflex fs18 textc lh44 btf5f6 dialog_bottom" v-else>
                <span class="w100p bg_line_blue cfff" @click="distribution_tap()">{{right}}</span>
            </div>
        </div>

    </div>
</template>

<script>

    export default {
        name: '',
        props:['dialog_title','dialog_ph','dialog_ph_2','dialog_ph_3','default','default_1','default_2','left' ,'right','type'],
        components: {},
        data() {
            return{
                text:'',
                text_2:''
            }
        },
        mounted() {

            if(this.default){
                this.text = this.default ;
            }

            if(this.default_2){
                this.text_2 = this.default_2 ;
            }

        },
        methods: {
            btn_tap(method){
                this.$emit('btn_tap',method,this.text , this.text_2 );
            },
            distribution_close(){
                if(this.type !== 'hint4'){
                    return
                }
                this.$emit('distribution_close');
            },
            distribution_tap(){
                
                this.$emit('distribution_tap');
            }
        },
        watch: {
            default(val) {
                this.text = val ;
            }
        }
    }
</script>

<style>
    .dialog_box {
        background: rgba(0, 0, 0, .5);
        z-index: 999;
    }

    .dialog_con {
        width: 580upx;
        position: absolute;
        left: 0;
        right: 0;
        top: 30%;
        margin: auto;
        overflow: hidden;
    }

    .dialog_con input{
        width: 100%;
        line-height: 78upx;
        height: 78upx;
        background: #f5f5f6;
        font-size: 28upx;
        color: #A8A8A8;
        padding-left: 22upx;
        margin-bottom: 20upx;
    }
    .dialog_con input:last-child{
        margin-bottom: 60upx;
    }

    .dialog_bottom{
        border-radius: 0 0 10upx 10upx;
    }
</style>























