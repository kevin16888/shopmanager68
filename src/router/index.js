import Vue from "vue";
import VueRouter from "vue-router";
import { Message } from "element-ui";
// import Login from '../components/login.vue'

//路由懒加载
// const Foo = () => import('./Foo.vue')
const Login = () => import("@/components/login.vue");
const Home = () => import("@/components/home.vue");
const Users = () => import("@/components/user1.vue");
const Rights = () => import("@/components/rights.vue");
const Roles = () => import("@/components/roles.vue");
const Goodslist = () => import("@/components/goodslist.vue");
const Goodsadd = () => import("@/components/goodsadd.vue");
const Cateparams = () => import("@/components/cateparams.vue");
const Goodscate = () => import("@/components/goodscate.vue");
const Order = () => import("@/components/order.vue");
const Reports = () => import("@/components/reports.vue");

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      name: "home",
      path: "/",
      component: Home,
      //路由嵌套
      children: [
        {
          name: "users",
          path: "/users",
          component: Users
        },
        {
          name: "rights",
          path: "/rights",
          component: Rights
        },
        {
          name: "roles",
          path: "/roles",
          component: Roles
        },
        {
          name: "goods",
          path: "/goods",
          component: Goodslist
        },
        {
          name: "goodsadd",
          path: "/goodsadd",
          component: Goodsadd
        },
        {
          name: "params",
          path: "/params",
          component: Cateparams
        },
        {
          name: "categories",
          path: "/categories",
          component: Goodscate
        },
        {
          name: "orders",
          path: "/orders",
          component: Order
        },
        {
          name: "reports",
          path: "/reports",
          component: Reports
        }
      ]
    },
    {
      name: "login",
      path: "/login",
      component: Login
    }
  ]
});

//全局前置导航守卫
//任何路由标识变化》来到路由配置》自动来到路由导航守卫》渲染组件
router.beforeEach((to, from, next) => {
  console.log("路由导航守卫执行-----");
  //to--要去的路由配置对象(name)，from当前的路由配置对象(name)
  console.log(to, from);
  //next方法让路由配置继续生效
  //1.如果要去的是login >> next()
  if (to.name === "login") {
    next();
  }
  //2.如果要去的不是login >>
  else {
    //2.1 !token > 去登录
    const token = localStorage.getItem("token");
    if (!token) {
      // this.$message.warning("请先登录");
      Message.warning("请先登录");
      router.push({
        name: "login"
      });
      //2.2 token > next()
      return;
    }
    next();
  }
});

export default router;
