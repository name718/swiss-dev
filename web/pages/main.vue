<template>
  <div>
    <!-- 顶部导航区 -->
    <header class="header">导航</header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 左侧导航栏 -->
      主内容区
      <aside class="sidebar">
        <nav>左侧</nav>
      </aside>

      <!-- 工具展示区 -->
      <section class="tool-area"></section>
    </main>

    <!-- 底部操作区 -->
    <footer class="footer">
      <p>© 2023 DevToolbox | 开发者工具箱</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
// 这里可以添加页面逻辑
</script>

<style scoped lang="less">
.header {
  position: sticky;
  top: 0;
  background: blue;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
}
.main-content {
  background: red;
  min-height: calc(100vh - 100px);
  .sidebar {
    background: green;
    width: 200px;
    min-height: calc(100vh - 100px);
  }
}
</style>
