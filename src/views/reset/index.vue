<template>
  <div class="count">
    <div class="login-count">
      <el-form class="login-form" ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <h3 class="title">找回密码</h3>
        <el-form-item prop="username">
          <el-input clearable placeholder="邮箱" v-model="ruleForm.username">
            <template #prepend>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input clearable placeholder="新密码" v-model="ruleForm.password" type="password">
            <template #prepend>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="authCode">
          <el-input clearable placeholder="邮箱验证码" v-model="ruleForm.authCode">
            <template #prepend>
              <el-icon><More /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style = "width:100%" type="primary" @click="getCode()">发送验证码！</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style = "width:100%" type="primary" @click="onSubmit()">重置密码</el-button>
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
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
  ],
  authCode: [
    { required: true, message: '邮箱验证码不能为空', trigger: 'blur' },
    // { length: 6, message: '二步验证码必须为六位', trigger: 'blur' },
  ],

})

const onSubmit = () => {
  if(sessionStorage.getItem("user") != null) {
    ElMessage.error("您已经登录，这不是您应该来的地方！")
    router.replace('/')
    return
  }
  var formData = new FormData();
  formData.append('email', ruleForm.username);
  formData.append('password', ruleForm.password);
  formData.append('captcha', ruleForm.authCode);
  request({
    method: "post",
    url: "/user/reset",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  }).then(res => {
    if (res.data.status) {
      ElMessage({
        message: '重置密码成功',
        type: 'success',
      })
      sessionStorage.setItem("2FA", res.data.message)
      router.replace('/reseted')
    } else {
      ElMessage.error(res.data.message)
    }
  });
};

const getCode = () => {
  request.get("/user/getReset?email=" + ruleForm.username).then(res => {
    if(res.data.status) {
      ElMessage({
        message: '验证码发送成功！',
        type: 'success'
      })
    } else {
      ElMessage.error(res.data.message )
    }
  })

}
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