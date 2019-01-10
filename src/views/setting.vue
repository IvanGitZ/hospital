<template>
  <div id="setting">
    <Card style="width:600px; margin: 0 auto;overflow: hidden" dis-hover >
      <p slot="title">
        修改密码
      </p>
      <!--<a href="#" slot="extra" @click.prevent="changeLimit">-->
        <!--<Icon type="ios-loop-strong"></Icon>-->
        <!--Change-->
      <!--</a>-->
      <Form :model="formItem" :label-width="80">
        <FormItem label="原密码">
          <Input v-model="formItem.pass" placeholder="请输入原密码"></Input>
        </FormItem>
        <FormItem label="新密码">
          <Input v-model="formItem.newPwd" placeholder="请输入新密码"></Input>
        </FormItem>
        <FormItem label="确认新密码">
          <Input v-model="formItem.againNewPwd" placeholder="请再次输入新密码"></Input>
        </FormItem>
      </Form>
      <div style="float: right;margin-right: 5px;margin-bottom: 20px">
        <Button>取消</Button>
        <Button type="primary" @click="sure">确定</Button>
      </div>
    </Card>
  </div>
</template>
<script>
  import Cookies from 'js-cookie';
  import request from 'utils/fetch';
  export default {
    name: 'setting',
    data () {
      return {
        formItem: {
          pass: '',
          newPwd: '',
          againNewPwd: ''
        }
      }
    },
    methods: {
      sure() {
        const self = this
        console.log(self.formItem, Cookies.get('id'))
        self.formItem.id = Cookies.get('id')
        delete self.formItem.againNewPwd
        request({ url: 'api/editPwd', method: 'post', params: self.formItem }).then(function(res) {
          console.log('res', res)
          if (res.data.flag) {
            self.$Message.success('密码修改成功')
          } else {
            self.$Message.warning(res.data.msg)
            self.formItem = {
              pass: '',
              newPwd: '',
              againNewPwd: ''
            }
          }
        })
      }
    }
  }
</script>
<style>

</style>