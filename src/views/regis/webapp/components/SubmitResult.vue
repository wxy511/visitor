<template>
  <div>
    <el-checkbox  v-model="checkError" border style="margin-bottom:15px;" @change="onChangeCheck">{{$t('Regis.onlyShowError')}}</el-checkbox>
    <el-table
      ref="result"
      v-loading="tableloading"
      :data="results" 
      class="result-table"
      border
      header-row-class-name="tableheaderrowclass"
      :row-class-name="TableRowClassName"
      :cell-style="stateTableCellStyle"
    >
      <el-table-column type="index" width="40">
      </el-table-column>
      <el-table-column :label="$t('RegInfo.visitor')" prop="Vname" align="left" :show-overflow-tooltip="true" width="80">
      </el-table-column>
      <!-- <el-table-column :label="$t('RegInfo.Vunit')" prop="Vunit" align="left" :show-overflow-tooltip="true" width="200"></el-table-column>
      <el-table-column :label="$t('RegInfo.Vphone')" prop="Vphone" align="left" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          <span>{{showPhone(scope.row.Vcountrycode,scope.row.Vphone)}}</span>
        </template>   
      </el-table-column> -->
      <el-table-column :label="$t('Regis.status.label')" prop="status" align="left" width="80">
        <template slot-scope="scope">
          <span :class="scope.row.status"> {{ $t('Regis.status.'+scope.row.status) }} </span>
        </template>          
      </el-table-column> 
      <el-table-column :label="$t('Regis.error.label')" align="left" >
        <template slot-scope="scope">
          <span v-show="scope.row.error"> {{ $t('Regis.error.'+scope.row.reason||'unknown') }} </span>
        </template>          
      </el-table-column>
    </el-table>
    <div style="height:20px"></div>
  </div>
</template>
<script>
import { mapState,mapGetters } from 'vuex'
import { showPhone } from '@/utils/visitor.js'

export default {
  name: 'SubmitResult',
  props: {},
  data(){
    return {
      tableloading:false,
      results:[{'error':0,'Vname':'','Vunit':'','Vphone':'','status':'success','reason':''}],
      fullData:[],
      errorData:[],
      checkError:false,
      loading:false
    }
  },
  computed: {
    ...mapState(['stateTableCellStyle']),
    ...mapGetters(['language']),
  },
  methods: {
    showPhone,
    initData(results,visitorList){
      this.tableloading = true
      var thisResults = []
      var thisError= []

      results.forEach(item => {
        try {
          item['status'] = item.error === 0?'success':'error'
          var visitor = visitorList[item['Number']]
          if (visitor) {
            item['Vname'] = visitor['Vname']
            item['Vunit'] = visitor['Vunit']||''
            item['Vphone'] = visitor['Vphone']||''      
            item['Vcountrycode'] = visitor['Vcountrycode']||''            
          }
          item['reason'] = 'unknown'
          if (item.error === 4 || item.error === 5 ||item.error === 6||item.error === 16 ||item.error === 17 || item.error === 40) {
            item['reason'] = 'erSubmit'+item.error 
          }

          thisResults.push(item)
          if (item.error !== 0) {
            thisError.push(item)
          }
        } catch (error) {
          
        }
      });

      this.results = thisResults
      this.fullData = thisResults
      this.errorData = thisError
      this.tableloading = false
    },
    TableRowClassName({ row, rowIndex }) {
      return 'table-'+row.status
    },
    onChangeCheck(val){
      this.results = val?this.errorData:this.fullData
    },
  }
}
</script>
<style lang="scss">
.result-table
{
  max-height: 900px;
  width: 100%;
  overflow-y: auto;
}
.success
{
  // border-left: 3px solid #19C096;
  // padding-left: 3px;
  color: #19C096;
}
.error
{
  // border-left: 3px solid #f26d7d;
  // padding-left: 3px;
  color: #f26d7d;
  font-weight: bold;
}
.result-table .table-error
{
  background-color: #fcf2f2 !important;
}
</style>