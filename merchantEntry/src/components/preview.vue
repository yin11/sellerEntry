<template>
	<div>
		<!--商户信息-->
		<div class="mb-7 fz15 business-info">
			<div class="logo">
				<img :src="userinfo.supplierLogo" width="100%"/>
			</div>
			<p class="fz17 txt-ellipsis">{{userinfo.shopName}}</p>
			<p class="fc-c txt-overflow address">{{userinfo.unitAddress}}</p>
			<p><a class="fc-c fz12 call" :href="'tel:' + userinfo.contactPhone">{{userinfo.contactPhone}}</a></p>
		</div>
		<!--基本信息-->
		<div>
			<ul class="fz14 info-list mb-7 ">
				<li class="clearfix">
					<span class="fl-l fc-c">经营许可证</span>
					<span class="fl-r">{{userinfo.certificate}}</span>
				</li>
				<li class="clearfix">
					<span class="fl-l fc-c">行业类型</span>
					<span class="fl-r">{{userinfo.deal_cate_match_row}}</span>
				</li>
				<li class="clearfix">
					<span class="fl-l fc-c">掌柜姓名</span>
					<span class="fl-r">{{userinfo.legalPerson}}</span>
				</li>
				<li class="clearfix">
					<span class="fl-l fc-c">掌柜手机号码</span>
					<span class="fl-r">{{userinfo.legalPersonPhone}}</span>
				</li>
				<li class="clearfix">
					<span class="fl-l fc-c">支付宝账号</span>
					<span class="fl-r">{{userinfo.alipayAccount}}</span>
				</li>
				<li class="clearfix">
					<span class="fl-l fc-c">支付宝账号姓名</span>
					<span class="fl-r">{{userinfo.alipayAccountRealName}}</span>
				</li>
				<li class="clearfix">
					<span class="fl-l fc-c">客户经理编号</span>
					<span class="fl-r">{{userinfo.referenceId}}</span>
				</li>
			</ul>
		</div>
		<!--门店照片-->
		<div class="clearfix photo-box">
			<div class="fl-l" style="width: 200px;">
				<img :src="userinfo.licensePhoto" width="100%"/>
				<p class="fz14">营业执照</p>
			</div>
			<div class="fl-r" style="width: 141px;">
				<img :src="userinfo.storeImgs_1" width="100%"/>
				<p class="fz14">门店照片</p>
			</div>
		</div>
		<div class="photo-box">
			<div class="" style="width: 141px;">
				<img :src="userinfo.storeImgs_2" width="100%"/>
				<p class="fz14">店内环境照片</p>
			</div>
		</div>
		<button type="button" class="btn bg-blue" @click="subFormate">提交</button>
		<!--确认弹窗-->
		<div v-show="subState">
			<div class="mask"></div>
			<div class="alert-box bg-f">
				<button type="button" class="close-btn" @click="hideAlert"></button>
				<img src="../assets/img/bg.png" width="100%"/>
				<p class="fc-blue fz18">提交申请成功</p>
				<p class="fz14">审核将在7个工作日内短信通知您结果</p>
				<router-link to='/' tag='button' class="bg-blue btn fz18" @click.native = 'clear'>确定</router-link>
				<!--<button type="button" class="bg-blue btn fz18" >确定</button>-->
			</div>
		</div>
		<!--提交错误返回第一步-->
		<div v-show="subErrorState">
			<div class="mask"></div>
			<div class="alert-box bg-f">
				<button type="button" class="close-btn" @click="hideErrorAlert"></button>
				<p class="fc-blue fz18">{{subErrorMsg}}</p>
				<router-link to='/' tag='button' class="bg-blue btn fz18" >返回第一步</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import * as comm from '../assets/js/comm'
