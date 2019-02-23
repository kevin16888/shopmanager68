<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索添加 -->
    <el-row class="searchBox">
      <el-col>
        <!-- 搜索框 -->
        <el-input class="searchInput" placeholder="请输入内容" v-model="query">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="success" disabled>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <!--     
      create_time: 1486720211
      email: "adsfad@qq.com"
      id: 500
      mg_state: true
      mobile: "12345678"
      role_name: "主管"
      username: "admin" 

      日期格式处理>过滤器>两类三步
      fmtdate的使用：1.v-bind   2.{{msg | fmtdate}}
      -->
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="160"></el-table-column>
      <el-table-column prop="create_time" label="创建日期" width="160">
        <template slot-scope="scope">
        {{scope.row.create_time | fmtdate}}
        </template> 
      </el-table-column>
      <el-table-column prop="name" label="用户状态" width="160"></el-table-column>
      <el-table-column prop="name" label="操作" width="160"></el-table-column>
    </el-table>
    <!-- 分页 -->
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      //表格数据
      list: []
    };
  },
  //   mounted(){}
  //获取首屏数据的方法调用
  created() {
    this.getTableData();
  },
  methods: {
    //获取表格数据
    async getTableData() {
      //需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      // this.$http.defaults.headers.common["Authorization"] = localStorage.getItem("token");
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      //ES6解构赋值
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = data.users;
        // console.log(this.list);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>
