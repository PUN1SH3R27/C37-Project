var happydogImg, dogImg,dog,garden,washroom,bedroom;
var database;
var feedtimeRef
var lastFed,currentTime
var foodS, foodStock;
var feedfood,addfood;
var foodObj;
var gameState, readState
function preload()
{
	dogImg= loadImage("Dog.png")
  happydogImg= loadImage("happy dog.png")
  garden=loadImage("Garden.png")
  washroom=loadImage("Wash Room.png")
  bedroom=loadImage("Bed Room.png")
}

function setup() {
  database = firebase.database();
	createCanvas(400, 500);

  foodObj= new Food()

  foodStock=database.ref('Food')
  foodStock.on("value",readStock)

  feedtimeRef=database.ref('FeedTime')
  feedtimeRef.on("value",function(data){
    lastFed=data.val()})

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val()
  })

  dog= createSprite(300,250,30,30)
  dog.addImage(dogImg)
  dog.scale=0.2
  
  feedfood = createButton('Feed the Dog');
  feedfood.mousePressed(feedDog)
  feedfood.position(360,75)

  addfood= createButton('Add Food');
  addfood.mousePressed(addFoods);
  addfood.position(460,75)

}


function draw() {  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feedfood.hide();
     addfood.hide();
     dog.remove();
   }else{
    feedfood.show();
    addfood.show();
    dog.addImage(dogImg);
   }
 
  drawSprites()
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happydogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}