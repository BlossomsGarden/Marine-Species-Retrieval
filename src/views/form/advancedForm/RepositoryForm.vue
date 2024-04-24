<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="海洋生物名">
          <a-input
            placeholder="请输入物种中文名称"
            v-decorator="[
              'cnName',
              {rules: [{ required: true, message: '请输入物种中文名称', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="请输入物种英文名">
          <a-input
            placeholder="请输入物种英文名"
            v-decorator="[
              'enName',
              {rules: [{ required: true, message: '请输入物种英文名', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="请输入物种拉丁文名">
          <a-input
            placeholder="请输入物种拉丁文名"
            v-decorator="[
              'latinName',
              {rules: [{ required: true, message: '请输入物种拉丁文名', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="形态描述">
          <a-input
            placeholder="请输入物种形态描述"
            v-decorator="[
              'morphology',
              {rules: [{ required: true, message: '请输入物种形态描述', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="生境信息">
          <a-input
            placeholder="请输入物种生境信息"
            v-decorator="[
              'habitat',
              {rules: [{ required: true, message: '请输入物种生境信息', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="鉴别特征">
          <a-input
            placeholder="请输入物种鉴别特征"
            v-decorator="[
              'feature',
              {rules: [{ required: true, message: '请输入物种鉴别特征', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit" >Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: 'RepositoryForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    validate (rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        callback(new Error('需要以 user- 开头'))
      }
      callback()
    }
  }
}
</script>

<style scoped>

</style>
