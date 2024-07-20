<template>
    <h1>
        {{ author }} says: {{ title }}
    </h1>
</template>

<script>
export default {
    name: 'Header',
    setup () {
        return {
            author: 'John Doe',
            title: 'Hello, world!'
        }
    }
}
</script>

<style scoped>
</style>