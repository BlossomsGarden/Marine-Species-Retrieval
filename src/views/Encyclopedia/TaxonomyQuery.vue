<template>
  <page-header-wrapper>
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-form :form="form" layout="inline">

        <standard-form-row title="界" block style="padding-bottom: 11px;" class="my-center">
          <a-form-item>
            <tag-select @change="handleKingdomOptionClick">
              <tag-select-option 
                v-for="(kingdomName, index) in kingdomNameList"
                :key="index"
                :value="`${kingdomName}`"
              >{{kingdomName}}</tag-select-option>
            </tag-select>
          </a-form-item>
        </standard-form-row>

        <standard-form-row title="门" block style="padding-bottom: 11px;" class="my-center">
          <a-form-item>
            <tag-select @change="handlePhylumOptionClick">
              <tag-select-option 
                v-for="(phylumName, index) in phylumNameList"
                :key="index"
                :value="`${phylumName}`"
              >{{phylumName}}</tag-select-option>
            </tag-select>
          </a-form-item>
        </standard-form-row>

        <standard-form-row title="纲" block style="padding-bottom: 11px;" class="my-center">
          <a-form-item>
            <tag-select @change="handleClassOptionClick">
              <tag-select-option 
                v-for="(className, index) in classNameList"
                :key="index"
                :value="`${className}`"
              >{{className}}</tag-select-option>
            </tag-select>
          </a-form-item>
        </standard-form-row>

        <standard-form-row title="目" block style="padding-bottom: 11px;" class="my-center">
          <a-form-item>
            <tag-select @change="handleOrderOptionClick">
              <tag-select-option 
                v-for="(orderName, index) in orderNameList"
                :key="index"
                :value="`${orderName}`"
              >{{orderName}}</tag-select-option>
            </tag-select>
          </a-form-item>
        </standard-form-row>

        <standard-form-row title="科" block style="padding-bottom: 11px;" class="my-center">
          <a-form-item>
            <tag-select @change="handleFamilyOptionClick">
              <tag-select-option 
                v-for="(familyName, index) in familyNameList"
                :key="index"
                :value="`${familyName}`"
              >{{familyName}}</tag-select-option>
            </tag-select>
          </a-form-item>
        </standard-form-row>

        <standard-form-row title="属" block style="padding-bottom: 11px;" class="my-center">
          <a-form-item>
            <tag-select @change="handleGenusOptionClick">
              <tag-select-option 
                v-for="(genusName, index) in genusNameList"
                :key="index"
                :value="`${genusName}`"
              >{{genusName}}</tag-select-option>
            </tag-select>
          </a-form-item>
        </standard-form-row>

      </a-form>
    </a-card>


    <div class="ant-pro-pages-list-projects-cardList">
      <a-list :loading="loading" :data-source="data" :grid="{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card class="ant-pro-pages-list-projects-card" hoverable>
            <img slot="cover" :src="item.cover" :alt="item.title" />
            <a-card-meta :title="item.title">
              <template slot="description">
                <ellipsis :length="50">{{ item.description }}</ellipsis>
              </template>
            </a-card-meta>
            <div class="cardItemContent">
              <span>{{ item.updatedAt | fromNow }}</span>
              <div class="avatarList">
                <avatar-list size="small" :max-length="2">
                  <avatar-list-item
                    v-for="(member, i) in item.members"
                    :key="`${item.id}-avatar-${i}`"
                    :src="member.avatar"
                    :tips="member.name"
                  />
                </avatar-list>
              </div>
            </div>
          </a-card>
        </a-list-item>
      </a-list>
    </div>


    <!-- 这篇文章真的救了我啊：https://blog.csdn.net/m0_64370558/article/details/130567199 -->
    <a-pagination
      :current="pagination.current"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :show-total="pagination.showTotal"
      @change="handlePageChange"
      style="float:right"
    />

  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { TagSelect, StandardFormRow, Ellipsis, AvatarList } from '@/components'
import {getAllByTaxonomy,getTaxonomy} from '@/api/speciesManager'
import {getContributors} from '@/api/speciesManager'
import { Modal, notification, Pagination } from 'ant-design-vue';
const TagSelectOption = TagSelect.Option
const AvatarListItem = AvatarList.Item

