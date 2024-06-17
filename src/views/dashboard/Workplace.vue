<template>
  <page-header-wrapper>
    
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatarUrl" />
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span>
          </div>
          <div>{{user.description}}</div>
        </div>
      </div>
    </template>

    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="归属组织" :value="user.orgName" />
        </div>
        <div class="stat-item">
          <a-statistic title="新增生物信息" value="200" />
        </div>
        <div class="stat-item">
          <a-statistic title="注册时间" :value="user.createTime" />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card 
            :loading="loading" 
            title="账号设置" 
            :bordered="false"
          >
            <div class="account-settings-info-view">
              <a-row :gutter="16" type="flex" justify="center">
                <a-col :order="isMobile ? 2 : 1" :md="24" :lg="16">
                  <a-form layout="vertical">
                    <a-form-item label="昵称">
                      <a-input placeholder="请输入您的昵称" v-model="form.name"/>
                    </a-form-item>
                    <a-form-item label="个人简介">
                      <a-textarea rows="4" placeholder="请输入个人简介" v-model="form.description"/>
                    </a-form-item>
                    <a-form-item label="邮箱">
                      <a-input placeholder="example@tongji.edu.cn" v-model="form.email"/>
                    </a-form-item>

                    <a-form-item>
                      <a-button type="primary" @click="save()">更新基本信息</a-button>
                    </a-form-item>
                  </a-form>
                </a-col>

                <a-col :order="1" :md="24" :lg="8" :style="{ minHeight: '200px' }">
                  <div class="ant-upload-preview" @click="editAvatar(1)" >
                    <a-icon type="cloud-upload-o" class="upload-icon"/>
                    <div class="mask">
                      <a-icon type="plus" />
                    </div>
                    <img :src="option.img"/>
                  </div>
                </a-col>
              </a-row>

              <a-modal
                title="修改头像"
                :visible="visible"
                :maskClosable="false"
                :confirmLoading="confirmLoading"
                :width="800"
                :footer="null"
                @cancel="cancelHandel"
              >
                <a-row>
                  <a-col :xs="24" :md="12" :style="{height: '350px'}">
                    <vue-cropper
                      ref="cropper"
                      :img="options.img"
                      :info="true"
                      :autoCrop="options.autoCrop"
                      :autoCropWidth="options.autoCropWidth"
                      :autoCropHeight="options.autoCropHeight"
                      :fixedBox="options.fixedBox"
                      @realTime="realTime"
                    >
                    </vue-cropper>
                  </a-col>
                  <a-col :xs="24" :md="12" :style="{height: '350px'}">
                    <div class="avatar-upload-preview">
                      <img :src="previews.url" :style="previews.img"/>
                    </div>
                  </a-col>
                </a-row>
                <br>
                <a-row>
                  <a-col :lg="2" :md="2">
                    <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
                      <a-button icon="upload">选择图片</a-button>
                    </a-upload>
                  </a-col>
                  <a-col :lg="{span: 1, offset: 2}" :md="2">
                    <a-button icon="plus" @click="changeScale(1)"/>
                  </a-col>
                  <a-col :lg="{span: 1, offset: 1}" :md="2">
                    <a-button icon="minus" @click="changeScale(-1)"/>
                  </a-col>
                  <a-col :lg="{span: 1, offset: 1}" :md="2">
                    <a-button icon="undo" @click="rotateLeft"/>
                  </a-col>
                  <a-col :lg="{span: 1, offset: 1}" :md="2">
                    <a-button icon="redo" @click="rotateRight"/>
                  </a-col>
                  <a-col :lg="{span: 2, offset: 6}" :md="2">
                    <a-button type="primary" @click="setAvatar()">保存</a-button>
                  </a-col>
                </a-row>
              </a-modal>
            </div>
          </a-card>
        </a-col>

        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card
            title="快速开始 / 便捷导航"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div class="item-group">
              <a @click="navTo('BioDB')">生物志库</a>
              <a @click="navTo('TaxonomyQuery')">归属查询</a>
              <a @click="navTo('PostFeedback')">上传反馈</a>
              <a @click="navTo('Account')">账号设置</a>
              <a v-if="user.admin" @click="navTo('AccountManagement')">用户管理</a>
              <a v-if="user.admin" @click="navTo('ContentManagement')">内容管理</a>
            </div>
          </a-card>
          
          
          <a-card 
            v-if="!this.user.admin"
            :loading="loading" 
            title="我的反馈" 
            :bordered="false"
          >
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <a-avatar slot="avatar" size="small" :src="item.uploaderAvatarUrl" />
                  <div slot="title">
                    <span>{{ item.uploaderName }}</span>&nbsp; 在&nbsp;
                    <a href="#">{{ item.title }}</a>&nbsp; 中反馈&nbsp;
                    <span>{{item.content}}</span>&nbsp;
                  </div>
                  <div slot="description">{{ item.createTime }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import {getMyFeedback} from '@/api/feedback'

import {uploadImage} from '@/api/utility'
import { notification } from 'ant-design-vue';
import {getInfo} from '@/api/login'
import {getAllOrg} from '@/api/manage'
import {editInfo} from '@/api/manage'
import { baseMixin } from '@/store/app-mixin'
import storage from 'store'


export default {
  name: 'Workplace',
  mixins: [baseMixin],
  components: {
    PageHeaderWrapper,
  },
  data () {
    return {
      timeFix: timeFix(),
      avatarUrl: '',
      user: {},

      loading: true,
      activities: [],

      currentUser:{},

      // cropper
      preview: {},
      previews:{},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      form:{
        name:'',
        description:'',
        email:'',
        avatarUrl:'',
      },
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      options: {
        img: '',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },

      orgList:[],
      user:{},
    }
  },

  computed: {
    ...mapState({
      welcome: state => state.user.welcome
    }),
  },
  async created () {
    await this.onLoad()
    
    this.getActivity()
  },
  methods: {
    navTo(dst){
      console.log(this.$store.getters)
      this.$router.push({
        name: dst,
        params: {}
      });
    },

    getActivity () {
      if(this.user.admin){
        // console.log("什么也不做")
      }
      else{
        getMyFeedback()
        .then(res=>{
          for(const d of res.data){
            this.activities.push({
              ...d,
              uploaderAvatarUrl:this.user.avatarUrl,
              uploaderName:this.user.name
            })
          }
        })
      }
    },


    async onLoad(){
      await getInfo()
      .then(res=>{
        this.option.img=res.data.avatarUrl
        this.form={
          name:res.data.name,
          description:res.data.description,
          email:res.data.email,
          avatarUrl:res.data.avatarUrl,
        }
        this.user = res.data
        this.avatarUrl = this.user.avatarUrl
        this.currentUser = {
          name: this.user.name,
          avatarUrl: this.user.avatarUrl
        }
      })

      await getAllOrg()
      .then(res=>{
        //你1是管理员，这个就别要了
        this.orgList=res.data
        this.user={
          ...this.user,
          //-1是因为索引与id差1
          orgName:this.orgList[this.user.organizationId-1].name
        }
      })

      this.loading=false
    },

    save(){
      if(this.form.name.length==0){
        notification.error({message:"昵称不允许为空"})
        return
      }
      this.form.avatarUrl = this.option.img
      console.log("看看form",this.form)
      editInfo(this.form)
      .then(res=>{
        console.log("看看修改信息的返回值",res)
        notification.success({message:"修改成功！"})
      })
      
      storage.set('name', this.form.name),
      storage.set('avatarUrl',this.form.avatarUrl)
    },


    editAvatar (id) {
      //首先初始化裁剪参数
      this.options = {
        img: '',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      this.visible = true
      this.id = id

      this.options.img = this.option.img
    },
    close () {
      this.id = null
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    async beforeUpload (file) {
      var isJpgOrPng = (file.type === 'image/jpeg' || file.type === 'image/png')
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must smaller than 5MB!');
      }
      if(isJpgOrPng && isLt5M){
        //先读个base64进去
        this.options.img = await new Promise((resolve,reject)=>{
          const reader = new FileReader()
          reader.onload = function(readerEvent) {
            resolve(readerEvent.target.result)
          }
          reader.readAsDataURL(file)
        })
      }
      else{
        return false
      }
    },

    // 上传图片（点击上传按钮）
    async setAvatar () {
      const data = await new Promise((resolve,reject)=>{
        this.$refs.cropper.getCropBlob((data) => {
          resolve(data)
        })
      })

      const blobToFile = (blob, fileName) => { 
        return new window.File([blob], fileName, { type: blob.type, });
      }; 
      const cropped = blobToFile(data, "cropped.png"); 
      const formData=new FormData()
      formData.append("image", cropped)

      this.options.img = await new Promise((resolve,reject)=>{
        uploadImage(formData)
        .then(res=>{
          console.log("上传图片成功！",res)
          resolve(res.data)
        })
        .catch(err=>{
          console.log("图片上传失败！",err.message)
          notification.error({message:'上传失败！'})
          reject(err.message)
        })
      })

      this.option.img=this.options.img
      this.visible = false  

      this.save()
    },

    okHandel () {
      const vm = this

      vm.confirmLoading = true
      setTimeout(() => {
        vm.confirmLoading = false
        vm.close()
        vm.$message.success('上传头像成功')
      }, 2000)
    },

    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang="less" scoped>
@import './Workplace.less';

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  
  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 90%;
      height: 90%;
    }
  }
</style>
