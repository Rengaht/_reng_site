function PAnimal(x_,y_){
	this._x=x_;
	this._y=y_;
	this._z=random(20,100);
	this._wid=80*random(.8,1.4);
	this._hei=this._wid*random(.3,.8);

	var hportion=random(.3,.5);
	var vportion=random(.4,.8);

	this._body_wid=this._wid*(1-hportion);
	this._body_hei=this._hei*random(.3,.45);

	this._head_wid=this._wid*hportion;
	this._head_hei=this._body_hei*random(.4,.8);
	
	this._mleg=parseInt(random(3,6));
	this._leg_wid=this._body_wid/this._mleg*random(.2,.4);
	this._leg_hei=this._hei-this._body_hei;
	this._leg_span=new Array();
	for(var i=0;i<this._mleg;++i) this._leg_span.push(random(0.05,0.5));

	this._fcolor=color(random(100,255),(random(20,80)+100),random(20,85));

	

	this._phi=Math.random()*Math.PI*2.0;

	this._land_vel=random(4,6);
	this._elastic_strength=this._land_vel/10*random(1,3);

	this._run_vel=50;
	this._move_vel;
	this._wheel_vel=27;
	this._skate_vel=60;

	this.first_foot_base=createVector();
	this.last_foot_base=createVector();
	

	this._cur_mode;
	this._dest_mode;
	this._anim_mode_change=new FrameAnimation(random(30,50),random(0,50));
	this._src_ang=0;
	this._dest_ang=0;

	this._calib_vel=createVector(0,0);

	this._shear_ang=createVector(random(-PI/6,PI/6),random(0,PI/12));
	this._head_ang=-PI/8;

	this.Init();
}	


PAnimal.prototype.Init=function(){
		this._cur_mode=0;
		this._dest_mode=0;
		this._move_vel=createVector(this._land_vel,0);
		// this.Update();
	
		// this._shapeObject=new THREE.Line(this._geo,this._mat);
		// this._shapeObject.position.setX(this._x);
		// this._shapeObject.position.setY(this._y);
		//scene_.add(this._shapeObject);
			
		//this._shapeObject.position=new THREE.Vector3(this._x,this._y,0);
};
PAnimal.prototype.Change=function(mode_){

	this._move_vel=createVector(this._land_vel,0);

	this._src_ang=lerp(this._src_ang,this._dest_ang,this._anim_mode_change.getPortion());
	this._anim_mode_change.restart();

	switch(mode_){
		case 0:
			this._dest_ang=0;
			break;
		case 1:
			this._move_vel.rotate(PI/4);
			this._dest_ang=PI/4;
			break;
		case 2:
			this._move_vel.rotate(-PI/8);
			this._dest_ang=-PI/8;
			break;
	}

	this._dest_mode=mode_;

	// console.log('change to mode: '+this._dest_mode);

};
PAnimal.prototype.Update=function(){

	if(this._cur_mode==this._dest_mode){
		var a=frameCount/this._land_vel+this._phi;

		var sp1_=.5;//map(_control_val[3],0,1024,.5,3);
		//float sp2_=map(_control_val[2],0,1024,0.5,3);

		// this._x+=(this._move_vel.x)*abs(sin(a)*.3+.8)*sp1_+this._calib_vel.x;
		// this._y+=(this._move_vel.y)*abs(sin(a)*.3+.8)*sp1_+this._calib_vel.y;		
		// this._x+=(this._move_vel.x)*abs(sin(a)*.3+.8)*sp1_;
		if(this._cur_mode==0) this._y+=(this._move_vel.mag())*abs(sin(a)*.3+.8)*sp1_;	
		this._y%=(height+this._wid*2);

	}else{
		if(this._anim_mode_change.getPortion()==1) this._cur_mode=this._dest_mode;		
		
		var t=this._anim_mode_change.getPortion();
		if(this._dest_mode==1) this._head_ang=(PI/8-this._head_ang*t);
		else this._head_ang=(-PI/8-this._head_ang*t);
	}
	this._anim_mode_change.update();
	
};
PAnimal.prototype.checkSpeed=function(mid_){
		
		this._calib_vel.mult(0);

		var c=createVector(mid_.x-this._x,mid_.y-this._y);
		var dir=createVector(this._land_vel,0);
		if(this._cur_mode==1) dir.rotate(PI/4);
		else if(this._cur_mode==2) dir.rotate(-PI/8);

		var sp_=.8;//map(_control_val[2],0,1024,5,.5);
		//dir.setMag(constrain(c.mag(),0,1.5));
		dir.setMag(sp_);

		var dot=c.dot(dir);
		
		if(dot>0) this._calib_vel.add(dir);
		if(dot<0) this._calib_vel.sub(dir);
		 
		 // console.log(this._calib_vel);

		// if(_cur_mode!=0) c.setMag(constrain(c.mag(),0,1));
		// else c.setMag(0);
		
		//_calib_vel=c.get();
		if(random(10)<1) this._move_vel.mult(random(.95,1.05));
		
};
PAnimal.prototype.checkCollide=function(pos_){
	var len=pos_.length;		
	for(var i=0;i<len;++i){
		var p=pos_[i];
		if(dist(p.x,p.y,this._x,this._y)<120){
			var dir=createVector(this._x-p.x,this._y-p.y);
			// dir.setMag(map(_control_val[2],0,1024,0.5,5));
			dir.setMag(1);
			this._calib_vel.add(dir);
		}
	}

};

