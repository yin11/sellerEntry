<template>
	<div>
		<!--商户基本信息-->
		<div class="info-box">
			<h4 class="fz18 title">商户基本信息</h4>
			<ul class="fz14">
				<li class="border-buttom">
					<span>商家名称：</span>
					<input type="text" placeholder="请输入商家名称 " v-model="shopName" @blur="testShopName"/>
				</li>
				<li class="border-buttom bg-arrow">
					<span>所在城市：</span>
					<input type="text" placeholder="请选择所在城市 " :data-areaCode = "areaCode"  v-model="areaName" @click="showPicker" readonly="readonly"/>
				</li>
				<li class="border-buttom">
					<span>详细地址：</span>
					<input type="text" placeholder="请输入详细地址 " v-model="unitAddress" @blur="testUnitAddress" />
					<!--<span id="select-city"  @click="showMap"></span>-->
				</li>
				<li class="border-buttom">
					<span>经营许可证编号：</span>
					<input type="text" placeholder="请输入经营许可证编号 " v-model="certificate" @blur="testCertificate" />
				</li>
				<li class="clearfix">
					<span>行业类型：</span>
					<span>{{dealCateMatchRow}}</span>
					<span class="fc-blue fl-r select" @click="getTradeType">选择</span>
				</li>
			</ul>
		</div>
		<!--掌柜信息-->
		<div class="info-box">
			<h4 class="fz18 title" >掌柜信息</h4>
			<ul class="fz14">
				<li class="border-buttom">
					<span>真实姓名：</span>
					<input type="text" placeholder="请输入法人（经营者）姓名" v-model="legalPerson" @blur="testLegalPerson"/>
				</li>
				<li class="">
					<span>手机号码：</span>
					<input type="tel" maxlength="11" placeholder="请输入法人（经营者）手机号码" v-model="legalPersonPhone" @blur="testLegalPersonPhone"/>
				</li>
			</ul>
		</div>
		<!--提现绑定账号-->
		<div class="info-box">
			<h4 class="fz18 title">提现绑定账号</h4>
			<ul class="fz14">
				<li class="border-buttom">
					<span>支付宝账户：</span>
					<input type="text" placeholder="请输入支付宝账户" @blur="testZFB" v-model="alipayAccount"/>
				</li>
				<li class="border-buttom">
					<span>支付宝账户姓名：</span>
					<input type="text" placeholder="请输入支付宝账户姓名" @blur="testZFBname" v-model="alipayAccountRealName"/>
				</li>
				<li class="">
					<span>客户经理编号：</span>
					<span v-if="readState">{{referenceUsername }}</span>
					<input type="text" placeholder="请输入客户经理编号" v-model="referenceUsername" @change="testManagerNum" v-else/>
				</li>
			</ul>
		</div>
		<!--下一步-->
		<div>
			<p style="text-align: center;"><a class="call fz11 fc-c" href="tel:4008090775">若无客户经理编号，请来电获取</a></p>
			<button type="button" class="btn bg-blue fz18"  :class=" next != '1111111111'?'btn-layer':'' " @click="sub"> 下一步</button>
			<!--<router-link to='/loginInfo' tag='button' @click.native="sub" class="btn bg-blue fz18" v-else >下一步</router-link>-->
		</div>
		<!--Popup-->
		<mt-popup v-model="popupSelect" position="bottom" >
			<ul class="type-list" >
				<Li :class=" dealCateId == item.id ? 'fc-blue' : '' " v-for="item in typeList" @click="selectTrade(item.name,item.id)">{{item.name}}</Li>
			</ul>
	    </mt-popup>
	    <!--选择省市区-->
	    <v-picker :showPickerState.sync = "showPickerState"  :areaName.sync = 'areaName'  :areaCode.sync = 'areaCode' :firstTime.sync = 'firstTime'></v-picker>
	    <!--显示地图现在地区-->
	    <mt-popup v-model="showMapState" position="bottom" >
	    	<div id="city" style="width: 100%;height: 350px;"></div>
    	</mt-popup>
    	<!--验证推荐码错误，拨打电话获取推荐码-->
    	<div v-show="confirmState">
    		<div class="v-modal" style="z-index: 2;"></div>
    		<div class="bg-f mint-msgbox" style="z-index: 3;">
    			<p class="mint-msgbox-content">拨打电话获取正确的邀请码</p>
    			<div class="flex-box mint-msgbox-btns">
    				<button type="button" class="item mint-msgbox-btn mint-msgbox-cancel " @click="hideConfirm">取消</button>
    				<a href="tel:4008090775" class="item mint-msgbox-btn mint-msgbox-confirm " style="text-align: center;">确定</a>
    			</div>
    		</div>
    	</div>
	</div>
