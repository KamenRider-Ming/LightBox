/*
	class = "js-lightbox-container"//默认类名
	src="" 图片地址
	data-source="" 图片地址
	data-group = ""进行分组
	data-title=""标题
	data-content=""内容
	调用方式:
	new OpenListBox()//默认
	new OpenListBox({containerClassName:"你要进行LightBox的图片类名"});
	Version : 1.0
	Author : 2486
 */

(function($){
	var OpenLightBox = function(options){
		var self = this;
		this.defaults = {//设置默认类名
			containerClassName : ".js-lightbox-container"
		}
		this.SucCodes = false;
		this.Myoptions = $.extend({}, self.defaults, options);
		this.popupMask = $('<div id = "g-lightbox-mask">');
		this.popupWin = $('<div id = "g-lightbox-view-pop-up">');
		this.bodyNode = $(document.body);
		this.LoadLightBoxCodes();
		this.popupView = this.popupWin.find("div.lightbox-pic-view");
		this.popupViewPic = this.popupView.find("img.lightbox-img");
		this.popupViewNextBtn = this.popupView.find("span.lightbox-next-btn");
		this.popupViewPrevBtn = this.popupView.find("span.lightbox-prev-btn");
		this.popupCaption = this.popupWin.find("div.lightbox-pic-caption");
		this.popupCaptionTitle = this.popupCaption.find("p.lightbox-caption-title");
		this.popupCaptoinContent = this.popupCaption.find("p.lightbox-caption-content");
		this.popupCaptionCloseBtn = this.popupCaption.find("span.lightbox-close-btn");
		this.popupCaptionHeight = 0;

		self.ResetCaption();
		

		//通过body绑定click事件
		
		this.groupName = null;
		this.groupData = [];
		this.bodyNode.delegate(this.Myoptions.containerClassName, "click", function(e){
				e.stopPropagation();//阻止向上传播

				//先确保图片是否加载成功
				//然后就控制图片的大小
				var curgroupName = $(this).attr("data-group");
				if(self.groupName != curgroupName){//重新更新组内数据
					self.groupName = curgroupName;
					self.getGroup();
				}
				self.ShowPic($(this));
				self.getIndexOf($(this));
				self.isAdjust = true;
		});

		this.popupMask.click(function(){
			self.popupMask.hide();
			self.popupWin.hide();
			self.popupViewPic.hide();
			self.ResetCaption();
			self.isAdjust = false;
		});

		this.popupCaptionCloseBtn.click(function(){
			self.popupMask.hide();
			self.popupWin.hide();
			self.popupViewPic.hide();
			self.ResetCaption();
			self.isAdjust = false;
		});

		this.popupViewPrevBtn.hover(function(){
			if(self.index != 0 && self.groupData.length > 1)
				$(this).addClass("lightbox-prev-btn-show");
		}, function(){
			$(this).removeClass("lightbox-prev-btn-show");
		});

		this.popupViewNextBtn.hover(function(){
			if(self.index != self.groupData.length - 1  && self.groupData.length > 1)
				$(this).addClass("lightbox-next-btn-show");
		}, function(){
			$(this).removeClass("lightbox-next-btn-show");
		});

		this.index = 0;
		this.popupViewNextBtn.click(function(){
			if(self.index != self.groupData.length - 1){
				self.ResetCaption();
				self.index ++;
				$(this).removeClass("lightbox-prev-btn-show");
				self.changePicSize(self.groupData[self.index].src);
			}
		});
		this.popupViewPrevBtn.click(function(){
			if(self.index != 0){
				self.ResetCaption();
				self.index --;
				$(this).removeClass("lightbox-next-btn-show");
				self.changePicSize(self.groupData[self.index].src);
			}
		});

		this.isAdjust = false;
		var timer = null;
		$(window).resize(function(){
			if(self.isAdjust){
				window.clearTimeout(timer);
				window.setTimeout(function(){
					self.ResetCaption();
					self.changePicSize(self.groupData[self.index].src);
					self.setCaption();
				},500);
			}
		});
	}

	OpenLightBox.prototype = {
		LoadLightBoxCodes:function(){//进行加载显示图片的控件代码
			if(this.SucCodes) return;
			var strDOM = '<div class = "lightbox-pic-view">'+
			'<span class = "lightbox-btn lightbox-prev-btn"></span>'+
			'<img class = "lightbox-img" src="">'+
			'<span class = "lightbox-btn lightbox-next-btn"></span>'+
		'</div>'+
		'<div class = "lightbox-pic-caption">'+
			'<div class = "lightbox-caption-text">'+
				'<p class = "lightbox-caption-title"></p>'+
				'<p class = "lightbox-caption-content"></p>'+
			'</div>'+
			'<span class = "lightbox-close-btn"></span>'+
		'</div>';

			this.popupWin.html(strDOM);
			this.bodyNode.append(this.popupMask, this.popupWin);
			this.popupMask.hide();
			this.popupWin.hide();
			this.SucCodes = true;
		},
		getGroup:function(){

			var self = this,
			    grouplist = this.bodyNode.find(self.Myoptions.containerClassName + "[data-group="+self.groupName +"]");
			self.groupData.length = 0;
			grouplist.each(function(){
				self.groupData.push({
					title:$(this).attr("data-title"),
					content:$(this).attr("data-content"),
					src:$(this).attr("data-source")
				});
			});
			console.log(this.groupData);
		},
		ShowPic:function(curObj){
			var self = this,
				curSrc = curObj.attr("data-source");
			self.popupWin.hide();
			self.popupMask.fadeIn();
			self.setPicSize(curSrc);
		},
		setPicSize:function(curSrc){
			var self = this;
			self.enLoadPic(curSrc, function(){
				self.ShowAnimate(curSrc);
			});
		},
		ShowAnimate:function(curSrc){
			var self = this,
				winHeight = $(window).height(),
				winWidth = $(window).width();

			this.popupView.css({
				width:(winWidth / 2),
				height:(winHeight / 2)
			});

			this.popupWin.fadeIn();

			this.popupWin.css({
				width:winWidth / 2 + 10,
				height:winHeight / 2 + 10,
				top: - (winHeight / 2 + 20),
				marginLeft: -(winHeight / 2 + 5)
			}).animate({
				top:(winHeight - winHeight / 2 - 10) / 2
			}, 500, function(){
				self.changePicSize(curSrc);
				self.setCaptionInfo();
			});

		},
		getIndexOf:function(curObj){
			var self = this;
			$(self.groupData).each(function(i){
				if($(this).attr("src") == curObj.attr("src")){
					self.index = i;
					return false;
				}
			});
		},
		ResetCaption:function(){
			var self = this;
			self.popupCaption.hide();
			self.popupCaption.css({marginTop:0});
		},
		setCaption:function(width){
			var self = this;
			self.popupCaption.find("p").css({width:width});
			self.popupCaptionHeight = self.popupCaption.height() + 5;
			self.popupCaption.show();
			self.popupCaption.animate({marginTop:-self.popupCaptionHeight});
		},
		changePicSize:function(curSrc){
			this.popupViewPic.css({
				height:"auto",
				width:"auto"
			}).hide().attr("src", curSrc);;
			var self = this,
				winHeight = $(window).height(),
				winWidth = $(window).width(),
				picHeight = this.popupViewPic.height(),
				picWidth = this.popupViewPic.width();
			var scale = Math.min(winWidth / (picWidth + 10), winHeight / (picHeight + 10), 1);
			var height = picHeight * scale,
				width = picWidth * scale;
			this.popupView.animate({
				width:width - 10,
				height:height - 10
			});
			this.popupWin.animate({
				width:width,
				height:height,
				top:(winHeight - height) / 2,
				marginLeft: - width / 2
			}, function(){
				self.popupViewPic.css({
					height:height - 10,
					width: width - 10
				}).fadeIn();
				self.setCaption(width - 10 - 5);
			});
		},
		enLoadPic:function(curSrc, callback){
			var self = this,
				img = new Image();
			if(window.ActiveXObject){
				img.onreadystatechange = function(){
					if(this.readystate == "complete"){
						callback();
					}
				}
			}
			else{
				img.onload = function(){
					callback();
				}
			}

			img.src = curSrc;
		},
		setCaptionInfo:function(){
			var curPic = this.groupData[this.index];
			this.popupCaptionTitle.text(curPic.title);
			this.popupCaptoinContent.text(curPic.content);
		}
	}

	window['OpenLightBox'] = OpenLightBox;
})(jQuery);