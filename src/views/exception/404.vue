<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-row>
        <a-button type="primary" @click="toHome">
          Back Home
        </a-button>
      </a-row>
      <a-row style="margin-top:20px">
        <a-button danger type="primary" @click="_logout()" >
          Logout
        </a-button>
      </a-row>
    </template>
  </a-result>
</template>

<script>
import {logout } from '@/api/login'
export default {
  name: 'Exception404',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    },

    _logout(){
      return this.$store.dispatch('Logout').then(() => {
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>
