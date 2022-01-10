<template>
  <div align="center">
    <!-- <img class="pic-404" src="~@/img/404_images/404notfound.svg" width="200" alt="404">
    <p><a href="/" class="return-home">Back to home</a></p> -->
    <div class="error">
      <div class="title">
        404
      </div>
      <div class="tip">
        {{$t('404tip')}}
      </div>
    </div>
    <p><a href="/client/" class="return-home">{{$t('backhome')}}</a></p>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>

<style lang="scss" scoped>
.error
{
  color: #4b4949;
  margin-top: 10%;
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
  width:400px;
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
