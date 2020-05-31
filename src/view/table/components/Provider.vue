<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "Provider",
        provide() {
            return {
                ...this.$attrs
            }
        }
    }
</script>
