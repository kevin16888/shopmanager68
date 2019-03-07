<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
    <el-alert class="alert" title="注意：只允许为第三级分类设置参数" type="warning" show-icon></el-alert>
    <el-form class="form" label-position="left" label-width="120px" :model="form">
      <el-form-item label="请选择商品分类">
        {{selectedOptions}}
        <!-- 下拉级联选择框 -->
        <el-cascader
          clearable
          :show-all-levels="false"
          expand-trigger="hover"
          :options="options"
          :props="defaultProps"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <el-tabs @tab-click="changeTab()" type="border-card" v-model="active">
      <el-tab-pane name="1" label="动态参数">
        <el-button disabled>设置动态参数</el-button>
        <!-- 表格 -->
        <el-table height="350px" border stripe :data="arrDy" style="width: 100%">
          <!-- 展开 -->
          <el-table-column type="expand" width="120">
            <template slot-scope="scope">
              <!-- 动态tab编辑 -->
              <!-- scope.row.attr_vals -->
              <el-tag
                :key="i"
                v-for="(item,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 序号 -->
          <el-table-column type="index" label="#" width="120"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称"></el-table-column>

          <el-table-column label="操作" width="100">
            <template>
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="2" label="静态参数">
        <el-button disabled>设置静态参数</el-button>
        <el-table height="350px" border stripe :data="arrStatic" style="width: 100%">
          <!-- 序号 -->
          <el-table-column type="index" label="#" width="120"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值"></el-table-column>

          <el-table-column label="操作" width="100">
            <template>
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>


<script>
export default {
  data() {
    return {
      active: "1",
      form: {},
      options: [],
      //绑定到层级下拉框上的数据
      selectedOptions: [],
      //层级下拉框的数据源配置
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 动态数组
      arrDy: [],
      // 静态数组
      arrStatic: [],
      //   dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //动态tab相关方法
    async handleClose(obj, item) {
      obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1);
      //put修改>1.找到要修改的数据（分类id+attr_id）2.新数据（请求体）
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
        {
          //put修改>1.找到要修改的数据(分类id+attr_id)2.新数据（请求体）
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          //以，分割的属性值列表[].join(",")
          attr_vals: obj.attr_vals.join(",")
        }
      );
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(obj) {
      let inputValue = this.inputValue;
      if (inputValue) {
        obj.attr_vals.push(inputValue);
        //添加，发送请求
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
          {
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: obj.attr_vals.join(",")
          }
        );
        //   console.log(res);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //改变tab
    changeTab() {
      this.getDyOrStatic();
    },
    //显示的label一变化触发的方法
    async handleChange() {
      this.getDyOrStatic();
    },
    //获取动态或静态数据
    async getDyOrStatic() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请先选择三级分类！");
        if (this.active === "1") {
          this.arrDy = [];
        }
        if (this.active === "2") {
          this.arrStatic = [];
        }
        return;
      }
      //获取动态数组
      if (this.active === "1") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        const {
          meta: { msg, status },
          data
        } = res.data;
        if (status === 200) {
          this.arrDy = data;
          this.arrDy.forEach(item => {
            //判断后台如果返回空字符串
            //   //如果不是，则split方法
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
          // console.log("动态参数数据");
          // console.log(this.arrDy);
        }
      }
      //获取静态数组
      if (this.active === "2") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        const {
          meta: { msg, status },
          data
        } = res.data;
        if (status === 200) {
          this.arrStatic = data;
          // console.log("静态参数数组");
          // console.log(this.arrStatic);
        }
      }
    },
    //获取三级商品分类数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    }
  }
};
</script>


<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>