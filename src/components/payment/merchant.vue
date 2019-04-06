<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>商户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" :model="form" label-width="1000px">
                <div class="handle-box">
                    <el-input v-model="form.merchantId" placeholder="商户ID" class="handle-input mr15"></el-input>
                    <el-input v-model="form.name" placeholder="商户名称" class="handle-input mr15"></el-input>
                    <el-input v-model="form.email" placeholder="邮箱" class="handle-input mr15"></el-input>
                </div>
                <div class="handle-box">
                    <el-input v-model="form.mobile" placeholder="手机号" class="handle-input mr15"></el-input>
                    <el-date-picker
                            v-model="form.startTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" class="mr15" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm">
                    </el-date-picker>

                    <el-button type="primary" icon="el-icon-search" @click="reload">搜索</el-button>
                    <el-button icon="el-icon-delete" class="handle-del mr5" @click="clear">清空</el-button>
                    <el-button icon="el-icon-download" class="handle-del mr5" @click="">导出excel</el-button>
                </div>
            </el-form>
            <div class="handle-box">

            </div>

            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus" @click="addVisible=true">新增</el-button>
            </div>


            <el-table :data="tableData" class="table" max-height="531" ref="multipleTable" @selection-change="handleSelectionChange" width="100%">
                <el-table-column type="index" label="序号" :index="multipleSelection"></el-table-column>
                <el-table-column align="center" prop="merchantId" label="商户ID" width="200"></el-table-column>
                <el-table-column align="center" prop="name" label="名称" width="200"></el-table-column>
                <el-table-column align="center" prop="email" label="邮箱" width="250"></el-table-column>
                <el-table-column align="center" prop="mobile" label="手机号" width="120"></el-table-column>
                <el-table-column align="center" prop="merchantSettlementSettingsCurrencies" label="商户结算配置货币" width="500">
                    <template slot-scope="scope">
                        <el-button type="primary" class="table123" size="mini" v-for="currency in scope.row.merchantSettlementSettingsCurrencies">{{currency}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商户配置货币" width="500">
                    <template slot-scope="scope">
                        <el-button type="primary" class="table123" size="mini" v-for="currency in scope.row.merchantSettingsCurrencies">{{currency}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="logoUrl" label="logo地址" width="200"></el-table-column>
                <el-table-column align="center" prop="logoReturnUrl" label="logo跳转地址" width="200"></el-table-column>
                <el-table-column align="center" prop="status" label="状态" width="120"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间" width="250">
                    <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.createTime|moment}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <!--<el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">-->
                <!--</el-pagination>-->

                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pagination.page_index"
                        :page-sizes="pagination.page_sizes"
                        :page-size="pagination.page_size"
                        :layout="pagination.layout"
                        :total="pagination.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="编辑" :visible.sync="editVisible" :close-on-press-escape="false"
                   :close-on-click-modal="false"
                   :modal-append-to-body="false " width="500px">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
                <el-form-item label="商户ID" prop="merchantId">
                    <el-input readonly="true"  prop="merchantId"
                              disabled="true" v-model="addForm.merchantId">
                    </el-input>
                </el-form-item>
                <el-form-item label="商户名称" prop="merchantName">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="logo地址" prop="logoUrl">
                    <el-input v-model="addForm.logoUrl" ></el-input>
                </el-form-item>
                <el-form-item label="logo跳转地址" prop="logoReturnUrl">
                    <el-input v-model="addForm.logoReturnUrl"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="editVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>



        <!-- 新增 -->
        <el-dialog title="新增商户" :visible.sync="addVisible" :close-on-press-escape="false"
                   :close-on-click-modal="false"
                   :modal-append-to-body="modalappendtobody " width="500px">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
                <el-form-item label="商户名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="logo地址" prop="logoUrl">
                    <el-input v-model="addForm.logoUrl" ></el-input>
                </el-form-item>
                <el-form-item label="logo跳转地址" prop="logoReturnUrl">
                    <el-input v-model="addForm.logoReturnUrl"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('addForm')">提交</el-button>
                    <el-button @click="addVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import {Message} from 'element-ui'
    export default {
        name: 'basetable',
        data() {
            var validateMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                }else {
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }
            };
            var validateEmail = (rule,value,callback)=>{
                if (value === '') {
                    callback(new Error('请正确填写邮箱'));
                } else {
                    if (value !== '') {
                        var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                        if(!reg.test(value)){
                            callback(new Error('请输入有效的邮箱'));
                        }
                    }
                    callback();
                }
            }
            return {
                tableData: [],
                index:0,
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                addVisible:false,
                delVisible: false,
                maskShow: false,
                modalappendtobody:false,
                form: {
                    merchantId: '',
                    name: '',
                    email: '',
                    logoReturnUrl:'',
                    logoUrl:'',
                    mobile:'',
                    startTime:''
                },
                addForm:{
                    merchantId:'',
                    name:'',
                    email:'',
                    mobile:'',
                    logoUrl:'',
                    logoReturnUrl:''
                },
                rules:{
                    name:[
                        {required:true,message:'商户名称不能为空',trigger:'blur'}
                    ],
                    email:[
                        {required:true,validator: validateEmail,trigger:'blur'}
                    ],
                    mobile:[
                        {required:true,validator: validateMobile,trigger: 'blur'}
                    ]
                },
                pagination:{
                    page_index:1,
                    page_sizes:[10,15,20],
                    page_size:10,
                    layout:'total, sizes, prev, pager, next, jumper',
                    total:0
                }
            }
        },
        created() {
            this.reload();
        },
        computed: {
            data() {
                this.reload();
            }
        },
        methods: {
            dateFormat:function(row, column) {
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD HH:mm:ss");
            },
            // 分页导航
            handleCurrentChange(page) {
                this.pagination.page_index = page;
                this.reload();
            },
            handleSizeChange(page_size){
                this.pagination.page_index = 1;
                this.pagination.page_size = page_size;
                this.reload();
            },
            search() {

            },
            clear(){
                this.form = {
                    merchantId:'',
                    merchantName: '',
                    email: '',
                    name:'',
                    startTime:'',
                    mobile:'',
                    date1:''
                };
                this.pagination.page_index =1;
                this.pagination.page_size = 10
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.addForm = row;
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                indexMethod();
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            },
            reload(){
                this.$axios.post("/merchant/list",this.form,{
                    headers: {
                        // 'content-type': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "token": localStorage.getItem("token") //token换成从缓存获取
                    },
                    params:{
                        merchantId:this.form.merchantId,
                        name:this.form.name,
                        email:this.form.email,
                        mobile:this.form.mobile,
                        startTime:this.form.startTime==null? '':this.form.startTime[0] ,
                        stopTime:this.form.startTime==null?'':this.form.startTime[1],
                        page:this.pagination.page_index,
                        limit:this.pagination.page_size
                    }
                }).then((res) => {
                    console.info(res);
                    if (res.data.page ==null){
                        this.tableData = '';
                        this.pagination.total = 0;
                        // this.pagination.page_size =1;
                    }else {
                        this.pagination.page_index = res.data.page.currPage;
                        this.tableData = res.data.page.list;
                        this.pagination.total = res.data.page.totalCount;
                    }
                });
            },
            onSubmit(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/merchant/save",this.addForm)
                            .then((response)=>{
                                console.info(response);
                                if (response.data.code ==0){
                                    Message.success("保存成功！！！");
                                    this.addVisible = false;
                                    this.modalappendtobody= true;
                                    this.reload();
                                }else {
                                    Message.error(response.data.message);
                                }
                            }).catch((err)=>{
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .mr15{
        margin-right: 15px;
    }
    .mr25{
        margin-right: 25px;
    }
    .table123{
        padding: 3px 3px;
    }
</style>
