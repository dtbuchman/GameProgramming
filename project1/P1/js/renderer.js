//GRAPHICS RENDERER
var renderer = (function(Context)
{
	//
	//background
	var backGround = new Image();
	backGround.src = "imgs/spcbk.png";

	var backGround2 = new Image();
	backGround2.src = "imgs/spcbk.png";

	var backGround3 = new Image();
	backGround3.src = "imgs/spaceTile.png";

	var backGround4 = new Image();
	backGround4.src = "imgs/spaceTile.png";

	var bk1X = -100;
	var bk1Y = -224;
	var bk2X = -100;
	var bk2Y = -1248;

	var bkGSpeed = 1.0;

	var astImgs;

	//
	//
	var titleImg = new Image();
	titleImg.src="imgs/menuPic.png";
	
	var overlayImg;
	var plyrLivesImg = new Image();
	plyrLivesImg.src = "imgs/livesShip.png";
	
	var gameOn = false;

 	function renderer() {
 		overlayImg = new Image();
		overlayImg.src = "imgs/overlay.png";
 		overlayImg.width = 800;
		overlayImg.height = 800;

		astImgs = new Array();
		//astImgs.push(new bkAstrd(65, -400));
		astImgs.push(new bkAstrd(225, -900));
		//astImgs.push(new bkAstrd(450, -620));
		astImgs.push(new bkAstrd(600, -80));
		//astImgs.push(new bkAstrd(760, -750));

 	};

	renderer.prototype.draw = function(context, plyr, em)
	{
		//scrollingbackground manager
		drawBackground(context);

		//display main menu
		if(showMenu)
		{	context.drawImage(titleImg, ((canvas.width/2) - (titleImg.width/2)), canvas.height/8);
			context.font = '46px monospace';
			context.fillStyle = "yellow";
			context.textAlign = "center";
			context.fillText("Push Spacebar to Start!", canvas.width/2, canvas.height/2); 

			
		}

		



		//
		//drawPlayer   ->>  imagesrc, posX,posY,width,height
		plyr.DrawPlayer(context);

		//
		//drawEnemies
		if(em != null)
		{
			em.DrawEnemies(context);
		}

		//
		//drawMissiles
		drawMissiles(context);
		if(em != null)
		{
			em.DrawEnemyMissiles(context);
		}

		//
		//drawOverlay
		if(overlayImg !=undefined)
		{
			DrawOverlay(context);
		}
		if(showGUI)
		{
			context.font = '42px monospace';
			context.fillStyle = "yellow";
			//context.fillText("SCORE", canvas.width/2, 20); 
			var frScore = FormatNumberLength(plyr.getPlayerScore(), 6);
			context.fillText(frScore, canvas.width/2, 35); 
			
			
			//
			// ++++++++++
			//context.drawImage(plyrImage, 64*i, canvas.height-64, 64, 64);
			//IF OVER 3 LIVES --->   (SHIP) x (#)
			var numLives =  plyr.getLivesLeft();
			if(numLives < 4)
			{
				for(i=0; i < numLives; i++)
				{

					context.drawImage(plyrLivesImg, 15+(64*i), canvas.height-60, 50, 50);
					

				}
			}
			else
			{
				context.drawImage(plyrLivesImg, 5, canvas.height-55, 50, 50);
				context.font = '38px monospace';
				context.fillText(" X "+numLives, 118, canvas.height-15); 
			}



		}

	}

	function DrawOverlay(context)
	{
		if(overlayImg != null)
		{
			context.drawImage(overlayImg, 0, 0,canvas.width, canvas.height);
			context.font = '12px monospace';
			context.fillStyle = "white";
			//context.fillText("Created By: Derek Buchman", (8.5*canvas.width/10), (9.8*canvas.height/10) );
			context.fillText("CSCI4070 - GameProgramming - Project 1", canvas.width/2, (9.8*canvas.height/10) );
		}
	}
	
	function drawMissiles(context)
	{
		if (plyr.getMsPrim() != undefined) 
		{
			context.drawImage(plyr.getMsPrim().getBkImg(), plyr.getMsPrim().getXPos(), 
				plyr.getMsPrim().getYPos(), plyr.getMsPrim().getMsSize(), 
				plyr.getMsPrim().getMsSize());
		}
		if (plyr.getMsSec() != null) 
		{
			context.drawImage(plyr.getMsSec().getBkImg(), plyr.getMsSec.getXPos(), 
				plyr.getMsSec().getYPos(), plyr.getMsSec().getMsSize(), 
				plyr.getMsSec().getMsSize());
		}

	}

	function drawBackground(context)
	{
		context.drawImage(backGround3, bk1X, bk1Y);
		context.drawImage(backGround4, bk2X, bk2Y);


		//update bkG values
		if(bk1Y < 800)
		{
			bk1Y += bkGSpeed;
		}
		else
		{
			bk1Y = -1248;
		}


		if(bk2Y < 800)
		{
			bk2Y += bkGSpeed;
		}
		else
		{
			bk2Y = -1248;
		}


	}

	function FormatNumberLength(num, length) {
	    var r = "" + num;
	    while (r.length < length) {
	        r = "0" + r;
	    }
    	return r;
	}


	return renderer;
})();