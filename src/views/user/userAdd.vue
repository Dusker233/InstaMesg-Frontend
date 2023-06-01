<template>
  <div class="userlist">
    <div class="userlist-left">
      <el-button style="margin-right: 6px" @click="adduser">添加用户</el-button>
      <el-scrollbar>
        <div class="left-list" v-for="(item, index) in list.arr" :key="index" :class="{'left-list-bg' : active == item.userId}" @click="startCall(item)">
          <img :src="item.avatarPath" class="left-list-img"/>
          <span class="left-list-title">{{ item.userName }}</span>
        </div>
      </el-scrollbar>
    </div>
    <div class="userlist-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {onMounted, reactive, ref} from 'vue'
  import {useRouter} from "vue-router";
  import request from "../../utils/request.js"

  const router = useRouter();
  const active = ref('');
  let list = reactive({arr: []})

  const adduser = () => {
    router.push("userAdd");
  }

  const startCall = (e) => {
    active.value = e.userId;
    router.push({path: 'chatFriend', query: {uid: e.userId}})
  }

  onMounted(() => {
    request.get("/friend/list").then(res => {
      console.log(res.data)
      list.arr = res.data.data
    })
  })
</script>

<style scoped>
.userlist {
  display: flex;
  height: 100%;
  width: 100%;
}
.userlist-left {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-left: 10px;
  flex: 1;
  border-right: 1px solid #dbd6d6;
}
.userlist-right {
  flex: 4;
}
.left-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas: 'a b'
                       'a b';
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.left-list-bg {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas: 'a b'
                       'a b';
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  background: #eaeaea;
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
</style>