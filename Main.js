const canvas = document.getElementById( 'gc' );
const context = canvas.getContext( '2d' );
const exportCanvas = document.getElementById( "exportCanvas" );
const exportContext = exportCanvas.getContext( "2d" );

// Strings
const version = "v1.0 or something";
var globalColor = "#FFFFFF";

// Numbers
var pizzaNum = 5;

// Booleans
const isFunny = false;
var dragging = false;
var erasing = false;

// Arrays
var keyMap = [];
var colors =
[
	[ "#000","#000","#000","#000","#000","#000","#000","#000" ],
	[ "#000","#000","#000","#000","#000","#000","#000","#000" ],
	[ "#000","#000","#000","#000","#000","#000","#000","#000" ],
	[ "#000","#000","#000","#000","#000","#000","#000","#000" ],
	[ "#000","#000","#000","#000","#000","#000","#000","#000" ],
	[ "#000","#000","#000","#000","#000","#000","#000","#000" ],
	[ "#000","#000","#000","#000","#000","#000","#000","#000" ],
	[ "#000","#000","#000","#000","#000","#000","#000","#000" ]
];

// Objects
var mouse = { x: 0,y: 0 };

window.onload = function()
{
	const fps = 30;
	setInterval(function()
	{
		Update();
		Draw();
	}, 1000 / fps );
	onkeydown = onkeyup = function( e )
	{
		keyMap[e.keyCode] = e.type == "keydown";
	}
	canvas.addEventListener( 'mousedown',CheckClick );
	canvas.addEventListener( 'mouseup',CheckClick2 );
	canvas.addEventListener( 'mousemove',function( e )
	{
			mouse.x = CheckMousePos( e ).x;
			mouse.y = CheckMousePos( e ).y;
	} );
	Init();
};

function CheckMousePos( e )
{
	const rect = canvas.getBoundingClientRect();
	const root = document.documentElement;
	const mouseX = e.clientX - rect.left - root.scrollLeft;
	const mouseY = e.clientY - rect.top - root.scrollTop;
	return { x: mouseX,y: mouseY };
}

function CheckClick()
{
	// When you click, this happens.
	dragging = true;
}

function CheckClick2()
{
	dragging = false;
}

function Init()
{
	context.webkitImageSmoothingEnabled = false;
	context.mozImageSmoothingEnabled = false;
	context.imageSmoothingEnabled = false;
	exportContext.webkitImageSmoothingEnabled = false;
	exportContext.mozImageSmoothingEnabled = false;
	exportContext.imageSmoothingEnabled = false;
	console.log( "Version " + version + " has been loaded successfully!" );
}

function Update()
{
	// Update things here
	if( keyMap[69] )
	{
		SetErasing( true );
	}
	if( keyMap[66] )
	{
		SetErasing( false );
	}
}

function Draw()
{
	// Draw things here
	globalColor = document.getElementById( "colorPicker" ).value;
	// Rect( 0,0,canvas.width,canvas.height,"#000" );
	var drawX = Math.floor( mouse.x );
	var drawY = Math.floor( mouse.y );
	while( drawX % 100 != 0 )
	{
		--drawX;
	}
	while( drawY % 100 != 0 )
	{
		--drawY;
	}
	if( dragging )
	{
		// Rect( drawX,drawY,100,100,"#0FF" );
		if( !erasing )
		{
			colors[drawX / 100][drawY / 100] = globalColor;
		}
		else
		{
			colors[drawX / 100][drawY / 100] = "#000";
		}
		if( !erasing )
		{
			exportContext.fillStyle = globalColor;
			exportContext.fillRect( drawX / 100,drawY / 100,1,1 );
		}
		else
		{
			exportContext.clearRect( drawX / 100,drawY / 100,1,1 );
		}
	}
	for( var i = 0; i < colors.length; ++i )
	{
		for( var j = 0; j < colors[i].length; ++j )
		{
			Rect( j * 100,i * 100,100,100,colors[j][i] );
		}
	}
	var outlineColor = "#FFF";
	if( erasing )
	{
		outlineColor = "#F00";
	}
	Rect( drawX,drawY,1,100,outlineColor );
	Rect( drawX,drawY,100,1,outlineColor );
	Rect( drawX + 100,drawY,1,100,outlineColor );
	Rect( drawX,drawY + 100,100,1,outlineColor );
}

function DownloadImage()
{
	const downloadName = document.getElementById( "imageName" ).value;
	const downloadData = exportCanvas.toDataURL( "png" );
	var download = document.createElement( "a" );
	download.href = downloadData;
	download.download = downloadName + ".png";
	download.click();
}

function SetErasing( value )
{
	if( value )
	{
		erasing = true;
	}
	else
	{
		erasing = false;
	}
}