</template>

<script>
import * as comm from '../assets/js/comm'
/*import BMap from 'BMap'*/
import picker from './picker'
export default {
	name: 'information',
	data () {
		return {
			firstTime : 0 , // 页面首次进入获取地址为0，更改城市后，选择为1
			popupSelect : false ,
     		next : '0000000000' ,
     		shopName : '' ,
     		unitAddress : '' ,
     		legalPerson : '' ,
     		legalPersonPhone : '' ,
     		areaCode : '' ,
     		certificate : '' ,
     		dealCateId : '' ,
     		dealCateMatchRow : '' ,
     		typeList :[] ,
     		showPickerState :false ,
     		areaName : '请选择地址' ,
     		lng: '' ,
     		lat: '' ,
     		showMapState : false ,
     		alipayAccount : '' ,
     		alipayAccountRealName : '' ,
     		referenceId : '' ,
     		USERINFO : {} ,
     		readState :false ,
     		referenceUsername : '' ,// 推荐人的名称
     		confirmState:false , //confirm对话框是否显示
		}
	},
	components : {
		'v-picker':picker ,
	},
	watch:{
		shopName:function(val){
			this.testShopName();
		},
		unitAddress:function(val){
			this.testUnitAddress();
		},
		legalPerson:function(){
			this.testLegalPerson();
		},
		legalPersonPhone:function(val){
			let _self  = this ;
			if(val.length == 0 || val.length == 11){
				_self.testLegalPersonPhone();
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 4);
			}
		},
		alipayAccount:function(val){
			let _self  = this ;
			if(comm.rule.empty(val,'支付宝账户不能为空') && comm.rule.testZFB(val) ){
				_self.next = comm.replaceNext(_self.next , '1' , 6);
				comm.USERINFO.alipayAccount = val ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 6);
			}
		},
		alipayAccountRealName:function(val){
			let _self  = this ;
			if(comm.rule.empty(val,'支付宝账户姓名不能为空') && comm.rule.name(val) ){
				_self.next = comm.replaceNext(_self.next , '1' , 7);
				comm.USERINFO.alipayAccountRealName = _self.alipayAccountRealName ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 7);
			}
		},
		referenceUsername:function(){
			this.testManagerNum();
		},
		areaName:function(){
			let _self  = this ;
			comm.USERINFO.areaCode = _self.areaCode ;
			_self.areaCode != '' ? _self.next = comm.replaceNext(_self.next , '1' , 1) : _self.next = comm.replaceNext(_self.next , '0' , 1);
			if(_self.firstTime == 1){
				_self.unitAddress = '' ;
				_self.lng = '' ;
     			_self.lat = '' ;
			}
		}
	},
	methods:{
		testShopName(){
			let _self  = this ;
			if(comm.rule.empty(_self.shopName,'商家名称不能为空') ){
				_self.next = comm.replaceNext(_self.next , '1' , 0);
				comm.USERINFO.shopName = _self.shopName ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 0);
			}
		},
		testUnitAddress(){
			let _self  = this ;
			if(comm.rule.empty(_self.unitAddress,'商家详细地址不能为空') ){
				_self.next = comm.replaceNext(_self.next , '1' , 2);
				//_self.getDefaultLocation();
				if(_self.unitAddress.includes("省") && _self.unitAddress.includes("市") && _self.unitAddress.includes("区")){
					comm.USERINFO.unitAddress =  _self.unitAddress ;
				}else{
					comm.USERINFO.unitAddress = _self.areaName + _self.unitAddress ;
				}
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 2);
			}
		},
		testCertificate(){ //验证经营许可证编号
			let _self  = this ;
			if(comm.rule.empty(_self.certificate,'经营许可证编号不能为空') ){
				_self.next = comm.replaceNext(_self.next , '1' , 9);
				comm.USERINFO.certificate = _self.certificate ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 9);
			}
		},
		testLegalPerson(){
			let _self  = this ;
			if(comm.rule.empty(_self.legalPerson,'法人（经营者）姓名不能为空') ){
				_self.next = comm.replaceNext(_self.next , '1' , 5);
				comm.USERINFO.legalPerson = _self.legalPerson ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 5);
			}
		},
		testLegalPersonPhone(){
			let _self  = this ;
			if(comm.rule.empty(_self.legalPersonPhone,'法人（经营者）手机号不能为空') && comm.rule.phone(_self.legalPersonPhone) ){
				_self.next = comm.replaceNext(_self.next , '1' , 4);
				comm.USERINFO.legalPersonPhone = _self.legalPersonPhone ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 4);
			}
		},
		testZFB(){//验证支付宝账户
			let _self  = this ;
			if(comm.rule.empty(_self.alipayAccount,'支付宝账户不能为空') && comm.rule.testZFB(_self.alipayAccount,'请输入正确格式的支付宝账户') ){
				_self.next = comm.replaceNext(_self.next , '1' , 6);
				comm.USERINFO.alipayAccount = _self.alipayAccount ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 6);
			}
		},
		testZFBname(){//验证支付宝账户姓名
			let _self  = this ;
			if(comm.rule.empty(_self.alipayAccountRealName,'支付宝账户姓名不能为空') && comm.rule.name(_self.alipayAccountRealName,'请输入正确的姓名') ){
				_self.next = comm.replaceNext(_self.next , '1' , 7);
				comm.USERINFO.alipayAccountRealName = _self.alipayAccountRealName ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 7);
			}
		},
		testManagerNum(){//验证客户经理编号
			let _self  = this ;
			if(comm.rule.empty(_self.referenceUsername,'邀请码不能为空') ){
				_self.next = comm.replaceNext(_self.next , '1' , 8);
				comm.USERINFO.referenceUsername = _self.referenceUsername ;
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 8);
			}
		},
		//隐藏confirm弹窗
		hideConfirm(){
			this.confirmState = false ;
		},
		//点击下一步时验证表单
		sub(){
			let _self  = this ;
			if(_self.next == '1111111111'){
				_self.getDefaultLocation(()=>{
					let _data = {
						referenceUsername : _self.referenceUsername ,
						shopName :  _self.shopName
					};
					comm.testReferee(_data).then((res)=>{
						if(res.data.state == 1){
							comm.USERINFO.referenceId  = comm.isNVL(res.data.data.referenceId , "") ;
							if(res.data.data.referenceType){
								comm.USERINFO.referenceType  =  res.data.data.referenceType ;
							}else{
								comm.USERINFO.referenceType  =  0 ;
							}
							comm.USERINFO.agentId  = comm.isNVL(res.data.data.agentId , "");
							comm.USERINFO.unitAddress = comm.USERINFO.unitAddress.replace(/请选择地址/g,"");
							comm.setStore('userinfo', comm.USERINFO);
							_self.$router.push({path:'/loginInfo'});
						}else if(res.data.state == 802905){/**商家名字已经存在请更换*/
							comm.toast(decodeURIComponent(res.data.msg));
						}else{
							_self.confirmState = true ;
							comm.toast(decodeURIComponent(res.data.msg));
						}
					});
				});
			}else{
				_self.testShopName();
				_self.testUnitAddress();
				_self.testCertificate();
				_self.testLegalPerson();
				_self.testLegalPersonPhone();
				_self.testZFB();
				_self.testZFBname();
				_self.testManagerNum();
			}
		},
		//获取行业类型
		getTradeType(){
			let _self = this ;
			comm.getTypeList().then((res) => {
       			if(res.data.state == 1){
       				_self.popupSelect = true ;
       				_self.typeList = res.data.data ;
       			}else{
					comm.toast(decodeURIComponent(res.data.msg));
				}
       		}).catch(function (error) {
			    comm.alertMsg(error);
			});
		},
		//选择行业
		selectTrade(name ,id){
			let _self = this ;
			_self.dealCateId = id ;
			_self.dealCateMatchRow = name ;
			_self.next = comm.replaceNext(_self.next , '1' , 3);
			comm.USERINFO.dealCateId = id ;
			comm.USERINFO.dealCateMatchRow = name ;
			comm.setStore('userinfo', comm.USERINFO);
			_self.popupSelect = false ;
		},
		//输入详细地址获取经纬度
       	getDefaultLocation(callback){
       		let _self = this ;
       		comm.getDefaultLocation(_self.unitAddress).then((res)=>{
				if(res.data.state == 1){
					if(res.data.data.status == 0){
						_self.lng = res.data.data.result.location.lng ;
						_self.lat = res.data.data.result.location.lat ;
						comm.USERINFO.longitude = res.data.data.result.location.lng ;
						comm.USERINFO.latitude = res.data.data.result.location.lat;
						comm.setStore('userinfo', comm.USERINFO);
						callback();
					}else{
						comm.toast(decodeURIComponent("找不到输入的地址"));
						//comm.toast(decodeURIComponent(res.data.data.msg));
					}
				}else{
					comm.toast(decodeURIComponent(res.data.msg));
				}
			}).catch(function (error) {
			    comm.alertMsg(error);
			});
       	},
		//获取当前默认定位的城市名称
		getDefaultAddress(){
			let _self = this ;
			comm.getDefaultAddress().then((res)=>{
				if(res.data.state == 1){
					let _addressComponent = res.data.data.result.addressComponent ;
					_self.areaCode = _addressComponent.adcode ;
					_self.areaName = _addressComponent.province + _addressComponent.city +_addressComponent.district ;
					_self.lng = res.data.data.result.location.lng ;
					_self.lat = res.data.data.result.location.lat ;
					_self.next = comm.replaceNext(_self.next , '1' , 1);
					_self.unitAddress = res.data.data.result.formatted_address ;
					_self.next = comm.replaceNext(_self.next , '1' , 2);
					comm.USERINFO.longitude = res.data.data.result.location.lng ;
					comm.USERINFO.latitude = res.data.data.result.location.lat;
					comm.USERINFO.areaCode = _addressComponent.adcode;
					comm.setStore('userinfo', comm.USERINFO);
				}else{
					comm.toast(decodeURIComponent(res.data.msg));
				}
			}).catch(function (error) {
			    comm.alertMsg(error);
			});
		},
		//显示填写地址显示地图（地址解析）
		showMap(){
			try{
				let _self = this ;
				_self.showMapState = true ;
				let map = new BMap.Map("city");      
				map.centerAndZoom(new BMap.Point(_self.lng,_self.lat), 22);      // 创建地址解析器实例     
				let myGeo = new BMap.Geocoder();      // 将地址解析结果显示在地图上，并调整地图视野    
				map.addControl( new BMap.NavigationControl() ); // 添加比例尺
				myGeo.getPoint( _self.areaName + _self.unitAddress  , function(point){      
				    if (point) {      
				        map.centerAndZoom(point, 22);      
				        map.addOverlay(new BMap.Marker(point));      
				    }      
				 }, 
				_self.areaName);
				map.addEventListener("click", (e)=>{
					let point = new BMap.Point(e.point.lng, e.point.lat);
					map.centerAndZoom(point, 22);
					let marker = new BMap.Marker(point);
					map.clearOverlays(); //清除其他覆盖物
					map.addOverlay(marker);
					myGeo.getLocation(e.point, function(rs){ //地址逆解析
						let addComp = rs.addressComponents;
						_self.unitAddress = addComp.district + addComp.street + addComp.streetNumber ;
						_self.areaName  = addComp.province + addComp.city + addComp.district;
						_self.next = comm.replaceNext(_self.next , '1' , 2);
						comm.USERINFO.unitAddress = _self.areaName  + addComp.street + addComp.streetNumber ;
						comm.setStore('userinfo', comm.USERINFO);
					});      
				});
			}catch(e){
				comm.alertMsg(e);
			}
		},
		//显示三级联动的弹出框
		showPicker(){
       		this.showPickerState = true ;
       	},
       	//通过接口获取返回的商家信息
       	getApplyDetail(){
       		let _self = this ;
       		let _data = {shopApplyId : comm.getQueryString('shopApplyId')} ;
       		comm.getApplyDetail(_data).then((res)=>{
       			if(res.data.state == 1){
       				let _json = res.data.data ;
       				_json.referenceUsername = comm.isNVL(res.data.referenceUsername, '000000') ;//从回填接口回去客户经理编号，若没有编号，则默认000000
       				_self.readState = true ;
       				_self.assignment(_json);
				}else{
					comm.toast(decodeURIComponent(res.data.msg));
				}
       		});
       	},
       	//将缓存的数据赋值给各个表单
       	assignment(_json){
       		let _self = this ;
       		_self.shopName = comm.isNVL(_json.shopName , '');
       		_self.certificate = comm.isNVL(_json.certificate , '');
			_self.unitAddress = comm.isNVL(_json.unitAddress , '');
			_self.legalPerson  = comm.isNVL(_json.legalPerson  , '');
			_self.legalPersonPhone  = comm.isNVL(_json.legalPersonPhone  , '');
			_self.certificate  = comm.isNVL(_json.certificate  , '');
			_self.dealCateId  = comm.isNVL(_json.dealCateId  , '');
			_self.dealCateMatchRow  = comm.isNVL(_json.dealCateMatchRow  , '');
			_self.alipayAccount  = comm.isNVL(_json.alipayAccount  , '');
			_self.alipayAccountRealName  = comm.isNVL(_json.alipayAccountRealName , '');
			//_self.referenceId  = comm.isNVL(_json.referenceId  , '') ;
			_self.referenceUsername  = comm.isNVL(_json.referenceUsername , '') ;
			//_self.readState = true ;
			comm.USERINFO.areaCode = comm.isNVL(_json.areaCode  , '') ;
			comm.USERINFO.dealCateMatchRow = comm.isNVL(_json.dealCateMatchRow  , '') ;
			comm.USERINFO.dealCateId = comm.isNVL(_json.dealCateId  , '') ;
			//comm.USERINFO.referenceType = comm.isNVL(_json.referenceType  , '') ;
			//comm.USERINFO.agentId = comm.isNVL(_json.agentId , '') ;
			_self.next = '1111111111' ;
			comm.setStore('RETURNUSERINFO', _json);
       	},
	},
	created:function(){
		let _self = this ;
		let _url = window.location.href ;
		if(comm.getQueryString('shopApplyId') && !_url.endsWith("aptitude")){ // app登录进去，此时审核未通过
			return ;
		}else{//页面初次进入，或者app未付款再次进入页面获取缓存填充
			//_self.getDefaultAddress();
			if(comm.getQueryString('username')){
				_self.readState = true ;
			}
		}
		
	},
	mounted(){
		window.ZSTGetInformation = comm.ZSTGetInformation;
		window.ZSTObtainLocation = comm.ZSTObtainLocation;
		comm.noRefresh();
		comm.noShare();
		let _self = this ;
		let _url = window.location.href ;
		if(comm.getQueryString('shopApplyId') ){ // app登录进去，此时审核未通过 && !_url.endsWith("aptitude")
			_self.getApplyDetail();
		}else{//页面初次进入，或者app未付款再次进入页面获取缓存填充
			//comm.getLocation(); //通知app传递定位信息
			let _setTime = setInterval(function(){ //定时获取app是否传入缓存的商家信息，若有，赋值之后清除定时器
				if(comm.getStore('CACHEUSERINFO')){ //判断缓存是否有商家信息
					let _data = JSON.parse( comm.getStore('CACHEUSERINFO') ) ;
					_self.assignment(_data);
					//_self.referenceUsername = comm.isNVL(comm.getQueryString('username') , '') ;
					//comm.USERINFO.referenceId  = comm.isNVL(comm.getQueryString('referenceId') , '') ;
					//comm.USERINFO.referenceType  = comm.isNVL(comm.getQueryString('referenceType') , '') ;
					//comm.USERINFO.agentId  = comm.isNVL(comm.getQueryString('agentId') , '') ;
					//alert('清除定时器')
					clearInterval(_setTime)
				}
			},500);
			/*let _setTimeLocation = setInterval(function(){ //定时获取app是否传入当前定位信息，若有，赋值之后清除定时器
				if(comm.getStore('LOCATION')){ //判断缓存是否有定位信息
					let _data = JSON.parse( comm.getStore('LOCATION') ) ;
					_self.areaCode = _data.areaCode ;
					_self.areaName = _data.areaName ;
					_self.unitAddress = _data.unitAddress ;
					comm.USERINFO.longitude = _data.longitude ;
					comm.USERINFO.latitude = _data.latitude ;
					alert('清除定时器2')
					clearInterval(_setTimeLocation)
				}
			},500);*/
			let _json = comm.USERINFO ;
			if(JSON.stringify(_json) != '{}'){ //页面输入信息，点击返回时将页面内容回填
				const list = Object.keys(_json).map((item, index) => ({key: item, value:_json[item]})) ;
				if(list.length >= 14){
					_self.shopName = comm.isNVL(_json.shopName , '');
					_self.unitAddress = comm.isNVL(_json.unitAddress , '');
					_self.legalPerson  = comm.isNVL(_json.legalPerson  , '');
					_self.legalPersonPhone  = comm.isNVL(_json.legalPersonPhone  , '');
					_self.certificate  = comm.isNVL(_json.certificate  , '');
					_self.dealCateId  = comm.isNVL(_json.dealCateId  , '');
					_self.dealCateMatchRow  = comm.isNVL(_json.dealCateMatchRow  , '');
					_self.alipayAccount  = comm.isNVL(_json.alipayAccount  , '');
					_self.alipayAccountRealName  = comm.isNVL(_json.alipayAccountRealName , '');
					//_self.referenceId  = comm.isNVL(_json.referenceId  , '') ;
					_self.next = '1111111111' ;
				}
			}
			_self.referenceUsername = comm.isNVL(comm.getQueryString('username') , '') ;
			//comm.USERINFO.referenceId  = comm.isNVL(comm.getQueryString('referenceId') , '') ;
			//comm.USERINFO.referenceType  = comm.isNVL(comm.getQueryString('referenceType') , '') ;
			//comm.USERINFO.agentId  = comm.isNVL(comm.getQueryString('agentId') , '') ;
		}
		comm.setStore('userinfo', comm.USERINFO);
	}
}	
</script>

