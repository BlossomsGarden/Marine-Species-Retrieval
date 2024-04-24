<template>
  <page-header-wrapper
    content="仿照中国生物志库进行设计，插入了一些测试数据。"
  >
    <a-input-search v-model="queryInput" style="width: 80%;" />
    <p>生僻字：㫋 䰳 鰯 䱝 鰧 鮄 鰕 鯱 鱊 鱎 鱥 鯮 鱲 䱗 鮀 鮈 鰋 鰕 鱵 䱻 魾 鮡 鮠 䱀 鰤 魣 鰶 䳭 鵙 鸊 鷉 鵰 鳽 䕹 䓫 䓮 䕅 㰀 䉡 㼎 䓞 簕</p>

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
import { Modal, notification, Pagination } from 'ant-design-vue';
import { TagSelect, StandardFormRow, Ellipsis, AvatarList } from '@/components'
import {getAllSpecies,getContributors} from '@/api/speciesManager'
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
      var speciesPage;
      await getAllSpecies(pNo,pSize,keyword)
      .then(res=>{
        speciesPage=res.data
      })
      // console.log("看看speciesPage",speciesPage)
      //赋值分页属性
      this.pagination.total=speciesPage.total
      this.pagination.current=pNo
      this.pagination.pageSize=pSize

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
</style>
