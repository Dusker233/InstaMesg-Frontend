<template>
  <div class="home">
    <div class="home-cont">
      <div class="home-cont-left">
        <div class="home-cont-left-top">
<!--          <el-avatar :src="url" />-->
          <img :src="url" class="home-cont-left-img" />
          <router-link tag="div" to="/listFriend" class="home-icon">
            <el-icon size="25" color="#9F9D99"><ChatDotSquare /></el-icon>
          </router-link>
          <router-link tag="div" to="/listGroup" class="home-icon">
            <el-icon size="25" color="#9F9D99"><ChatDotRound /></el-icon>
          </router-link>
          <router-link tag="div" to="/addFriend" class="home-icon">
            <el-icon size="25" color="#9F9D99"><Plus /></el-icon>
          </router-link>
          <router-link tag="div" to="/addGroup" class="home-icon">
            <el-icon size="25" color="#9F9D99"><CirclePlus /></el-icon>
          </router-link>
          <router-link tag="div" to="/deleteFriend" class="home-icon">
            <el-icon size="25" color="#9F9D99"><Minus /></el-icon>
          </router-link>
          <router-link tag="div" to="/deleteGroup" class="home-icon">
            <el-icon size="25" color="#9F9D99"><Close /></el-icon>
          </router-link>
          <router-link tag="div" to="/info" class="home-icon">
            <el-icon size="25" color="#9F9D99"><User /></el-icon>
          </router-link>
        </div>
        <div class="home-cont-left-bottom" @click="logout">
          <el-icon size="25" color="#9F9D99"><SwitchButton /></el-icon>
        </div>
      </div>
      <div class="home-cont-right">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router";
  import request from "../utils/request.js"
  import { onMounted, ref } from "vue"
  import { ElMessage } from "element-plus";

  const router = useRouter();
  const url = ref('');

  const logout = () => {
    request.get("/user/logout").then(res => {
      sessionStorage.removeItem("user")
      router.replace("/login")
    })
  }

  onMounted(() => {
    if(sessionStorage.getItem("user") == null) {
      ElMessage.error("请先登录");
      router.replace("/login")
      return
    }
    request.get("/user/info").then(res => {
      console.log(res)
      if(res.data.status == false) {
        ElMessage.error("请先登录");
        router.replace("/login")
      } else {
        url.value = res.data.data.avatarPath
      }
    })
  })

  onclose = function() {
    sessionStorage.removeItem("user")
    request.get("/user/logout")
  }

  // onbeforeunload = function() {
  //   request.get("/user/logout")
  //   sessionStorage.removeItem("user")
  // }
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.home-cont {
  border-radius: 10px;
  width: 950px;
  height:750px;
  background: #ffffff;
  display: flex;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.home-cont-left {
  flex: 1;
  border-right: 1px solid #eeeeee;
  background: rgb(247, 247, 247);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
}
.home-cont-right {
  flex: 9;
}
.home-cont-left-img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-top: 5px;
}
.home-cont-left-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 200px;
}
.home-icon {
  margin-top: 30px;
  cursor: pointer;
  flex: 1;
}
.router-link-active i {
  color: red;
}
</style>