<template>
  <div class="userlist">
    <div class="userlist-left">
      <el-scrollbar>
        <div class="left-list" v-for="count in 100" :class="{'left-list-bg' : active == count}" @click="startCall(count)">
          <img src="../../../test.png" class="left-list-img"/>
          <span class="left-list-title">aaa</span>
        </div>
      </el-scrollbar>
    </div>
    <div class="userlist-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import {useRouter} from "vue-router";

  const router = useRouter();
  const active = ref('');
  const startCall = (e) => {
    active.value = e;
    router.push({path: 'chatFriend', query: {uid: e}})
  }
</script>

<style scoped>
.userlist {
  display: flex;
  height: 100%;
  width: 100%;
}
.userlist-left {
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