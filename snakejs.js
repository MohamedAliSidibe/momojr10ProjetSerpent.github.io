window.onload=function()
{
    var canvas,contexte,delaie,x,y;
    var canvasWidth,canvasHeight,blockSize;
    canvasWidth=900;
    canvasHeight=600;
    x=0;
    y=0;
    blockSize=30;
    delaie=100; //1 sec donc 1000 mlsec
    var snakee;
    var applee;
    var widthInBlocks=canvasWidth/blockSize;
    var heightInBlocks=canvasHeight/blockSize;
    var score;
    init();
    function init()
    {
         canvas=document.createElement('canvas');
         canvas.height=canvasHeight;
         canvas.width=canvasWidth;
         canvas.style.border="30px solid gray";
         canvas.style.margin="50px auto";
         canvas.style.display="block";
         canvas.style.backgroundColor="#ddd"
         document.body.appendChild(canvas);// pour attacher à notre page htlm
    // document de notre page htlm 
    // en donnant le tag body de notre html
    // et appenchild qui permet d'accrocher un tag qui sera
    //le canvas qu'on a creer.
    // Le canvas c'est element qui permet de dessiner notre page htlm
          contexte=canvas.getContext('2d');
    // pour dessiner on utilise le contexte
            snakee=new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
            applee=new Apple([10,10]);// x et y de la pomme
            score=0;
           refreshCanvas();
    }
   
    function refreshCanvas()
    {     
        if(snakee.checkcollision())
        {
            gameOver();
            //GAME OVER
        }
        else{
            if(snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple=true;
                do{
                    applee.setNewPositionApple();
                  }
                while(applee.isOnSnake(snakee))

            }
         contexte.clearRect(0,0,canvasWidth,canvasHeight);
         // c'est supprimer le contenue de notre canvas 
         drawScore();
         snakee.draw();
         snakee.advance();
         applee.draw();
         setTimeout(refreshCanvas,delaie)
         //refaire le fonction tant que le delai est passe
        }
    }
    function gameOver()
    {
        contexte.save();
        contexte.font="bold 70px sans-serif";
        contexte.fillStyle="#000";
        contexte.textAlign="center";
        contexte.textBaseline="middle";
        contexte.strokeStyle="white";
        contexte.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        contexte.strokeText("Game Over", centreX, centreY -180);
        contexte.fillText("Game Over", centreX, centreY -180);
        contexte.font = "bold 30px sans-serif";
        contexte.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        contexte.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        /*contexte.lineWidth=5;
        contexte.strokeText("Game Over",canvasWidth /2,canvasHeight /2 -180);// pour cacher l'ecriture
        contexte.fillText("Game Over",canvasWidth/2,canvasHeight/2 -180);
        contexte.font="bold 30px sans-serif";
        contexte.strokeText("Appuyer sur la touche espace pour rejouer",canvasWidth/2,canvasHeight/2 -120);
        contexte.fillText("Appuyer sur la touche espace pour rejouer",canvasWidth/2,canvasHeight/2 -120);*/
        contexte.restore();
    }
    function restart(){
        snakee=new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee=new Apple([10,10]);// x et y de la pomme
        score=0;
       refreshCanvas();

    }
    function drawScore(){
        contexte.save();
        contexte.font="bold 200px sans-serif";
        contexte.fillStyle="gray";
        contexte.textAlign="center";
        contexte.textBaseline="middle";
        contexte.fillText(score.toString(),canvasWidth/2 ,canvasHeight/2);
        contexte.restore();
    }
    function drawBlock(contexte,position)
    {
        var x=position[0]* blockSize;
        var y=position[1]* blockSize;
        contexte.fillRect(x,y,blockSize,blockSize);
    }
    
    function Snake(body,direction)
    {
        this.body=body;
        this.direction=direction;
        this.ateApple=false;
        this.draw=function(){

            contexte.save;
            contexte.fillStyle="#ff0000";
            for(var i=0; i< this.body.length; i++)
            {
                drawBlock(contexte,this.body[i]);
            }
            contexte.restore();

        };
    
        this.advance=function()
        {
            var nextPosition=this.body[0].slice();
            //slice va donner l'element copier
            
            switch(this.direction)
            {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            // unshift permet de rajouter le nextPosition a la tete
            if(!this.ateApple)
            {
                this.body.pop();
            }// si il mange le pomme le serpent s'agrandit.
            else{
                this.ateApple=false;
            }
        };

    this.setDirection= function(newDirection){
        var directionPermise ;
        switch(this.direction)
        {
            case "left":
            case "right":
               directionPermise=["up","down"];  
               break;
            case "down":
            case "up":
                directionPermise=["left","right"];
                break;
            default:
                    throw("Invalid Direction");
        }
        if (directionPermise.indexOf(newDirection) > -1)
        {
            this.direction=newDirection;
        }
    };
    
 this.checkcollision=function()
 {
     var collisionmur=false;
     var snakeCollision=false;
     var head=this.body[0];// Ma tete du serpent
     var rest=this.body.slice(1); /// copie le reste du corps du snake sans sa tete
     var snakeX=head[0];
     var snakeY=head[1];
     var minX=0;
     var minY=0;
     var maxX=widthInBlocks-1;
     var maxY=heightInBlocks-1;
     var isNotBetweenHorizontalWalls=snakeX<minX || snakeX>maxX;
     var isNotBetweenVerticalWalls=snakeY<minY || snakeY>maxY;
     if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
     {
         collisionmur=true;// savoir si le serpent c'est cogner le mur
     }
     for(var i=0;i< rest.length;i++)
     {
        if(snakeX===rest[i][0] && snakeY===rest[i][1] )
        {
            // verifier si le snake ne s'est pas fait lui meme une colision
            snakeCollision=true;

        }
     }
     return collisionmur || snakeCollision;

 };
 this.isEatingApple=function(appleToEat)
 {
     var head=this.body[0];
     if(head[0]===appleToEat.position[0] && head[1]===appleToEat.position[1])
     {
        return true;
     }
     else{
         return false;
     }
 }
}
    function Apple (position)
    {
        this.position=position;
        this.draw=function()
        {
            contexte.save();
            contexte.fillStyle="#33cc33";
            contexte.beginPath();
            var rayon=blockSize/2;
            var xballe=this.position[0]* blockSize+ rayon;
            var yballe=this.position[1]*blockSize + rayon;
            contexte.arc(xballe,yballe,rayon,0,Math.PI*2,true);
            contexte.fill();
            contexte.restore();
            
        };
        this.setNewPositionApple=function()
        {
            var newX=Math.round(Math.random()* (widthInBlocks-1));
            var newY=Math.round(Math.random()* (heightInBlocks-1));
            this.position=[newX,newY];
        };// la nouvelle position de la pomme
        this.isOnSnake=function(snakeToCheck)
        {
            var isOnSnake=false;
            for(var i=0;i< snakeToCheck.body.length; i++)
            {
                if(this.position[0]===snakeToCheck.body[i][0] && this.position[1]===snakeToCheck.body[i][1])
                    {
                        isOnSnake=true;
                    }
            }
            return isOnSnake;
        };//connaitre si la pomme est au dessous de notre snake
    }



document.onkeydown= function handleKeyDown(e)
//quand l'utilisateur appuie une touche de son clavier les ecouteurs.
 {
    var key=e.keyCode;
    // pour connaitre le touche de notre code qui a ete appuye
    var newDirection;
    switch(key)
    {
        case 37:
            newDirection="left";
            break;
        case 38:
            newDirection="up";
            break;
        case 39:
            newDirection="right";
            break;
        case 40:
            newDirection="down";
            break;
        case 32:
             restart();
             return;
        default:
            return;
    }
    snakee.setDirection(newDirection);
 };
}