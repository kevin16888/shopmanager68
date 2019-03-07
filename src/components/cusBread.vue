<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
  </el-card>
 </template>

<script>
export default {
    // data(){
    //     return {
    //         level1:"权限管理",
    //         level2:"权限列表"
    //     }
    // }
    name:'CusBread',
    props:['level1','level2']
};
</script>

<style scoped>

</style>
