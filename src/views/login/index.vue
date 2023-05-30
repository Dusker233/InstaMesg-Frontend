<template>
  <div class="count">
    <div class="login-count">
      <el-form class="login-form" ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <h3 class="title">登录</h3>
        <el-form-item prop="username">
          <el-input clearable placeholder="用户名" v-model="ruleForm.username">
            <template #prepend>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input clearable placeholder="密码" v-model="ruleForm.password" type="password">
            <template #prepend>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="authCode">
          <el-input clearable placeholder="二步验证码" v-model="ruleForm.authCode">
            <template #prepend>
              <el-icon><More /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style = "width:100%" type="primary" @click="onSubmit()">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style = "width:100%" type="primary" @click="RegisterUser">注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style = "width:100%" type="primary" @click="ResetPassword">忘记密码？</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router";
  import { ref, reactive } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import request from "../../utils/request.js";
  import { ElMessage } from 'element-plus'

  const router = useRouter();

  const ruleForm = reactive({
    username: '',
    password: '',
    authCode: ''
  });

  const ruleFormRef = ref();

  const rules = reactive<FormRules>({
    username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
    ],
    authCode: [
      { required: true, message: '二步验证码不能为空', trigger: 'blur' },
      // { length: 6, message: '二步验证码必须为六位', trigger: 'blur' },
    ],

  })

  const onSubmit = () => {
    if(sessionStorage.getItem("user") != null) {
      ElMessage.error("请不要重复登录！")
      router.replace('/')
      return
    }
    var formData = new FormData();
    formData.append('username', ruleForm.username);
    formData.append('password', ruleForm.password);
    formData.append('authCode', ruleForm.authCode);
    request({
      method: "post",
      url: "/user/login",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      if (res.data.status) {
        ElMessage({
          message: '登录成功',
          type: 'success',
        })
        sessionStorage.setItem("user", res.data.data)
        router.replace('/')
      } else {
        ElMessage.error(res.data.message)
      }
    });
  };

  const RegisterUser = () => {
    router.replace("/register");
  };

  const ResetPassword = () => {
    router.replace("/reset");
  };
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
.title {
  text-align: center;
}
</style>