<template>
  <div id="phone">
    <div style="overflow: hidden">
      <div style="float: left">
        <Form :model="formItem" :label-width="40" :inline="true">
          <FormItem label="电话:">
            <Input v-model="formItem.pass" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="姓名:">
            <Input v-model="formItem.newPwd" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="时间:">
            <Input v-model="formItem.againNewPwd" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="时间:">
            <Input v-model="formItem.againNewPwd" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="时间:">
            <Input v-model="formItem.againNewPwd" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </div>
      <div style="float: right">
        <Button type="primary">搜索</Button>
      </div>
    </div>
    <Table :columns="columns1" :data="data1"></Table>
  </div>
</template>
<script>
export default {
  name: 'phone',
  data() {
    return {
      formItem: {
        pass: '',
        newPwd: '',
        againNewPwd: ''
      },
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
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
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]
    }
  }
}
</script>
<style scoped>
  #phone {
    margin-top: 20px;
  }
</style>