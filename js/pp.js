
var pa;

var pmode=0;
var _font;

function setup(){
	var can=createCanvas(200,windowHeight);
	can.parent('pp_canvas');

	pa=new PAnimal(0,0);

	_font=loadFont("font/EnvyCodeR-Italic.ttf");
}
function draw(){
	background(255);
	// fill(255,20);
	// rect(0,0,width,height);
	// rotate(HALF_PI*3);
	drawLine();

	pa.Draw(true);
	pa.Draw(false);

	fill(180);
	noStroke();
	textFont(_font);
	textSize(12);
	if(frameCount%60<30) text("CLICK!",20,20);

	if(pa._y>height) pa=new PAnimal(pa._x,pa._y);
}
function keyPressed(){
	if(key=='s'){
		pmode=(pmode+1)%2;
		pa.Change(pmode);
	}
}
function mousePressed(){
	// if(random(2)<1){
		pmode=(pmode+1)%2;
		pa.Change(pmode);
	 // }//else{
	// 	pa=new PAnimal(0,0);
	// }
}
function drawLine(){
	
	push();
	fill(120,120);
	noStroke();
	textSize(6);

	// for(var i=0;i<20;++i){
	// 	var n=i*10;
	// 	push();
	// 	translate(3,height/20*i);	
	// 	rotate(HALF_PI);

	// 	text(n,random(-.5,.5),random(-.5,.5));

	// 	pop();
	// }

	beginShape();
	for(var i=0;i<20;++i){		
		vertex(0+5*sin(frameCount/20+i/20*PI+random(-.5,.5)),height/20*i+random(-1,1));			
	}
	endShape();
	pop();
}