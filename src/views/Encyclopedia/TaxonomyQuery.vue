<template>
  <page-header-wrapper>
    <a-modal 
      :visible="modalVisible"
      @ok="modalModify"
      ok-text="修改"
      :ok-button-props="{ props: {disabled: !this.showEditBtn} }"
      @cancel="modalCancel"
    >
      <a-descriptions title="物种信息">
        <a-descriptions-item label="海洋生物名">{{this.modalData.cnName}}</a-descriptions-item>
        <a-descriptions-item label="英文名">{{this.modalData.enName}}</a-descriptions-item>
        <a-descriptions-item label="拉丁文名">{{this.modalData.latinName}}</a-descriptions-item>
        <a-descriptions-item label="形态描述">{{this.modalData.morphology}}</a-descriptions-item>
        <a-descriptions-item label="生境信息">{{this.modalData.habitat}}</a-descriptions-item>
        <a-descriptions-item label="鉴别特征">{{this.modalData.feature}}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <div>
        <p style="font-weight: 700;font-size: 16px;">图片列表</p>
        <div class="image-list">
          <div class="image-item" v-for="(image, index) in this.modalData.imageList" :key="index">
            <img :src="image" :alt="image.alt" />
          </div>
        </div>
      </div>
      <a-divider style="margin-bottom: 32px"/>
      <a-descriptions title="归属类目">
        <a-descriptions-item label="界">{{this.modalData.kingdomName}}</a-descriptions-item>
        <a-descriptions-item label="门">{{this.modalData.phylumName}}</a-descriptions-item>
        <a-descriptions-item label="纲">{{this.modalData.className}}</a-descriptions-item>
        <a-descriptions-item label="目">{{this.modalData.orderName}}</a-descriptions-item>
        <a-descriptions-item label="科">{{this.modalData.familyName}}</a-descriptions-item>
        <a-descriptions-item label="属">{{this.modalData.genusName}}</a-descriptions-item>
      </a-descriptions>
      
        <p style="font-weight: 700;font-size: 16px;color:red;cursor:pointer" @click="postError()">信息有误？</p>
    </a-modal>


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
          <a-card @click="showModal(item.title)" class="ant-pro-pages-list-projects-card" hoverable>
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

      
      //在getList函数中被请求后实时赋值
      speciesPage:{},

      modalVisible:false,
      modalData:{
        cnName: '仓库名',
        enName: '仓库域名',
        latinName: '仓库管理员',
        morphology: '审批人',
        habitat: '生效日期',
        feature: '仓库类型',
        imageList:[],
        kingdomName: '界',
        phylumName: '门',
        className: '纲',
        orderName: '目',
        familyName: '科',
        genusName: '属'
      },

      showEditBtn:false,
    }
  },
  filters: {
    fromNow (date) {
      return moment(date).fromNow()
    }
  },
  created(){
    //是否是管理员，因为修改是要判断的权限的
    // console.log(this.$store.getters)
    this.showEditBtn=this.$store.getters.userInfo.organizationId===1 || this.$store.getters.userInfo.organizationId===3
  },
  mounted () {
    getTaxonomy()
    .then(res=>{
      console.log("看看返回值",res)
      this.kingdomNameList = res.data.kingdomNameList.length>10?res.data.kingdomNameList.slice(0,6):res.data.kingdomNameList
      this.phylumNameList = res.data.phylumNameList.length>10?res.data.phylumNameList.slice(0,6):res.data.phylumNameList
      this.classNameList = res.data.classNameList.length>10?res.data.classNameList.slice(0,6):res.data.classNameList
      this.orderNameList = res.data.orderNameList.length>10?res.data.orderNameList.slice(0,6):res.data.orderNameList
      this.familyNameList = res.data.familyNameList.length>10?res.data.familyNameList.slice(0,6):res.data.familyNameList
      this.genusNameList = res.data.genusNameList.length>10?res.data.genusNameList.slice(0,6):res.data.genusNameList
      
      this.loading=false
      this.QueryByTaxonomy(1,8)
    })
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
        this.speciesPage=res.data
      })
      .catch(err=>{
        console.log("出错了",err)
        this.loading=false
        return
      })
      
      //赋值分页属性
      this.pagination.total=this.speciesPage.total
      this.pagination.current=pageNo
      this.pagination.pageSize=pageSize

      //赋值列表data
      this.data=[]
      for (const species of this.speciesPage.records){
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
      this.QueryByTaxonomy(pageNo,pageSize)
    },
    
        //展开modal显示物种详细信息
    showModal(speciesName){
      //先装载信息
      const speciesList=this.speciesPage.records
      this.modalData = speciesList.find((val) => {
        return val.cnName === speciesName
      })
      console.log(speciesName, this.modalData)
      //然后开放访问
      this.modalVisible=true
    },
    //modal的修改按钮
    modalModify(){
      this.modalVisible=false
      this.$router.push({
        name: "EditSpecies",
        params: {
          speciesData: this.modalData
        }
      });
    },
    //modal的取消按钮
    modalCancel(){
      this.modalVisible=false
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


.image-list {
  display: flex; /* 让项目横向排列 */
  flex-wrap: nowrap; /* 不允许换行 */
  overflow-x: auto; /* 允许横向滚动 */
}

.image-item {
  flex: 0 0 200px; /* 固定宽度 */
  height: 200px; /* 固定高度 */
  margin-right: 10px; /* 每个图像之间的间距 */
  overflow: hidden; /* 避免图像溢出 */
  border: 1px solid #ccc; /* 添加边框 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

.image-item img {
  width: 100%; /* 图像填满容器 */
  height: 100%; /* 图像填满容器 */
  object-fit: cover; /* 保持图像比例，填满整个容器 */
}
</style>
