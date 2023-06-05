<template>
  <div class="chat">
    <h3 class="title">{{title}}</h3>
    <el-tag type="success" v-if="onlineStatus === true">在线</el-tag>
    <el-tag type="warning" v-if="onlineStatus === false" color="red">离线</el-tag>
<!--    <h4 class="title" v-if="onlineStatus === true">在线</h4>-->
<!--    <h4 class="title" v-if="onlineStatus === false">离线</h4>-->
    <el-scrollbar>
      <div class="chat-list" v-for="(item, index) in messageList.arr">
        <div :class="item.sender.userId == uid ? 'chat-list-left' : 'chat-list-right'">
<!--          {{item}}-->
          <img :src="item.sender.avatarPath" class="list-img"/>
          <div :class="item.sender.userId == uid ? 'left-msg' : 'right-msg'">{{item.message.content}}</div>
        </div>
      </div>
    </el-scrollbar>
    <div class="chat-bottom">
      <el-input class="textarea" type="textarea" :rows="7" placeholder="Please input" v-model="text"/>
      <el-button type="primary" @click="send">发送</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRoute, onBeforeRouteUpdate} from 'vue-router'
  import { ref, onMounted, reactive } from 'vue'
  import request from '../../utils/request.js'
  import {ElMessage} from "element-plus";

  let route = useRoute();
  let uid = ref('');
  let messageList = reactive({arr: []});
  let title = ref('');
  let text = ref('');
  let avatarTo = ref(''), avatarFrom = ref('');
  let wsUrl = "ws://127.0.0.1:2345/imserver/";
  let userlist = reactive([]);
  let socket;
  let webSocketState = false;
  let onlineStatus = ref(false);

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
      // console.log(res.data.data)
      messageList.arr = res.data.data
    })
  }

  const sendIm = () => {
    if(!text.value) {
      ElMessage.error("请输入聊天内容")
      return
    }
    if(typeof(WebSocket) == "undefined") {
      ElMessage.error("您的浏览器不支持WebSocket")
    } else {
      let content = {from: sessionStorage.getItem("user"), to: uid.value, text: text.value, code: "normal"}
      socket.send(JSON.stringify(content))
      let sender = {userId: sessionStorage.getItem("user"), avatarPath: avatarFrom}
      let message = {content: text.value}
      messageList.arr.push({sender, message})
    }
  }

  const send = () => {
    sendIm()
    if(!text.value) {
      ElMessage.error("请输入聊天内容")
      return
    }
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
        text.value = ''
      } else {
        ElMessage.error(res.data.message)
      }
    })
  }

  const loginWebsocket = () => {
    if (typeof (WebSocket) == "undefined") {
      console.log("您的浏览器不支持WebSocket");
    } else {
      console.log("您的浏览器支持WebSocket");
      wsUrl = wsUrl + sessionStorage.getItem("user");
      console.log(wsUrl)
      if(socket != null) {
        socket.close()
        socket = null
      }
      socket = new WebSocket(wsUrl)
      socket.onopen = function () {
        console.log("websocket已打开")
        heartbeat(3000)
        webSocketState = true
      }
      socket.onmessage = function (msg) {
        console.log(msg)
        console.log("收到数据====" + msg.data)
        let data = JSON.parse(msg.data)
        if(data.users) {
          userlist = data.users.filter(user => user.userid  !== sessionStorage.getItem("user"))
          console.log(userlist)
          if(userlist.some(user => user.userid === uid.value) === true)
            onlineStatus.value = true
          else
            onlineStatus.value = false
        } else {
          if(data.from === uid.value) {
            let sender = {userId: uid.value, avatarPath: avatarTo}
            let message = {content: data.text}
            messageList.arr.push({sender, message})
          }
        }
      }
      //关闭事件
      socket.onclose = function () {
        console.log("websocket已关闭")
      };
      //发生了错误事件
      socket.onerror = function () {
        console.log("websocket发生了错误")
      }
    }
  }

  onMounted(() => {
    getuid()
    loginWebsocket()
    request.get("/user/info").then(res => {
      if(res.data.status) {
        avatarFrom = res.data.data.avatarPath
      }
    })
    request.get("/user/info/" + uid.value).then(res => {
      if(res.data.status) {
        avatarTo = res.data.data.avatarPath
      }
    })
    console.log(avatarFrom.value)
    console.log(avatarTo.value)
  })

  const heartbeat = (time) => {
    setTimeout(() => {
      let content = {from: sessionStorage.getItem("user"), to: "heartbeat", text: new Date(), code: "heartbeat"}
      socket.send(JSON.stringify(content))
      waitingServer(time)
    }, time)
  }

  const waitingServer = (time) => {
    setTimeout(() => {
      if(webSocketState) {
        heartbeat(time)
        return
      }
      try {
        close()
      } catch(e) {
        console.log('已关闭连接，无需再次关闭')
      }
    }, time)
  }

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