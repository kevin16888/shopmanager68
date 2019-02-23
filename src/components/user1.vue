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
        <el-input
          @click="getAllUsers()"
          clearable
          class="searchInput"
          placeholder="请输入内容"
          v-model="query"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="success" @click="showDiagAddUser()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" height="300px">
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
      <el-table-column label="创建日期" width="160">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="160">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <!-- <template slot-scope="scope"> -->
        <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
        <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
        <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        <!-- </template> -->
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框--添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleAdd = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      //为了区分是请求之后后台返回的值还是自己写的初始值，所以写-1
      total: -1,
      //表格数据
      list: [],
      //对话框数据，默认不显示
      dialogFormVisibleAdd: false,
      //对话框表单数据
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
    };
  },
  //   mounted(){}
  //获取首屏数据的方法调用
  created() {
    this.getTableData();
  },
  methods: {
    //添加用户，打开对话框
    showDiagAddUser(){
      this.dialogFormVisibleAdd = true;
    },
    //清空时获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    //搜索用户
    searchUser() {
      this.pagenum = 1; //解决BUG：从第1页开始展示
      this.getTableData();
    },
    //分页相关方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      //切换每页显示条数，按照新pagesize发送请求
      this.pagenum = 1; //解决当前每页显示条数超出页码最大值问题，此时每页显示条数修改为从第1页开始展示
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      //当前第2页》点击第3页》触发该方法》val=3
      this.pagenum = val;
      this.getTableData();
    },
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
      console.log(res);
      //ES6解构赋值
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
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
.page {
  margin-top: 20px;
}
</style>
