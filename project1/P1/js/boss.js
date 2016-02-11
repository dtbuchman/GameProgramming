var boss = (function (context) {

    var xPos;
    var yPos;
    var bkImg;
    var bossSize;
    var wallCollCounter;
    var vel;
    var direction;
    var bossMs;
    var numStreams;
    var canShoot;
    var shotDelay;
    var canShootTrackingMSA;
    var trackingMSA;

    var bossHealth;

    var hitCirc;

    var isAlive;

    //
    //state of boss
    //0 -- Entering
    //1 -- Attacking
    //2 -- Dead(Dieing?Exploding?)
    var bossState;


    function boss(inX, inY) 
    { // constructor
        
        this.xPos = inX;
        this.yPos=inY;
        this.bossSize = 256;
        this.bkImg = new Image();
        this.bkImg.src = "imgs/bossBack.png";
        this.vel = 1;
        this.direction = 1;
        this.wallCollCounter = 0;
        this.bossState = 0;
        bossMs= new Array();

        this.isAlive = true;

        this.canShoot = false;
        this.canShootTrackingMSA = false;
        this.numStreams = 0;
        this.shotDelay = 0.5
        bossHealth = 6;
        hitCirc = {
            x: this.xPos+this.bossSize/2,
            y: this.yPos + this.bossSize/2,
            radius: this.bossSize/2
        };
    }

    boss.prototype.UpdateBoss = function(plyrRef)
    {
        if(this.bossState == 0)
        {
            if(this.yPos <= canvas.height/12)
            {
                this.yPos += this.vel;
            }
            else
            {
                this.bossState++;
                chooseNumStreams();
                this.canShoot = true;
                shoot(this.bossMs, this.xPos+this.bossSize/2, this.yPos+this.bossSize/2);
                //console.log("MADE IT TO START LOC");
            }

            //
            //check for collisions
            checkMSCollisions(plyrRef, this.bossState);
        }
        else if(this.bossState == 1)
        {
            //console.log("MADE IT TO STATE 1");
            //
            //shoot
            //msPrim = new missile(playerPosX, playerPosY, 0);  //type 0 for player missile
            
            //console.log(bossMs.length);
            if(this.canShoot && bossMs.length>0)
            {
                //console.log(canShoot);
                //console.log("THIS=====>"+this.canShoot);
                //if last missile added is this distance away from mb
                var dist = canvas.height/3;
                //console.log(bossMs);
                if(bossMs[bossMs.length-1].getYPos() > this.yPos + dist)
                {
                    shoot(this.bossMs, this.xPos+this.bossSize/2, this.yPos+this.bossSize/2);    
                    //this.canShoot = false;
                }
            }

            //
            //
            //
            //TRACKINGMISSILES
            if(canShootTrackingMSA && trackingMSA == null)
            {
                //console.log("shooting");
                shootTrackingMSA(this.xPos+this.bossSize/2, this.yPos+this.bossSize/2);
            }

            if(trackingMSA != null)
            {
                //console.log("UPDATING");
                trackingMSA.updateMS(plyrRef);
                if(plyrRef.getMsPrim() != null)
                {
                    if(circleCollision(trackingMSA.getMsHitCirc(), plyrRef.getMsPrim().getMsHitCirc() ))
                    {
                        console.log("HIT A MISSILE!");
                        plyrRef.resetPrimMs();
                        trackingMSA = null;
                    }
                }
                if(plyrRef.getMsSec() != null)
                {
                    if(circleCollision(trackingMSA.getMsHitCirc(), plyrRef.getMsSec().getMsHitCirc() ))
                    {
                        plyrRef.resetSecMs();
                        trackingMSA = null;
                    }
                }
            }
            



            //bullet fire rate
            //setTimeout(shootingDelay(), this.shotDelay);
            
            //update missiles
            if(bossMs != undefined)
            {   
                for(var i =0; i < bossMs.length;i++)
                {
                    //console.log("HERE");
                    if(bossMs[i] != null)
                    {
                        if(bossMs[i].getYPos() > canvas.height*2)
                        {
                            bossMs.splice(i,1);
                        }
                        else
                        {
                            bossMs[i].updateMS();      
                        }
                        
                    }
                }
            }

            if(this.yPos >= canvas.height/30)
            {
                this.yPos -= this.vel;
            }

            //
            //move left/right
            if(this.xPos+(this.vel*this.direction) < canvas.width-this.bossSize &&
                this.xPos+(this.vel*this.direction) > 0 )
            {
                this.xPos+= (this.vel*this.direction);
            }
            else
            {
                this.direction *= -1;
                chooseNumStreams();
            }

             //
            //check for collisions
            checkMSCollisions(plyrRef, this.bossState);
            
        }
        else if(this.bossState == 2)
        {
            //death anim then
            //next stage ...

            this.isAlive = false;
        }


        //
        //health check
        if(bossHealth <= 0)
        {
            this.bossState++;
        }


        hitCirc.x = this.xPos+this.bossSize/2;
        hitCirc.y = this.yPos+this.bossSize/2;
    }

    boss.prototype.drawBoss = function(context)
    {
        //
        //drawing hitcircle
        //context.beginPath();
        //context.arc(hitCirc.x, hitCirc.y, hitCirc.radius, 0, 2 * Math.PI, false);
        //context.fillStyle = 'green';
        //context.fill();

        if(bossMs != undefined)
        {   
            for(var i =0; i < bossMs.length;i++)
            {
                //console.log("HERE");
                if(bossMs[i] != null)
                {
                    
                    //console.log(bossMs[i].getEnemyMissile());
                    context.drawImage(bossMs[i].getBkImg(), 
                      bossMs[i].getXPos(), bossMs[i].getYPos(),
                      bossMs[i].getMsSize(), bossMs[i].getMsSize());  
                    
                }
            }
        }

        if(trackingMSA != null)
        {
            //
            //drawing hitcircle
            //context.beginPath();
            //context.arc(trackingMS.getMsHitCirc().x, trackingMS.getMsHitCirc().y, 
                //trackingMS.getMsHitCirc().radius, 0, 2 * Math.PI, false);
            //context.fillStyle = 'green';
            //context.fill();

            trackingMSA.DrawMS(context);
            //context.drawImage(trackingMS.getBkImg(), trackingMS.getXPos(), trackingMS.getYPos(),
                //trackingMS.getMsSize(), trackingMS.getMsSize());
        }

       

        if(this.bossState == 1)
        {
              
        }
        context.drawImage(this.bkImg, this.xPos, this.yPos,this.bossSize, this.bossSize);
    }

    function shoot(msArr, spawnX, spawnY)
    {
        //console.log("SHOOTING");
        var xRatio = canvas.width/this.numStreams;
        var tempMs;
        var targetPoints;

        switch(this.numStreams)
        {
            case 3:
                targetPoints = [canvas.width*-8, canvas.width/2, canvas.width*8];
                break;
            case 4:
                targetPoints = [ canvas.width*-8, 0,
                 canvas.width, canvas.width*8];
                break;
            
        }

        //console.log(targetPoints);

        for(var i = 0; i < this.numStreams; i++)
        {
            tempMs = new missile(spawnX, spawnY, 4);
            tempMs.setMsTargetX(xRatio*i);
            tempMs.setMsTargetY(8000);
            //console.log(tempMs);
            
            bossMs.push(tempMs);
        }
        //console.log(bossMs);
    }


    function chooseNumStreams()
    {
        //FOR BOSS
        var randomnumber = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
        this.numStreams = randomnumber;

    }

    //
    //
    //TRACKING MISSILES
    function shootTrackingMSA(xPosition, yPosition)
    {
        //console.log("Shooting");
        trackingMSA = new missile(xPosition, yPosition, 3);

        canShootTrackingMSA = false;
        //console.log(trackingMS);
        setTimeout(function() { 
            canShootTrackingMSA = true;  }, 15000);
    }
   
    //
    //
    function checkMSCollisions(plyrRef, inState)
    {
        if(plyrRef.getMsPrim() != null)
        {
            
            if(circleCollision(hitCirc, plyrRef.getMsPrim().getMsHitCirc()))
            {
                console.log(hitCirc);
                plyrRef.processBossHit(plyrRef.getMsPrim());
                processHit(inState);
            }
        }
        if(plyrRef.getMsSec() != null)
        {
            if(circleCollision(hitCirc, plyrRef.getMsSec().getMsHitCirc()))
            {
                plyrRef.procesBossHit(plyrRef.getMsSec());   
                processHit(inState);
            }
        }
    }


    function processHit(inState)
    {
        if(inState == 1)
        {
            console.log("boss HIT!!");
            bossHealth--;
            console.log(bossHealth);
            if(bossHealth < 5)
            {
                canShootTrackingMSA = true;
                //console.log("CAN SHOOT MS");
            }
        }
    }



    function distance(p0, p1) {
        var dx = p1.x - p0.x,
            dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    function circleCollision(c0, c1) {
        //console.log(c0,c1);
        return distance(c0, c1) <= c0.radius + c1.radius;
    };

    boss.prototype.getXPos = function () {return this.xPos;}
    boss.prototype.getYPos = function () {return this.yPos;}

    boss.prototype.getBkImg = function(){return this.bkImg;}
    boss.prototype.getIsAlive = function(){return this.isAlive;}
    boss.prototype.getBossSize = function(){return this.bossSize;}


    boss.prototype.getBossOrbs = function(){return bossMs;}
    boss.prototype.getHitCirc = function(){return hitCirc;}
    boss.prototype.getTrackingMS = function(){return trackingMSA;}
    boss.prototype.resetTrackingMS = function(){trackingMSA = null}

    return boss;
})();