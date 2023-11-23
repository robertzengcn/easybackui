<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      :inline="true"
      class="form-container"
    >
      <!-- <sticky
        :z-index="10"
        :class-name="'sub-navbar '+postForm.status"
      >
        <comment-dropdown v-model="postForm.disableComment" />
        <platform-dropdown v-model="postForm.platforms" />
        <source-url-dropdown v-model="postForm.sourceURL" />
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >
          Publish
        </el-button>
        <el-button
          v-loading="loading"
          type="warning"
          @click="draftForm"
        >
          Draft
        </el-button>
      </sticky> -->

      <div class="createPost-main-container">
        <!-- <el-row :gutter="20"> -->
          <!-- <warning /> -->

          <!-- <el-col :span="12"> -->
            <el-form-item
              style="margin-bottom: 40px;"
              prop="title"
            >
              <material-input
                v-model="postForm.username"
                :maxlength="100"
                name="username"
                required
              >
              {{$t('common.username')}}
              </material-input>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="12"> -->
            <el-form-item
              style="margin-bottom: 40px;"
              prop="title"
            >
              <material-input
                v-model="postForm.name"
                :maxlength="100"
                name="name"
                required
              >
              {{$t('common.name')}}
              </material-input>
            </el-form-item>
          <!-- </el-col> -->
        <!-- </el-row> -->

        <!-- <el-row :gutter="20"> -->
          <!-- <el-col :span="12"> -->
            <el-form-item
              style="margin-bottom: 40px;"
              prop="phone"
            >
              <material-input
                v-model="postForm.phone"
                :maxlength="100"
                name="phone"
              >
              {{$t('common.phone')}}
              </material-input>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="12"> -->
            <el-form-item
              style="margin-bottom: 40px;"
              prop="email"
            >
              <material-input
                v-model="postForm.email"
                :maxlength="100"
                name="email"
                required
              >
              {{$t('common.email')}}
              </material-input>
            </el-form-item>
          <!-- </el-col> -->
        <!-- </el-row> -->

        <el-form-item
          prop="imageURL"
          style="margin-bottom: 30px;"
        >
          <upload-image v-model="postForm.imageURL" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isValidURL } from '@/utils/validate'
import { getStaff, defaultStaffData } from '@/api/staffs'
import { getUsers } from '@/api/users'
import { AppModule } from '@/store/modules/app'
import { TagsViewModule, ITagView } from '@/store/modules/tags-view'
import MaterialInput from '@/components/MaterialInput/index.vue'
import Sticky from '@/components/Sticky/index.vue'
import Tinymce from '@/components/Tinymce/index.vue'
import UploadImage from '@/components/UploadImage/index.vue'
// import Warning from './Warning.vue'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { Form } from 'element-ui'

@Component({
  name: 'StaffDetail',
  components: {
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown,
    MaterialInput,
    Sticky,
    Tinymce,
    UploadImage
    // Warning
  }
})
export default class extends Vue {
  @Prop({ default: false }) private isEdit!: boolean

  private validateRequire = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      if (rule.field === 'imageURL') {
        this.$message({
          message: 'Upload cover image is required',
          type: 'error'
        })
      } else {
        this.$message({
          message: rule.field + ' is required',
          type: 'error'
        })
      }
      callback(new Error(rule.field + ' is required'))
    } else {
      callback()
    }
  }

  private validateSourceUrl = (rule: any, value: string, callback: any) => {
    if (value) {
      if (isValidURL(value)) {
        callback()
      } else {
        this.$message({
          message: 'Invalid URL',
          type: 'error'
        })
        callback(new Error('Invalid URL'))
      }
    } else {
      callback()
    }
  }

  private postForm = Object.assign({}, defaultStaffData)
  private loading = false
  private userListOptions = []
  private rules = {
    imageURL: [{ validator: this.validateRequire }],
    username: [{ validator: this.validateRequire }],
    // fullContent: [{ validator: this.validateRequire }],
    sourceURL: [{ validator: this.validateSourceUrl, trigger: 'blur' }]
  }

  private tempTagView?: ITagView
  private tinymceActive = true

  // get abstractContentLength() {
  //   return this.postForm.abstractContent.length
  // }

  get lang() {
    return AppModule.language
  }

  // set and get is useful when the data
  // returned by the backend api is different from the frontend
  // e.g.: backend return => "2013-06-25 06:59:25"
  //       frontend need timestamp => 1372114765000
  get timestamp() {
    return (+this.postForm.updateTime)
  }

  set timestamp(value) {
    this.postForm.updateTime = value.toString()
  }

  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(parseInt(id))
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of this.setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempTagView = Object.assign({}, this.$route)
  }

  deactivated() {
    this.tinymceActive = false
  }

  activated() {
    this.tinymceActive = true
  }

  private async fetchData(id: number) {
    try {
      const { data } = await getStaff(id)
      this.postForm = data.staff
      // Just for test
      // this.postForm.title += `   Staff Id:${this.postForm.id}`
      // this.postForm.abstractContent += `   Staff Id:${this.postForm.id}`
      const title = this.lang === 'zh' ? '编辑职工' : 'Edit Staff'
      // Set tagsview title
      this.setTagsViewTitle(title)
      // Set page title
      this.setPageTitle(title)
    } catch (err) {
      console.error(err)
    }
  }

  private setTagsViewTitle(title: string) {
    const tagView = this.tempTagView
    if (tagView) {
      tagView.title = `${title}-${this.postForm.id}`
      TagsViewModule.updateVisitedView(tagView)
    }
  }

  private setPageTitle(title: string) {
    document.title = `${title} - ${this.postForm.id}`
  }

  private submitForm() {
    (this.$refs.postForm as Form).validate(valid => {
      if (valid) {
        this.loading = true
        this.$notify({
          title: 'Success',
          message: 'The post published successfully',
          type: 'success',
          duration: 2000
        })
        // this.postForm.status = 'published'
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000)
      } else {
        console.error('Submit Error!')
        return false
      }
    })
  }

  // private draftForm() {
  //   if (this.postForm.fullContent.length === 0 || this.postForm.title.length === 0) {
  //     this.$message({
  //       message: 'Title and detail content are required',
  //       type: 'warning'
  //     })
  //     return
  //   }
  //   this.$message({
  //     message: 'The draft saved successfully',
  //     type: 'success',
  //     showClose: true,
  //     duration: 1000
  //   })
  //   // this.postForm.status = 'draft'
  // }

  private async getRemoteUserList(name: string) {
    const { data } = await getUsers({ name })
    if (!data.items) return
    this.userListOptions = data.items.map((v: any) => v.name)
  }
}
</script>

<style lang="scss">
.article-textarea {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>

<style lang="scss" scoped>
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
</style>
