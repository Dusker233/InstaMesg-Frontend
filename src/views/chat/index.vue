<template>
  <div class="chat">
    <h3 class="title">{{title}}</h3>
    <el-scrollbar>
      <div class="chat-list" v-for="(item, index) in messageList.arr">
        <div :class="item.sender.userId == uid ? 'chat-list-left' : 'chat-list-right'">
<!--          {{item}}-->
          <img :src="item.sender.avatarPath" class="list-img"/>
          <div :class="item.sender.userId == uid ? 'left-msg' : 'right-msg'">{{item.message.content}}</div>
        </div>
<!--        <div class="chat-list-right">-->
<!--          <img src="../../../test.png" class="list-img"/>-->
<!--          <div class="right-msg">hello</div>-->
<!--        </div>-->
      </div>
    </el-scrollbar>
    <div class="chat-bottom">
      <el-input class="textarea" type="textarea" :rows="7" placeholder="Please input" v-model="text"/>
      <el-button type="primary" @click="send">发送</el-button>
      <el-button type="primary">上传文件</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRoute, onBeforeRouteUpdate} from 'vue-router'
  import { ref, onMounted, reactive } from 'vue'
  import request from '../../utils/request.js'
  import {ElMessage} from "element-plus";
import socket from "../../utils/websocket";

  let route = useRoute();
  let uid = ref('');
  let messageList = reactive({arr: []});
  let title = ref('');
  let text = ref('');

  onBeforeRouteUpdate((to) => {
    uid.value = to.query.uid
    getMessageList(to.query.uid)
  })

  const getuid = () => {
    uid.value = route.query.uid
    getMessageList(route.query.uid)
  }

  const getMessageList = (e) => {
    request.get("/user/info/" + e).then(res => {
      title.value = res.data.data.userName
    })
    request.get("/message/listFriendMessage?userid=" + e).then(res => {
      console.log(res.data.data)
      messageList.arr = res.data.data
    })
  }

  const send = () => {
    let formData = new FormData();
    formData.append('userid', uid.value)
    formData.append('content', text.value)
    request({
      method: 'post',
      url: '/message/sendFriend',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      if(res.data.status) {
        getMessageList(uid.value)
        text.value = ''
      } else {
        ElMessage.error(res.data.message)
      }
    })
  }

  const loginWebsocket = () => {
    Promise.resolve().then(() => {
      socket.init()
    }).then(() => {
      socket.send({uid: sessionStorage.getItem("user"), type: 'text'})
    })
  }

  onMounted(() => {
    getuid()
    loginWebsocket()
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