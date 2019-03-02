<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-alert class="alert" title="消息提示的文案" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <el-form class="form" label-position="top" label-width="80px" :model="form">
      <el-tabs @click="changeTab" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name"
          v-for="item1 in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="item2"
              v-for="item2 in item1.attr_vals" :key="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        
        <el-tab-pane name="3" label="商品属性">商品属性---</el-tab-pane>
        <el-tab-pane name="4" label="商品图片">商品图片---</el-tab-pane>
        <el-tab-pane name="5" label="商品内容">商品内容---</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "2",
      //添加商品的表单数据
      // goods_name	商品名称	不能为空
      // goods_price	价格	不能为空
      // goods_weight	重量	不能为空
      // goods_number	数量	不能为空
      // goods_cat	以为','分割的分类列表	不能为空
      // goods_introduce	介绍	可以为空
      // pics	上传的图片临时路径（对象）	可以为空
      // attrs	商品的参数（数组）	可以为空
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: ""
      },
      // 级联使用的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children:'children'
      },
      //复选框组
      checkList: [],
      arrDy: []
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //点击任何tab都会
    async changeTab() {
      //如果点了第二个tab
      if (this.active === "2") {
        //如果不是三级分类
        if (this.selectedOptions.length !== 3) {
          //提示
          this.$message.error("请选择三级分类！");
          return;
        }
        //获取动态参数数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        console.log(res);
        const {
          meta: { msg, status },
          data
        } = res.data;
        if (status === 200) {
          this.arrDy = data;
          // console.log(this.arrDy);
          this.arrDy.forEach(item => {
            if(item.attr_vals.length ===0){
              item.attr_vals = [];
            } else {
            item.attr_vals = item.attr_vals.trim().split(',')
            }
            // item.attr_vals =
            //   item.attr_vals.trim().length === 0
            //     ? []
            //     : item.attr_vals.trim().split(",");
            console.log(item.attr_vals);
          });
        }
      }
    },
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.arrDy = data;
      }
    },
    handleChange() {}
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
.form {
  height: 350px;
  overflow: auto;
}
</style>
