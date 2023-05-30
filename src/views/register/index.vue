<template>
  <div class="count">
    <div class="login-count">
      <el-form class="login-form" ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <h3 class="title">注册</h3>
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
          <el-input clearable placeholder="再次确认密码" v-model="ruleForm.authCode" type="password">
            <template #prepend>
              <el-icon><More /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input clearable placeholder="邮箱" v-model="ruleForm.email">
            <template #prepend>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style = "width:100%" type="primary" @click="onSubmit">注册</el-button>
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
  authCode: '',
  email: ''
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
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    // { length: 6, message: '二步验证码必须为六位', trigger: 'blur' },
  ],

})

const onSubmit = () => {
  var formData = new FormData();
  formData.append('username', ruleForm.username);
  formData.append('password', ruleForm.password);
  formData.append('email', ruleForm.email);
  if(ruleForm.password != ruleForm.authCode) {
    ElMessage.error("密码与确认密码不一致")
    location.reload()
    return
  }
  request({
    method: "post",
    url: "/user/register",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  }).then(res => {
    if (res.data.status) {
      ElMessage({
        message: '注册成功',
        type: 'success',
      })
      router.replace('/registered')
    } else {
      ElMessage.error(res.data.message)
      location.reload()
      return
    }
  });
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