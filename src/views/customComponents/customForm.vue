<template>
  <div id="customForm">
    <Card shadow>
      <p slot="title">受理描述</p>
      <Form :model="formItem" :label-width="60">
        <!-- 第一行 -->
        <Row :gutter="10">
          <Col span="6">
          <FormItem label="工单来源">
            <Select v-model="formItem.source">
              <Option v-for="item in source" :value="item.value" :key="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="呼救类型">
            <Select v-model="formItem.distress_types">
              <Option v-for="item in distress" :value="item.value" :key="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="事故类型">
            <Select v-model="formItem.accident_types">
              <Option v-for="item in accidentTypes" :value="item.value" :key="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="事故等级">
            <Select v-model="formItem.accident_level">
              <Option v-for="item in accident" :value="item.value" :key="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="16">
          <FormItem label="现场地址">
            <Input v-model="formItem.address_scene" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="区域">
            <Input v-model="formItem.address_area" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="16">
          <FormItem label="接车地址">
            <Input v-model="formItem.address_destination" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="患者人数">
            <Input v-model="formItem.patients" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="12">
          <FormItem label="送往地点">
            <Input v-model="formItem.address_send" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="主诉">
            <Input v-model="formItem.cc" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="病情">
            <Select v-model="formItem.illness">
              <Option v-for="item in illness" :value="item.value" :key="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="5">
          <FormItem label="患者姓名">
            <Input v-model="formItem.patientName" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="4">
          <FormItem label="性别">
            <Select v-model="formItem.sex">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="年龄">
            <Input v-model="formItem.age" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="民族">
            <Select v-model="formItem.national">
              <Option v-for="item in ethnic" :value="item.value" :key="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="国籍">
            <Select v-model="formItem.nationality">
              <Option v-for="item in countries" :value="item.value" :key="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="6">
          <FormItem label="主叫号码">
            <Input v-model="formItem.calling_phone" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="联系人">
            <Input v-model="formItem.name" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="联系电话">
            <Input v-model="formItem.phone" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="分机号">
            <Input v-model="formItem.extension" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="12">
          <FormItem label="特殊要求">
            <Input v-model="formItem.requirements" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem>
            <Checkbox v-model="formItem.stretcher" label="需要担架">需要担架</Checkbox>
          </FormItem>
          </Col>
        </Row>
        <FormItem label="备注">
          <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入"></Input>
        </FormItem>
      </Form>
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
    </Card>
    <!-- 表格 -->
  </div>
</template>
<script>
  import request from 'utils/fetch'
  export default {
    name: 'customForm',
    components: {},
    data () {
      return {
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
          { title: '电话记录', key: '电话记录' },
          { title: '转电话', key: '转电话' },
          { title: '继续接听', key: '继续接听'},
          { title: '代派', key: '代派' },
          { title: '派车', key: '派车' }
        ],
        carData: [],
        cityList: [
          {
            value: 'New York',
            label: 'New York'
          },
          {
            value: 'London',
            label: 'London'
          },
          {
            value: 'Sydney',
            label: 'Sydney'
          },
          {
            value: 'Ottawa',
            label: 'Ottawa'
          },
          {
            value: 'Paris',
            label: 'Paris'
          },
          {
            value: 'Canberra',
            label: 'Canberra'
          }
        ],
        source: [], // 来源
        distress: [], // 呼救类型
        accidentTypes: [], // 事故类型
        accident: [], // 事故等级
        illness: [], // 病情
        ethnic: [], // 民族
        countries: [], // 国籍
        formItem: {
          source: '',
          distress_types: '',
          accident_types: '',
          accident_level: '',
          address_scene: '',
          address_area: '',
          address_destination: '',
          patients: '',
          address_send: '',
          cc: '',
          illness: '',
          patientName: '',
          sex: '',
          age: '',
          national: '',
          nationality: '',
          calling_phone: '',
          name: '',
          phone: '',
          extension: '',
          requirements: '',
          stretcher: '',
          remark: ''
        }
      }
    },
    created() {
      const self = this
      this.getCarList()
      // 工单来源下拉
      request({url: 'api/queryDic', method: 'post', params: { type: 'source' }}).then(function(res) {
        self.source = res.data.data
        // console.log('工单来源', res.data.data)
      })
      // 呼救类型下拉
      request({url: 'api/queryDic', method: 'post', params: { type: 'distress' }}).then(function(res) {
        self.distress = res.data.data
        // console.log('呼救类型', res.data.data)
      })
      // 事故类型accident_types
      request({url: 'api/queryDic', method: 'post', params: { type: 'accident_types' }}).then(function(res) {
        self.accidentTypes = res.data.data
        // console.log('事故类型', res.data.data)
      })
      // 事故等级accident_types
      request({url: 'api/queryDic', method: 'post', params: { type: 'accident' }}).then(function(res) {
        self.accident = res.data.data
        // console.log('事故等级', res.data.data)
      })
      // 病情illness
      request({url: 'api/queryDic', method: 'post', params: { type: 'illness' }}).then(function(res) {
        self.illness = res.data.data
        // console.log('病情', res.data.data)
      })
      // 民族ethnic
      request({url: 'api/queryDic', method: 'post', params: { type: 'ethnic' }}).then(function(res) {
        self.ethnic = res.data.data
        // console.log('民族', res.data.data)
      })
      // 国籍countries
      request({url: 'api/queryDic', method: 'post', params: { type: 'countries' }}).then(function(res) {
        self.countries = res.data.data
        // console.log('国籍', res.data.data)
      })
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
          self.carData = res.data.data.data
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
      }
    }
  }
</script>
<style scoped>
  #customForm {
    max-width: 1080px;
    margin: 0 auto;
  }
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

