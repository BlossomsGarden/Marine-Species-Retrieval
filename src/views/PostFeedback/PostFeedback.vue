<template>
  <page-header-wrapper content="放心写，承诺不泄露任何信息">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="主题"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'title',
              {rules: [{ required: true, message: '请输入反馈主题' }]}
            ]"
            placeholder="请输入反馈主题" />
        </a-form-item>
        
        <a-form-item
          label="反馈内容"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-textarea
            rows="4"
            placeholder="请输入反馈内容"
            v-decorator="[
              'content',
              {rules: [{ required: true, message: '请输入反馈内容' }]}
            ]" />
        </a-form-item>

        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">提交</a-button>
        </a-form-item>
      </a-form>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import {newFeedback} from '@/api/feedback'
import notification from 'ant-design-vue/es/notification'

export default {
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          newFeedback(values)
          .then(res=>{
            if(res.success){
              notification.success({message:"提交成功！"})
            }
            else{
              notification.error({message:"出现未知的错误！"})
              console.log(res)
            }
          })
          .catch(err=>{
            notification.error({message:"出现未知的错误！"})
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
