// function random(min_,max_){
// 	return Math.random()*(max_-min_)+min_;
// }

function FrameAnimation(len,delay){
	this.ani_t=0;
	this.ani_vel=1.0/len;
	this.delay_fr=delay;
	this.ani_start=false;
	this.do_reverse=false;
	
	this.is_loop=false;
	this.loop_count=0;

	this.reset=function(){
		this.ani_start=false;
		if(!this.is_loop) this.ani_t=-this.delay_fr*this.ani_vel;
		else this.ani_t=0;
	};
	this.start=function(){
		this.ani_start=true;
	};
	this.restart=function(){
		this.reset();
		this.start();
		this.loop_count=0;
	};
	this.update=function(){
		if(!this.ani_start) return;

		if(this.ani_t<1) this.ani_t+=this.ani_vel;
		else{
			this.ani_start=false;
			this.ani_t=1;
			if(this.is_loop){
				this.loop_count++;
				this.reset();
				this.start();
			}
		}
	};
	this.getPortion=function(){
		if(this.ani_t<0) return 0;
		if(this.ani_t==1) return 1;
		var k=0.5;
		var r=0.5-0.5*Math.cos(this.ani_t*(PI));
		//if(is_elastic) r=0.5f-0.51f*cos(PI*ani_t+k*ani_t-k*0.5f);
		
		if(this.do_reverse) return (this.loop_count%2==1)?(1-r):r;
		else return r;
	};

}