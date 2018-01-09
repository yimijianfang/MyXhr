//MyXhr对象
var MyXhr = function(config){
	this.config = config;
	var that = this;
	//默认配置项
	defaultConfig = {
		"options":{
				"url"    : "",//请求地址
				"method" : "post",//get||post
				"async"  : true,//异步
				"data"   : [],//post请求数据
				"timeout": 5000//超时时间
			},
		"success":function(){

		},
		"error":function(){
			
		}
	};
	//合并配置项
	var mergeConfig = this.config = this.extend(this.config, defaultConfig);
	var xhr = this.createXhr();
	
	//处理逻辑
	var postData = null;
	var url = mergeConfig.options.url;
	if(mergeConfig.options.method == "post"){
		//post 用formate传值，省去加header
		postData = mergeConfig.options.data;
		var formData = new FormData();
		for(var item in postData){
			formData.append(item, postData[item]);
		}
		postData = formData;
	}else{
		//get方式用参数名和参数值用encodeURIComponent()编码
		url = this.dealUrl(url);
	}
	xhr.open(mergeConfig.options.method, url, mergeConfig.options.async);
	
	xhr.onreadystatechange = function(){
		//监听状态 0=>为初始化 1=>启动 2=>发送 3=>接受 4=>完成
		if(xhr.readyState == 4){
			if((xhr.status>=200 && xhr.status<300) || xhr.status==304){
				that.config.success(xhr.responseText);
			}else{
				that.config.error()+xhr.status;
			}
		}
	};
	xhr.send(postData);

	

	//超时报错
	xhr.ontimeout = function(){
		throw new Error("connect timeout");
	}
}

/**以下为公共方法**/
//extend方法，与$.extend()相同
MyXhr.prototype.extend = function (p1, p2){
		var p = (function loop(p1, p2){
			var p = {};//返回值
			for(var item in p2){
				//如果是对象再次递归调用函数
				if(typeof p2[item]==='object'){
					p[item] = loop(p1[item], p2[item]);
				}else{
					/**自定义配置项覆盖默认配置**/
					if((typeof p1)!='undefined' && (typeof p1[item])!='undefined' && p1[item]){
						p[item] = p1[item];
					}else{
						p[item] = p2[item];										
					}
				}
			}
			return p;
		})(p1,p2);
		return p;
};

//创建xhr
/**支持XHR对象和ActiveX对象**/
MyXhr.prototype.createXhr = function(){
	if(typeof XMLHttpRequest != "undefined"){
		return new XMLHttpRequest();
	}else if(typeof ActiveXObject != "undefined"){
		if(typeof arguments.callee.activeXString != "string"){
			var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
			var i, len;
			for(i = o,len=versions.length; i<len; i++){
				try{
					new ActiveXObject(version[i]);
					arguments.callee.activeXString = version[i];
					break;
				}catch(ex){
					//跳过
				}
			}
		}
		return new ActiveXObject(arguments.callee.activeXString);
	}else{
		throw new Error("NO XHR object available");
	}
}

//处理url
MyXhr.prototype.dealUrl = function(url){
	var index = url.indexOf('?');
	if(index == -1){
		return url;
	}
	var domain = url.substring(0, index);
	var pars = url.slice(index+1);
	var arrs = pars.split('&');
	var newurl = domain;
	for(var item in arrs){
		var arr = arrs[item].split("=");
		var split = "&";
		if(item == 0){
			split = "?";
		}
		newurl += (split + encodeURIComponent(arr[0]) + "=" + encodeURIComponent(arr[1]));
	}
	return newurl;

}
