<template>
  <div class="chat">
    <h3 class="title">233</h3>
    <el-scrollbar>
      <div class="chat-list" v-for="count in 10">
        <div class="chat-list-left">
          <img src="../../../test.png" class="list-img"/>
          <div class="left-msg">hello</div>
        </div>
        <div class="chat-list-right">
          <img src="../../../test.png" class="list-img"/>
          <div class="right-msg">hello</div>
        </div>
      </div>
    </el-scrollbar>
    <div class="chat-bottom">
      <el-input class="textarea" type="textarea" :rows="7" placeholder="Please input"/>
      <el-button type="primary">发送</el-button>
      <el-button type="primary">上传文件</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter, onBeforeRouteUpdate } from 'vue-router'
  import { ref, onMounted } from 'vue'

  let route = useRouter();
  let uid = ref('');

  onBeforeRouteUpdate((to) => {
    uid.value = to.query.uid
  })

  const getuid = () => {
    uid.value = route.query.uid
  }

  onMounted(() => {

  })
</script>

<style scoped>
.title {
  text-align: center;
}
.chat {
  height: 100%;
  display: flex;
  background: rgb(247, 247, 247);
  flex-direction: column;
  justify-content: space-between;
}
.chat-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chat-list-left {
  padding: 20px;
  display: flex;
  flex-direction: row;
}
.list-img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}
.left-msg {
  margin-left: 5px;
  background: #ffffff;
  font-size: 15px;
  border-radius: 6px;
  max-width: 200px;
  word-wrap: break-word;
}
.right-msg {
  margin-right: 5px;
  background: #ffffff;
  font-size: 15px;
  border-radius: 6px;
  max-width: 200px;
  word-wrap: break-word;
}
.chat-list-right {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
}
.chat-bottom {
  display: flex;
  justify-content: space-between;
  align-items: end;
}
</style>