<template>
    <input class="y-input" type="text" @input="inputChange" v-model="inputValue"/>
</template>
<script>
    export default {
        name: 'y-input',
        data() {
            return {
                inputValue: ""
            }
        },
        methods: {
            inputChange(e) {
                if(this._events.input) {
                    this.$emit("input", this.inputValue)
                } else {
                    this.inputValue = "";
                }
            }
        }
    }
</script>>