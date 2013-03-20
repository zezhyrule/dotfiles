var Slave = {
	startx: 150,
	starty: 150,
	endx: 550,
	endy: 300,
	movex: 0,
	movey: 0,
	boxWidth:0,
	boxHeight:0,
	dragging: false,
	moving: false,
	resizing: false,
	mousedown: false,
	i:0,
	docHeight:0,
	winHeight:0,
	winWidth:0,
	MessageListener: function()
	{
		chrome.extension.onRequest.addListener(function(request, sender, response)
		{
			switch(request.msg)
			{
				case "load_url": Slave.LoadUrl(request.URL); break;
				case "clean_up": Slave.CleanUp(); break;
				case "show_area": Slave.ShowGrabArea(); break;
				case "show_selector": Slave.ShowSelector(); break;
				case "scroll_init": Slave.ScrollInit(); break;
				case "scroll_next": Slave.ScrollNext(); break;
			}
			response({});
		});
	},
	SendMessage: function(message)
	{
		//Message is object
		chrome.extension.connect().postMessage(message);
	},
	LoadUrl: function(url)
	{
		window.location.href = url;	
	},
	ScrollInit: function()
	{
		Slave.docHeight = document.getElementsByTagName('body')[0].clientHeight;
		Slave.winHeight = window.innerHeight;
		Slave.winWidth = window.innerWidth;
		Slave.startY = window.scrollY;
		window.scrollTo(0,0);
		Slave.i = 0;
		setTimeout("Slave.SendMessage({msg:'scroll_init_done', height:"+ Slave.docHeight +", width:"+ Slave.winWidth +"});", 300);
	},
	ScrollNext:function()
	{
		Slave.i++;
		if(Slave.i*Slave.winHeight < Slave.docHeight) {
			window.scrollTo(0, Slave.i * Slave.winHeight);
			setTimeout("Slave.SendMessage({msg:'scroll_next_done'});", 300);
		}
		else {
			window.scrollTo(0,Slave.startY);
			Slave.SendMessage({msg:'scroll_finished'});
		}
	},
	ShowGrabArea: function()
	{
		Slave.CleanUp();
		Slave.SetupGrab();
		Slave.CreateArea();
	},
	SetupGrab: function()
	{
		cssRef = document.createElement('link');
		cssRef.id = 'pixlr-style';
		cssRef.rel = 'stylesheet';
		cssRef.href = chrome.extension.getURL('assets/grab.css');
		cssRef.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(cssRef);
	},
	GrabSelected: function()
	{
		Slave.RemoveArea();
		setTimeout( function(){ Slave.SendMessage({msg:"grab_selected", x:Slave.startx, y:Slave.starty, width:Slave.endx-Slave.startx, height:Slave.endy-Slave.starty})}, 50);
	},
	EditClick: function()
	{
		Slave.LoaderStep();
		Slave.SendMessage({msg:'edit', title: document.location.hostname});
	},
	ShareClick: function()
	{
		Slave.LoaderStep();
		Slave.SendMessage({msg:'share', title: document.location.hostname});
	},
	SaveClick: function()
	{
		Slave.LoaderStep();
		Slave.SendMessage({msg:'save', title: document.location.hostname});
	},
	CloseClick: function()
	{
		Slave.CleanUp();
	},
	/*CopyClick: function()
	{
		Slave.LoaderStep();
		Slave.SendMessage({msg:'copy'});
	},*/
	ShowSelector: function()
	{
		if(!document.getElementById('pixlr-style'))
		{
			Slave.SetupGrab();
		}
		var bod = document.getElementsByTagName('body')[0];
		
		Slave.AddDivElement(bod, 'pixlr-overlay-shadow');
		var selector = Slave.AddDivElement(bod, 'pixlr-overlay-selector'); 
		
		var edit = Slave.AddDivElement(selector, 'pixlr-edit');
		edit.addEventListener("mousedown", Slave.EditClick, false);
		edit.innerHTML = "EDIT<div>In Pixlr.com</div>";
		
		var share = Slave.AddDivElement(selector, 'pixlr-share');
		share.addEventListener("mousedown", Slave.ShareClick, false);
		share.innerHTML = "SHARE<div>To Imm.io</div>";
		
		var save = Slave.AddDivElement(selector, 'pixlr-save');
		save.addEventListener("mousedown", Slave.SaveClick, false);
		save.innerHTML = "SAVE<div>To Desktop</div>";
		
		var close = Slave.AddDivElement(selector, 'pixlr-close');
		close.addEventListener("mousedown", Slave.CloseClick, false);
		
		/*var copy = Slave.AddDivElement(selector, 'pixlr-copy');
		copy.addEventListener("mousedown", Slave.CopyClick, false);
		copy.innerHTML = "COPY<div>To Clipboard</div>";*/
	},
	LoaderStep: function()
	{
		var bod = document.getElementsByTagName('body')[0];
		
		Slave.RemoveElement("pixlr-overlay-selector");
		Slave.AddDivElement(bod, 'pixlr-overlay-loader'); 
	},
	CreateArea: function()
	{
		Slave.AddDivElement(document.body, 'pxa-area-protector');
		setTimeout(Slave.DisplayArea, 100);
	},
	DisplayArea: function()
	{
		var areaProtector = document.getElementById('pxa-area-protector');
		
		Slave.AddDivElement(areaProtector, 'pxa-shadow-top');
		Slave.AddDivElement(areaProtector, 'pxa-shadow-bottom');
		Slave.AddDivElement(areaProtector, 'pxa-shadow-left');
		Slave.AddDivElement(areaProtector, 'pxa-shadow-right');

		var areaElement = Slave.AddDivElement(areaProtector, 'pxa-area');
		
		Slave.AddDivElement(areaElement, 'pxa-container');
		Slave.AddDivElement(areaElement, 'pxa-size');

		var cancel = Slave.AddDivElement(areaElement, 'pxa-cancel');
		cancel.addEventListener("mousedown", function (){Slave.RemoveArea();}, true);
		cancel.innerHTML = "Cancel";
		
		var crop = Slave.AddDivElement(areaElement, 'pxa-crop');
		crop.addEventListener("mousedown", Slave.GrabSelected, true);
		crop.innerHTML = "Crop";

		Slave.AddDivElement(areaElement, 'pxa-north-west');
		Slave.AddDivElement(areaElement, 'pxa-north-east');
		Slave.AddDivElement(areaElement, 'pxa-south-east');
		Slave.AddDivElement(areaElement, 'pxa-south-west');
		
		document.addEventListener("mousedown", Slave.MouseDown, false);
		document.addEventListener("dblclick", Slave.GrabSelected, false);
		document.addEventListener("mousemove", Slave.MouseMove, false);
		document.addEventListener("mouseup", Slave.MouseUp, false);

		Slave.boxHeight = document.getElementById('pxa-area-protector').clientHeight;
		Slave.boxWidth = document.getElementById('pxa-area-protector').clientWidth;
		
		var areaElement = document.getElementById("pxa-area");
		areaElement.style.left = Slave.startx + "px";
		areaElement.style.top = Slave.starty + "px";
		areaElement.style.width = (Slave.endx - Slave.startx) + "px";
		areaElement.style.height = (Slave.endy - Slave.starty) + "px";

		Slave.UpdateShadow(areaElement);
		Slave.UpdateSize();
	},
	MouseDown: function(event)
	{
		if(event.button != 2)
		{
			var element = event.target;

			if(element)
			{
				var elementName = element.tagName;
				
				if(elementName && elementName == "HTML")
				{
					Slave.RemoveArea();
				}
				else if(elementName && document)
				{
					Slave.mousedown = true;
				
					var areaElement = document.getElementById("pxa-area");
					var xPosition = event.pageX - window.scrollX;
					var yPosition = event.pageY - window.scrollY;
					
					if(areaElement)
					{
						if(element == document.getElementById("pxa-container"))
						{
							Slave.moving = true;
							Slave.movex = xPosition - areaElement.offsetLeft;
							Slave.movey = yPosition - areaElement.offsetTop;
						} 
						else if(element == document.getElementById("pxa-north-east"))
						{
							Slave.resizing = true;
							Slave.startx = areaElement.offsetLeft;
							Slave.starty = areaElement.offsetTop + areaElement.clientHeight;
						} 
						else if(element == document.getElementById("pxa-north-west"))
						{
							Slave.resizing = true;
							Slave.startx = areaElement.offsetLeft + areaElement.clientWidth;
							Slave.starty = areaElement.offsetTop + areaElement.clientHeight;
						} 
						else if(element == document.getElementById("pxa-south-east"))
						{
							Slave.resizing = true;
							Slave.startx = areaElement.offsetLeft;
							Slave.starty = areaElement.offsetTop;
						} 
						else if(element == document.getElementById("pxa-south-west"))
						{
							Slave.resizing = true;
							Slave.startx = areaElement.offsetLeft + areaElement.clientWidth;
							Slave.starty = areaElement.offsetTop;
						}
						else
						{
							Slave.dragging = true;
							Slave.endx = 0;
							Slave.endy = 0;
							Slave.startx = xPosition;
							Slave.starty = yPosition;
						}
					}
				}
			}
			event.stopPropagation();
			event.preventDefault();
		}
	},
	MouseMove: function(event)
	{
		var element = event.target;

		if(element && Slave.mousedown)
		{
			var areaElement = document.getElementById("pxa-area");

			if(areaElement)
			{
				var xPosition = event.pageX - window.scrollX;
				var yPosition = event.pageY - window.scrollY;

				if(Slave.dragging || Slave.resizing)
				{
					var width = 0;
					var height = 0;
					
					Slave.endx = xPosition;
					Slave.endy = yPosition;

					if(Slave.startx > Slave.endx)
					{
						width = Slave.startx - Slave.endx;
						areaElement.style.left = xPosition + "px";
					} 
					else
					{
						width = Slave.endx - Slave.startx;
						areaElement.style.left = Slave.startx + "px";
					}

					if(Slave.starty > Slave.endy)
					{
						height = Slave.starty - Slave.endy;
						areaElement.style.top = Slave.endy + "px";
					} 
					else
					{
						height = Slave.endy - Slave.starty;
						areaElement.style.top = Slave.starty + "px";
					}
					areaElement.style.height = height + "px";
					areaElement.style.width  = width + "px";
				} 
				else if(Slave.moving)
				{
					var newXPosition = xPosition - Slave.movex;
					var newYPosition = yPosition - Slave.movey;

					if (newXPosition < 0) {
						newXPosition = 0;
					}
					else if(newXPosition + areaElement.clientWidth > Slave.boxWidth) {
						newXPosition = Slave.boxWidth - areaElement.clientWidth;
					}
					
					if (newYPosition < 0) {
						newYPosition = 0;
					}
					else if(newYPosition + areaElement.clientHeight > Slave.boxHeight) {
						newYPosition = Slave.boxHeight - areaElement.clientHeight;
					}
					
					areaElement.style.left = newXPosition + "px";
					areaElement.style.top  = newYPosition + "px";
					Slave.endx   = newXPosition + areaElement.clientWidth;
					Slave.startx = newXPosition;
					Slave.endy   = newYPosition + areaElement.clientHeight;
					Slave.starty = newYPosition;
				}
				Slave.UpdateShadow(areaElement);
				Slave.UpdateSize();
			}
		}
	},
	UpdateShadow: function(areaElement)
	{
		var width, height;
		
		var shadowTop = document.getElementById("pxa-shadow-top");
		shadowTop.style.height = parseInt(areaElement.style.top) + "px";
		shadowTop.style.width = (parseInt(areaElement.style.left) +  parseInt(areaElement.style.width) + 1) +"px";
		
		var shadowLeft = document.getElementById("pxa-shadow-left");
		shadowLeft.style.height = (Slave.boxHeight - parseInt(areaElement.style.top)) + "px";
		shadowLeft.style.width = parseInt(areaElement.style.left) + "px";
		
		height = (parseInt(areaElement.style.top)+parseInt(areaElement.style.height) + 1);
		width = (Slave.boxWidth) - 1 - (parseInt(areaElement.style.left) + parseInt(areaElement.style.width));
		
		if(height < 0) height = 0;
		if(width < 0) width = 0;
		
		var shadowRight = document.getElementById("pxa-shadow-right");
		shadowRight.style.height = height + "px";
		shadowRight.style.width =  width + "px";
		
		height = (Slave.boxHeight - 1 - (parseInt(areaElement.style.top)+parseInt(areaElement.style.height)));
		width = (Slave.boxWidth) - parseInt(areaElement.style.left);
		
		if(height < 0) height = 0;
		if(width < 0) width = 0;
		
		var shadowBottom = document.getElementById("pxa-shadow-bottom");
		shadowBottom.style.height = height + "px";
		shadowBottom.style.width = width + "px";
	},
	MouseUp: function(event)
	{
		Slave.mousedown = false;
	
		if(event.button != 2)
		{
			Slave.resizing = false;
			Slave.dragging = false;
			Slave.moving = false;
			Slave.movex = 0;
			Slave.movey = 0;
			
			if(Slave.endx < Slave.startx) {
				var nx = Slave.endx;
				Slave.endx = Slave.startx;
				Slave.startx = nx;
			}
			if(Slave.endy < Slave.starty) {
				var ny = Slave.endy;
				Slave.endy = Slave.starty;
				Slave.starty = ny;
			}
		}
	},
	RemoveArea: function()
	{
		Slave.RemoveElement("pxa-area-protector");
		Slave.RemoveElement("pxa-area");

		try { document.removeEventListener("mousedown", Slave.MouseDown, false); } catch(exception) { }
		try { document.removeEventListener("mousemove", Slave.MouseMove, false); } catch(exception) { }
		try { document.removeEventListener("mouseup", Slave.MouseUp, false); } catch(exception) { }
		try { document.removeEventListener("dblclick", Slave.GrabSelected, false); } catch(exception) { }
	},
	CleanUp: function()
	{
		Slave.RemoveArea();
		Slave.RemoveElement("pixlr-style");
		Slave.RemoveElement("pixlr-overlay-shadow");
		Slave.RemoveElement("pixlr-overlay-loader");
		Slave.RemoveElement("pixlr-overlay-selector");
	},
	UpdateSize: function()
	{
		var width, height;
		var areaSizeElement = document.getElementById("pxa-size");

		if(Slave.endx > Slave.startx){
			width = Slave.endx - Slave.startx;
		} else {
			width = Slave.startx - Slave.endx;
		}
		
		if(Slave.endy > Slave.starty){
			height = Slave.endy - Slave.starty;
		} else {
			height = Slave.starty - Slave.endy;
		}
		areaSizeElement.innerHTML = width +" x "+ height;
	},
	AddDivElement: function(parent, id)
	{
		var el = document.createElement('div');
		el.id = id; parent.appendChild(el);
		return el;
	},
	RemoveElement: function(id)
	{
		if(document.getElementById(id)) {
			document.getElementById(id).parentNode.removeChild(document.getElementById(id));
		}
	}
};
Slave.MessageListener();