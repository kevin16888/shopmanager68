import Vue from "vue";
import Router from "vue-router";
// import Login from '../components/login.vue'
import Login from "@/components/login.vue";
import Home from "@/components/home.vue";
import User1 from "@/components/user1.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: "home",
      path: "/",
      component: Home,
      children: [
        {
          name: "user1",
          path: "/user1",
          component: User1
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