PAnimal.prototype.Draw=function(draw_fill){

		this.Update();
		

		var theta=frameCount/10.0+this._phi;

		var draw_portion=1.5*Math.abs(Math.sin(frameCount/(120/this._land_vel)));
		var elastic_portion=.6+this._elastic_strength*Math.abs(Math.sin(frameCount/(180/this._land_vel)+this._phi));

		// console.log(draw_portion);

		var cur_body_wid=this._body_wid;
		//(this._cur_mode==0)?this._body_wid*elastic_portion:this._body_wid;


		

		push();
		translate(this._x,this._y);

		translate(this._body_wid/2,this._body_hei);
		rotate(HALF_PI);
		if(this._dest_mode==1){
			var t=this._anim_mode_change.getPortion();
			shearX(this._shear_ang.x*t);	
			shearY(this._shear_ang.y*t);	
			// translate(0,this._leg_hei/2*t)


		} 
		translate(-this._body_wid/2,-this._body_hei);

		// if(this._cur_mode==1) this._skateboard.Draw();
		// if(this._cur_mode==2) for(var i=0;i<2;++i) this._firewheel[i].Draw(true);


		if(this._dest_mode!=this._cur_mode){
			var t=this._anim_mode_change.getPortion();
			switch(this._dest_mode){
				case 1:
					// if(draw_fill) this._skateboard.Draw(draw_fill,-width*(1-t),0);
					break;
				case 2:
					// this._firewheel[0].SetPos(this.first_foot_base);
					// this._firewheel[1].SetPos(this.last_foot_base);
					// if(draw_fill)
					// 	for(var i=0;i<2;++i) this._firewheel[i].Draw(draw_fill,-width*(1-t),0);
					break;
			}
			translate(0,-this.body_hei*abs(sin(t*TWO_PI*2)));
		}else{
			switch(this._cur_mode){
			case 0:
				//if(elastic_stage!=0) pg.translate(body_wid*(0.6+elastic_strength)-cur_body_wid,0);
				break;
			case 1:			
				// if(draw_fill){
				// 	this._skateboard.Draw(draw_fill,0,0);	
				// 	this._skateboard.Draw(!draw_fill,0,0);	
				// }
				break;
			case 2:
				// this._firewheel[0].SetPos(this.first_foot_base);
				// this._firewheel[1].SetPos(this.last_foot_base);

				// var frame_portion=frameCount/(this._wheel_vel/this._land_vel)+this._phi;
				// var stage=parseInt((frame_portion%TWO_PI)/(PI/2));
				// if(stage>1 && draw_fill)
				// 	for(var i=0;i<2;++i) this._firewheel[i].Draw(draw_fill,0,0);
			
				break;
			}
		}

		if(draw_fill){
			fill(this._fcolor);
			noStroke();
		}else{
			stroke(0,120);
			noFill();
		}
		beginShape();
		vertex(0,0);
		bezierVertex(cur_body_wid/3,-this._body_hei*.3*draw_portion,
						 			cur_body_wid/3*2,-this._body_hei*.3*draw_portion,
						 			cur_body_wid,0);


		var ear_base1=createVector(this._head_hei*.8,0);
		ear_base1.rotate((-Math.PI/3)*draw_portion-Math.PI/6-Math.PI/4);
		var ear_base2=createVector(this._head_hei*.8,0,0);
		ear_base2.rotate(-Math.PI/3*draw_portion-Math.PI/4);
		
		bezierVertex(cur_body_wid+ear_base1.x,ear_base1.y,
									cur_body_wid+ear_base2.x,ear_base2.y,
					  				cur_body_wid+this._head_wid*.1,0);


		var h1=createVector(this._head_wid*.5,0);
		h1.rotate(this._head_ang);

		var h2=createVector(this._head_wid,this._body_hei);
		h2.rotate(this._head_ang);


		bezierVertex(cur_body_wid+h1.x,-this._body_hei*.1*draw_portion+h1.y,
					 cur_body_wid+h2.x,this._body_hei*.4*draw_portion+h2.y,
					 cur_body_wid,this._head_hei);
		vertex(cur_body_wid*(1-this._leg_span[0]/this._mleg),this._body_hei);
		// this._curvePath.add(new THREE.LineCurve(new THREE.Vector3(cur_body_wid,-this._head_hei,0),
		// 										new THREE.Vector3(cur_body_wid*(1-this._leg_span[0]/this._mleg),-this._body_hei,0)));

		for(var i=0;i<this._mleg;++i){
			 if(i>0) vertex(cur_body_wid*(1.0-(i+this._leg_span[i])/this._mleg),this._body_hei);

			if(this._cur_mode!=this._dest_mode){
				this.drawJumpLeg(cur_body_wid*(1.0-(i+this._leg_span[i])/this._mleg),this._body_hei,this._leg_wid,this._leg_hei,i);
				continue;	
			} 

			if(this._cur_mode==1) this.drawSleepLeg(cur_body_wid*(1.0-(i+this._leg_span[i])/this._mleg),this._body_hei,this._leg_wid,this._leg_hei,i);
			else if(this._cur_mode==0) this.drawRunLeg(cur_body_wid*(1.0-(i+this._leg_span[i])/this._mleg),this._body_hei,this._leg_wid,this._leg_hei,i);
			// else if(this._cur_mode==2) this.drawWheelLeg(cur_body_wid*(1.0-(i+this._leg_span[i])/this._mleg),this._body_hei,this._leg_wid,this._leg_hei,i);
			//console.log(cur_body_wid*(1.0-(i+this._leg_span[i])/this._mleg));
		}
		bezierVertex(-cur_body_wid*.1*draw_portion,this._body_hei,
					 				-cur_body_wid*.1*draw_portion,0,
					 				0,0);
		endShape(); 


		if(!draw_fill){
			stroke(red(this._fcolor)/1.1,green(this._fcolor)/1.1,blue(this._fcolor)/1.3);
			beginShape();
			for(var i=0;i<50;++i){
					// pg.strokeWeight(random(2));
					var n=noise((i+frameCount+this._land_vel));
					var n2=noise(i*this._land_vel);
					vertex(n*cur_body_wid,
							   map(n2,0,1,-this._body_hei*.1,this._body_hei/2));
			
			}
			endShape();
		}

		if(this._dest_mode!=this._cur_mode){
			var t=this._anim_mode_change.getPortion();
			switch(this._cur_mode){
				case 1:
					// if(draw_fill) this._skateboard.Draw(draw_fill,-width*t,0);
					break;
				case 2:
					// if(!draw_fill)
					// 	for(var i=0;i<2;++i) this._firewheel[i].Draw(draw_fill,-width*t,0);
					break;
			}
		}else{
			switch(this._cur_mode){
				case 0:
					//if(draw_fill) drawLand(pg);
					break;
				case 2:
					// if(!draw_fill){
					// 	for(var i=0;i<2;++i) this._firewheel[i].Draw(draw_fill,0,0);
					// }
					break;
			}
		}


	
		
		pop();
};

