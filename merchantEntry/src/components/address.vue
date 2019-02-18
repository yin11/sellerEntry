<template>
	<div>
		<!--商户登录信息-->
		<div class="info-box bg-f">
			<h4 class="fz18 title">商户收货信息</h4>
			<ul class="fz14">
				<li class="border-buttom">
					<span>收货人姓名：</span>
					<input type="text" placeholder="请输入收货人姓名" v-model="receiver" @blur="testContacts"/>
				</li>
				<li class="border-buttom">
					<span>收货人电话：</span>
					<input type="tel" maxlength="11" placeholder="请输入收货人电话" v-model="receiverPhone" @blur="testContactPhone"/>
				</li>
				<li class="border-buttom">
					<span>收货人详细地址：</span>
					<textarea placeholder="请输入收货人详细地址" v-model="contactway" @blur="receiverAddress" rows="2"></textarea>
				</li>
			</ul>
		</div>
		<!--下一步-->
		<div class="bg-f">
			<p style="text-align: center;" class="fz11 pd-tb-5 fc-c">该收货地址将作为赠送助商通话呗卡的邮寄地址，请如实填写</p>
			<button type="button" v-if="next != '111'" class="btn bg-blue btn-layer fz18">下一步</button>
			<button type="button" class="btn bg-blue fz18" @click="subFormate"  v-else>下一步</button>
			<!--<button type="button" class="btn bg-blue fz18"  :class=" next != '111'?'btn-layer':'' " @click="subFormate"> 下一步</button>-->
		</div>
	</div>
</template>

<script>
import * as comm from '@/assets/js/comm'
export default {
	data () {
		return {
      		receiver: '' , //收货人    
      		receiverAddress : '' , //收货地址    
      		receiverPhone : '' ,// 联系人电话
      		next : '000' ,
    	}
	},
	mounted(){
    	let _self = this ;
		let _url = window.location.href ;
		comm.noRefresh();
		comm.noShare();
		if(comm.getStore('RETURNUSERINFO')){// app登录进去，此时审核未通过,页面从接口获取数据回填
			let _json = JSON.parse(comm.getStore('RETURNUSERINFO')) ;
			_self.receiver = comm.isNVL(_json.receiver , '');
			_self.receiverAddress = comm.isNVL(_json.receiverAddress , '');
			_self.receiverPhone  = comm.isNVL(_json.receiverPhone  , '');
			_self.next = '111' ;
		}else{//页面初次进入，或者app未付款再次进入页面获取缓存填充
			let _json = comm.USERINFO ;
			if(_json){
				const list = Object.keys(_json).map((item, index) => ({key: item, value:_json[item]})) ;
				if(list.length == 16){
					_self.receiver = comm.isNVL(_json.receiver , '');
					_self.receiverAddress = comm.isNVL(_json.receiverAddress , '');
					_self.receiverPhone  = comm.isNVL(_json.receiverPhone  , '');
					_self.next = '111' ;
				}
			}
		}
	},
	watch:{
		contacts:function(val){
			this.testContacts();
		},
		contactway:function(){
			this.testContactway();
		},
		contactPhone:function(){
			let _self  = this ;
			if(comm.rule.empty(_self.receiverPhone,'收货人电话不能为空')){
				_self.next = comm.replaceNext(_self.next , '1' , 1);
				comm.USERINFO.receiverPhone = _self.receiverPhone ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 1);
			}
		}
	},
	created: function(){
		
	},
	methods: {
		testContacts(){ //验证收货人姓名
			let _self  = this ;
			if(comm.rule.empty(_self.receiver,'收货人姓名不能为空') ){
				_self.next = comm.replaceNext(_self.next , '1' , 0);
				comm.USERINFO.receiver = _self.receiver ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 0);
			}
		},
		testContactway(){
			let _self  = this ;
			if(comm.rule.empty(_self.receiverAddress,'收货地址 不能为空') ){
				_self.next = comm.replaceNext(_self.next , '1' , 2);
				comm.USERINFO.receiverAddress = _self.receiverAddress ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 2);
			}
		},
		testContactPhone(){
			let _self  = this ;
			if(comm.rule.empty(_self.contactPhone,'收货人电话不能为空') && comm.rule.phone(_self.contactPhone)){
				_self.next = comm.replaceNext(_self.next , '1' , 1);
				comm.USERINFO.contactPhone = _self.contactPhone ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 1);
			}
		},
		/*向app传递填写的信息吊起支付*/
       	postData(){
       		let _self = this ;
       		comm.setStore('userinfo', comm.USERINFO);
       		let _data = {};
       		_data.info = comm.USERINFO ;
       		//_data.data = {"packagePrice":1999,"legalPersonPhone":comm.USERINFO.legalPersonPhone} ;
       		if(comm.getQueryString('shopApplyId')){//此时为商家入驻被拒，再次提交
       			_self.$router.push({path:'/aptitude'});//跳转路由
       		}else{//初次提交入驻信息，提交信息给app吊起支付
       			_data.data = {"packagePrice":1999,"userName":_self.userName} ;
	       		/*let _data = comm.USERINFO ;*/
	       		comm.postData(JSON.stringify(_data));
       		}
       	},
       	//提交商家信息
		subFormate(){
			try{
				let _self = this ;
				_self.disabled = true ;
				comm.subFormation(comm.USERINFO).then((res)=>{
					_self.disabled = false ;
					let _data = res.data ;
					if(_data.state == 1){
						if(_data.data.rechargeState == 1){ //提交成功，但是用户已经是未审核状态(即用户已经交过1999) 。1已充值 ,0 未充值
							_self.$router.push({path:'/aptitude',query: {shopApplyId: _data.data.id}});//跳转路由,提交图片
						}else if(_data.data.rechargeState == 0){
							_self.postData();
						}
		        	}else{
		        		comm.toast(decodeURIComponent(res.data.msg)) ;
		        	}
				}).catch(function(error){
		           comm.alertMsg(error);
		        });
	        }catch(e){
				comm.alertMsg(e);
			}
		},
   }
}
</script>

<style scoped>
textarea{
    width: 64%;
}
.info-box{
	border-bottom: none;
}
</style>