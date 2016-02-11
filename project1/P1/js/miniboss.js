var miniboss = (function (context) {

    var xPos;
    var yPos;
    var bkImg;
    var mbSize;
    var wallCollCounter;
    var vel;
    var direction;
    var bossMs;
    var numStreams;
    var canShoot;
    var shotDelay;
    var canShootTrackingMS;
    var trackingMS;

    var mbHealth;

    var hitCirc;

    var isAlive;

    //
    //state of miniboss
    //0 -- Entering
    //1 -- Attacking
    //2 -- Dead(Dieing?Exploding?)
    var mbState;


    function miniboss(inX, inY) 
    { // constructor
        
        this.xPos = inX;
        this.yPos=inY;
        this.mbSize = 180;
        this.bkImg = new Image();
        this.bkImg.src = "imgs/minibosssprites/mini1.png";
        this.vel = 5.5;
        this.direction = 1;
        this.wallCollCounter = 0;
        this.mbState = 0;
        bossMs= new Array();

        this.isAlive = true;

        this.canShoot = false;
        this.canShootTrackingMS = false;
        this.numStreams = 0;
        this.shotDelay = 0.5
        mbHealth = 10;
        hitCirc = {
            x: this.xPos+this.mbSize/2,
            y: this.yPos + this.mbSize/2,
            radius: this.mbSize/2-10
        };
    }

    miniboss.prototype.UpdateMB = function(plyrRef)
    {
        //console.log(this.xPos, this.yPos);
        if(this.mbState == 0)
        {
            if(this.yPos <= canvas.height/12)
            {
                this.yPos += 2;
            }
            else
            {
                this.mbState++;
                chooseNumStreams();
                this.canShoot = true;
                shoot(this.bossMs, this.xPos+this.mbSize/2, this.yPos+this.mbSize/2);
                //console.log("MADE IT TO START LOC");
            }

            //
            //check for collisions
            checkMSCollisions(plyrRef, this.mbState);
        }
        else if(this.mbState == 1)
        {
            //console.log("MADE IT TO STATE 1");
            //
            //shoot
            //msPrim = new missile(playerPosX, playerPosY, 0);  //type 0 for player missile
            
            //console.log(this.canShoot);
            if(this.canShoot && bossMs.length>0)
            {
                //console.log(canShoot);
                //console.log("THIS=====>"+this.canShoot);
                //if last missile added is this distance away from mb
                var dist = canvas.height/2;
                //console.log(bossMs);
                if(bossMs[bossMs.length-1].getYPos() > this.yPos + dist)
                {
                    shoot(this.bossMs, this.xPos+this.mbSize/2, this.yPos+this.mbSize/2);    
                    //this.canShoot = false;
                }
            }

            //
            //TRACKINGMISSILE
            if(canShootTrackingMS && trackingMS == null)
            {
                //console.log("shooting");
                shootTrackingMS(this.xPos+this.mbSize/2, this.yPos+this.mbSize/2);
            }

            if(trackingMS != null)
            {
                //console.log("UPDATING");
                trackingMS.updateMS(plyrRef);
                if(plyrRef.getMsPrim() != null)
                {
                    if(circleCollision(trackingMS.getMsHitCirc(), plyrRef.getMsPrim().getMsHitCirc() ))
                    {
                        console.log("HIT MB MISSILE!");
                        //plyrRef.getMsPrim().Die();
                        plyrRef.resetPrimMs();
                        trackingMS = null;
                    }
                }
                if(plyrRef.getMsSec() != null)
                {
                    if(circleCollision(trackingMS.getMsHitCirc(), plyrRef.getMsSec().getMsHitCirc() ))
                    {
                        plyrRef.resetSecMs();
                        trackingMS = null;
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
            if(this.xPos+(this.vel*this.direction) < canvas.width-this.mbSize &&
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
            checkMSCollisions(plyrRef, this.mbState);
            
        }
        else if(this.mbState == 2)
        {
            //death anim then
            //next stage ...

            this.isAlive = false;
        }


        //
        //health check
        if(mbHealth <= 0)
        {
            this.mbState++;
        }
        //console.log(this.xPos+" "+this.yPos);
       

        hitCirc.x = this.xPos+this.mbSize/2;
        hitCirc.y = this.yPos+this.mbSize/2;
    }

    miniboss.prototype.DrawMB = function(context)
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

        if(trackingMS != null)
        {
            //
            //drawing hitcircle
            //context.beginPath();
            //context.arc(trackingMS.getMsHitCirc().x, trackingMS.getMsHitCirc().y, 
                //trackingMS.getMsHitCirc().radius, 0, 2 * Math.PI, false);
            //context.fillStyle = 'green';
            //context.fill();

            trackingMS.DrawMS(context);
            //context.drawImage(trackingMS.getBkImg(), trackingMS.getXPos(), trackingMS.getYPos(),
                //trackingMS.getMsSize(), trackingMS.getMsSize());
        }

        if(this.mbState == 1)
        {
              
        }
        context.drawImage(this.bkImg, this.xPos, this.yPos,this.mbSize, this.mbSize);
    }

    function shoot(msArr, spawnX, spawnY)
    {
        //console.log("SHOOTING");
        var xRatio = canvas.width/this.numStreams;
        var tempMs;
        var targetPoints;

        switch(this.numStreams)
        {
            case 2:
                targetPoints = [canvas.width*-8,canvas.width*8];
                break;
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
            tempMs = new missile(spawnX, spawnY, 2);
            tempMs.setMsTargetX(xRatio*i);
            tempMs.setMsTargetY(8000);
            //console.log(tempMs);
            
            bossMs.push(tempMs);
        }
        //console.log(bossMs);
    }


    function chooseNumStreams()
    {
        var randomnumber = Math.floor(Math.random() * (4 - 4 + 1)) + 2;
        this.numStreams = randomnumber;

    }


    //TRACKING MISSILE
    function shootTrackingMS(xPosition, yPosition)
    {
        //console.log("Shooting");
        trackingMS = new missile(xPosition, yPosition, 3);

        canShootTrackingMS = false;
        //console.log(trackingMS);
        setTimeout(function() { 
            canShootTrackingMS = true;  }, 5500);
    }

    //
    //
    function checkMSCollisions(plyrRef, inState)
    {
        if(plyrRef.getMsPrim() != null)
        {
            
            if(circleCollision(hitCirc, plyrRef.getMsPrim().getMsHitCirc()))
            {
                console.log("MINIBOSS HIT");
                plyrRef.processMBHit(plyrRef.getMsPrim());
                processHit(inState);
            }

        }


        if(plyrRef.getMsSec() != null)
        {
            if(circleCollision(hitCirc, plyrRef.getMsSec().getMsHitCirc()))
            {
                plyrRef.procesMBHit(plyrRef.getMsSec());   
                processHit(inState);
            }
        }
    }


    function processHit(inState)
    {
        if(inState == 1)
        {
            console.log("miniboss HIT!!");
            mbHealth--;
            console.log(mbHealth);
            if(mbHealth < 8)
            {
                canShootTrackingMS = true;
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

    miniboss.prototype.getXPos = function () {return this.xPos;}
    miniboss.prototype.getYPos = function () {return this.yPos;}

    miniboss.prototype.getBkImg = function(){return this.bkImg;}
    miniboss.prototype.getIsAlive = function(){return this.isAlive;}
    miniboss.prototype.getMbSize = function(){return this.mbSize;}

    miniboss.prototype.getMbOrbs = function(){return bossMs;}
    miniboss.prototype.getHitCirc = function(){return hitCirc;}
    miniboss.prototype.getTrackingMS = function(){return trackingMS;}
    miniboss.prototype.resetTrackingMS = function(){trackingMS = null}

    return miniboss;
})();