import axios from 'axios'; 
import md5 from 'js-md5';
export default {
	name: 'preview',
	data () {
    	return {
     		userinfo : {} ,
     		subState:false ,
     		subErrorState : false ,
     		subErrorMsg : ''
    	}
	},
	methods:{
		subFormate(){
			let _self = this ;
			let _formate = new FormData();
			let _data = _self.userinfo;
			let _licensePhoto = comm.dataURLtoBlob(comm.IMGFORMDATA.licensePhoto),
				_storeImgs_1 = comm.dataURLtoBlob(comm.IMGFORMDATA.storeImgs_1) ,
				_storeImgs_2 = comm.dataURLtoBlob(comm.IMGFORMDATA.storeImgs_2) ,
				_supplierLogo = comm.dataURLtoBlob(comm.IMGFORMDATA.supplierLogo);
			delete _data.licensePhoto;
			delete _data.storeImgs_1;
			delete _data.storeImgs_2;
			delete _data.supplierLogo;
			let _sec = md5(comm.asciiSort(_data)) ;
			const list = Object.keys(_data).map((item, index) => ({key: item, value:_data[item]})) ;
			list.forEach((i)=>{
				_formate.append(i.key,i.value);
			});
			_formate.append('licensePhoto',_licensePhoto);
			_formate.append('storeImgs_1',_storeImgs_1);
			_formate.append('storeImgs_2',_storeImgs_2);
			_formate.append('supplierLogo',_supplierLogo);
			axios.post( '/sapi/add/shop',
                _formate,
                {
                headers: {
                    'Content-Type': 'multipart/form-data' ,
                    'sec':_sec
                }
              }
            ).then(function(res){
	        	if(res.data.state == 1){
	          		_self.subState = true ;
	        	}else if(res.data.state == 802903 ){
	          		_self.subErrorState = true ;
	          		_self.subErrorMsg = decodeURIComponent(res.data.msg) ;
	        	}else if(res.data.state == 802902 ){
	          		_self.subErrorState = true ;
	          		_self.subErrorMsg = decodeURIComponent(res.data.msg) ;
	        	}else if(res.data.state == 900104 ){
	          		_self.subErrorState = true ;
	          		_self.subErrorMsg = decodeURIComponent(res.data.msg) ;
	        	}else{
	        		comm.toast(decodeURIComponent(res.data.msg)) ;
	        	}
	        })
	        .catch(function(error){
	           comm.alertMsg(error);
	        });
		},
		//提交成功后清除缓存
		clear(){
			comm.removeStore('userinfo');
			delete comm.IMGFORMDATA.licensePhoto;
			delete comm.IMGFORMDATA.storeImgs_1;
			delete comm.IMGFORMDATA.storeImgs_2;
			delete comm.IMGFORMDATA.supplierLogo;
		},
		hideAlert(){
			this.subState = false ;
		},
		hideErrorAlert(){
			this.subErrorState = false ;
		}
	},
	created:function(){
		let _self = this ;
		_self.userinfo = JSON.parse( comm.getStore('userinfo') ) ; //从缓存中信息
	}
}	
</script>

<style scoped>
	.business-info{
		position: relative;
		padding: 20px 15px 20px 150px;
		min-height: 110px;
	}
	.logo{
		width: 110px;
		height: 110px;
		position: absolute;
		left: 15px;
		top: 20px;
		overflow: hidden;
	}
	.address{
		padding-right: 30px;
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAuCAMAAAB6WzuLAAAAOVBMVEUAAAAlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6OKCBbbAAAAEnRSTlMA8uEqFwtwPrTDf0zQo5mOY1dEgMfpAAABBElEQVQ4y4XTW5KFIAwE0A4vRXxg9r/YqRqnIDHCnO9UX5O+QAplO9f13ErAp5gyNzlFGNWxQglayGzsHsJC/IGKmOCBNuN5aMHD8RA9ExtPnL/L8JQHcLJCxMoKRFL38jH65FgIKNzl8NfFyl3FxY1Ds3NzIOsj2FPtcDrExhBIJArn58gFYRMjTl6gO8RIfvVhettlQ6lP3LIlr/t4BOKmyEim+5kopP8OSZVWl6Wu/Oh7Es8E9JjOhMxjIvBPzNbvNOBM9cZiGulsa5GGC8+f7A3lmPzMcCuKePF2GyOZy1uZhR2fnPkQw5sPsappz7rMo7Ny73ckOmYKmAr9qQzdFS8/K4Q+KmE0sU4AAAAASUVORK5CYII=) no-repeat right center;
		background-size: auto 22px;
	}
	.call{
	    display: inline-block;
    	background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAAAPFBMVEUAAAAAk/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/3PN+y1AAAAE3RSTlMA59qluTMVCZBf882bcECBVUsgXohDyAAAALlJREFUOMuNlFcShDAMQ9MgkELz/e+6DdCwIE/e9xtHEysxH2L11egsVkRyrymDfLGKNMqOo0pMcuBpGAEdTQMG4hQBgTi1wel4HpBPZSIGDkudoUTcDscjMGVDHE7YA8WGQVltR0vshIVRVtmZFam0SK5B6tOtRNr+y1H0kP3fDifUKOItlJ5IdsFzsev1OHtazsnJeA2e5YlbT6gDKnfA5KgDYhFA/4EVo5T/ZLZQNkOIo/8NC+8pLxbqHVJC+uB+AAAAAElFTkSuQmCC) no-repeat right center;
		padding-right: 30px;
		background-size: auto 100%; 
	}
	.mb-7{
		border-bottom: 7px solid #f2f2f2 ;
	}
	.info-list{
		padding: 9px 12px 9px 15px;
		line-height: 42px;
	}
	.photo-box{
		padding: 30px 11px 15px 11px;
		text-align: center;
	}
	.photo-box img{
		height: 141px;
		overflow-y: hidden;
	}
	.alert-box img{
		margin-bottom: 32px;
	}
	.alert-box .btn{
		width: 235px;
    	border-radius: 35px;
	}
</style>