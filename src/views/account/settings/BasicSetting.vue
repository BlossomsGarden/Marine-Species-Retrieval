<template>

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
</template>

<script>
import {uploadImage} from '@/api/utility'
import { notification } from 'ant-design-vue';
import { editInfo,getInfo} from '@/api/login'
import { baseMixin } from '@/store/app-mixin'
import storage from 'store'
import { SHOW_NAME, SHOW_AVATAR } from '@/store/mutation-types'

export default {
  mixins: [baseMixin],
  data () {
    return {
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
    }
  },
  created(){
    this.onLoad()
  },
  methods: {
    async onLoad(){
      const getInfoRes = await getInfo()
      this.option.img=getInfoRes.data.avatarUrl
      this.form={
        name:getInfoRes.data.name,
        description:getInfoRes.data.description,
        email:getInfoRes.data.email,
        avatarUrl:getInfoRes.data.avatarUrl,
      }
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
          console.log("谁先？")
          resolve(data)
        })
      })
      console.log("谁后？")

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
          console.log("谁先？")
        })
        .catch(err=>{
          console.log("图片上传失败！",err.message)
          notification.error({message:'上传失败！'})
          reject(err.message)
        })
      })

      this.option.img=this.options.img
      console.log("谁后？看看this.option.img",this.option.img)
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
