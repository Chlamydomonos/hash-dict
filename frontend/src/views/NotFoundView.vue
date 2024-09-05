<template>
    <div class="main-frame">
        <h1 class="not-found">Not Found</h1>
        <RouterLink to="/" class="home-link">回到首页</RouterLink>
    </div>
</template>

<style lang="scss" scoped>
.main-frame {
    margin: 0 auto;
    text-align: center;
}

.not-found {
    font-size: 10rem;
}

.home-link {
    font-size: 3rem;
    color: var(--el-text-color-secondary);
}
</style>
