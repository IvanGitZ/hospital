<template>
    <div id="dashboard">
        <Tabs value="name1">
            <TabPane label="车辆与工单" name="name1">
                <div class="top" style="margin-bottom: 10px">
                    <div class="title">
                        <span style="float: left;font-size: 20px">车辆：22</span>
                        <div class="titleRight">
                            <RadioGroup v-model="searchLabel" type="button">
                                <Radio label="全部"></Radio>
                                <Radio label="待命"></Radio>
                                <Radio label="任务中"></Radio>
                                <Radio label="暂停"></Radio>
                                <Radio label="下班"></Radio>
                                <Radio  style="background-color: #2d8cf0;color: white;" label="刷新"></Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <Table style="margin-bottom: 10px" :columns="columns1" :data="data1"></Table>
                    <ButtonGroup>
                        <Button>收到指令</Button>
                        <Button>驶向现场</Button>
                        <Button>收到指令</Button>
                        <Button>驶向现场</Button>
                        <Button>收到指令</Button>
                        <Button>驶向现场</Button>
                    </ButtonGroup>
                </div>
                <div class="bottom">
                    <div class="title">
                        <div class="titleLeft">
                            <span style="font-size: 20px">工单信息</span>
                            <span>工单数：{{cont}}</span>
                        </div>
                        <div class="titleRight">
                            <RadioGroup v-model="searchLabel" type="button">
                                <Radio label="全部"></Radio>
                                <Radio label="待派"></Radio>
                                <Radio label="进行中"></Radio>
                                <Radio label="挂起"></Radio>
                                <Radio  style="background-color: #2d8cf0;color: white;" label="刷新"></Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <Table style="margin-bottom: 10px" :columns="columns2" :data="data1"></Table>
                    <ButtonGroup>
                        <Button>撤销待排</Button>
                        <Button>增援</Button>
                        <Button>改派</Button>
                        <Button>电话相关</Button>
                        <Button>挂起</Button>
                        <Button>结束挂起</Button>
                    </ButtonGroup>
                </div>
            </TabPane>
            <TabPane label="受理信息" name="name2">
                <Table :columns="columns2" :data="data1"></Table>
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
        searchLabel: '',
        columns1: [
          {
            title: '站点名称',
            key: 'name'
          },
          {
            title: '车牌号',
            key: 'age'
          },
          {
            title: '司机',
            key: 'address'
          }
        ],
        columns2: [
          {
            title: '工单名称',
            key: 'name'
          },
          {
            title: '工单类型',
            key: 'age'
          },
          {
            title: '地址',
            key: 'address'
          }
        ],
        data1: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            date: '2016-10-03'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01'
          }
        ]
      }
    },
    created() {
      request({
        url: 'api/queryCarList',
        method: 'get',
        params: {}
      }).then(function(res){
        console.log('返回值', res.data)
      })
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