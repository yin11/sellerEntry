<template>
	<div>
		<div class="box">
			<!--申请入驻的返回状态-->
			<p class="state " :class="msg == '申请失败'? 'bg-r' : '' ">{{msg}}</p>
			<div class="flex-box fz15" v-if="state == 1">
				<div class="item bg-c " :class=" num >= 1 ? 'bg-blue' : '' " >基本信息</div>
				<div class="item bg-c"  :class=" num >= 2 ? 'bg-blue' : '' " >登录信息</div>
				<div class="item bg-c"  :class=" num >= 3 ? 'bg-blue' : '' " style="padding-left: 8px;box-sizing: border-box;">收货地址</div>
				<div class="item bg-c"  :class=" num >= 4 ? 'bg-blue' : '' " >资质</div>
			</div>
		</div>
	</div>
</template>

<script>
import * as comm from '../assets/js/comm'
export default {
	name: 'subnav',
	data () {
    	return {
     		num : 0 ,
     		state : 1 ,
     		msg : ''
		}
	},
	created:function(){
  		//this.num = comm.SUBNAVNUM ;
  		let _url = window.location.href ;
  		if(_url.endsWith("aptitude")){
  			this.msg = '申请中' ;
  			this.num = 2;
			this.state = 1 ;
  		}else if(_url.includes("shopApplyId")){
  			this.msg = '申请失败' ;
  		}
  		console.log(this.msg)
	},
	watch:{
		$route(to,from){
			if(to.path == '/loginInfo'){
				this.num = 1;
				this.state = 1 ;
			}else if(to.path == '/aptitude'){
				this.num = 3;
				this.state = 1 ;
			}else if(to.path == '/address'){
				this.num = 2;
				this.state = 1 ;
			}else if(to.path == '/preview'){
				this.state = 0;
				this.state = 0 ;
			}else{
				this.num = 0;
				this.state = 1 ;
			}
	    	console.log(to.path);
	    }
	}
}	
</script>

<style scoped>
	.box{
		padding: 16px 23px;
	}
	.state{
		background: #0c8deb ;
		color: #fff;
		text-align: center;
		font-size: 12px;
		line-height: 1.5;
		margin-bottom: 5px;
	    margin-right: 5px;
	}
	.bg-r{
		background: #ff4e00;
	}
	.flex-box{
		display: flex;
	}
	.item{
		flex: 1;
		text-align: center;
		margin-right: 5px;
		height: 36px;
		line-height: 36px;
		position: relative;
	}
	.item.bg-blue{
		color: #fff;
	}
	.item:before{
		content: '';
		display: block;
		height: 36px;
		width: 12px;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABJCAMAAAAQexaYAAAARVBMVEUAAADl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXyw35LAAAAFnRSTlMAFwr141fX7cytoJGCcmNINSTBuD4sB9hYyAAAAKlJREFUOMuV1ccRxCAQRFFh5QGhVecf6kbwD831FVWYmZ6lLLDWAKCdQIUgBwAdBOoEOQLoIFAnyBFAJ4F+BDUC6CTQIKgRQBeBBsFGoItAH8FGoJsgPQCaBLoJ0gOgSaBGkAKAXgI1gjUAaCdQIajujt09VTNvnoL5ui/+oPnn062r263dz+yPze3By+3zYWZJjWZenW4mdjN3czSz/XDnR6EZZU41nIN/mQhKuiJbkLkAAAAASUVORK5CYII=) no-repeat center;
		background-size: cover;
		position: absolute;
	    right: -12px;
		z-index: 2;
	}
	.item.bg-blue:before{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABJCAMAAAAQexaYAAAARVBMVEUAAAAAjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP8AjP+Jw/1PAAAAFnRSTlMA9RbjVyTX7cytoJFyY0g7DcG4MIV+T9MLRwAAAKpJREFUOMuV1UkShCAQRFEBQVEBUTvvf9Q+wV8k2xdEMFRlLesCa4sAqgRaCVIE0EGgTpBuAB0E6gTpBtBJoEFQCHQSaBAUAn0Eegl2Av0IwgugnUAXQcgAmgS6CEIG0CRQIwgZQA+BGsEWAVQJtBIUd0d1T9XMm4dovu6DP2j++XTr6jJrN2SzP3a3Bz+3z4eZJcXNq9PNxE656yZ1N6dBiubEqeZUwzn4B9E3Sns0ppMqAAAAAElFTkSuQmCC) no-repeat center;
		background-size: cover;
	}
	.item:after{
		content: '';
		display: block;
		height: 36px;
		width: 12px;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABJCAMAAAAQexaYAAAAS1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////+DmQsHAAAAGHRSTlMA9RbjV9ftzMCtoIJjSDsNMCghtpSNdm9LFbWzAAAAq0lEQVQ4y5XVSRKEIBBEUQFRUMChbTvvf9I+wV8k2xdEMFRlTfMEa4kAqgSaCVIE0EagTpAOAG0E6gTpANBDoEGQCfQl0CDIBNoJdBKsBNoJwgmglUAvQbgAVAj0Iwg3gAqBGkG4AfQhUCNYIoAqgWaC7O6o7qmaefMQzdct+IPmnxe3rl6zdsNl9sfq9uDu9vkwsyS7efW4mdgpd92k7uY0SNGcONWcajgH/5IVUSErAzZaAAAAAElFTkSuQmCC) no-repeat center;
		background-size: cover;
		position: absolute;
	    left: 0;
	    top: 0;
		z-index: 1;
	}
	.item:nth-of-type(2){
		padding-left: 8px;
	}
	.item:first-of-type:after{
		opacity: 0;
	}
	.item:last-of-type:before{
		opacity: 0;
	}
</style>