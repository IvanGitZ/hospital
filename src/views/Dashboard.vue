<template>
    <div id="dashboard">
        <Tabs value="name1">
            <TabPane label="车辆与工单" name="name1">
                <div class="top" style="margin-bottom: 10px">
                    <div class="title">
                        <span style="float: left;font-size: 20px">车辆：{{carTotal}}</span>
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
                    <Table style="margin-bottom: 10px" @on-selection-change="carSelectColumn" :columns="carColumns" :data="carData"></Table>
                    <ButtonGroup>
                      <Button v-for="item in carBtnArr" @click="carClick(item.key)" :key="item.key">{{item.title}}</Button>
                    </ButtonGroup>
                </div>
                <div class="bottom">
                    <div class="title">
                        <div class="titleLeft">
                            <span style="font-size: 20px">工单信息</span>
                            <span>工单数：{{orderTotal}}</span>
                        </div>
                        <div class="titleRight">
                            <RadioGroup v-model="orderSearch" @on-change="getOrderList" type="button">
                                <Radio label="">全部</Radio>
                                <Radio label="1">进行中</Radio>
                                <Radio label="0">挂起</Radio>
                                <Radio  style="background-color: #2d8cf0;color: white;" label="">刷新</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <Table style="margin-bottom: 10px" @on-selection-change="orderSelectColumn" :columns="orderColumns" :data="orderData"></Table>
                    <ButtonGroup>
                      <Button v-for="item in orderBtnArr" @click="orderClick(item.key)" :key="item.key">{{item.title}}</Button>
                    </ButtonGroup>
                </div>
            </TabPane>
            <TabPane label="受理信息" name="name2">
              <customForm></customForm>
            </TabPane>
        </Tabs>
        <!-- 上下班弹窗 -->
        <Modal
          v-model="changeModel"
          title="选择上班人员"
          @on-ok="changeOk"
          @on-cancel="cancel">
            <Form :model="formItem" :label-width="80">
                <FormItem label="司机">
                    <Select v-model="formItem.driverId">
                        <Option v-for="item in driverArr" :value="item.id" :key="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医生">
                    <Select v-model="formItem.doctorId">
                        <Option v-for="item in doctorArr" :value="item.id" :key="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="护士">
                    <Select v-model="formItem.nurseId">
                        <Option v-for="item in nurseArr" :value="item.id" :key="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
        <!-- 上下班弹窗 -->
        <Modal
          width="70%"
          v-model="changeCarModel"
          title="选择车辆"
          @on-ok="changeCarOk"
          @on-cancel="cancel">
            <Table style="margin-bottom: 10px" @on-selection-change="selectNewCar" :columns="carColumns" :data="readyCarData"></Table>
        </Modal>
    </div>
