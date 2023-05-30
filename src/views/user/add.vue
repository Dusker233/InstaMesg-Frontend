<template>
  <div class="cent">
    <div class="cent-top">
      <el-input></el-input>
      <el-button>搜索</el-button>
    </div>
    <div class="userlist-left">
      <el-scrollbar height="200">
        <div class="left-list" v-for="count in 100" :class="{'left-list-bg' : active == count}" @click="startCall(count)">
          <img src="../../../test.png" class="left-list-img"/>
          <span class="left-list-title">aaa</span>
          <el-button>添加</el-button>
        </div>
      </el-scrollbar>
    </div>
    <el-divider></el-divider>
    <div class="userlist-left">
      <el-scrollbar height="200">
        <div class="left-list" v-for="count in 100" :class="{'left-list-bg' : active == count}" @click="startCall(count)">
          <img src="../../../test.png" class="left-list-img"/>
          <span class="left-list-title">aaa</span>
          <div>
            <el-button>添加</el-button>
            <el-button>拒绝</el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>

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
</style>