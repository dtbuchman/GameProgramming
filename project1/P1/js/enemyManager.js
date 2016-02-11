//enemy(inX, inY, inType, inTargetX, inTargetY)

var enemyManager = (function(Context)
{
	var enemyArr;
	var numEnemies;
	var spawnA_X, spawnA_Y;
	var spawnB_X, spawnB_Y;
	var spawnC_X, spawnC_Y;
	var spawnD_X, spawnD_Y;

	var targetA_X, targetA_Y;
	var targetB_X, targetB_Y;
	var targetC_X, targetC_Y;
	var targetD_X, targetD_Y;
	var targetA2_X, targetA2_Y;
	var targetB2_X, targetB2_Y;
	var targetC2_X, targetC2_Y;
	var targetD2_X, targetD2_Y;

	var currWave;
	var currStage;
	var bonusWave;
	//var tempEnemy;

	var lm;


	//
	//miniboss
	var mb;
	var mbHealth;
	//boss
	var enemyBoss;
	var bossHealth;

	//
	//


	function enemyManager()
	{	
		bonusWave = false;
		enemyArr = new Array();
		lm = new lineupManager();

		spawnA_X= -200;
		spawnA_Y = -250;
		spawnB_X = canvas.width+200;
		spawnB_Y = -250;
		spawnC_X = -200;
		spawnC_Y = canvas.height-300;
		spawnD_X = canvas.width+200;
		spawnD_Y = canvas.height-300;

		//
		//
		targetA_X = 0.2*canvas.width;
		targetA_Y = canvas.height/2; 
		targetB_X = 0.8*canvas.width;
		targetB_Y = canvas.height/2;
		targetC_X = 0.8*canvas.width;
		targetC_Y = canvas.height/2 + 80;
		targetD_X = 0.2*canvas.width;
		targetD_Y = canvas.height/2 + 80;

		targetA2_X = -1*canvas.width/2;
		targetA2_Y = canvas.height/2 - 80; 
		targetB2_X = 1.5*canvas.width;
		targetB2_Y = canvas.height/2 - 80;
		targetC2_X = 1.5*canvas.width;
		targetC2_Y = canvas.height/2;
		targetD2_X = -1*canvas.width/2;
		targetD2_Y = canvas.height/2;

		currStage = 0;
		currWave = 1;
		StartStage();
	}

	enemyManager.prototype.UpdateEnemies = function(context, plyrRef)
	{	
		if(gameOn)
		{
			if(plyrRef.getLivesLeft() < 1)
			{
				currStage = 4;
				gameOn = false;
			}

			//console.log("GAME ON --> "+currStage);
			//lineup
			//
			if(currStage == 0)
			{
				//
				if(enemyArr != null)
				{
					checkForCollisions(plyrRef);	
				}
				
				
				updateEnemyStage(plyrRef);
				if(currWave == 4 & enemyArr.length == 0)
				{
					currStage++;
					StartStage();
				}
			}	
			else if(currStage == 1)//MINIBOSS STAGE
			{
				//console.log("MINIBOSS");
				//context.font = '24px monospace';
				//context.fillStyle = "yellow";
				//context.textAlign = "center";
				//context.fillText("STAGE 2", canvas.width/2, canvas.height/2); 

				if(mb != null)
				{
					//
					checkForCollisions(plyrRef);

					//update miniboss
					//console.log("MB --->  UPDATING");
					mb.UpdateMB(plyrRef);
					if(!mb.getIsAlive())
					{
						currWave = 1;
						currStage++;
						StartStage();
					}
				}
				
				//update enemy 
			}
			else if(currStage == 2)//ENEMY STAGE
			{
				//
				if(enemyArr != null)
				{
					checkForCollisions(plyrRef);	
				}

				//spawn enemies
				//update enemies
				//console.log(currStage);
				updateEnemyStage(plyrRef);
				if(currWave == 4 && enemyArr.length == 0)
				{
					currStage++;
					StartStage();
				}
			}
			else if(currStage == 3)//BOSS STAGE
			{
				//console.log("BOSS STAGE");
				//spawn enemies
				//update enemies 

				//console.log("MINIBOSS");
				//context.font = '24px monospace';
				//context.fillStyle = "yellow";
				//context.textAlign = "center";
				//context.fillText("STAGE 2", canvas.width/2, canvas.height/2); 

				if(enemyBoss != null)
				{
					//
					checkForCollisions(plyrRef);

					//update miniboss
					//console.log("MB --->  UPDATING");
					enemyBoss.UpdateBoss(plyrRef);
					if(!enemyBoss.getIsAlive())
					{
						currStage++;
					}
				}
			}
			else if(currStage == 4)//SCORE SCREEN STAGE
			{
				//console.log("SCORE SCREEN");
				//TAKEN OVER BY MAIN GAME LOOP
				gameOn = false;
			}
		}
	}

	//
	//
	//COLLISIONS!!
	function checkForCollisions(plyrRef)
	{
		if(plyrRef.getAllowInput())
		{
			if(currStage == 0)
			{
				//ENEMYSTAGE
				//CHECK
				//PLAYER_ENEMY
				//PLAYER_ENEMY MS
				for(var i = 0; i < enemyArr.length; i++)
				{
					if(enemyArr[i] != null)
					{
						if(circleCollision(plyrRef.getHitCirc(), enemyArr[i].getEnemyHitCirc()) )
						{
							enemyArr.splice(i, 1);
							plyrRef.Die();
						}
						if (enemyArr[i].getEnemyMissile() != null) 
						{
							if(circleCollision(plyrRef.getHitCirc(), enemyArr[i].getEnemyMissile().getMsHitCirc()) )
							{
								plyrRef.Die();
							}
						}
					}
				}
			}
			else if(currStage == 1)
			{
				//MB
				//CHECK 
				//-PLAYER-MB
				//-PLAYER-ORBS
				//-PLAYER-MS
				if(mb!=null)
				{
					if(circleCollision(plyrRef.getHitCirc(), mb.getHitCirc()) )
					{
						console.log("HIT THE MINIBOSS");
						plyrRef.Die();
					}

					var orbs = mb.getMbOrbs();
					if(orbs != null)
					{
						for(var n = 0; n < orbs.length; n++)
						{
							if(orbs[n] != null)
							{
								if(circleCollision(plyrRef.getHitCirc(), orbs[n].getMsHitCirc()) )
								{
									console.log("HIT A MISSILE");
									plyrRef.Die();
								}
							}
						}
					}

					if(mb.getTrackingMS() != null)
					{
						if(circleCollision(plyrRef.getHitCirc(), (mb.getTrackingMS().getMsHitCirc())) )
						{
							console.log("HIT A ROCKET");
							mb.resetTrackingMS();
							//mb.setTrackingMS(null);
							plyrRef.Die();
						}
					}
				}
			}
			else if(currStage == 2)
			{
				//ENEMYSTAGE
				//CHECK
				//PLAYER_ENEMY
				//PLAYER_ENEMY MS
				for(var m = 0; m < enemyArr.length; m++)
				{
					if(enemyArr[m] != null)
					{
						if(circleCollision(plyrRef.getHitCirc(), enemyArr[m].getEnemyHitCirc()) )
						{
							console.log("HIT AN ENEMY");
							enemyArr.splice(i, 1);
							plyrRef.Die();
						}
						else if (enemyArr[m].getEnemyMissile() != null) 
						{
							if(circleCollision(plyrRef.getHitCirc(), enemyArr[m].getEnemyMissile().getMsHitCirc()) )
							{
								console.log("HIT AN ENEMY MISSILE");
								plyrRef.Die();
							}
						}
					}
				}
			}
			else if(currStage == 3)
			{
				//MB
				//CHECK 
				//-PLAYER-ORBS
				//-PLAYER-MS
				if(enemyBoss!=null)
				{
					if(circleCollision(plyrRef.getHitCirc(), enemyBoss.getHitCirc()) )
					{
						console.log("HIT THE BOSS");
						plyrRef.Die();
					}

					var orbs = enemyBoss.getBossOrbs();
					if(orbs != null)
					{
						for(var n = 0; n < orbs.length; n++)
						{
							if(orbs[n] != null)
							{
								if(circleCollision(plyrRef.getHitCirc(), orbs[n].getMsHitCirc()) )
								{
									console.log("HIT A MISSILE");
									enemyBoss.resetTrackingMS();
									plyrRef.Die();
								}
							}
						}
					}

					if(enemyBoss.getTrackingMS() != null)
					{
						if(circleCollision(plyrRef.getHitCirc(), (enemyBoss.getTrackingMS().getMsHitCirc())) )
						{
							console.log("HIT A ROCKET");
							//mb.setTrackingMS(null);
							plyrRef.Die();
						}
					}
				}
			}
		}
	}



	enemyManager.prototype.Start = function(context)
	{		
		if(gameOn)
		{
			if(currStage == 0)
			{
				if(currWave == 1)
				{

					setTimeout(function() { spawnEnemies('A', 'C2', 4, 0);  }, 5000);
					setTimeout(function() { spawnEnemies('B', 'A2', 4, 0);  }, 5000);
					setTimeout(function() { NextWave();  }, 8000);
				}
			}
		}
	}

	function StartStage()
	{
		if(currStage == 1)
		{
			//draw text for GUI(MINIBOSS)

			//
			//
			mb = new miniboss(canvas.width/2-128,-0.75*canvas.height);
			//console.log("MINIBOSS SPAWNED");
		}
		else if(currStage == 2)
		{
			enemyArr = [];
			lm = new lineupManager();

			if(currWave == 1)
			{
				//console.log("Stage 2 - wave 1");
				setTimeout(function() { spawnEnemies('D', 'C', 4, 0);  }, 2000);
				setTimeout(function() { spawnEnemies('C', 'D', 4, 0);  }, 2000);
				setTimeout(function() { NextWave();  }, 8000);
			}
		}
		else if(currStage == 3)
		{
			//draw text for GUI(BOSS)

			//
			//
			enemyBoss = new boss(canvas.width/2-128,-canvas.height/2);
			console.log("BOSS SPAWNED");
			//console.log(enemyBoss);
		}
	}

	function spawnEnemies(spawnPoint, targetPoint, numToSpawn, typeToSpawn)
	{
		//enemy(inX, inY, inType, inTargetX, inTargetY)

		var tempSpawnX, tempSpawnY;
		var tempTargetX, tempTargetY;
		var spawnDir;

		switch(spawnPoint)
		{
			case 'A':
				tempSpawnX = spawnA_X;
				tempSpawnY = spawnA_Y;
				spawnDir = -1;
				break;
			case 'B':
				tempSpawnX = spawnB_X;
				tempSpawnY = spawnB_Y;
				spawnDir = 1;
				break;
			case 'C':
				tempSpawnX = spawnC_X;
				tempSpawnY = spawnC_Y;
				spawnDir = -1;
				break;
			case 'D':
				tempSpawnX = spawnD_X;
				tempSpawnY = spawnD_Y;
				spawnDir = 1;
				break;
		}

		switch(targetPoint)
		{
			case 'A':
				tempTargetX = targetA_X;
				tempTargetY = targetA_Y;
				break;
			case 'B':
				tempTargetX = targetB_X;
				tempTargetY = targetB_Y;
				break;
			case 'C':
				tempTargetX = targetC_X;
				tempTargetY = targetC_Y;
				break;
			case 'D':
				tempTargetX = targetD_X;
				tempTargetY = targetD_Y;
				break;
			case 'A2':
				tempTargetX = targetA2_X;
				tempTargetY = targetA2_Y;
				break;
			case 'B2':
				tempTargetX = targetB2_X;
				tempTargetY = targetB2_Y;
				break;
			case 'C2':
				tempTargetX = targetC2_X;
				tempTargetY = targetC2_Y;
				break;
			case 'D2':
				tempTargetX = targetD2_X;
				tempTargetY = targetD2_Y;
				break;
		}

		for(var i = 0; i < numToSpawn; i++)
		{
			//console.log(tempSpawnX+(80*i*spawnDir), tempSpawnY, typeToSpawn, tempTargetX, tempTargetY);
			//var tempEnemy = new enemy(tempSpawnX+(180*i*spawnDir), tempSpawnY, typeToSpawn, tempTargetX, tempTargetY);
			

			enemyArr.push( new enemy(tempSpawnX+(80*i*spawnDir), tempSpawnY+(80*i*spawnDir), typeToSpawn, tempTargetX, tempTargetY));
			
		}

		
	}

	function NextWave()
	{
		if(currStage == 0)
		{
			currWave++;

			if(currWave == 2)
			{
				
				setTimeout(function() { spawnEnemies('A', 'A', 2, 1);  }, 1200);
				setTimeout(function() { spawnEnemies('B', 'B', 2, 1);  }, 1200);
				setTimeout(function() { NextWave();  }, 3000);
			}

			if(currWave == 3)
			{
				
				setTimeout(function() { spawnEnemies('C', 'C2', 3, 0);  }, 1200);
				setTimeout(function() { spawnEnemies('D', 'A2', 3, 0);  }, 1200);
				setTimeout(function() { NextWave();  }, 3000);
			}

			if(bonusWave) //bonus round
			{
				


				//add bonus
				//onStatsGUI
				

				//setTimeout(gameStartDelay, Start);
				//rndr.flashText(ctx, "STAGE "+currStage, 50);
				//play music

				Start();
			}
		}
		else if(currStage == 2)
		{
			currWave++;

			if(currWave == 2)
			{
				
				setTimeout(function() { spawnEnemies('A', 'A', 2, 1);  }, 2500);
				setTimeout(function() { spawnEnemies('B', 'B', 2, 1);  }, 2500);
				setTimeout(function() { NextWave();  }, 2000);
			}

			if(currWave == 3)
			{
				
				setTimeout(function() { spawnEnemies('B', 'D', 3, 0);  }, 3000);
				setTimeout(function() { spawnEnemies('A', 'C', 3, 0);  }, 3000);
				setTimeout(function() { NextWave();  }, 3000);
			}

			if(bonusWave) //bonus round
			{
				


				//add bonus
				//onStatsGUI
				

				//setTimeout(gameStartDelay, Start);
				//rndr.flashText(ctx, "STAGE "+currStage, 50);
				//play music

				Start();
			}
		}
		

	}


	enemyManager.prototype.NextStage = function()
	{
		//spawn non-shooting, fast units
	}	

	enemyManager.prototype.StartBonus = function()
	{
		//spawn non-shooting, fast units
	}

	enemyManager.prototype.DrawEnemies = function(context)
	{		
		if(currStage == 0 || currStage == 2)
		{

			for(var i =0; i < enemyArr.length;i++)
			{
				enemyArr[i].DrawEnemy(context);
				
				//
		        //drawing hitcircle
		        //console.log(enemyArr[i].getEnemyHitCirc());
		        //context.beginPath();
		        //context.arc(enemyArr[i].getEnemyHitCirc().x, enemyArr[i].getEnemyHitCirc().y, 
		       // 	enemyArr[i].getEnemyHitCirc().radius, 0, 2 * Math.PI, false);
		       // context.fillStyle = 'green';
		        //context.fill();
			}
		}
		else if(currStage == 1)
		{
			if(mb!=undefined)
			{
				mb.DrawMB(context);
			}
		}
		else if(currStage == 3)
		{
			if(enemyBoss!=null)
			{
				//console.log(enemyBoss);
				enemyBoss.drawBoss(context);
			}
		}
	}

	enemyManager.prototype.DrawEnemyMissiles = function(context)
	{		
		if(currStage == 0)
		{
			for(var i =0; i < enemyArr.length;i++)
			{
				//console.log("HERE");
				if(enemyArr[i] != null)
				{
					if(enemyArr[i].getEnemyMissile() != null)
					{
						//console.log(enemyArr[i].getEnemyMissile());
						context.drawImage(enemyArr[i].getEnemyMissile().getBkImg(), 
						enemyArr[i].getEnemyMissile().getXPos(), enemyArr[i].getEnemyMissile().getYPos(),
						enemyArr[i].getEnemyMissile().getMsSize(), enemyArr[i].getEnemyMissile().getMsSize());	
					}
				}
			}
		}
		else if(currStage == 1)
		{
			if(mb != undefined)
			{
				//mb.DrawMBMissiles(context);
			}
		}
		else if(currStage == 2)
		{
			for(var i =0; i < enemyArr.length;i++)
			{
				//console.log("HERE");
				if(enemyArr[i] != null)
				{
					if(enemyArr[i].getEnemyMissile() != null)
					{
						//console.log(enemyArr[i].getEnemyMissile());
						context.drawImage(enemyArr[i].getEnemyMissile().getBkImg(), 
						enemyArr[i].getEnemyMissile().getXPos(), enemyArr[i].getEnemyMissile().getYPos(),
						enemyArr[i].getEnemyMissile().getMsSize(), enemyArr[i].getEnemyMissile().getMsSize());	
					}
				}
			}
		}
	}

	function updateEnemyStage(plyrRef)
	{
		//
		//lineup
		lm.UpdateLineUpPositions(enemyArr);

		//
		//collisions
		var missiles = plyrRef.getMissiles();
		for(var m = 0; m < enemyArr.length; m++)
		{
			//primary
			if(	missiles[0] != null)
			{
				//
				//collision detection
				if(circleCollision(missiles[0].getMsHitCirc(), enemyArr[m].getEnemyHitCirc()) )
				{
					//
					//DIE
					//missiles[0] = null;
					//enemyArr[m].Die();
					console.log("HIT");
					
					//scoring and missile reset
					plyrRef.processHit(missiles[0], enemyArr[m]);
					enemyArr.splice(m,1);
				}
			}
			//secondary
			if(	missiles[1] != null)
			{
				//
				//collision detection
				if(circleCollision(missiles[1].getMsHitCirc(), enemyArr[m].getEnemyHitCirc() ))
				{
					//
					//DIE
					//missiles[1] = null;
					//enemyArr[m].Die();
					
					//scoring and missile reset
					plyrRef.processHit(missiles[1], enemyArr[m]);
					enemyArr.splice(m,1);
				}
			}
		}	


		//
		//enemy 'FSM'
		for(var i = 0; i < enemyArr.length; i++)
		{
			if(enemyArr[i] != null)
			{
				//
				//enemyArr[i].UpdateEnemy(context);	

				//console.log(enemyArr[i]);

				//
				if(enemyArr[i].getEnemyMissile() != null)
				{
					enemyArr[i].getEnemyMissile().updateMS();
					//console.log("Enemy Missile - "+ enemyArr[i].getEnemyMissile());
				}

				//console.log(this.enemyPosY);
				
				//
				//fire missiles
				var randomnumber = Math.floor(Math.random() * (10000 - 0 + 1)) + 0;

				if(enemyArr[i].getState() == 0)
				{
					if(randomnumber > 9940)
					{
						//console.log("FIRE!");
						enemyArr[i].fireMissile(enemyArr[i].getX(), enemyArr[i].getY());
						//console.log("Created missile at -  x: "+enemyArr[i].getX()+"  y: "
							//+enemyArr[i].getY());
					}
				}
				else if(enemyArr[i].getState() == 2)
				{
					if(randomnumber > 9980)
					{
						//console.log("FIRE!");
						enemyArr[i].fireMissile(enemyArr[i].getX(), enemyArr[i].getY());
						//console.log("Created missile at -  x: "+enemyArr[i].getX()+"  y: "
							//+enemyArr[i].getY());
					}
				}
				


			//round to nearest multiple of 2
				if(Math.ceil(enemyArr[i].getX()/2)*2 == 
					Math.ceil(enemyArr[i].getEnemyTargetX()/2)*2 && 
						Math.ceil(enemyArr[i].getY()/2)*2 == 
							Math.ceil(enemyArr[i].getEnemyTargetY()/2)*2 )
				{
					//console.log("Enemy "+ i+" made it to target");
					//
					//
					if(enemyArr[i].getState() == 0)
					{
						//console.log("MADE IT! - NOW IN STATE 1!");
						enemyArr[i].setState(2);
						
						//var pos = lm.findTargetPos(enemyArr, enemyArr[i].getEnemyType());
						//enemyArr[i].setEnemyTargetX(pos[0]);
						//enemyArr[i].setEnemyTargetY(pos[1]);
						
						//console.log("Headed to x:"+pos[0]+"  y:"+pos[1]);
						//enemyArr[i].findTargetInLineUp();
					}
					else if(enemyArr[i].getState() == 1)
					{
						//console.log("State 2");
						enemyArr[i].setState(2);
					}
					else if(enemyArr[i].getState() == 3)
					{
						enemyArr[i].setState(1);
					}
				}
				else
				{
					//console.log("Enemy not reached target");
					//console.log("Enemy"+ i + " x: "+ enemyArr[i].getX() + "  y: " +enemyArr[i].getY() +"   TARGET-  x: " +enemyArr[i].getEnemyTargetX()+" y:"+enemyArr[i].getEnemyTargetY() );
					
					//if enemyState2 --> should not allow moveTowards
					//if(enemyArr[i].getState() != 2)
					//{
					moveTowardsTarget(enemyArr[i]);
					//}
				}
				
				
				//enemyArr[i].UpdateEnemy(context);
				//console.log("Enemy"+ i +" -->   x: "+enemyArr[i].getX()+"  y: "+enemyArr[i].getY());
			}
		}
	}

	function moveTowardsTarget(tempEnemy)
	{
		if(tempEnemy.getX() < tempEnemy.getEnemyTargetX())
		{
			tempEnemy.setX(tempEnemy.getX() + tempEnemy.getEnemySpeed());
		}
		else if(tempEnemy.getX() > tempEnemy.getEnemyTargetX())
		{
			tempEnemy.setX(tempEnemy.getX() - tempEnemy.getEnemySpeed());	
		}
		else
		{
			//do nothing
			
		}

		if(tempEnemy.getY() < tempEnemy.getEnemyTargetY())
		{
			tempEnemy.setY(tempEnemy.getY() + tempEnemy.getEnemySpeed());
		}
		else if(tempEnemy.getY() > tempEnemy.getEnemyTargetY())
		{
			tempEnemy.setY(tempEnemy.getY() - tempEnemy.getEnemySpeed());	
		}
		else
		{
			//do nothing
		}


	}




    function distance(p0, p1) {
        var dx = p1.x - p0.x,
            dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    function circleCollision(c0, c1) {
        return distance(c0, c1) <= c0.radius + c1.radius;
    };


    enemyManager.prototype.getCurrStage = function(){return currStage;}

	return enemyManager;
})();