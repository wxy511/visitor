<template>
  <div class="g-gray-background" id='record'>
    <div class="camera_outer">
      <div v-for="(urls,index) in imgs" :key="index" style="float: left; margin: 10px ; border: 1px solid #ccc;">
          <div style="text-align: right; position: relative;" v-on:click="deleteImg(index)">X</div>
          <img :src="urls" width="100px" height="100px"  />
      </div>
      <div style=" width: 100px; height: 100px; background-color: #ccc; border:1px solid #ccc; float: left;  margin: 10px ;" v-on:click="imgClick()"></div>
      <input style="float: left;  display: none;" type="file" id='uploadFile' accept="image/*"  v-on:change="readLocalFile()">
    </div>    
  </div>
</template>
<script>

export default {
  mounted() {

  },
  created() {
  },
  watch: {
  },
  computed:{

  },
  data () {
    return {
      imgs:[],
      navList: [
        {"name":"","id":"","img":"/bus.png","to":"/home/case","strkey":"case"},
        {"name":"","id":"","img":"/bus.png","to":"/home/case","strkey":"routineInspection"},
        {"name":"","id":"","img":"/bus.png","to":"/home/record","strkey":"record"},
        {"name":"","id":"","img":"/bus.png","to":"/home/case","strkey":"dataReport"},
        {"name":"","id":"","img":"/bus.png","to":"/home/site","strkey":"siteInfo"},
        {"name":"","id":"","img":"/bus.png","to":"/home/case","strkey":"projectProgress"},
      ],
    }
  },
  components:{},
  methods:{
    initData(){
      this.navList.forEach(nav => {
        nav['name'] = this.$t(nav['strkey'])
        nav['img'] = require("@/img/"+nav['imgname'])
      });
    },
//删除图片
    deleteImg:function(index){
        this.imgs.splice(index,1);
    },
//图片click
    imgClick:function(){
        document.getElementById("uploadFile").click();
    },
    //点击选中图片
    readLocalFile: function () {
        var localFile = document.getElementById("uploadFile").files[0];
        var reader =new FileReader();
        var content;
        var current=this;
        reader.onload = function(event) {
            content = event.target.result;
            console.log(content.length);

            current.imgs.push(content); //获取图片base64代码
          }
        reader.onerror = function(event) {
            alert('error')
        }
        content = reader.readAsDataURL(localFile,"UTF-8");
        var sss=document.getElementById("uploadFile").value;
        console.log(sss);
    }
  }
}
</script>
<style lang="scss">
#record {
  padding-bottom: 3rem;
  color: black;
  height: 100%;
}
.homepage
{
  width: 100%;
  height: auto;
}
.nav-card
{
  /* width:100%; */
  margin:5px;
  border-radius: 4px;
  border: 1px solid #EBEEF5;
  background-color: #FFF;
  color: #303133;
  -webkit-transition: .3s;
  transition: .3s;

  box-shadow: 0 1px 4px 0 rgba(85,85,85,.1);
  padding: 10px;
  /* border-radius: 6px; */
}


 .camera_outer{
   border:1px solid #303133;
  position: relative;
  overflow: hidden;
  background-size: 100%;
  video,canvas,.tx_img{
   -moz-transform:scaleX(-1);
   -webkit-transform:scaleX(-1);
   -o-transform:scaleX(-1);
   transform:scaleX(-1);
  }
  .btn_camera{
   position: absolute;
   bottom: 4px;
   left: 0;
   right: 0;
   height: 50px;
   background-color: rgba(0,0,0,0.3);
   line-height: 50px;
   text-align: center;
   color: #ffffff;
  }
  .bg_r_img{
   position: absolute;
   bottom: 0;
   left: 0;
   right: 0;
   top: 0;
  }
  .img_bg_camera{
   position: absolute;
   bottom: 0;
   left: 0;
   right: 0;
   top: 0;
   img{
    width: 100%;
    height: 100%;
   }
   .img_btn_camera{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: rgba(0,0,0,0.3);
    color: #ffffff;
    .loding_img{
     width: 50px;
     height: 50px;
    }
   }
  }
 }
</style>
