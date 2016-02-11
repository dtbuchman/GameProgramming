var missile = (function (context) {

    var velocity;
    var xPos;
    var yPos;
    var MSType; //0-player,  1-enemy  2-miniboss  3- Tracking MS
    var bkImg;
    var msSize;
    var msTargetX;
    var msTargetY;
    var hitCirc;
    //
    //sprite variables
    var sprite;
    var numOfFrames;
    var currFrame;
    var spriteWidth, spriteHeight;
    

    function missile(inX,inY,msType) { // constructor
        
        this.xPos = inX;
        this.yPos=inY;
        this.MSType = msType;
        this.msSize = 64;
        this.bkImg = new Image();
        this.sprite= new Image();

        if(this.MSType == 0)
        {
            this.velocity = -16;
            this.bkImg.src = "imgs/bulletBlue.png";
        }
        else if(this.MSType == 1)
        {
            this.velocity = 8;
            this.bkImg.src = "imgs/bulletRed.png";
        }
        else if(this.MSType == 2)
        {
            this.msSize = 24;
            this.velocity = 3;
            this.bkImg.src = "imgs/alien101.png";
            this.msTargetX = canvas.width/2;
            this.msTargetY = canvas.height;
        }
        else if(this.MSType == 3)
        {
            this.velocity = 2;
            this.sprite.src = "imgs/trackingSpritesheet.png";
            this.currFrame = 0;
            this.numOfFrames = 8;
            this.spriteHeight = 150;
            this.spriteWidth = 90;
            this.msSize = 48;
            //setTimeout(function() { Die();  }, 4000);
        }
        else if(this.MSType == 4)
        {
            this.msSize = 24;
            this.velocity = 4;
            this.bkImg.src = "imgs/alien102.png";
            this.msTargetX = canvas.width/2;
            this.msTargetY = canvas.height;
        }

        this.hitCirc = {
            x: this.xPos+this.msSize/2,
            y: this.yPos+this.msSize/2,
            radius: this.msSize/2-10
        };

    }

    missile.prototype.updateMS = function(plyrRef)
    {
        if(this.MSType == 0 || this.MSType == 1)
        {
            this.yPos += this.velocity;
        }
        else if(this.MSType == 2 || this.MSType == 4)//MB
        {
            if(this.msTargetX != undefined && this.msTargetY != undefined)
            {
                //console.log(this.msTargetY);
                if(this.xPos < this.msTargetX)
                {
                    this.xPos+=(this.velocity/2);
                }
                else if(this.xPos > this.msTargetX)
                {
                    this.xPos-=(this.velocity/2);
                }
                else
                {
                    //do nothing
                    
                }

                if(this.yPos < this.msTargetY)
                {
                    this.yPos+=this.velocity;
                }
                else if(this.yPos > this.msTargetY)
                {
                    this.yPos-=this.velocity;
                }
                else
                {
                    //do nothing
                }
                    
            }
        }
        else if(this.MSType == 3)//TRK
        {
            //console.log("UPDATING TRACKING");
            if(this.xPos < plyrRef.getX())
                {
                    this.xPos+=(this.velocity);
                }
                else if(this.xPos > plyrRef.getX())
                {
                    this.xPos-=(this.velocity);
                }
                else
                {
                    //do nothing
                    
                }

                if(this.yPos < plyrRef.getY())
                {
                    this.yPos+=this.velocity;
                }
                else if(this.yPos > plyrRef.getY())
                {
                    this.yPos-=this.velocity;
                }
                else
                {
                    //do nothing
                }
        }
        //checkCollisions(); ?
        //return value if coll, for player secMiss val
       
        this.hitCirc.x = this.xPos+this.msSize/2;
        this.hitCirc.y = this.yPos+this.msSize/2;

        if(this.yPos < 0 || this.yPos > 810)
        {//DIE
            //Explode();
            //return null;
            //Die();
           
            
        }

    }

    missile.prototype.DrawMS = function(context)
    {
        if( this.MSType == 3)
        {
            //console.log("HERE");
            context.drawImage(this.sprite, this.spriteWidth * this.currFrame, 0,
                this.spriteWidth, this.spriteHeight, this.xPos, this.yPos, this.msSize, this.msSize);
             if (this.currFrame == this.numOfFrames) 
             {
                 this.currFrame = 0;
             } 
             else {
                 this.currFrame++;
               }
        }
    }


    //death
    missile.prototype.Die = function () {return null;}


    missile.prototype.getXPos = function () {return this.xPos;}
    missile.prototype.getYPos = function () {return this.yPos;}

    missile.prototype.getVelocity = function () {return this.velocity;}

    missile.prototype.getBkImg = function(){return this.bkImg;}
    missile.prototype.getMsSize = function(){return this.msSize;}
    missile.prototype.getMsHitCirc = function(){return this.hitCirc;}
    missile.prototype.setMsTargetX = function(inX){this.msTargetX = inX}
    missile.prototype.setMsTargetY = function(inY){this.msTargetY = inY}

    return missile;
})();