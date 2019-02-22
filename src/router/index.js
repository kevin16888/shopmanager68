import Vue from "vue";
import Router from "vue-router";
// import Login from '../components/login.vue'
import Login from "@/components/login.vue";
import Home from "@/components/home.vue";
import Users from "@/components/user1.vue";

Vue.use(Router);

export default new Router({
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
