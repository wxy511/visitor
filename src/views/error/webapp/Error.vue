<template>
  <div align="center">
    <!-- <img class="pic-404" src="~@/img/404_images/404notfound.svg" width="200" alt="404"> -->
    <div class="error">
    <div class="title">
      !
    </div>
    <div class="tip">
      {{$t('alertErr')}}
    </div>
    </div>
    <p class="return-home" @click="logout">
      {{$t('logout')}}
      <!-- <router-link :to="{ name: 'home'}">{{$t('logout')}}</router-link> -->
    </p>
  </div>
</template>
<script>

export default {
  name: 'PageError',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  },
  methods:{
    logout(){
      window.location.href = '/logout/'
    }
  }
}
</script>

<style lang="scss" scoped>
.error
{
  color: #4b4949;
  margin-top: 20%;
  margin-bottom: 50px;
  .title{
    font-size: 4rem;
    font-weight: bold;
  }
  .tip{
    font-size: 1.5rem; 
  }
}

.pic-404
{
  width:250px;
  height: auto;
  margin-top: 5%;
}
.return-home {
    display: block;
    width: 150px;
    height: 36px;
    background: #0f6349;
    border-radius: 100px;
    text-align: center;
    color: #ffffff;
    font-size: 14px;
    line-height: 36px;
    padding: 0 20px;
  }
</style>
