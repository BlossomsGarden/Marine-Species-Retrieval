<template>
  <page-header-wrapper>
    <a-modal
      title="添加用户"
      v-model="modalVisible"
      @ok="modalOk"
      @cancel="modalCancel"
    >
      <a-form :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-form-item label="用户昵称" :required="true" style="display:flex">
          <a-input v-model="newUser.name"/>
        </a-form-item>

        <a-form-item label="登录密码">
          <a-input v-model="newUser.password"/>
        </a-form-item>

        <a-form-item label="归属组织" :required="true" style="display:flex">
          <a-select v-model="newUser.organizationId" placeholder="请选择">
            <a-select-option v-for="item in newUser.orgList" :key="item.id" :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="归属组织">
                <a-select v-model="queryParam.orgId" placeholder="请选择" default-value="0">
                  <a-select-option v-for="item in orgList" :key="item.id" :value="item.id">
                    {{item.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.name" placeholder="请输入用户名查找"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
                <a-button type="primary" @click="handleQuery()">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>

      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="tableData" 
        :alert="true"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>

        <span slot="orgName" slot-scope="text,record">
          <!-- 减去2是因为organization表中1:'admin'。取到列表之后尾部插入0:'全部'，又删除了1:'admin'，于是2:'同济大学'索引为0 -->
          {{orgList[record.organizationId-2].name}}
        </span>

        <span slot="status" slot-scope="text,record">
          <a-badge :color="record.blocked?'red':'green'" :text="record.blocked?'封禁中':'使用中'" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="_blockUser(record)">封禁</a>
            <a-divider type="vertical" />
            <a @click="_deleteUser(record)" style="color:red">删除</a>
          </template>
        </span>
      </a-table>


    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Modal, notification } from 'ant-design-vue'
import {getRoleList,getServiceList,getAllOrg,getAllUser,blockUser,deleteUser,newUser } from '@/api/manage'


const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

const columns=[
  {
    title: '编号',
    align:'center',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '用户名',
    align:'center',
    dataIndex: 'name'
  },
  {
    title: '描述',
    align:'center',
    dataIndex: 'description'
  },
  {
    title: '归属组织',
    align:'center',
    dataIndex: 'orgName',
    scopedSlots: { customRender: 'orgName' }
  },
  {
    title: '状态',
    align:'center',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '上次登录',
    align:'center',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    align:'center',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'AccountManagement',
  data () {
    return {
      //组织列表
      orgList:[],
      // 查询参数
      queryParam: {
        orgId:0,
        name:''
      },
      //表格变量
      tableData: [],
      columns: columns,
      //新建用户modal变量
      modalVisible: false,
      newUser:{
        name:'',
        password:'',
        organizationId:2,
        orgList:[]
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  async created () {
    getRoleList({ t: new Date() })

    //获得都有哪些组织
    await getAllOrg()
    .then(res=>{
      //你1是管理员，这个就别要了
      this.orgList=res.data.filter(item => item.id!=1)
      this.orgList.push({
        id:0,
        name:'全部'
      })
    })

    await this.handleQuery()
  },
  methods: {
    handleQuery(){
      getAllUser(this.queryParam.orgId, this.queryParam.name)
      .then(res=>{
        console.log("查看查询结果",res.data)
        this.tableData=res.data
      })
    },

    //弹出新建modal
    handleEdit (record) {
      this.newUser.name=''
      this.newUser.password=''
      this.newUser.organizationId=2
      this.newUser.orgList = this.orgList.filter(item => item.id != 0 && item.id!=1)
      this.modalVisible = true
    },
    modalOk(){
      newUser(this.newUser)
      .then(res=>{notification.success({message:'添加用户成功！'})})
      .catch(err=>{console.log(err);notification.error({message:"添加用户失败！"})})
      this.modalVisible=false
    },
    //添加问卷问题的modal<取消>按钮
    modalCancel(){
      this.modalVisible=false
    },

    _deleteUser(row){
      deleteUser(row.id)
      .then(res=>{notification.success({message:'删除成功！'})})
      .catch(err=>{console.log(err);notification.error({message:"删除失败！"})})
    },
    _blockUser(row){
      blockUser(row.id)
      .then(res=>{notification.success({message:'封禁成功！'})})
      .catch(err=>{console.log(err);notification.error({message:"封禁失败！"})})
    },
  }
}
</script>

<style lang="less" scoped></style>
