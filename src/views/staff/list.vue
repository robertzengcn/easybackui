<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        width="80"
        align="center"
        :label="$t('common.id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        :label="$t('common.name')"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        :label="$t('common.username')"
      >
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="105px"
        :label="$t('common.phone')"
      >
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        :label="$t('common.status')"
        width="110"
      >
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('common.action')"
        width="120"
      >
        <template slot-scope="{row}">
          <router-link :to="'/staff/edit/'+row.id">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
            >
              Edit
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getStaffs } from '@/api/staffs'
import { IArticleData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'StaffList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private list: IArticleData[] = []
  private listLoading = true
  private listQuery = {
    page: 1,
    pageSize: 20
  }

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getStaffs(this.listQuery)
    console.log(data)
    this.list = data.records
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
