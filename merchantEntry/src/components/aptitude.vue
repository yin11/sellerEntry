<template>
	<div>
		<div class="photo-box">
			<p class="fz11 mandatory">必填选项</p>
			<div class="clearfix">
				<div class="fl-l">
					<div class="border" style="width: 200px;">
						<input type="file" accept="image/*" class="btn-file" @change="license" id="license" />
						<img :src="licenseImg" width="100%" v-if="licenseImg != '' "/>
						<button type="button" class="add-btn" v-else></button>
					</div>
					<p class="fz14">上传营业执照</p>
				</div>
				<div class="fl-r">
					<div class="border">
						<input type="file" accept="image/*" class="btn-file" @change="store" id="store" />
						<img :src="storeImg" width="100%" v-if="storeImg != '' "/>
						<button type="button" class="add-btn" v-else></button>
					</div>
					<p class="fz14">上传门店照片</p>
				</div>
			</div>
		</div>
		<div class="photo-box">
			<p class="fz11 mandatory">必填选项</p>
			<div class="clearfix">
				<div class="fl-l">
					<div class="border">
						<input type="file" accept="image/*" class="btn-file" @change="logo" id="logo" />
						<img :src="logoImg" width="100%" v-if="logoImg != '' "/>
						<button class="add-btn" type="button"></button>
					</div>
					<p class="fz14">上传商户LOGO</p>
				</div>
				<div class="fl-r">
					<div class="border">
						<input type="file" accept="image/*" class="btn-file" @change="ambient" id="ambient" />
						<img :src="ambientImg" width="100%" v-if="ambientImg != '' "/>
						<button class="add-btn" type="button"></button>
					</div>
					<p class="fz14">上传门店环境照片</p>
				</div>
			</div>
		</div>
		<!--按钮-->
		<div class="btn-box">
			<button type="button" class="btn bg-blue btn-layer" v-if=" next != '1111'">确认提交</button>
			<button type="button" class="btn bg-blue " @click="subFormate" :disabled="disabled" v-else>确认提交</button>
		</div>
		<!--<div class="btn-box clearfix" v-if=" next != '1111'">
			<button type="button" class="btn bg-green fl-l btn-layer"  >预览</button>
			<button type="button" class="btn bg-blue fl-r btn-layer" >确认提交</button>
		</div>
		<div class="btn-box clearfix" v-else>
			<router-link to='/preview' tag='button' class="btn bg-green fl-l "  >预览</router-link>
			<button type="button" class="btn bg-blue fl-r" @click="subFormate" :disabled="disabled">确认提交</button>
		</div>-->
		<!--图片裁剪-->
		<div v-if="example2.img != '' " class="cut-box">
			<VueCropper
				ref="cropper2"
				:img="example2.img"
				:outputSize="example2.size"
				:outputType="example2.outputType"
				:info="example2.info"
				:canScale="example2.canScale"
				:autoCrop="example2.autoCrop"
				:autoCropWidth="example2.autoCropWidth"
				:autoCropHeight="example2.autoCropHeight"
				:fixed="example2.fixed"
				:fixedNumber="example2.fixedNumber"
			></VueCropper>
			<div class="btn-box clearfix clip-btn-box">
				<button type="button" class="btn fl-l bg-blue" @click="finish('blob')">确定</button>
				<button type="button" class="btn fl-r bg-c" @click="cancelCropper">取消</button>
			</div>
		</div>
		<!--提交成功确认弹窗-->
		<div v-show="subState">
			<div class="mask"></div>
			<div class="alert-box bg-f">
				<button type="button" class="close-btn" @click="hideAlert"></button>
				<img src="../assets/img/bg.png" width="100%"/>
				<p class="fc-blue fz18">图片上传成功</p>
				<p class="fz14">审核将在7个工作日内短信通知您结果</p>
				<button type="button" class="bg-blue btn fz18" @click="goUrl">确定</button>
				<!--<router-link to='/' tag='button' class="bg-blue btn fz18" @click.native = 'clear'>确定</router-link>-->
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
import VueCropper from './VueCropper'
import axios from 'axios'; 
import md5 from 'js-md5';
export default {
	name: 'aptitude',
	data () {
		return {
			next : '0000',
     		licenseImg :'' ,
     		storeImg : '' ,
     		logoImg : '' ,
     		ambientImg : '' ,
     		typeId : 0 ,
     		subState :false ,
     		licenseData : {} ,
     		storeData : {} ,
     		logoData : {} ,
     		disabled : false ,
     		subErrorState : false ,
     		subErrorMsg : '',
     		example2: {
				img: '',
				info: true,
				size: .5,
				outputType: 'jpeg',
				canScale: false,
				autoCrop: true,
				// 只有自动截图开启 宽度高度才生效
				autoCropWidth: 200,
				autoCropHeight: 200,
				// 开启宽度和高度比例
				fixed: true,
				fixedNumber: [1, 1]
			}
		}
	},
	methods:{
		addPic(e){
			if (typeof FileReader === 'undefined') {
			    comm.toast('你的浏览器不支持上传图片哟！');
			    return false ;
			}
			var files = e.target.files || e.dataTransfer.files;
			if(files.length > 0){
			    imgResize(file[0], callback);
			}
		},
		license(e){
			try{
				let _self = this ;
				let file = document.getElementById('license').files[0];//创建用来读取此文件的对象
				//if(_self.verificationPicFile(file)){
					//let reader = new FileReader();//使用该对象读取file文件
				    //let URL = window.URL || window.webkitURL;
				    //let imgURL = URL.createObjectURL(file);
				    _self.typeId = 1 ;
				    //_self.licenseImg = imgURL ;
				    //_self.example2.img = imgURL ;
				    _self.verificationPicFile(file,function(ImgUrl){
				    	_self.example2.img = ImgUrl ;
					    _self.licenseImg =  ImgUrl ; 
					    _self.example2.autoCropWidth = 200 ;
					    _self.example2.autoCropHeight = 140 ;
					    _self.example2.fixedNumber = [10,7] ;
				    });
				    //console.log(_imgurl)
				    
				//}
			}catch(e){
				comm.alertMsg(e);
			}
		},
		goUrl(){
			this.clear();
			comm.goUrl();
		},
		store(){
			try{
				let _self = this ;
				let storefile = document.getElementById('store').files[0];//创建用来读取此文件的对象
				_self.typeId = 2 ;
				_self.verificationPicFile(storefile,function(ImgUrl){
			    	_self.example2.img = ImgUrl ;
				    _self.storeImg =  ImgUrl ; 
				    _self.example2.autoCropWidth = 200 ;
				    _self.example2.autoCropHeight = 200 ;
				    _self.example2.fixedNumber = [1,1] ;
			    });
				/*if(_self.verificationPicFile(storefile.size)){
					let storereader = new FileReader();//使用该对象读取file文件
				    let URL = window.URL || window.webkitURL;
				    let imgURL = URL.createObjectURL(storefile);
				    _self.typeId = 2 ;
				    //_self.storeImg = imgURL ;
				     _self.example2.img = imgURL ;
				    // _self.example2.autoCropWidth = 300 ;
				    //_self.example2.autoCropHeight = 300 ;
				    //_self.example2.fixedNumber = [1,1] ;
				}*/
			}catch(e){
				comm.alertMsg(e);
			}
		},
		logo(){
			try{
				let _self = this ;
				let logofile = document.getElementById('logo').files[0];//创建用来读取此文件的对象
				_self.typeId = 3 ;
				_self.verificationPicFile(logofile,function(ImgUrl){
			    	_self.example2.img = ImgUrl ;
				    _self.logoImg =  ImgUrl ; 
				    _self.example2.autoCropWidth = 200 ;
				    _self.example2.autoCropHeight = 200 ;
				    _self.example2.fixedNumber = [1,1] ;
			    });
				/*if(_self.verificationPicFile(logofile.size)){
					let logoreader = new FileReader();//使用该对象读取file文件
				    let URL = window.URL || window.webkitURL;
				    let imgURL = URL.createObjectURL(logofile);
				    _self.typeId = 3 ;
		//		    _self.logoImg = imgURL ;
				    _self.example2.img = imgURL ;
	//			    _self.example2.autoCropWidth = 300 ;
	//			    _self.example2.autoCropHeight = 300 ;
	//			    _self.example2.fixedNumber = [1,1] ;
				}*/
			}catch(e){
				comm.alertMsg(e);
			}
		},
		ambient(){
			try{
				let _self = this ;
				let logofile = document.getElementById('ambient').files[0];//创建用来读取此文件的对象
				_self.typeId = 4 ;
				_self.verificationPicFile(logofile,function(ImgUrl){
			    	_self.example2.img = ImgUrl ;
				    _self.ambientImg =  ImgUrl ; 
				    _self.example2.autoCropWidth = 200 ;
				    _self.example2.autoCropHeight = 200 ;
				    _self.example2.fixedNumber = [1,1] ;
			    });
				/*if(comm.verificationPicFile(logofile.size)){
					let logoreader = new FileReader();//使用该对象读取file文件
				    let URL = window.URL || window.webkitURL;
				    let imgURL = URL.createObjectURL(logofile);
				    _self.typeId = 4 ;
		//		    _self.ambientImg = imgURL ;
				    _self.example2.img = imgURL ;
	//			    _self.example2.autoCropWidth = 300 ;
	//			    _self.example2.autoCropHeight = 300 ;
	//			    _self.example2.fixedNumber = [1,1] ;
				}*/
			}catch(e){
				comm.alertMsg(e);
			}
		},
		//取消裁剪
		cancelCropper(){
			this.example2.img = '' ;
			if(this.typeId == 1 ){
				document.getElementById('license').value = '' ;
			}else if(this.typeId == 2 ){
				document.getElementById('store').value = '' ;
			}else if(this.typeId == 3 ){
				document.getElementById('logo').value = '' ;
			}else if(this.typeId == 4 ){
				document.getElementById('ambient').value = '' ;
			}
		},
		//点击确定裁剪图片
		finish (type) {
			try{
				let _self = this ;
				if (type === 'blob') {
					this.$refs.cropper2.getCropBlob((data) => {
						//var test = window.open('')
						if(_self.typeId == 1 ){
							_self.licenseData = data ;
							comm.readBlobAsDataURL(data, function (dataurl){
							    comm.IMGFORMDATA.licensePhoto = dataurl ;
							});
							_self.licenseImg = window.URL.createObjectURL(data) ;
							comm.USERINFO.licensePhoto = window.URL.createObjectURL(data)  ;
							comm.setStore('userinfo', comm.USERINFO);
							_self.next = comm.replaceNext(_self.next , '1' , 0);
						}else if(_self.typeId == 2 ){
							_self.storeData = data ;
							comm.readBlobAsDataURL(data, function (dataurl){
							    comm.IMGFORMDATA.storeImgs_1 = dataurl ;
							});
							_self.storeImg = window.URL.createObjectURL(data) ;
							comm.USERINFO.storeImgs_1 = window.URL.createObjectURL(data)  ;
							comm.setStore('userinfo', comm.USERINFO);
							_self.next = comm.replaceNext(_self.next , '1' , 1);
						}else if(_self.typeId == 3 ){
							_self.logoData = data ;
							comm.readBlobAsDataURL(data, function (dataurl){
							    comm.IMGFORMDATA.supplierLogo = dataurl ;
							});
							_self.logoImg = window.URL.createObjectURL(data) ;
							comm.USERINFO.supplierLogo = window.URL.createObjectURL(data)  ;
							comm.setStore('userinfo', comm.USERINFO);
							_self.next = comm.replaceNext(_self.next , '1' , 2);
						}else if(_self.typeId == 4 ){
							_self.ambientData = data ;
							comm.readBlobAsDataURL(data, function (dataurl){
							    comm.IMGFORMDATA.storeImgs_2 = dataurl ;
							});
							_self.ambientImg = window.URL.createObjectURL(data) ;
							comm.USERINFO.storeImgs_2 = window.URL.createObjectURL(data)  ;
							comm.setStore('userinfo', comm.USERINFO);
							_self.next = comm.replaceNext(_self.next , '1' , 3);
						}
						_self.example2.img = '' ;
						_self.typeId = 0 ;
					})
				} else {
					this.$refs.cropper2.getCropData((data) => {
						test.location.href = data
					})
				}
			}catch(e){
				comm.alertMsg(e);
			}
		},
		//提交图片信息
		subFormate(){
			try{
				let _self = this ;
				let _formate = new FormData();
				_formate.append('licensePhoto',_self.licenseData);
				_formate.append('storeImgs_1',_self.storeData);
				_formate.append('storeImgs_2',_self.ambientData);
				_formate.append('supplierLogo',_self.logoData);
				//_formate.append('token',comm.TOKEN);
				let _shopApplyId = comm.isNVL(comm.getQueryString('shopApplyId') , '');
				if(_shopApplyId != '' ){ //可从地址栏获取shopApplyId
					_shopApplyId = _shopApplyId ;
				}else{  //路由跳转带参数shopApplyId
					_shopApplyId = _self.$route.query.shopApplyId ;
				}
				_formate.append('shopApplyId', _shopApplyId);
				let _sec = md5(comm.asciiSort({shopApplyId:_shopApplyId})) ;
				axios.post( '/sapi/upload/shop/images',
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
		          		_self.disabled = false ;
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
			}catch(e){
				comm.alertMsg(e);
			}
		},
		//提交商家信息
		/*subFormate(){
			try{
				let _self = this ;
				_self.disabled = true ;
				let _formate = new FormData();
				let _data = JSON.parse( comm.getStore('userinfo') ) ;
				delete _data.licensePhoto;
				delete _data.storeImgs_1;
				delete _data.storeImgs_2;
				delete _data.supplierLogo;
				let _sec = md5(comm.asciiSort(_data)) ;
				const list = Object.keys(_data).map((item, index) => ({key: item, value:_data[item]}))
				list.forEach((i)=>{
					_formate.append(i.key,i.value);
				})
				_formate.append('licensePhoto',_self.licenseData);
				_formate.append('storeImgs_1',_self.storeData);
				_formate.append('storeImgs_2',_self.ambientData);
				_formate.append('supplierLogo',_self.logoData);
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
		          		_self.disabled = false ;
		          		//_self.clear();
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
	        }catch(e){
				comm.alertMsg(e);
			}
		},*/
		//提交成功后清除缓存
		clear(){
			comm.removeStore('userinfo');
			delete comm.IMGFORMDATA.licensePhoto;
			delete comm.IMGFORMDATA.storeImgs_1;
			delete comm.IMGFORMDATA.storeImgs_2;
			delete comm.IMGFORMDATA.supplierLogo;
			comm.goUrl();
		},
		hideAlert(){
			this.subState = false ;
		},
		hideErrorAlert(){
			this.subErrorState = false ;
		},
		//判断上传的图片是否超过2M
		verificationPicFile(fileObj , callback){
			try{
				let _self = this ;
			    let fileMaxSize = 2048;//2M
			    let _size = fileObj.size / 1024;
			    let ImgUrl = '' ;
			    let reader = new FileReader();
			    if (_size > fileMaxSize) {
			        comm.toast("文件大小大于2M，请耐心等待");
			        reader.readAsDataURL(fileObj);
			        reader.onload=function(){
			        	var re = this.result;
			        	_self.canvasDataURL(re,{quality: 0.2},function(base64Codes){
		                	if( base64Codes.length / 1024 > 150 ){
		                		let _file = _self.dataURLtoFile(base64Codes , 'file');
		                		_self.verificationPicFile(_file , callback);
		                	}else{
		                		ImgUrl = base64Codes ;
		                		callback(ImgUrl);
		                	}
		               });
			        }
			    }else if (_size <= 0) {
			        comm.toast("文件大小不能为0M！");
			        return false;
			    }else{
			    	let URL = window.URL || window.webkitURL;
				    let imgURL = URL.createObjectURL(fileObj);
				    ImgUrl = imgURL ;
				    callback(ImgUrl);
				    /*_self.licenseImg = imgURL ;
				    _self.example2.img = imgURL ;*/
			    	//return true;
			    }
			    //return ImgUrl ;
		    }catch(e){
				comm.alertMsg(e)
			}
		},
		//将图片压缩成base64
		canvasDataURL(path, obj, callback){
			try{
				let img = new Image();
			    img.src = path;
			    img.onload = function(){
			        let that = this;
			        // 默认按比例压缩
			        let w = that.width,
			            h = that.height,
			            scale = w / h;
			        w = obj.width || w;
			        h = obj.height || (w / scale);
			        let quality = 0.7;  // 默认图片质量为0.7
			        //生成canvas
			        let canvas = document.createElement('canvas');
			        let ctx = canvas.getContext('2d');
			        // 创建属性节点
			        let anw = document.createAttribute("width");
			        anw.nodeValue = w;
			        let anh = document.createAttribute("height");
			        anh.nodeValue = h;
			        canvas.setAttributeNode(anw);
			        canvas.setAttributeNode(anh);
			        ctx.drawImage(that, 0, 0, w, h);
			        // 图像质量
			        if(obj.quality && obj.quality <= 1 && obj.quality > 0){
			            quality = obj.quality;
			        }
			        // quality值越小，所绘制出的图像越模糊
			        var base64 = canvas.toDataURL('image/jpeg', quality);
			        // 回调函数返回base64的值
			        callback(base64);
			    }
			}catch(e){
				comm.alertMsg(e);
			}
		},
		//dataURL转换为File对象
		dataURLtoFile(dataurl, filename) {
			try{
			    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			    while(n--){
			        u8arr[n] = bstr.charCodeAt(n);
			    }
			    return new File([u8arr], filename, {type:mime});
		    }catch(e){
				comm.alertMsg(e);
			}
		}
	},
	components: {
    	VueCropper
	},
	created:function(){
		try{
			let _json = JSON.parse( comm.getStore('userinfo') )  ;
			if(_json){
				const list = Object.keys(_json).map((item, index) => ({key: item, value:_json[item]})) ;
				if(list.length == 20){
					this.licenseImg = comm.isNVL(_json.licensePhoto , '');
					this.storeImg = comm.isNVL(_json.storeImgs_1 , '');
					this.logoImg  = comm.isNVL(_json.supplierLogo  , '');
					this.ambientImg  = comm.isNVL(_json.storeImgs_2 , '');
					this.licenseData = comm.dataURLtoBlob(comm.IMGFORMDATA.licensePhoto) ;
					this.storeData = comm.dataURLtoBlob(comm.IMGFORMDATA.storeImgs_1) ;
					this.ambientData = comm.dataURLtoBlob(comm.IMGFORMDATA.storeImgs_2) ;
					this.logoData = comm.dataURLtoBlob(comm.IMGFORMDATA.supplierLogo) ;
					this.next = '1111' ;
				}
			}
		}catch(e){
			comm.alertMsg(e);
		}
	},
	mounted(){
		window.ZSTObtainParameter = comm.ZSTObtainParameter;
		comm.noRefresh();
		comm.noShare();
	}
}	
</script>

<style scoped>
	.photo-box{
		padding: 0 10px;
	}
	.mandatory{
		padding: 7px 0 7px 21px;
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWBAMAAAA2mnEIAAAAMFBMVEUAAAD/TgD/TgD/TgD/TgD/TgD/TgD/TgD/TgD/TgD/TgD/TgD/TgD/TgD/TgD/TgDHhvrjAAAAD3RSTlMAd90iqlVE7sy7iDMRZplUILMFAAAAmklEQVQY02MAAbb/D0AUlL0Azub+LwBnM+NgM/y/gME+JAxiBzAwME5kiP/feIBBP4Hhyv8vDP7///8U0E99////dwZWkf8QoAg2S1D///+FG6DGcPz/DTdyfeWnA1Am63/hegco2/wHw/2PUHb/ZwbO/xC9XP8FgK7TAbPjPwEJ+S9gB9eDDGQCO5sR7EG2/w0giUyw2Q8ZGACpST8FAl7DnAAAAABJRU5ErkJggg==) no-repeat 4px center;
		background-size: auto 12px; 
	}
	.border{
		border: 1px solid #d7dbe6;
		height: 140px;
		width: 140px;
		position: relative;
		overflow: hidden;
	}
	.add-btn{
		width: 100%;
		height: 100%;
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA9BAMAAADsTHzaAAAAG1BMVEUAAACapMGapMGapMGapMGapMGapMGapMGapMGICMXtAAAACXRSTlMAgD9wKGB4HlfEbZenAAAARUlEQVQ4y2NABW1pSQz4QKCg0Kj8qPyoPNHyLC7IwFBQAoXvwFAoiA8I0Fy+2BgZJAqKofANBjz8RuVH5UeOvJOSOqoAAElCMXXlfNG7AAAAAElFTkSuQmCC) no-repeat center;
	}
	.photo-box .fz14{
		text-align: center;
		line-height: 30px;
		margin-bottom: 20px;
	}
	.btn-box{
		background: #fafafa;
		padding: 31px 27px 25px 27px;
	}
	.clip-btn-box button{
		width: 149px;
	}
	.btn-file{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
    	top: 0;
    	opacity: 0;
	}
	/*裁剪*/
	.cut-box{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 5;
	}
	.cut-box .btn-box{
		position: fixed;
	    bottom: -25px;
	    background: transparent;
	    box-sizing: border-box;
	    width: 100%;
	}
</style>