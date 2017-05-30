const canvas = document.getElementById( 'gc' );
const context = canvas.getContext( '2d' );
const exportCanvas = document.getElementById( "exportCanvas" );
const exportContext = exportCanvas.getContext( "2d" );

// Strings
const version = "v1.0 or something";
var globalColor = "#FFFFFF";

// Numbers

// Booleans
var dragging = false;
var erasing = false;

// Arrays
var keyMap = [];
var colors =
[
	[ "#fff","#777","#fff","#777","#fff","#777","#fff","#777" ],
	[ "#777","#fff","#777","#fff","#777","#fff","#777","#fff" ],
	[ "#fff","#777","#fff","#777","#fff","#777","#fff","#777" ],
	[ "#777","#fff","#777","#fff","#777","#fff","#777","#fff" ],
	[ "#fff","#777","#fff","#777","#fff","#777","#fff","#777" ],
	[ "#777","#fff","#777","#fff","#777","#fff","#777","#fff" ],
	[ "#fff","#777","#fff","#777","#fff","#777","#fff","#777" ],
	[ "#777","#fff","#777","#fff","#777","#fff","#777","#fff" ]
];
const colorsORIG =
[
	[ "#fff","#777","#fff","#777","#fff","#777","#fff","#777" ],
	[ "#777","#fff","#777","#fff","#777","#fff","#777","#fff" ],
	[ "#fff","#777","#fff","#777","#fff","#777","#fff","#777" ],
	[ "#777","#fff","#777","#fff","#777","#fff","#777","#fff" ],
	[ "#fff","#777","#fff","#777","#fff","#777","#fff","#777" ],
	[ "#777","#fff","#777","#fff","#777","#fff","#777","#fff" ],
	[ "#fff","#777","#fff","#777","#fff","#777","#fff","#777" ],
	[ "#777","#fff","#777","#fff","#777","#fff","#777","#fff" ]
];

// Objects
var mouse = { x: 0,y: 0 };
var tools =
{
	brush:		true,
	eraser:		false,
	identifier:	false
}

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
	document.getElementById( "colorPicker" ).value = "#00FFFF";
	console.log( "Version " + version + " has been loaded successfully!" );
}

function Update()
{
	// Update things here
	if( keyMap[69] )
	{
		// SetErasing( true );
		SetTool( "eraser" );
	}
	if( keyMap[66] )
	{
		// SetErasing( false );
		SetTool( "brush" );
	}
	if( keyMap[73] )
	{
		// IdentifyColor();
		SetTool( "identifier" );
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
		if( tools.brush )
		{
			colors[drawX / 100][drawY / 100] = globalColor;
			exportContext.fillStyle = globalColor;
			exportContext.fillRect( drawX / 100,drawY / 100,1,1 );
		}
		else if( tools.eraser )
		{
			colors[drawX / 100][drawY / 100] = colorsORIG[drawX / 100][drawY / 100];
		}
		else if( tools.identifier )
		{
			IdentifyColor();
		}
		/*
		if( !erasing )
		{
			colors[drawX / 100][drawY / 100] = globalColor;
		}
		else
		{
			colors[drawX / 100][drawY / 100] = colorsORIG[drawX / 100][drawY / 100];
			exportContext.clearRect( drawX / 100,drawY / 100,1,1 );
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
		*/
	}
	for( var i = 0; i < colors.length; ++i )
	{
		for( var j = 0; j < colors[i].length; ++j )
		{
			Rect( j * 100,i * 100,100,100,colors[j][i] );
		}
	}
	var outlineColor = "#0FF";
	if( tools.brush )
	{
		outlineColor = "#0FF";
	}
	else if( tools.eraser )
	{
		outlineColor = "#F00";
	}
	else if( tools.identifier )
	{
		outlineColor = "#0F0";
	}
	/*
	var outlineColor = "#0FF";
	if( erasing )
	{
		outlineColor = "#F00";
	}
	*/
	const offset = 3;
	Rect( drawX - offset,drawY,offset,100,outlineColor );
	Rect( drawX,drawY - offset,100,offset,outlineColor );
	Rect( drawX + 100,drawY,offset,100,outlineColor );
	Rect( drawX,drawY + 100,100,offset,outlineColor );
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

function SetTool( tool )
{
	tools.brush = false;
	tools.eraser = false;
	tools.identifier = false;
	if( tool === "brush" )
	{
		tools.brush = true;
	}
	else if( tool === "eraser" )
	{
		tools.eraser = true;
	}
	else if( tool === "identifier" )
	{
		tools.identifier = true;
	}
}

function IdentifyColor()
{
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
	globalColor = colors[drawX / 100][drawY / 100];
	document.getElementById( "colorPicker" ).value = globalColor;
}
