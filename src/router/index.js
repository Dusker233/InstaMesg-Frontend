import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/login",
        name: "login",
        component:() => import("../views/login/index.vue")
    },
    {
        path: "/register",
        name: "register",
        component:() => import("../views/register/index.vue"),
    },
    {
        path: "/registered",
        name: "registered",
        component: () => import("../views/register/registered.vue"),
    },
    {
        path: "/reset",
        name: "reset",
        component:() => import("../views/reset/index.vue")
    },
    {
        path: "/",
        name: "home",
        component:() => import("../layout/index.vue"),
        children: [
            {
                path: "/listFriend",
                name: "listFriend",
                component:() => import("../views/user/userList.vue"),
                children: [
                    {
                        path: "/chatFriend",
                        name: "chatFriend",
                        component:() => import("../views/chat/index.vue"),
                    }
                ]
            },
            {
                path: "/addFriend",
                name: "addFriend",
                component:() => import("../views/user/userAdd.vue"),
                children: [
                    {
                        path: "/userAdd",
                        name: "userAdd",
                        component:() => import("../views/user/add.vue")
                    }
                ]
            },
            {
                path: "/confirmFriend",
                name: "confirmFriend",
                component:() => import("../views/user/userConfirm.vue"),
            },
            {
                path: "/deleteFriend",
                name: "deleteFriend",
                component:() => import("../views/user/userDelete.vue"),
            },
            {
                path: "/infoFriend",
                name: "infoFriend",
                component:() => import("../views/user/userInfo.vue"),
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})


export default router;