<template>
  <div class="title-box" :class="padidng == 'none'? '' : 'mt20 mb20' ">
    <span class="title">{{title}}</span>
    <span class="dec">{{dec}}</span>
  </div>
</template>

<script>
  export default {
    name: "noData",
    props:{
      title:{
        type:String,
        default:'',
      },
      dec:{
        type:String,
        default:'',
      },
      padidng:{
        type:String,
        default:'true',
      }
    }
  }
</script>

<style scoped>
.title-box{
}
.title{
  font-size: 40upx;
  color: #383838;
  font-weight:bold;
  line-height: 1.2;
  margin-right: 8upx;
}
.dec{
  font-size: 28upx;
  color: rgba(81,205,203,0.3);
  line-height: 1;
  vertical-align:bottom;
  font-weight: bold;
}
</style>
