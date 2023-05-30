<template>
  <div class="count">
    <div class="login-count">
      <el-form class="login-form" ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <h3 class="title">找回密码成功！</h3>
        <p style="text-align: center">如果您需要重置二步验证器，请您使用二步验证器应用（如 Microsoft Authenticator）扫描下方二维码获取您的二步验证器，登录时需要提供验证器中的二步验证码以安全登录。</p>
        <img :src="url" class="home-img" />
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import {ref, onMounted} from 'vue'
import request from "../../utils/request.js";
import { ElMessage } from 'element-plus'

const router = useRouter();
const url = ref('');

onMounted(() => {
  if(sessionStorage.getItem("2FA") == null) {
    ElMessage.error("非法访问！")
    router.replace('/')
    return
  }
  url.value = sessionStorage.getItem("2FA")
  sessionStorage.removeItem("2FA")
  })
</script>

<style scoped>
.count {
  width: 100vw;
  height: 100vh;
}
.login-count {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.login-form {
  border-radius: 15px;
  padding: 15px 35px 15px 35px;
  width: 250px;
  background: #ffffff;
  box-shadow: 0 0 25px #cac6c6;
}
.home-img {
  display: flex;
  width: 200px;
  height: 200px;
  margin-left: 25px;
}
.title {
  text-align: center;
}
</style>