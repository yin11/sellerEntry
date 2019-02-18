import Vue from 'vue'
import Router from 'vue-router'
import information from '@/components/information'
import loginInfo from '@/components/loginInfo'
import aptitude from '@/components/aptitude'
import preview from '@/components/preview'
import address from '@/components/address'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'information',
      component: information
    },{
    	path: '/loginInfo',
      name: 'loginInfo',
      component: loginInfo
    },{
    	path: '/aptitude',
      name: 'aptitude',
      component: aptitude
    },{
    	path: '/preview',
      name: 'preview',
      component: preview
    },{
    	path: '/address',
      name: 'address',
      component: address
    }
  ]
})