PAnimal.prototype.drawRunLeg=function(lx,ly,lw,lh,leg_index){
	var frame_portion=frameCount/(this._run_vel/this._land_vel)+this._phi;
	var stage=parseInt((frame_portion%(Math.PI*2))/(Math.PI/2));
	
	var kang=-Math.PI/2.5*(Math.sin(frame_portion));
	if(leg_index%2==1) kang=-Math.PI/2.5*(Math.sin(frame_portion+Math.PI/2));
	var fang=0;//kang+PI/1.8;
	
	switch(stage){
		case 0:
			fang=kang+Math.PI/2.6;//*(sin(frame_portion));
			break;
		case 1:
			fang=kang+Math.PI/2.6*Math.sin(frame_portion);
			break;
		case 2:
			fang=kang;
			break;		
		case 3:
			fang=kang+Math.PI/2.6*(1-Math.abs(Math.sin(frame_portion)));
			break;
			
	}
	this.drawLeg(kang,fang,lx,ly,lw,lh,leg_index);
};
PAnimal.prototype.drawLeg=function(kang,fang,lx,ly,lw,lh,leg_index){
		var knee_base=createVector(0,lh/2,0);
		knee_base.rotate(kang);

		var foot_base=createVector(0,lh/2,0);
		foot_base.rotate(fang);
		

		var foot_base2=createVector(-lw,lh/2,0);
		foot_base2.rotate(fang);
	

		foot_base.add(knee_base);
		foot_base2.add(knee_base);
		
		
		bezierVertex(lx+knee_base.x,ly+knee_base.y,
							lx+foot_base.x,ly+foot_base.y,
							lx+foot_base.x,ly+foot_base.y);
		
		vertex(lx+foot_base2.x,ly+foot_base2.y);
		
		bezierVertex(lx-lw+knee_base.x,ly+knee_base.y,
							lx-lw+knee_base.x,ly+knee_base.y,
							lx-lw,ly);


		if(leg_index==0) this.first_foot_base=createVector(lx-lw+foot_base.x,ly+lh);
		else if(leg_index==this._mleg-1) this.last_foot_base=createVector(lx+lw+foot_base.x,ly+lh);
		
};

