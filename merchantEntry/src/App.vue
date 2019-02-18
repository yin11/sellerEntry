<template>
  <div id="app">
  	<v-subnav></v-subnav>
    <router-view/>
  </div>
</template>

<script>
import subnav from './components/subnav'
export default {
  name: 'App',
  components : {
		'v-subnav':subnav ,
	},
}
</script>

<style>
@import 'assets/css/base.css';
</style>