</template>
<script>
  import customForm from '@/views/customComponents/customForm'
  import request from 'utils/fetch';
  export default {
    name: 'dashboard',
    components: { customForm },
    data () {
      return {
        // 工单修改的状态
        orderChangeState: '',
        readySelectCarArr: [],
        // 待命的车辆
        readyCarData: [],
        // 员工表单
        carId: '',
        formItem: {
          driverId: '',
          doctorId: '',
          nurseId: ''
        },
        driverArr: [],
        doctorArr: [],
        nurseArr: [],
        changeModel: false, // 上下班弹窗
        changeCarModel: false, // 增派改派弹窗
        // 车辆
        carSearch: '',
        carSelectArr: [],
        carColumns: [
          { title: '站点名称', key: 'siteName', type: 'selection' },
          { title: '车牌号', key: 'number' },
          { title: '司机', key: 'driverName'},
          { title: '医生', key: 'doctorName' },
          { title: '护士', key: 'nurseName' },
          { title: '状态', key: 'stateName'},
          { title: '按键时间', key: 'siteName' },
          { title: '车况', key: 'vehicles' },
          { title: '随车电话', key: 'phone'},
          { title: '任务号', key: 'orderNo' },
          { title: '车型', key: 'model'}
        ],
        carBtnArr: [
          { title: '收到指令', key: '0' },
          { title: '驶向现场', key: '1' },
          { title: '抢救转送', key: '2'},
          { title: '途中待命', key: '3' },
          { title: '站内待命', key: '4' },
          { title: '中止任务', key: '5'},
          { title: '暂停调用', key: '6' },
          { title: '恢复调用', key: '7' },
          { title: '上下班', key: 'change'}
        ],
        carData: [],
        carTotal: '',
        // 工单
        orderSearch: '',
        orderSelectArr: [],
        orderColumns: [
          { title: '工单号', key: 'orderNo', type: 'selection' },
          { title: '状态', key: 'stateName' },
          { title: '主叫电话', key: 'callingPhone'},
          { title: '工单来源', key: 'source' },
          { title: '调度员', key: 'userName' },
          { title: '受理时间', key: 'createTime'},
          { title: '现场地址', key: 'addressScene' },
          { title: '接车地址', key: 'addressDestination' },
          { title: '目的地', key: 'addressSend'}
        ],
        orderBtnArr: [
          { title: '唤醒待派', key: '12' },
          { title: '撤销待派', key: '13' },
          { title: '增援', key: '14'},
          { title: '改派', key: '15' },
          { title: '电话相关', key: '电话相关' }
        ],
        orderData: [],
        orderTotal: ''
      }
    },
    created() {
      const self = this
      self.getCarList()
      self.getOrderList()
      self.getUserList()
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
      // 员工信息查询
      getUserList() {
        const self = this
        request({ url: 'api/queryUserList', method: 'post', params: { roleName: 'driver' } }).then(function(res){
          self.driverArr = res.data.data.data
        })
        request({ url: 'api/queryUserList', method: 'post', params: { roleName: 'doctor' } }).then(function(res){
          self.doctorArr = res.data.data.data
        })
        request({ url: 'api/queryUserList', method: 'post', params: { roleName: 'nurse' } }).then(function(res){
          self.nurseArr = res.data.data.data
        })
      },
      // 车辆
      getCarList(value) {
        const self = this
        request({
          url: 'api/queryCarList',
          method: 'get',
          params: { state: value }
        }).then(function(res){
          console.log('车辆信息返回值', res.data)
          self.carData = res.data.data.data
          self.carTotal = res.data.total
          _.each(self.carData, function(item) {
            switch (item.state) {
              case '0': item.stateName = '待命'
                break;
              case '1': item.stateName = '任务中'
                break;
              case '2': item.stateName = '暂停'
                break;
              case '3': item.stateName = '下班'
                break;
            }
          })
        })
      },
      getReadyCarList() {
        const self = this
        request({
          url: 'api/queryCarList',
          method: 'get',
          params: { state: '0' }
        }).then(function(res){
          console.log('车辆信息返回值', res.data)
          self.readyCarData = res.data.data.data
          _.each(self.readyCarData, function(item) {
            switch (item.state) {
              case '0': item.stateName = '待命'
                break;
              case '1': item.stateName = '任务中'
                break;
              case '2': item.stateName = '暂停'
                break;
              case '3': item.stateName = '下班'
                break;
            }
          })
        })
      },
      carSelectColumn(selection) {
        console.log(selection)
        const self = this
        self.carSelectArr = _.cloneDeep(selection)
      },
      carClick(data) {
        const self = this
        if (self.carSelectArr.length < 1) {
          this.$Message.info('请选择车辆')
          return
        }
        console.log('carClick', data, self.carSelectArr)
        if (data === 'change') {
          if (self.carSelectArr.length > 1) {
            this.$Message.info('请选择唯一的车辆进行调整')
            return
          }
          // 上下班
          _.each(self.carSelectArr, function(item){
            let params = {}
            if (item.state === '0') {
              // 待命中，可下班
              params = {
                state: '1',
                carId: item.id,
                driverId: item.driverId,
                doctorId: item.doctorId,
                nurseId: item.nurseId
              }
            } else if (item.state === '2' || item.state === '3') {
              // 暂停或下班，可上班
              self.changeModel = true
              self.carId = item.id
              return false
            } else {
              alert('进行中，不可调整')
              return false
            }
            request({
              url: 'api/duty',
              method: 'post',
              params: params
            }).then(function(dutyRes){
              console.log('上下班', dutyRes)
              self.getCarList()
            })
          })
          self.carSelectArr = []
        } else {
          _.each(self.carSelectArr, function(item) {
            request({
              url: 'api/editCar',
              method: 'post',
              params: { id: item.id, state: data }
            }).then(function(res) {
              console.log('修改车辆信息', res)
              self.getCarList()
            })
          })
          self.carSelectArr = []
        }
      },
      changeOk() {
        const self = this
        const params = self.formItem
        console.log(self.carSelectArr)
        params.state = '0'
        params.carId = self.carId
        console.log('params', params)
        request({ url: 'api/duty', method: 'post', params: params }).then(function(dutyRes){
          console.log('上下班', dutyRes)
          self.getCarList()
          self.carSelectArr = []
        })
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
          self.orderData = res.data.data.data
          self.orderTotal = res.data.total
          _.each(self.orderData, function(item) {
            switch (item.state) {
              case '0': item.stateName = '挂起'
                break;
              case '1': item.stateName = '进行中'
                break;
              case '2': item.stateName = '撤销'
                break;
              case '3': item.stateName = '已完成'
                break;
            }
          })
        })
      },
      orderSelectColumn(selection) {
        console.log(selection)
        const self = this
        self.orderSelectArr = _.cloneDeep(selection)
      },
      orderClick(data) {
        const self = this
        if (self.orderSelectArr.length < 1) {
          this.$Message.info('请选择工单')
          return
        } else if (self.orderSelectArr.length > 1) {
          this.$Message.info('请选择唯一工单修改')
          return
        }
        if (data === '14' || data === '15') {
          self.changeCarModel = true
          self.orderChangeState = data
          self.getReadyCarList()
          return
        }
        console.log('orderClick', data, self.orderSelectArr)
        _.each(self.orderSelectArr, function(item){
          request({
            url: 'api/editOrder',
            method: 'post',
            params: { id: item.id, state: data }
          }).then(function(orderRes){
            console.log('工单状态修改返回值', orderRes)
            self.getOrderList()
          })
        })
        self.orderSelectArr = []
      },
      selectNewCar(data) {
        console.log(data)
        const self = this
        self.readySelectCarArr = data
      },
      changeCarOk() {
        const self = this
        console.log('点击确定', self.orderSelectArr, self.orderChangeState, self.readySelectCarArr)
        let carIds = ''
        const carArr = []
        if (self.readySelectCarArr.length >= 0) {
          _.each(self.readySelectCarArr, function(item) {
            carArr.push(item.id)
          })
          carIds = carArr.join(',')
        } else {
          this.$Message.info('请选择新添加的车辆')
        }
        request({
          url: 'api/editOrder',
          method: 'post',
          params: { id: self.orderSelectArr[0].id, state: self.orderChangeState, carIds: carIds }
        }).then(function(orderRes){
          console.log('工单状态修改返回值', orderRes)
          self.getOrderList()
          self.getCarList()
          self.readySelectCarArr = []
        })
      },
      cancel() {
        this.$Message.info('取消')
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