//Set up three.js context
var camera, scene, renderer;
var particleCloud, sparksEmitter;

$(document).ready(function(){
	/*
	window.client = new Caress.Client({
		host: 'localhost',
		port: 5000
	});
	
	//start listening for TUIO events emitted by Caress server
	client.connect();
	*/
	

	//Test out touch gestures	
	$('#app').hammer().on('tap', '#conveyor', function(e){
		$(this).css({'background': '#333'});
		console.log(e);
	});	
	
	//init Three.js particle stream
	init();
	animate();
});

//Three.js 
function init(){
	var rendererW = $('#app #conveyor').width(),
		rendererH = $('#app #conveyor').height();
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		clearColor: 0x000000,
		clearAlpha: 0.0
	});
	renderer.setSize(rendererW, rendererH);
	$('#app #conveyor').append(renderer.domElement);
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(45, rendererW/rendererH, 1, 10000);
	camera.position.set(0,0,50);
	camera.lookAt(scene.position);
	scene.add(camera);
	
	//particle stuff
	var particlesLength = 5000,
		particles = new THREE.Geometry();
		
	function newpos( x, y, z ) {
		return new THREE.Vector3( x, y, z );
	}
	
	var Pool = {
		__pools: [],
		// Get a new Vector
		get: function() {
			if ( this.__pools.length > 0 ) {
				return this.__pools.pop();
			}
			console.log( "pool ran out!" )
			return null;
		},
		// Release a vector back into the pool
		add: function( v ) {
			this.__pools.push( v );
		}
	};
	
	for ( i = 0; i < particlesLength; i ++ ) {
		particles.vertices.push( newpos( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY ) );
		Pool.add( i );
	}
	
	//use default particle material for now
	var pMaterial = new THREE.ParticleBasicMaterial({
		color: 0xE8FF00,
		size: 3,
		blending: THREE.AdditiveBlending,
		transparent: true
	});
	
	particleCloud = new THREE.ParticleSystem(particles, pMaterial);
	scene.add(particleCloud);
	
	//set up particle system
	var setTargetParticle = function() {
		var target = Pool.get();
		//values_size[ target ] = Math.random() * 200 + 100;
		return target;
	};
	var onParticleCreated = function( p ) {
		var position = p.position;
		p.target.position = position;

		var target = p.target;

		if ( target ) {
			particles.vertices[ target ] = p.position;
			//values_color[ target ].setHSL( hue, 0.6, 0.1 );
		};
	};
	var onParticleDead = function( particle ) {
		var target = particle.target;
		if ( target ) {
			// Hide the particle
			//values_color[ target ].setRGB( 0, 0, 0 );
			particles.vertices[ target ].set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );
			// Mark particle system as available by returning to pool
			Pool.add( particle.target );
		}
	};
	sparksEmitter = new SPARKS.Emitter(new SPARKS.SteadyCounter(500) );
	sparksEmitter.addInitializer( new SPARKS.Position( new SPARKS.LineZone( new THREE.Vector3(-150,-3,0), new THREE.Vector3(-150,3,0) ) ) );
	sparksEmitter.addInitializer( new SPARKS.Lifetime( 1, 15 ));
	sparksEmitter.addInitializer( new SPARKS.Target( null, setTargetParticle ) );
	sparksEmitter.addInitializer( new SPARKS.Velocity( new SPARKS.PointZone( new THREE.Vector3( 25, 0, 0 ) ) ) );
	
	sparksEmitter.addAction( new SPARKS.Age(TWEEN.Easing.Linear.None) );
	sparksEmitter.addAction( new SPARKS.Accelerate( 0, 0, 0 ) );
	sparksEmitter.addAction( new SPARKS.Move() );
	sparksEmitter.addAction( new SPARKS.RandomDrift( 1, 2, 11 ) );
	
	sparksEmitter.addCallback( "created", onParticleCreated );
	sparksEmitter.addCallback( "dead", onParticleDead );
	sparksEmitter.start();

}
function animate(){	
	render();
	requestAnimationFrame( animate );
}
function render(){
	particleCloud.geometry.verticesNeedUpdate = true;
	renderer.render(scene, camera);
}