<style scoped>
	.call{
	    display: inline-block;
    	background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAAAPFBMVEUAAAAAk/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/0Ak/3PN+y1AAAAE3RSTlMA59qluTMVCZBf882bcECBVUsgXohDyAAAALlJREFUOMuNlFcShDAMQ9MgkELz/e+6DdCwIE/e9xtHEysxH2L11egsVkRyrymDfLGKNMqOo0pMcuBpGAEdTQMG4hQBgTi1wel4HpBPZSIGDkudoUTcDscjMGVDHE7YA8WGQVltR0vshIVRVtmZFam0SK5B6tOtRNr+y1H0kP3fDifUKOItlJ5IdsFzsev1OHtazsnJeA2e5YlbT6gDKnfA5KgDYhFA/4EVo5T/ZLZQNkOIo/8NC+8pLxbqHVJC+uB+AAAAAElFTkSuQmCC) no-repeat right center;
		padding-right: 30px;
		background-size: auto 100%; 
	    margin-top: 10px;
	}
	.bg-address{
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAuCAMAAAB6WzuLAAAAOVBMVEUAAAAlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6OKCBbbAAAAEnRSTlMA8uEqFwtwPrTDf0zQo5mOY1dEgMfpAAABBElEQVQ4y4XTW5KFIAwE0A4vRXxg9r/YqRqnIDHCnO9UX5O+QAplO9f13ErAp5gyNzlFGNWxQglayGzsHsJC/IGKmOCBNuN5aMHD8RA9ExtPnL/L8JQHcLJCxMoKRFL38jH65FgIKNzl8NfFyl3FxY1Ds3NzIOsj2FPtcDrExhBIJArn58gFYRMjTl6gO8RIfvVhettlQ6lP3LIlr/t4BOKmyEim+5kopP8OSZVWl6Wu/Oh7Es8E9JjOhMxjIvBPzNbvNOBM9cZiGulsa5GGC8+f7A3lmPzMcCuKePF2GyOZy1uZhR2fnPkQw5sPsappz7rMo7Ny73ckOmYKmAr9qQzdFS8/K4Q+KmE0sU4AAAAASUVORK5CYII=) no-repeat right 25px center;
		background-size: auto 23px; 
	}
	.bg-arrow{
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAJ1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADdEvm1AAAADHRSTlMA8DCgENBgwLCQcCA4rAWlAAAAXklEQVQ4y2MYZoClCIcE+0EF7BJMMkI4tCiOaqGWFo4zBdglbI46YBVnPhOCQ8Nh7OIeZwywJ4gYHBpccWo4hV3D1jMJOILjGI7QwKlBjLTgY8MV4MxQDZhgEsPwBAB6Yhoo4B/IgwAAAABJRU5ErkJggg==) no-repeat right 20px center;
		background-size: auto 23px; 
	}
	.select{
		padding: 0px 25px;
	}
	.type-list{
		 width: 100%;
	    height: 280px;
	    overflow-y: auto;
	}
	.type-list li{
		height: 35px;
		line-height: 35px;
		text-align: center;
	}
	#city{
		display: inline-block;
	}
	#select-city{
	    display: block;
	    width: 29px;
	    height: 40px;
	    position: absolute;
	    right: 20px;
	    top: 10px;
	    opacity: 0.2;
	}
</style>