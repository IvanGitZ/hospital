<template>
    <div id="dashboard">
        <Tabs value="name1">
            <TabPane label="车辆与工单" name="name1">
                <div class="top" style="margin-bottom: 10px">
                    <div class="title">
                        <span style="float: left;font-size: 20px">车辆：22</span>
                        <div class="titleRight">
                            <RadioGroup v-model="carSearch" @on-change="getCarList" type="button">
                                <Radio label="">全部</Radio>
                                <Radio label="0">待命</Radio>
                                <Radio label="1">任务中</Radio>
                                <Radio label="2">暂停</Radio>
                                <Radio label="3">下班</Radio>
                                <Radio  style="background-color: #2d8cf0;color: white;" label="">刷新</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <Table style="margin-bottom: 10px" @on-select="carSelectColumn" :columns="carColumns" :data="carData"></Table>
                    <ButtonGroup>
                      <Button v-for="item in carBtnArr" @click="carClick(item.key)" :key="item.key">{{item.title}}</Button>
                    </ButtonGroup>
                </div>
                <div class="bottom">
                    <div class="title">
                        <div class="titleLeft">
                            <span style="font-size: 20px">工单信息</span>
                            <span>工单数：{{cont}}</span>
                        </div>
                        <div class="titleRight">
                            <RadioGroup v-model="orderSearch" @on-change="getOrderList" type="button">
                                <Radio label="">全部</Radio>
                                <Radio label="0">待派</Radio>
                                <Radio label="1">进行中</Radio>
                                <Radio label="2">挂起</Radio>
                                <Radio  style="background-color: #2d8cf0;color: white;" label="">刷新</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <Table style="margin-bottom: 10px" @on-select="orderSelectColumn" :columns="orderColumns" :data="orderData"></Table>
                    <ButtonGroup>
                      <Button v-for="item in orderBtnArr" @click="orderClick(item.key)" :key="item.key">{{item.title}}</Button>
                    </ButtonGroup>
                </div>
            </TabPane>
            <TabPane label="受理信息" name="name2">
                <Table :columns="orderColumns" :data="carData"></Table>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
  import request from 'utils/fetch';
  export default {
    name: 'dashboard',
    data () {
      return {
        cont: 10,
        // 车辆
        carSearch: '',
        carSelectArr: [],
        carColumns: [
          { title: '站点名称', key: 'siteName', type: 'selection' },
          { title: '车牌号', key: 'number' },
          { title: '司机', key: 'driverName'},
          { title: '医生', key: 'doctorName' },
          { title: '护士', key: 'nurseName' },
          { title: '状态', key: 'state'},
          { title: '按键时间', key: 'siteName' },
          { title: '车况', key: 'vehicles' },
          { title: '随车电话', key: 'phone'},
          { title: '任务号', key: 'orderNo' },
          { title: '车型', key: 'model'}
        ],
        carBtnArr: [
          { title: '收到指令', key: '收到指令' },
          { title: '驶向现场', key: '驶向现场' },
          { title: '抢救转送', key: '抢救转送'},
          { title: '途中待命', key: '途中待命' },
          { title: '站内待命', key: '站内待命' },
          { title: '中止任务', key: '中止任务'},
          { title: '暂停调用', key: '暂停调用' },
          { title: '恢复调用', key: '恢复调用' },
          { title: '上下班', key: '上下班'}
        ],
        carData: [],
        // 工单
        orderSearch: '',
        orderColumns: [
          { title: '工单号', key: 'orderNo', type: 'selection' },
          { title: '状态', key: 'state' },
          { title: '主叫电话', key: 'callingPhone'},
          { title: '工单来源', key: 'source' },
          { title: '调度员', key: 'userName' },
          { title: '受理时间', key: 'createTime'},
          { title: '现场地址', key: 'addressScene' },
          { title: '接车地址', key: 'addressDestination' },
          { title: '目的地', key: 'addressSend'}
        ],
        orderBtnArr: [
          { title: '唤醒待派', key: '唤醒待派' },
          { title: '撤销待派', key: '撤销待派' },
          { title: '增援', key: '增援'},
          { title: '改派', key: '改派' },
          { title: '电话相关', key: '电话相关' }
        ],
        orderData: []
      }
    },
    created() {
      const self = this
      self.getCarList()
      self.getOrderList()
        // const self = this
        // const ws = new WebSocket("ws://aid.jdaoyun.com/ws")
        // ws.onopen = function() {
        //     console.log("open")
        //     ws.send("hello");
        // }
        // ws.onmessage = function(evt) {
        //     self.cont = evt.data
        //     console.log('websocket onmessage', evt.data)
        // }
    },
    mounted() {

    },
    methods: {
      // 车辆
      getCarList(value) {
        const self = this
        request({
          url: 'api/queryCarList',
          method: 'get',
          params: { state: value }
        }).then(function(res){
          console.log('车辆信息返回值', res.data)
          self.carData = res.data.josnObj.data
        })
      },
      carSelectColumn(selection, row) {
        console.log(selection, row)
        const self = this
        self.carSelectArr = _.cloneDeep(selection)
      },
      carClick(data) {
        const self = this
        console.log('carClick', data, self.carSelectArr)
      },
      // 工单
      getOrderList(value) {
        const self = this
        request({
          url: 'api/queryOrderList',
          method: 'get',
          params: { state: value }
        }).then(function(res){
          console.log('工单返回值', res.data)
          self.orderData = res.data.josnObj.data
        })
      },
      orderSelectColumn(selection, row) {
        console.log(selection, row)
        const self = this
        self.carSelectArr = _.cloneDeep(selection)
      },
      orderClick(data) {
        const self = this
        console.log('carClick', data, self.carSelectArr)
      }
    }
  }
</script>
<style scoped>
    .title {
        /*padding-bottom: 10px;*/
        overflow: hidden;
    }
    .titleLeft {
        float: left;
        overflow: hidden;
    }
    .titleRight {
        float: right;
    }
</style>