<template>
  <page-header-wrapper content="创建一个新物种的信息！">
    <a-card class="card" title="基本信息" :bordered="false">
      <repository-form ref="repository" :showSubmit="false" :initialData="this.initFormData"/>
    </a-card>
    <a-card class="card" title="描述图片" :bordered="false">
      <a-upload 
        listType="picture-card" 
        :customRequest="uploadPhoto"
        :file-list="uploadFileList" 
        :remove="removePhoto"
      >
        <div v-if="!uploadFileList || uploadFileList.length < 16">
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </a-card>
    <a-card class="card" title="归属信息" :bordered="false">
      <task-form ref="task" :showSubmit="false" :initialData="this.initFormData"/>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <span class="popover-wrapper">
        <a-popover title="表单校验信息" overlayClassName="antd-pro-pages-forms-style-errorPopover" trigger="click" :getPopupContainer="trigger => trigger.parentNode">
          <template slot="content">
            <li v-for="item in errors" :key="item.key" @click="scrollToField(item.key)" class="antd-pro-pages-forms-style-errorListItem">
              <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
              <div class="">{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">
            <a-icon type="exclamation-circle" />{{ errors.length }}
          </span>
        </a-popover>
      </span>
      <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import RepositoryForm from '@/views/form/advancedForm/RepositoryForm'
import TaskForm from '@/views/form/advancedForm/TaskForm'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import {uploadImage} from '@/api/utility'
import notification from 'ant-design-vue/es/notification'
import {newSpecies} from '@/api/speciesManager'

const fieldLabels = {
  cnName: '',
  enName: '',
  latinName: '',
  morphology: '',
  habitat: '',
  feature: '',

  kingdomName: '',
  phylumName: '',
  className: '',
  orderName: '',
  familyName: '',
  genusName: ''
}

export default {
  name: 'AddSpecies',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    RepositoryForm,
    TaskForm
  },
  data () {
    return {
      // 加载状态
      loading: false,
      memberLoading: false,

      initFormData : {
        cnName: '',
        enName: '',
        latinName: '',
        morphology: '',
        habitat: '',
        feature: '',
        kingdomName: '',
        phylumName: '',
        className: '',
        orderName: '',
        familyName: '',
        genusName: ''
      },
      uploadFileList:[],

      errors: []
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
    },
    newMember () {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow (record) {
      this.memberLoading = true
      const { key, name, workId, department } = record
      if (!name || !workId || !department) {
        this.memberLoading = false
        this.$message.error('请填写完整成员信息。')
        return
      }
      // 模拟网络请求、卡顿 800ms
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = this.data.find(item => item.key === key)
        target.editable = false
        target.isNew = false
        this.memberLoading = false
      })
    },
    toggle (key) {
      const target = this.data.find(item => item.key === key)
      target._originalData = { ...target }
      target.editable = !target.editable
    },
    getRowByKey (key, newData) {
      const data = this.data
      return (newData || data).find(item => item.key === key)
    },
    cancel (key) {
      const target = this.data.find(item => item.key === key)
      Object.keys(target).forEach(key => { target[key] = target._originalData[key] })
      target._originalData = undefined
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.data = newData
      }
    },

    // 上传图片
    uploadPhoto(event) {
      const that = this
      this.loading = true
      const file = event.file
      
      const formData = new FormData()
      formData.append('image', file)
      uploadImage(formData)
      .then(res=>{
        // console.log('上传照片返回的数据', res)
        console.log("当前上传图片列表",this.uploadFileList)
        const fileList = that.uploadFileList
        fileList.push({
          uid: fileList.length,
          name: 'x',
          status: 'done',
          url: res.data,
        })
        this.loading = false
      })
      .catch(err => {
        console.log("上传图片出错",err)
        this.loading = false
      })
    },
    
    // 删除上传的图片
    removePhoto(e) {
      //遍历删除
      let index
      for (index in this.uploadFileList) {
        if (e.uid === this.uploadFileList[index].uid) {
          break
        }
      }
      this.uploadFileList.splice(index, 1)
      //将后面的uid更新
      for (var i=index;i<this.uploadFileList.length;i++) {
        this.uploadFileList[i].uid = i
      }
      return true
    },

    // 最终全页面提交
    validate () {
      const { $refs: { repository, task }, $notification } = this
      const repositoryForm = new Promise((resolve, reject) => {
        repository.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })
      const taskForm = new Promise((resolve, reject) => {
        task.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })

      // clean this.errors
      this.errors = []
      Promise.all([repositoryForm, taskForm]).then(values => {
        
        const BasicInfo = values[0]
        const ImageList= this.uploadFileList.map(function(obj) {
          return obj.url;
        });
        const TaxonomyInfo=values[1]
        // console.log("看看基本信息", BasicInfo)
        // console.log("看看图片链接", ImageList)
        // console.log("看看归属", TaxonomyInfo)
        const SpeciesDTO={
          ...BasicInfo,
          imageList:ImageList,
          ...TaxonomyInfo
        }
        console.log(SpeciesDTO)
        newSpecies(SpeciesDTO)
        .then(res=>{
          if(res.success){
            notification.success({message:"提交成功！"})
          }
          else{
            notification.error({message:res.msg})
            console.log(res)
          }
        })
        .catch(err=>{
          console.log("出现了未知的错误",err)
          notification.error({message:"出现了未知的错误"+err})
        })
      })
      .catch(() => {
        const errors = Object.assign({}, repository.form.getFieldsError(), task.form.getFieldsError())
        const tmp = { ...errors }
        this.errorList(tmp)
      })
    },
    errorList (errors) {
      if (!errors || errors.length === 0) {
        return
      }
      this.errors = Object.keys(errors)
        .filter(key => errors[key])
        .map(key => ({
          key: key,
          message: errors[key][0],
          fieldLabel: fieldLabels[key]
        }))
    },
    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
  .popover-wrapper {
    :deep(.antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content) {
      min-width: 256px;
      max-height: 290px;
      padding: 0;
      overflow: auto;
    }
  }
  .antd-pro-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;
    i {
          margin-right: 4px;
    }
  }
  .antd-pro-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background: #e6f7ff;
    }
    .antd-pro-pages-forms-style-errorIcon {
      float: left;
      margin-top: 4px;
      margin-right: 12px;
      padding-bottom: 22px;
      color: #f5222d;
    }
    .antd-pro-pages-forms-style-errorField {
      margin-top: 2px;
      color: rgba(0,0,0,.45);
      font-size: 12px;
    }
  }
</style>
