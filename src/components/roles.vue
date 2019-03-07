<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button class="btn" type="primary">添加角色</el-button>
    <el-table @expand-change="fn" :data="roles" style="width: 100%" height="350px">
      <el-table-column type="expand" width="60">
        <template slot-scope="scope">
          <!-- 行列布局 -->
          <el-row class="level1" v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag
                @close="deleRights(scope.row,item1)"
                closable
                type="success"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    @close="deleRights(scope.row,item2)"
                    closable
                    type="warning"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRights(scope.row,item3)"
                    closable
                    type="info"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="120"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button
            @click="showDiaSetRights(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <!-- props配置选项{label/children}
      default-checked-keys[]默认选中
      default-expanded-keys[]默认展开
      node-key 每个节点唯一标识
      data数据源-->
      <el-tree
        ref="treeDom"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogFormVisible: false,
      //树形结构的数据
      treelist: [],
      // arrExpand: [],
      arrCheck: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      currRoleId: -1
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    //解决bug，列表显示时，只展开一个
    fn(row, expandedRows) {
      console.log("----");
      // console.log(row);
      // console.log(expandedRows);
      //展开第一个 [a]
      //如果数组【】length>1,则展开第一个时【a,b】
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },
    //-------分配权限，发送请求-------------
    async setRights() {
      //获取全选节点id  getCheckedKeys
      //在js中操作dom元素》ref操作dom，this.$refs.ref值.js方法()
      const arr1 = this.$refs.treeDom.getCheckedKeys();
      // console.log(arr1);
      //获取半选节点id   getHalfCheckedKeys
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys();
      // console.log(arr2);
      //ES6展开操作运算符
      const arr = [...arr1, ...arr2];
      //roleID角色id
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        // 权限id列表
        rids: arr.join(",")
      });
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //1.关闭对话框
        this.dialogFormVisible = false;
        //2.刷新角色列表
        this.getRoles();
      }
    },
    //---------------取消权限--------------
    async deleRights(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //1.提示
        this.$message.success(msg);
        //2.更新，会返回当前角色的剩余权限
        // this.getRoles();
        //只更新当前角色权限
        role.children = data;
      }
    },

    //----------分配权限 ---打开对话框--------------
    async showDiaSetRights(role) {
      this.currRoleId = role.id;
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.treelist = data;
        //嵌套循环遍历  ---默认角色权限全部展开
        // const temp = [];
        // this.treelist.forEach(item1 => {
        //   temp.push(item1.id);
        //   item1.children.forEach(item2 => {
        //     temp.push(item2.id);
        //     item2.children.forEach(item3 => {
        //       temp.push(item3.id);
        //     });
        //   });
        // });
        // // console.log(temp);
        // this.arrExpand = temp;
        //获取当前角色有的权限的权限id
        // console.log(role);
        const temp2 = [];
        role.children.forEach(item1 => {
          // temp2.push(item1.id);最外层id》temp》arrCheck
          item1.children.forEach(item2 => {
            // temp2.push(item2.id);
            item2.children.forEach(item3 => {
              temp2.push(item3.id);
            });
          });
        });
        // console.log(temp2);
        this.arrCheck = temp2;
      }
      this.dialogFormVisible = true;
    },
    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level,
.level2 {
  margin-bottom: 10px;
}
</style>
