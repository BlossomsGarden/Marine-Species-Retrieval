<template>
  <page-header-wrapper content="仿照中国生物志库进行设计，插入了一些测试数据。">
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

    <a-input-search v-model="queryInput" style="width: 80%;" @search="getList(1,8,queryInput)" />
    <p>生僻字：㫋 䰳 鰯 䱝 鰧 鮄 鰕 鯱 鱊 鱎 鱥 鯮 鱲 䱗 鮀 鮈 鰋 鰕 鱵 䱻 魾 鮡 鮠 䱀 鰤 魣 鰶 䳭 鵙 鸊 鷉 鵰 鳽 䕹 䓫 䓮 䕅 㰀 䉡 㼎 䓞 簕</p>

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
import { Modal, notification, Pagination } from 'ant-design-vue';
import { TagSelect, StandardFormRow, Ellipsis, AvatarList } from '@/components'
import {getAllSpecies,getContributors} from '@/api/speciesManager'
const TagSelectOption = TagSelect.Option
const AvatarListItem = AvatarList.Item

export default {
  name:'BioDB',
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
      showEditBtn:false,

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

      data: [],
      form: this.$form.createForm(this),
      loading: true,

      //分页属性
      pagination: {
        total:0,  //总数据条数
        current:1,
        pageSize: 5,  //每页显示5条数据
        showTotal: total => `共 ${total} 条数据`,  //分页中显示总的数据
      },

      //搜索栏内容
      queryInput:'',
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
    this.getList(1,8,this.queryInput)
  },
  methods: {
    //点击下一页等页面按钮的处理=1函数
    handlePageChange(pageNo, pageSize){
      this.loading=true
      console.log("看看Input",this.queryInput)
      this.getList(pageNo,pageSize,this.queryInput)
    },

    //获取帖子
    async getList (pNo,pSize,keyword) {
      await getAllSpecies(pNo,pSize,keyword)
      .then(res=>{
        this.speciesPage=res.data
      })
      // console.log("看看接口请求返回的speciesPage",this.speciesPage)
      //赋值分页属性
      this.pagination.total=this.speciesPage.total
      this.pagination.current=pNo
      this.pagination.pageSize=pSize

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
        this.data.push({
          ...obj,
          members:members
        })
      }
      this.loading=false
      
      // this.$http.get('/list/article', { params: { count: 8 } })
      // .then(res => {
      //   console.log('res', res)
      //   this.data = res.result
      //   this.loading = false
      // })

      // console.log("看看赋值后的data",this.data)
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

    //信息有误
    postError(){
      console.log("信息有误")
      this.$router.push({
        name: "PostFeedback",
        params: {}
      });
    }
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
