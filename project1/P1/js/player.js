//+==================
//PLAYER 
//===================

var player = (function(Context)
{
	var playerPosX, playerPosY; 
	var playerSpeed = 5;
	var score = 0;
	var numLivesLeft;
	var playerSize = 80;
	var primCannReady;
	var secCannReady;
	var msPrim;
	var msSec;
	
	var hitCirc;
	var allowInput;

	//
	//sprite variables
	var sprite;
	var numOfFrames;
	var currFrame;
	var spriteWidth, spriteHeight;
	var playerScore;
	
	var spriteY;

	var rspnX;
	var rspnY;

	function player()
	{
		playerPosX = canvas.width/2 - playerSize/2;
		playerPosY = canvas.height/2 + 120;

		primCannReady = true;
		secCannReady = false;

		playerScore = 0;
		numLivesLeft = 5;
		//
		//sprite vars
		sprite= new Image();
		//sprite.src="imgs/ships/Blue/Small_ship_blue/1.png";
		sprite.src="imgs/spritesheetPlayer2.png";
		spriteY = 0;
		numOfFrames = 9;
		currFrame = 0;
		spriteWidth = 650;
		spriteHeight = 650;
		allowInput = true;

		rspnX = canvas.width/2 - playerSize/2;
		rspnY = 0.75*canvas.height;

		hitCirc = {
            x: (playerPosX+playerSize/2),
            y: (playerPosY+playerSize/2)-5,
            radius: (playerSize/2)-14
        };
        

	}


	player.prototype.UpdatePlayer = function(context)
	{		
		if(gameOn)
		{
			if(allowInput)
			{
				if(rightDown && (playerPosX+playerSpeed < canvas.width - 80) )
				{
					playerPosX += playerSpeed;
				}
				if(leftDown && (playerPosX-playerSpeed > 0) )
				{
					playerPosX -= playerSpeed;
				}
				if(upDown && (playerPosY-playerSpeed > canvas.width/4) )
				{
					playerPosY -= playerSpeed;
				}
				if(downDown && (playerPosY+playerSpeed < (canvas.height - (canvas.height/6))) )
				{
					playerPosY += playerSpeed;
				}
			}
			else
			{
				moveTowardsRespawnPoint();
			}


			if(ctrlDown)
			{
				if(primCannReady)
				{
					//fireMissile(primary)
					msPrim = new missile(playerPosX, playerPosY, 0);  //type 0 for player missile
					primCannReady = false;
					//PRIMARY RESET DELAY
					console.log("PLAYER FIRE");
					setTimeout(function() {  primCannReady = true;  }, 2000);
				}
				else
				{
					if(secCannReady)
					{
						//fireMissile(seconday)
						msSec = new missile(playerPosX, playerPosY, 0); 
						secCannReady = false;
					}
				}
			}


			//
			//update player missiles
			if(msPrim != null)
			{
				msPrim.updateMS();
			}
			if(msSec != null)
			{
				msSec.updateMS();
			}



		}


		hitCirc.x = playerPosX+playerSize/2;
        hitCirc.y = playerPosY+playerSize/2;


	}

	player.prototype.Die = function () 
	{ 
		console.log("PLAYER DIED");
		//death anim
		spriteY = 650;
		//respawn offscreen ---> move to starting pos

		
	}

	player.prototype.DrawPlayer = function(context)
	{
		 //
        //drawing hitcircle
        //DRAW_HIT_CIRCLE(context);


		//context.drawImage(sprite, playerPosX, playerPosY, playerSize, playerSize);
		context.drawImage(sprite, spriteWidth * currFrame, spriteY,spriteWidth, spriteHeight, playerPosX, playerPosY, playerSize, playerSize);
		 if (currFrame == numOfFrames) {
             currFrame = 0;
           } else {
             currFrame++;
           }

         if(spriteY == 650)
         {
         	if(currFrame == 9)
         	{
         		playerPosX = canvas.width/2;
         		playerPosY = canvas.height+180;

         		spriteY = 0;
         		if(numLivesLeft >= 0)
         		{
         			numLivesLeft--;
         			allowInput = false;
         			moveTowardsRespawnPoint();
         		}
         		else
         		{
         			//GAME OVER
         			//em checks for lives left
         			//then calls "Game over"
         		}
         		
         	}
         }
       
	}

	function moveTowardsRespawnPoint()
	{
		if(Math.ceil(playerPosX/2)*2 == Math.ceil(rspnX/2)*2 && 
				Math.ceil(playerPosY/2)*2 == Math.ceil(rspnY/2)*2 )
				{
					//made it to respawn point
					allowInput = true;
				}
		else
		{
			if(playerPosX < rspnX)
			{
				playerPosX++;
			}
			else if(playerPosX > rspnX)
			{
				playerPosX--;
			}
			if(playerPosY < rspnY)
			{
				playerPosY++;
			}
			else if(playerPosY > rspnY)
			{
				playerPosY--;
			}

		}

	}

	player.prototype.processHit = function(inMS, inEnemy)
	{
		if(inMS == msPrim)
		{
			resetPrimMs();
		}
		else if(inMS == msSec)
		{
			resetSecMs();
		}

		//==================
		//  ++  SCORING  ++
		//===================
		//ENEMY TYPE 0
		//State 0 ->100   State 1 ->50
		//
		//ENEMY TYPE 1
		//State 0 ->160   State 1 ->80
		var addScore = 0;
		if(inEnemy.getEnemyType() == 0)
		{
			if(inEnemy.getState() == 0)
			{
				addScore = 100;
			}
			else if(inEnemy.getState() == 1 || inEnemy.getState() == 2)
			{
				addScore = 45; 
			}

		}
		else if(inEnemy.getEnemyType() == 1)
		{
			if(inEnemy.getState() == 0)
			{
				addScore = 160;
			}
			else if(inEnemy.getState() == 1 || inEnemy.getState() == 2)
			{
				addScore = 75; 
			}
		}

		playerScore += addScore;

	}

	player.prototype.processMBHit = function(inMS)
	{
		if(inMS == msPrim)
		{
			resetPrimMs();
		}
		else if(inMS == msSec)
		{
			resetSecMs();
		}
		playerScore += 120;
	}

	player.prototype.processBossHit = function(inMS)
	{
		if(inMS == msPrim)
		{
			resetPrimMs();
		}
		else if(inMS == msSec)
		{
			resetSecMs();
		}
		playerScore += 225;
	}


	function resetPrimMs()
	{
		msPrim = null;
	}
	function resetSecMs()
	{
		msSec = null;
	}

	function DRAW_HIT_CIRCLE(context)
	{
		    //
        //drawing hitcircles
        context.beginPath();
        context.arc(hitCirc.x, hitCirc.y, hitCirc.radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();

      
	}

	//PLAYER getters/setters
	player.prototype.resetPrimMs = function () {msPrim = null; }
	player.prototype.resetSecMs = function () {msSec = null; }
	
    
    player.prototype.getX = function () {return playerPosX; }
    player.prototype.getY = function () {return playerPosY; }
    player.prototype.setX = function (inX) {playerPosX = inX; }
    player.prototype.setY = function (inY) {playerPosY = inY; }
    player.prototype.getScore = function () {return score; }
    player.prototype.getPlayerSize = function () {return playerSize; }
    player.prototype.getLivesLeft = function () {return numLivesLeft; }
    player.prototype.getSprite = function () {return sprite; }

    player.prototype.getMsPrim = function(){return msPrim;}
    player.prototype.getMsSec = function(){return msSec;}
    player.prototype.getAllowInput = function(){return allowInput;}

    player.prototype.getMissiles = function(){return [msPrim, msSec];}

    player.prototype.getPlayerScore = function(){return playerScore;}
    player.prototype.addPlayerScore = function(inPoints){playerScore += inPoints;}
    player.prototype.getHitCirc = function(){return hitCirc;}

    return player;
})();