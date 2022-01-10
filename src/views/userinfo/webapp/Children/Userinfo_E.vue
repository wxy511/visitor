<template>
  <apppage-layout :title="$t('user.userpage')" page="Userinfo_E">
    <div slot="right"></div>
    <div slot="body" class="userlist">
      <van-cell-group v-if="userType==='e' ">
        <van-cell :title="$t('user.name')" is-link @click="userinfoChange('Ename')"><span>{{userInfo.Ename}}&nbsp;</span></van-cell>
        <van-cell :title="$t('user.email')" >{{userInfo.Eemail}}&nbsp;</van-cell>
        <van-cell :title="$t('user.phone')"  is-link @click="userinfoChange('Ephone')"><span> {{showPhone(userInfo.Ecountrycode,userInfo.Ephone,true)}}</span>&nbsp; </van-cell>
        <van-cell v-show="config.Edept && config.Edept.E" :title="$t('RegInfo.Edept')" is-link @click="userinfoChange('Edept')">{{userInfo.Edept}}&nbsp;</van-cell>
        <van-cell v-show="config.Edivision && config.Edivision.E" :title="$t('user.Edivision')" is-link @click="userinfoChange('Edivision')">{{userInfo.Edivision}}&nbsp;</van-cell>
      </van-cell-group>
      <van-cell-group v-if="userType==='v' ">
        <van-cell :title="$t('user.name')" is-link @click="userinfoChange('Vname')"><span>{{userInfo.Vname}}&nbsp;</span></van-cell>
        <van-cell :title="$t('user.phone')" ><span> {{showPhone(userInfo.Vcountrycode,userInfo.Vphone,true)}}</span>&nbsp; </van-cell>
        <van-cell v-show="config.Vunit" :title="$t('user.unit')" is-link @click="userinfoChange('Vunit')"><span>{{userInfo.Vunit}}&nbsp;</span></van-cell>
        <van-cell v-show="config.Vemail && config.Vemail.E" :title="$t('user.email')" is-link @click="userinfoChange('Vemail')">{{userInfo.Vemail}}&nbsp;</van-cell>
        <van-cell 
          v-show="config.Vnation && config.Vnation.E" 
          :title="$t('RegInfo.Vnation')" 
          is-link 
          @click="userinfoChange('Vnation')">{{ showVnation(userInfo.Vnation)}}&nbsp;</van-cell>               
        <van-cell v-show="config.Vid && config.Vid.E" :title="$t('user.id')" :is-link="!config.Vid.R" @click="userinfoChange('Vid')">
          {{showVid(userInfo.Vidtype,userInfo.Vid)}} &nbsp;
        </van-cell>
      </van-cell-group>
      <van-cell-group class="lngCell">
        <van-cell :title="$t('switchLanguage')"  @click="onSwitchLanguage" is-link> <span>{{$t('lng.'+language)}}&nbsp;</span></van-cell>
      </van-cell-group>

     <el-button plain class="btnLogout" @click="logout" v-if="!embeddedAPP">
        <i class="el-icon-switch-button paddingright"></i>
        <span> {{$t('logout')}} </span>
      </el-button>
    </div>
  </apppage-layout>
</template>
<script>
import { mapState ,mapGetters} from 'vuex'
import { showPhone } from '@/utils/visitor'
import ApppageLayout from '@/components/ApppageLayout'

export default {
  name:'Userinfo_E',
  components:{ApppageLayout},
  mounted() {
    this.initData();
  },
  created() {

  },
  watch: {
    "$route"(to, from){
      if (to.name == "Userinfo_E") {
        //this.userInfo = this.$store.getters.userInfo
      }
    }
  },
  data () {
    return {
      currIndex:1,
      active:1,
    }
  },
  computed: {
    ...mapState(['mainclr','config','userType','nationMap_code_obj','embeddedAPP']),
    ...mapGetters(['language','userInfo']),
  },
  methods: {
    showPhone,
    showVid(idtype,id){
      if (!id) {
        return ''
      }
      return this.$t('RegInfo.IDType.'+String(idtype))+ ' - ' + id
    },
    async initData(){

    },
    onSwitchLanguage () {
      this.$router.push({ name: 'switchLanguage' });
    },
    onComplaint(){
      this.$router.push({ name: 'complaint' });
    },
    onClickLeft(){
      this.$router.goBack();
    },
    logout(){
      window.location.href = '/logout/?type=regis&user=e'    
    },
    userinfoChange(type){
      if (type === 'Vid' && this.config.Vid && this.config.Vid.R) {
        return
      }
      this.$router.push({name:'changeUserInfo',query:{type:type}})
    },
    showVnation(code){
      if (code && this.nationMap_code_obj[code]) {
        return this.nationMap_code_obj[code][this.language] || ''
      }
      return ''
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.btnLogout
{
  margin-top: 15px;
  width: 100%;
}

.mainbody{
  height: 100%;
}
.titleclass
{
  width: 100px;
}
.lngCell
{
  margin-top: 5px;
}
.userlist .van-cell__title
{
    flex: 0 0 100px;
    text-align: left;
    span{
      display: inline-block;
      word-break: break-all;      
    }
}
.van-cell__left-icon {
  color: #969799;
  font-size: 1.2rem;
}
.router-slider-enter-active,
.router-slider-leave-active {
  transition: all 0.3s;
}

.router-slider-enter,
.router-slider-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>