PAnimal.prototype.drawSkateLeg=function(lx,ly,lw,lh,leg_index){
	
	var frame_portion=frameCount/(this._skate_vel/this._land_vel)+this._phi;
	var stage=parseInt((frame_portion%(Math.PI*2))/(Math.PI/2));
	
	var fang=Math.PI/8;
	if(leg_index>(this._mleg-1)/2) fang-=-Math.PI/10*Math.abs(Math.sin(frame_portion));//PI/6*(sin(frame_portion+PI/2));
	var kang=fang;

	this.drawLeg(kang,fang,lx,ly,lw,lh,leg_index);
};

PAnimal.prototype.drawWheelLeg=function(lx,ly,lw,lh,leg_index){
	
	var frame_portion=frameCount/(this._wheel_vel/this._land_vel)+this._phi;
	var stage=parseInt((frame_portion%(Math.PI*2))/(Math.PI/2));
	
	var kang=-Math.PI/2*(Math.sin(frame_portion));
	if(leg_index%2==1) kang=-Math.PI/2*(Math.sin(frame_portion+Math.PI/4));
	var fang=0;//kang+PI/1.8;
	
	switch(stage){
		case 0:
			fang=kang+Math.PI/1.6;
			break;
		case 1:
			fang=kang+Math.PI/1.6*Math.sin(frame_portion);
			break;
		case 2:
			fang=kang;
			break;
		case 3:
			fang=kang+Math.PI/1.6*(1-Math.abs(Math.sin(frame_portion)));
			break;
			
	}

	this.drawLeg(kang,fang,lx,ly,lw,lh,leg_index);
};

PAnimal.prototype.drawJumpLeg=function(lx,ly,lw,lh,leg_index){
	
	var frame_portion=frameCount/(this._land_vel/2)+this._phi;
	var stage=parseInt((frame_portion%(TWO_PI))/(PI/2));	
	stage%=2;

	var left=(leg_index>(this._mleg-1)/2);
	
	var kang=0;//-PI/2*(sin(frame_portion));
	var fang=0;//kang+PI/1.8;
	
	frame_portion+=random(-.1,.1);
	if(left) kang=PI/3*(sin(frame_portion));
	else kang=-PI/3*(sin(frame_portion));
	fang=kang+random(-1,1)*PI/8;

	this.drawLeg(kang,fang,lx,ly,lw,lh,leg_index);
};
PAnimal.prototype.drawSleepLeg=function(lx,ly,lw,lh,leg_index){
	var frame_portion=frameCount/(80/this._land_vel)+this._phi;
	var stage=parseInt((frame_portion%TWO_PI)/(PI/2));
		
	var kang=-PI/2.5+PI*.05*sin(frame_portion);
	var fang=kang+PI*.1*abs(sin(frame_portion));

	if(noise(leg_index*this._land_vel)<0.5||leg_index==0){
		kang=-PI/2.7;
		fang=kang+PI*(.8+.01*abs(sin(frame_portion)));			 
	}
	this.drawLeg(kang,fang,lx,ly,lw,lh,leg_index);
}