<template>
    <div class="sidebar">
        <!--<el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"-->
            <!--text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>-->
            <!--<template v-for="item in items">-->
                <!--<template v-if="item.subs">-->
                    <!--<el-submenu :index="item.index" :key="item.index">-->
                        <!--<template slot="title">-->
                            <!--<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>-->
                        <!--</template>-->
                        <!--<template v-for="subItem in item.subs">-->
                            <!--<el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">-->
                                <!--<template slot="title">{{ subItem.title }}</template>-->
                                <!--<el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">-->
                                    <!--{{ threeItem.title }}-->
                                <!--</el-menu-item>-->
                            <!--</el-submenu>-->
                            <!--<el-menu-item v-else :index="subItem.index" :key="subItem.index">-->
                                <!--{{ subItem.title }}-->
                            <!--</el-menu-item>-->
                        <!--</template>-->
                    <!--</el-submenu>-->
                <!--</template>-->
                <!--<template v-else>-->
                    <!--<el-menu-item :index="item.index" :key="item.index">-->
                        <!--<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>-->
                    <!--</el-menu-item>-->
                <!--</template>-->
            <!--</template>-->
        <!--</el-menu>-->

        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.list">
                    <el-submenu :index="item.menuId" :key="item.menuId">
                        <template slot="title" v-if="item.name=='directpayPlatform'">
                            <i class="el-icon-lx-home"></i><span slot="title">支付平台</span>
                        </template>

                        <template slot="title" v-if="item.name=='sysManagement'">
                            <i class="el-icon-setting"></i><span slot="title">系统管理</span>
                        </template>

                        <template v-for="subItem in item.list">
                            <el-submenu v-if="subItem.list" :index="subItem.url" :key="subItem.url">
                                <template slot="title">{{ subItem.name }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.list" :key="i" :index="threeItem.url">
                                    {{ threeItem.name }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.url" :key="subItem.url">
                                {{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.url" :key="item.url">
                        <i class="el-icon-lx-home"></i><span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                // items: [
                //     {
                //         icon: 'el-icon-lx-home',
                //         index: 'dashboard',
                //         title: '系统首页'
                //     },
                //     {
                //         icon: 'el-icon-lx-cascades',
                //         index: 'table',
                //         title: '基础表格'
                //     },
                //     {
                //         icon: 'el-icon-lx-cascades',
                //         index: '3',
                //         title: '支付中心',
                //         subs:[
                //             {
                //                 title:'商户信息',
                //                 index:'merchant'
                //             },
                //             {
                //                 index:'merchantsettings_table',
                //                 title:'商户配置'
                //             },
                //             {
                //                 index:'merchantsettingssettlement_table',
                //                 title:'商户结算配置'
                //             },
                //             {
                //                 index:'table343434',
                //                 title:'商户流水'
                //             },
                //             {
                //                 index:'order11',
                //                 title:'商户订单'
                //             },
                //             {
                //                 index:'table1234',
                //                 title:'商户结算'
                //             },
                //             {
                //                 index:'table666',
                //                 title:'支付通知'
                //             }
                //         ]
                //     }
                // ]
                items:[]
            }
        },
        methods:{
           loadMenu(){
               this.$axios.post("/sys/menu/nav",null, {
               }).then((res) => {
                   if (res.data != null){
                       this.items = res.data.menuList;
                       console.info(this.items);
                   }else {

                   }
               });
           }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
            this.loadMenu();
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
