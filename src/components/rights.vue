<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
    <el-table :data="list" style="width: 100%" height="350px">
      <el-table-column type="index" label="#" width="160"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column label="层级" width="200">
        <!-- res 的数据中 level 是字符'0'，把其转换成层级 -->
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data(){
    return {
      list:[]
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(`rights/list`);
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = data;
      }
    }
  }
};
</script>

<style scoped>
.box {
  height: 100%;
}
</style>
