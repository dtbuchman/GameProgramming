var bkAstrd = (function(Context)
	{
		//context.drawImage(sprite, playerPosX, playerPosY, playerSize, playerSize);
		var astX, astY;
		var astSprite;
		var astWidth, astHeight;
		var astVel;

		function bkAstrd(newX, newY)
		{
			this.astX = newX;
			this.astY = newY;
			this.astSprite = new Image();
			var randNum = Math.floor((Math.random() * 10) + 1);
			if(randNum < 5)
			{
				this.astSprite.src="imgs/astroid_dark.png";
			}
			else
			{
				this.astSprite.src="imgs/astroid_dark_2.png";
			}

			//
			randNum = Math.floor(Math.random() * (120 - 20 + 1)) + 20;
			this.astWidth = randNum;
			this.astHeight = randNum;

			//
			randNum = Math.floor(Math.random() * (3 - 0.5 + 1)) + 0.5;
			this.astVel = randNum;


		}

		bkAstrd.prototype.getX = function () {return this.astX; }
		bkAstrd.prototype.getY = function () {return this.astY; }
		bkAstrd.prototype.setY = function (inY) { this.astY = inY; }
		bkAstrd.prototype.getSprite = function () {return this.astSprite; }
		bkAstrd.prototype.getWidth = function () {return this.astWidth; }
		bkAstrd.prototype.getHeight = function () {return this.astHeight; }
		bkAstrd.prototype.getVel = function () {return this.astVel; }

		bkAstrd.prototype.setWidth = function (inWidth) {this.astWidth = inWidth; }
		bkAstrd.prototype.setHeight = function (inHeight) {this.astHeight = inHeight; }
		bkAstrd.prototype.setVel = function (inVel) {this.astVel = inVel; }

		return bkAstrd;
	})();