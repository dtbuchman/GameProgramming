var enemy = (function(Context)
{

	var enemyPosX, enemyPosY;
	var enemySpeed;
	var sprite, enemyType;
	var targetX, targetY;
	var canFire;
	var enemyMissile;
	var linePos;
	var lineUpNum;
	var hitCirc;
	var enemySize;

	//
	//0 - initial bombing run after spawn
	//1 - return to lineup
	//2 - in lineup
	//3 - attacking
	var enemyState;

	function enemy(inX, inY, inType, inTargetX, inTargetY)
	{
		console.log("ENEMY CREATED");
		this.enemyPosX = inX;
		this.enemyPosY = inY;
		this.enemySpeed = 2.0;
		this.enemyType = inType;
		this.targetX = Math.round(inTargetX);
		this.targetY = Math.round(inTargetY);
		this.enemyState = 0;
		this.sprite= new Image();
		this.canFire = true;
		this.currFrame = 0;

		this.spriteHeight = 522;
		
		if(this.enemyType == 0)
		{
			this.numOfFrames = 7;
			this.spriteWidth = 550;
			this.sprite.src="imgs/spritesheetEnemy.png";
			this.enemySize = 64;
		}
		else if(this.enemyType == 1)
		{
			this.numOfFrames = 15;
			this.spriteWidth = 522;
			this.sprite.src="imgs/spritesheetEnemy2.png";
			this.enemySize = 68;
		}

		this.hitCirc = {
            x: (this.enemyPosX+this.enemySize/2),
            y: (this.enemyPosY+this.enemySize/2),
            radius: (this.enemySize/2)-10
        };
		
	}

	enemy.prototype.UpdateEnemy = function(context)
	{

	}
	
	enemy.prototype.DrawEnemy = function(context)
	{
		//
		//get which sprite
		//findoutwhichdirection
		

		//console.log(this.enemyPosY);
		context.drawImage(this.sprite, this.spriteWidth * this.currFrame, 0,this.spriteWidth, this.spriteHeight,
				this.enemyPosX, this.enemyPosY, this.enemySize, this.enemySize);
		 if (this.currFrame == this.numOfFrames) {
            this.currFrame = 0;
          } else {
            this.currFrame++;
          }
	}

	enemy.prototype.CollidesWith = function(otherX, otherY)
	{

		return false; 
	}

	enemy.prototype.Die = function()
	{
		//console.log("DEATH!@");
		//
		//death animation
		return null;
		//setTimeout(function() { return null; }, 1000);
	}

	enemy.prototype.fireMissile = function(inX, inY)
	{	
		//console.log("ENEMY FIRE - "+ enemyPosY);
		this.enemyMissile = new missile(inX, inY, 1);
		//console.log(this.enemyMissile);
	}

	enemy.prototype.resetMs = function()
	{
		this.enemyMissile = null;
	}





	enemy.prototype.getX = function () {return this.enemyPosX; }
    enemy.prototype.getY = function () {return this.enemyPosY; }
    enemy.prototype.setX = function (newX) { 
    	this.enemyPosX = newX; 
    	this.hitCirc.x = this.enemyPosX+this.enemySize/2;
    }
    enemy.prototype.setY = function (newY) { 
    	this.enemyPosY = newY; 
    	this.hitCirc.y = this.enemyPosY+this.enemySize/2;
    }
    
    enemy.prototype.getEnemyTargetX = function () {return this.targetX; }
    enemy.prototype.getEnemyTargetY = function () {return this.targetY; }
    enemy.prototype.setEnemyTargetX = function (inX) {this.targetX = inX; }
    enemy.prototype.setEnemyTargetY = function (inY) {this.targetY = inY; }
    
    enemy.prototype.getEnemySpeed = function () {return this.enemySpeed; }
    enemy.prototype.setEnemySpeed = function (inSpeed) {this.enemySpeed = inSpeed; }
    
    enemy.prototype.getSprite = function () {return this.sprite; }
    enemy.prototype.setSprite = function (inSprite) {this.sprite = inSprite; }
    
    enemy.prototype.getState = function () {return this.enemyState; }
    enemy.prototype.setState = function (inState) {this.enemyState = inState; }
    
    enemy.prototype.getLineUpNum = function () {return this.lineUpNum; }
    enemy.prototype.setLineUpNum = function (inNum) {this.lineUpNum = inNum; }
    
    enemy.prototype.getEnemySize = function () {return this.enemySize; }
    enemy.prototype.setEnemySize = function (inSize) {this.enemySize = inSize; }
    
    enemy.prototype.getEnemyType = function () {return this.enemyType; }
    enemy.prototype.setEnemyType = function (inType) {this.enemyType = inType; }

	enemy.prototype.getEnemyMissile = function () {return this.enemyMissile; }

	enemy.prototype.getLinePos = function () {return this.linePos; }
	enemy.prototype.setLinePos = function (inPos) {this.linePos = inPos; }

	enemy.prototype.getEnemyHitCirc = function(){return this.hitCirc;}

    return enemy;
})();