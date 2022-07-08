<template>
  <div>
    <dt>{{ index }}{{ title }}</dt>
    <dd><div ref="contentRef"></div></dd>
  </div>
</template>

<script>
export default {
  name: "articleRssItem",
  data() {
    return {
      bodyContent: "",
    };
  },
  props: {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    img: {
      type: String,
    },
  },
  created(){
    this.$nextTick(() => {
          if (this.$refs.contentRef) {
             this.$refs.contentRef.innerHTML = this.content;
          }
        });
  },
  watch: {
    content: {
        immediate: true, 
        handler (val, oldVal) {
     
        }
    },
  },
  methods: {},
};
</script>

<style scoped>
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
