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
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            @click="showDiagEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showMsgBoxDele(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showDiaSetRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
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
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框--编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框---分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">{{formdata.username}}</el-form-item>
        <el-form-item label="角色">
          <!-- {{selectVal}} -->
          <el-select v-model="selectVal" placeholder="请选择角色">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <!-- 将来获取角色名数据，用v-for遍历 -->
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
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
      //对话框声明初始数据，默认不显示
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      //对话框表单数据
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //下拉框用的数据
      selectVal: -1,
      currUserId: -1,
      //角色数组
      roles: []
    };
  },
  //   mounted(){}
  //获取首屏数据的方法调用
  created() {
    this.getTableData();
  },
  methods: {
    //--------分配角色，发送请求--------
    async setRole(){
      const res = await this.$http.put(`users/${this.currUserId}/role`,{rid:this.selectVal});
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //关闭对话框
        this.dialogFormVisibleRole = false;
      }
    },
    //-------分配角色 --打开对话框-----------
    async showDiaSetRole(user) {
      this.formdata = user;
      this.currUserId = user.id;
      this.dialogFormVisibleRole = true;
      //获取角色名称
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.roles = res.data.data;

      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);
      //给下拉框v-model绑定的selectVal赋值
      this.selectVal = res2.data.data.rid;
    },
    //-------------修改用户状态---------
    async changeState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      console.log(res);
    },
    //---------编辑-------------
    //编辑 --发送请求
    async editUser() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //关闭对话框
        this.dialogFormVisibleEdit = false;
        this.getTableData();
      }
    },
    //编辑用户 --弹出框
    showDiagEditUser(user) {
      //获取当前用户数据
      this.formdata = user;
      this.dialogFormVisibleEdit = true;
    },
    //------------删除----------------
    //删除弹框
    showMsgBoxDele(user) {
      this.$confirm("确定要删掉?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //id->用户id数据->user.id
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1; //解决BUG：删除后从第一页开始显示
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除！");
        });
    },
    //---------添加--------------------
    //添加用户，确定，发送请求
    async addUser() {
      const res = await this.$http.post(`users`, this.formdata);
      console.log(res);
      //解构赋值
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 关闭对话框
        this.dialogFormVisibleAdd = false;
        //更新表格
        this.getTableData();
      }
    },
    //添加用户，打开对话框
    showDiagAddUser() {
      this.dialogFormVisibleAdd = true;
      // 打开对话框，清空数据
      this.formdata = {};
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