export default {
  components: {
    AvatarList,
    AvatarListItem,
    Ellipsis,
    TagSelect,
    TagSelectOption,
    StandardFormRow,
    'a-pagination': Pagination,
  },
  data () {
    return {
      data: [],
      form: this.$form.createForm(this),
      loading: true,

      kingdomNameList:['动物','植物','原核生物'],
      selectedKingdomName:[],
      phylumNameList: ['某门1', '某门2', '某门3'],
      selectedPhylumName: [],
      classNameList: ['某纲1', '某纲2', '某纲3'],
      selectedClassName: [],
      orderNameList: ['某目1', '某目2', '某目3'],
      selectedOrderName: [],
      familyNameList: ['某科1', '某科2', '某科3'],
      selectedFamilyName: [],
      genusNameList: ['某属1', '某属2', '某属3'],
      selectedGenusName: [],
      
      //分页属性
      pagination: {
        total:0,  //总数据条数
        current:1,
        pageSize: 5,  //每页显示5条数据
        showTotal: total => `共 ${total} 条数据`,  //分页中显示总的数据
      },
    }
  },
  filters: {
    fromNow (date) {
      return moment(date).fromNow()
    }
  },
  mounted () {
    this._getTaxonomy()
  },
  methods: {

    handleKingdomOptionClick (event) {
      if(event.checked){
        console.log("选择",event.value)
        if(event.value==='total'){
          this.selectedKingdomName=this.kingdomNameList
        }
        else{
          this.selectedKingdomName.push(event.value)
        }
      }
      else{
        console.log("取消选择",event.value)
        if(event.value==='total'){
          this.selectedKingdomName=[]
        }
        else{
          this.selectedKingdomName = this.selectedKingdomName.filter((item) => item !== event.value);
        }
      }
      console.log("看看selectedKingdomName",this.selectedKingdomName)
      this.QueryByTaxonomy(this.pagination.current,this.pagination.pageSize)
    },
    handlePhylumOptionClick(event) {
      if (event.checked) {
        console.log("选择", event.value)
        if (event.value === 'total') {
          this.selectedPhylumName = this.phylumNameList
        } else {
          this.selectedPhylumName.push(event.value)
        }
      } else {
        console.log("取消选择", event.value)
        if (event.value === 'total') {
          this.selectedPhylumName = []
        } else {
          this.selectedPhylumName = this.selectedPhylumName.filter((item) => item !== event.value);
        }
      }
      console.log("看看selectedPhylumName", this.selectedPhylumName)
      this.QueryByTaxonomy(this.pagination.current,this.pagination.pageSize)
    },
    handleClassOptionClick(event) {
      if (event.checked) {
        console.log("选择", event.value)
        if (event.value === 'total') {
          this.selectedClassName = this.classNameList
        } else {
          this.selectedClassName.push(event.value)
        }
      } else {
        console.log("取消选择", event.value)
        if (event.value === 'total') {
          this.selectedClassName = []
        } else {
          this.selectedClassName = this.selectedClassName.filter((item) => item !== event.value);
        }
      }
      console.log("看看selectedClassName", this.selectedClassName)
      this.QueryByTaxonomy(this.pagination.current,this.pagination.pageSize)
    },
    handleOrderOptionClick(event) {
      if (event.checked) {
        console.log("选择", event.value)
        if (event.value === 'total') {
          this.selectedOrderName = this.orderNameList
        } else {
          this.selectedOrderName.push(event.value)
        }
      } else {
        console.log("取消选择", event.value)
        if (event.value === 'total') {
          this.selectedOrderName = []
        } else {
          this.selectedOrderName = this.selectedOrderName.filter((item) => item !== event.value);
        }
      }
      console.log("看看selectedOrderName", this.selectedOrderName)
      this.QueryByTaxonomy(this.pagination.current,this.pagination.pageSize)
    },
    handleFamilyOptionClick(event) {
      if (event.checked) {
        console.log("选择", event.value)
        if (event.value === 'total') {
          this.selectedFamilyName = this.familyNameList
        } else {
          this.selectedFamilyName.push(event.value)
        }
      } else {
        console.log("取消选择", event.value)
        if (event.value === 'total') {
          this.selectedFamilyName = []
        } else {
          this.selectedFamilyName = this.selectedFamilyName.filter((item) => item !== event.value);
        }
      }
      console.log("看看selectedFamilyName", this.selectedFamilyName)
      this.QueryByTaxonomy(this.pagination.current,this.pagination.pageSize)
    },
    handleGenusOptionClick(event) {
      if (event.checked) {
        console.log("选择", event.value)
        if (event.value === 'total') {
          this.selectedGenusName = this.genusNameList
        } else {
          this.selectedGenusName.push(event.value)
        }
      } else {
        console.log("取消选择", event.value)
        if (event.value === 'total') {
          this.selectedGenusName = []
        } else {
          this.selectedGenusName = this.selectedGenusName.filter((item) => item !== event.value);
        }
      }
      console.log("看看selectedGenusName", this.selectedGenusName)
      this.QueryByTaxonomy(this.pagination.current,this.pagination.pageSize)
    },
    
    async QueryByTaxonomy(pageNo,pageSize){
      this.loading=true

      var speciesPage;
      const taxonomyQuery={
        kingdomNameList:this.selectedKingdomName,
        phylumNameList:this.selectedPhylumName,
        classNameList:this.selectedClassName,
        orderNameList:this.selectedOrderName,
        familyNameList:this.selectedFamilyName,
        genusNameList:this.selectedGenusName
      }
      console.log("看看传入的查询参数",taxonomyQuery)
      await getAllByTaxonomy(pageNo,pageSize,taxonomyQuery)
      .then(res=>{
        speciesPage=res.data
        console.log("看看speciesPage",speciesPage)
      })
      .catch(err=>{
        console.log("出错了",err)
        this.loading=false
        return
      })
      
      //赋值分页属性
      this.pagination.total=speciesPage.total
      this.pagination.current=pageNo
      this.pagination.pageSize=pageSize

      //赋值列表data
      this.data=[]
      for (const species of speciesPage.records){
        var obj={
          id:species.id,
          title:species.cnName,
          description:species.morphology,
          cover:species.imageList.length==0?"https://poby-tongji.oss-cn-shanghai.aliyuncs.com/static-img/jiren/2024-sakura-team-modal.jpg":species.imageList[0],
          updatedAt:species.updateTime
        }

        //请求物种信息的贡献者
        var members=[];
        await getContributors(species.id)
        .then(res=>{
          for (const u of res.data){
            members.push({
              name:u.name,
              avatar:u.avatarUrl,
            })
          }
        })
        .catch(err=>{
          console.log("出错了",err)
          return
        })

        this.data.push({
          ...obj,
          members:members
        })
      }

      this.loading=false
      console.log("看看data",this.data)
    },

    //点击下一页等页面按钮的处理=1函数
    handlePageChange(pageNo, pageSize){
      this.loading=true
      this.pagination.pageNo=1
      t
      this.QueryByTaxonomy(pageNo,pageSize)
    },
    
    _getTaxonomy(){
      getTaxonomy()
      .then(res=>{
        // console.log("看看返回值",res)
        this.kingdomNameList = res.data.kingdomNameList.length>10?res.data.kingdomNameList.slice(0,10):res.data.kingdomNameList
        this.phylumNameList = res.data.phylumNameList.length>10?res.data.phylumNameList.slice(0,15):res.data.phylumNameList
        this.classNameList = res.data.classNameList.length>10?res.data.classNameList.slice(0,15):res.data.classNameList
        this.orderNameList = res.data.orderNameList.length>10?res.data.orderNameList.slice(0,15):res.data.orderNameList
        this.familyNameList = res.data.familyNameList.length>10?res.data.familyNameList.slice(0,15):res.data.familyNameList
        this.genusNameList = res.data.genusNameList.length>10?res.data.genusNameList.slice(0,15):res.data.genusNameList
        
        this.loading=false
        this.QueryByTaxonomy(1,8)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  :deep(.ant-pro-tag-select .ant-tag) {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
.ant-pro-pages-list-projects-cardList {
  margin-top: 24px;

  :deep(.ant-card-meta-title) {
    margin-bottom: 4px;
  }

  :deep(.ant-card-meta-description) {
    height: 44px;
    overflow: hidden;
    line-height: 22px;
  }

  .cardItemContent {
    display: flex;
    height: 20px;
    margin-top: 16px;
    margin-bottom: -4px;
    line-height: 20px;

    > span {
      flex: 1 1;
      color: rgba(0,0,0,.45);
      font-size: 12px;
    }

    :deep(.ant-pro-avatar-list) {
      flex: 0 1 auto;
    }
  }
}

.my-center{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
