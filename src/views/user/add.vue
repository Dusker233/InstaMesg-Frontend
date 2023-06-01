<template>
  <div class="cent">
    <div class="cent-top">
      <el-input v-model="query.name"></el-input>
      <el-button @click="getUserTop">搜索</el-button>
    </div>
    <div class="userlist-left">
      <el-scrollbar height="200">
        <div class="left-list" v-if="userTop.id">
          <img :src="userTop.image" class="left-list-img"/>
          <span class="left-list-title">{{userTop.name}}</span>
          <el-button @click="dialogVisible = true">添加</el-button>
        </div>
      </el-scrollbar>
      <el-dialog title="提示" v-model="dialogVisible" center width="20%">
        <span>请输入添加好友理由，也可以不输入</span>
        <div style="display: flex;">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="reason" placeholder="" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd(userTop.id)">确定</el-button>
      </span>
      </el-dialog>
    </div>
    <el-divider></el-divider>
    <div class="userlist-left">
      <el-scrollbar height="200">
        <div class="left-list" v-for="(item, index) in userConfirm.arr" :key="index">
          <el-dialog title="提示" v-model="reasonVisible" center width="20%">
            <span>发送添加请求时间：</span>
            <p>{{Format(Time)}}</p>
            <span>对方添加您时的理由：</span>
            <p>{{Reason}}</p>
            <span slot="footer" class="dialog-footer">
              <el-button @click="reasonVisible = false">取 消</el-button>
              <el-button type="primary" @click="reasonVisible = false">确定</el-button>
            </span>
          </el-dialog>
          <img :src="item.userInfo.avatarPath" class="left-list-img" @click="Time = item.time;Reason = item.reason;reasonVisible = true"/>
          <span class="left-list-title">{{item.userInfo.userName}}</span>
          <div>
            <el-button @click="accept(item.userInfo.userId)">添加</el-button>
            <el-button @click="deny(item.userInfo.userId)">拒绝</el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-divider></el-divider>
    <div class="userlist-left">
      <el-scrollbar height="120">
        <div class="left-list" v-for="(item, index) in userWaiting.arr">
          <img :src="item.userInfo.avatarPath" class="left-list-img"/>
          <span class="left-list-title">{{item.userInfo.userName}}</span>
          <p>等待验证中</p>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {ref, reactive, onMounted} from "vue";
  import request from "../../utils/request.js"
  import {ElMessage} from "element-plus";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc.js"
  import timezone from "dayjs/plugin/timezone.js"

  let Time = ref();
  let Reason = ref();
  let userTop = reactive({});
  let userConfirm = reactive({arr: []});
  let userWaiting = reactive({arr: []});
  let dialogVisible = ref(false);
  let reasonVisible = ref(false);
  let reason = reactive('');
  let query = reactive({
    name: ''
  });

  const Format = (e) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)

    // dayjs.tz.setDefault("Asia/Shanghai")
    return dayjs(e).format('YYYY-MM-DD HH:mm:ss')
  }

  const getUserTop = () => {
    request.get("/friend/getUser?name=" + query.name).then(res => {
      if(res.data.status) {
        userTop.id = res.data.data.userId
        userTop.name = res.data.data.userName
        userTop.image = res.data.data.avatarPath
      } else {
        ElMessage.error(res.data.message)
      }
    })
  }

  const confirmAdd = (e) => {
    var formData = new FormData();
    formData.append('friendid', e)
    formData.append('reason', reason)
    request({
      method: 'post',
      url: '/friend/addFriend',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      if(res.data.status) {
        ElMessage.success(res.data.message)
        dialogVisible.value = false
      } else {
        ElMessage.error(res.data.message)
        dialogVisible.value = false
      }
    })
  }

  onMounted(() => {
    request.get("/friend/confirmFriendList").then(res => {
      console.log(res.data)
      if(res.data.status) {
        userConfirm.arr = res.data.data
      }
    })
    request.get("/friend/waitingFriendList").then(res => {
      if(res.data.status) {
        userWaiting.arr = res.data.data
      }
    })
  })

  const accept = (e) => {
    let formData = new FormData();
    formData.append('userid', e);
    request({
      method: 'post',
      url: '/friend/acceptFriend',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      if(res.data.status) {
        ElMessage.success(res.data.message)
        location.reload()
      } else {
        ElMessage.error(res.data.message)
        location.reload()
      }
    })
  }

  const deny = (e) => {
    let formData = new FormData();
    formData.append('userid', e);
    request({
      method: 'post',
      url: '/friend/denyFriend',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      if(res.data.status) {
        ElMessage.success(res.data.message)
        location.reload()
      } else {
        ElMessage.error(res.data.message)
        location.reload()
      }
    })
  }

</script>

<style scoped>
.cent {
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.cent-top {
  display: flex;
}
.userlist-left {
  padding-top: 20px;
  padding-left: 10px;
  flex: 1;
}
.left-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-template-areas: 'a b c'
                       'a b c';
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.left-list-img {
  grid-area: a;
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
.left-list-title {
  grid-area: b;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>