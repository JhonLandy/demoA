<template>
    <el-button @click="request">发送请求</el-button>
</template>
<script>
// import axios from 'axios'


export default {
    methods: {
        request() {

            var xhr = new XMLHttpRequest();

            xhr.open('GET', '/ycl/http/test', true);

            xhr.setRequestHeader('withCredentials', 'false');

            xhr.send();
            // axios({
            //     method: 'get',
            //     url: '/ycl/http/test',
            //     headers: {
            //         withCredentials: false
            //     },
            //     data: {
            //         firstName: 'Fred',
            //         lastName: 'Flintstone'
            //     }
            // }).then(res => {
            //     console.log(res)
            //     console.log(document.cookie)
            // })
        }
    }
}
</script>