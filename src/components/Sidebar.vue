<!--<template>-->
  <!--<div class="sidebar">-->
    <!--<nav class="sidebar-nav">-->
      <!--<sidebar-item :routes='siderbar_routers.children'></sidebar-item>-->

    <!--</nav>-->
  <!--</div>-->
<!--</template>-->
<!--<script>-->
   <!--import SidebarItem from './SidebarItem';-->
<!--import { mapGetters } from 'vuex';-->
<!--export default {-->
  <!--name: 'sidebar',-->
  <!--components: { SidebarItem },-->
      <!--computed: {-->
        <!--...mapGetters([-->
          <!--'siderbar_routers'-->
        <!--])-->
      <!--},-->
  <!--methods: {-->
    <!--handleClick (e) {-->
      <!--e.preventDefault()-->
      <!--e.target.parentElement.classList.toggle('open')-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->

<!--<style lang="css">-->
  <!--.nav-link {-->
    <!--cursor:pointer;-->
  <!--}-->
<!--</style>-->
<template>
    <div class="sidebar">
        <Card class="sidebarCard">
            <p slot="title">
                系统当前有0个电话排队
            </p>
            电话
        </Card>
        <Card class="sidebarCard">
            <p slot="title">
                坐席状态
            </p>
            <div>
                <p><span>一号台 </span> 就绪</p>
                <p><span>二号台 </span> 离席</p>
                <p><span>三号台 </span> 受理</p>
            </div>
        </Card>
        <Card class="sidebarCard">
            <p slot="title">
                来电信息
            </p>
            <div>
                <p><span>姓名：</span>张三</p>
                <p><span>电话：</span>18823437747</p>
                <p><span>上次来电：</span>2018-10-01</p>
                <Button type="success" long>挂机</Button>
            </div>
        </Card>
    </div>
</template>
<script>
    export default {
      name: 'sidebar',
      data () {
        return {

        }
      }
    }
</script>
<style scoped>
    .sidebar {
        color: #000;
    }
    .sidebarCard {
        border-radius: 0;
    }
</style>
