var lineupManager = (function(Context)
{
	var currLineupBasic;
	var getCurrLineupAdv;

	var numBasic;
	var numAdv;

	var moveDir;
	var lineSpeed;

	var	nextOpenBasicSpot;
	var nextOpenAdvSpot;

	var basicPos;
	var advPos;

	function lineupManager(enemyArr)
	{
		numBasic = 0;
		numAdv = 0;
		basicLineSpeed = 0.75;
		advLineSpeed = 0.5;
		basicMoveDir = 1;
		advMoveDir = 1;

		basicPos = new Array();
		advPos = new Array();
		initPos();
	}

	lineupManager.prototype.UpdateLineUpPositions = function (enArr) 
	{

		if(basicPos != undefined && advPos != undefined)
		{


			if(enArr != undefined)
			{
				nextOpenBasicSpot = 0;
				nextOpenAdvSpot = 0;

				for(var i  = 0; i < enArr.length; i++)
				{
					if(enArr[i] != undefined)
					{
						if(enArr[i].getState() == 2 )
						{
							//console.log("here");
							if(enArr[i].getEnemyType() == 0)
							{
								//console.log(basicCount);
								//console.log("basicEnemy" - basicPos[5]);
								//console.log(enArr[i].getLineUpNum());
								enArr[i].setEnemyTargetX(basicPos[nextOpenBasicSpot].x);
								enArr[i].setEnemyTargetY(basicPos[nextOpenBasicSpot].y);
								nextOpenBasicSpot++;	
							}
							else if(enArr[i].getEnemyType() == 1)
							{
								//console.log(enArr[i].getLineUpNum());
								enArr[i].setEnemyTargetX(advPos[nextOpenAdvSpot].x);
								enArr[i].setEnemyTargetY(advPos[nextOpenAdvSpot].y);
								nextOpenAdvSpot++;		
							}
							else{}//do nothing
						}
					}
				}	
			}



			//
			//update basic array pos
			for(var q=0;q<nextOpenBasicSpot;q++)
			{
				var tempX = basicPos[q].x+(basicLineSpeed*basicMoveDir);
				if( (0 < tempX) && (tempX < canvas.width-80 ))
				{
					basicPos[q].x = tempX;
				}	
				else
				{
					basicMoveDir *= -1;
				}

			}

			//console.log(basicPos[5]);

			//update advPos array
			for(var m=0;m<nextOpenAdvSpot;m++)
			{
				var tempXb = advPos[m].x+(advLineSpeed*advMoveDir);
				if( (200 < tempXb) && (tempXb < 600 ) )
				{
					advPos[m].x = tempXb;
				}	
				else
				{
					advMoveDir *= -1;
					//console.log("CHANGING "+tempXb );
				}

			}



		}

	}


	function initPos()
	{
		var canvas = document.getElementById('canvas');
		//
		// alert(points[i].x + ' ' + points[i].y); --> points.push({x:56, y:87});
		//basicPos = [];

		var newY = 150;
		var xCounter = 1;

		for(var i = 1; i < 20; i++)
		{
			
			basicPos.push({x:xCounter*(canvas.width/10), y:newY});
			
			xCounter+=2;
			if(i%4==0 && i>1)
			{
				newY+=80;
				console.log(newY);
				
				xCounter = 1;
			}
		}

		//advPos = [];
		for(var m = 3; m < 9;m++)
		{
			advPos.push({x:m*(canvas.width/10), y:50});
		}

	}


	

	lineupManager.prototype.getCurrLineup = function () {return currLineup; }
	lineupManager.prototype.getBasicPos= function () {return basicPos; }
	lineupManager.prototype.getAdvPos= function () {return advPos; }
	lineupManager.prototype.getnextOpenBasicSpot = function () {return nextOpenBasicSpot; }
	lineupManager.prototype.getnextOpenAdvSpot = function () {return nextOpenAdvSpot; }

 	return lineupManager;
})();