var factor = 4;
var margin = factor;
var numRect = 0;
var numDoor = 0;
var numCloset = 0;

$(function(){
	
	createRoom(120, 120);
	
	
	$('#room-submit').click(function(){
		createRoom(parseInt($('#room-width')[0].value), parseInt($('#room-height')[0].value));
	});
	
	$('#rect-submit').click(function(){
		createRect(parseInt($('#rect-width')[0].value), parseInt($('#rect-height')[0].value))
	});
	
	$('#door-submit').click(function(){
		createDoor($('#door-select')[0].value, parseInt($('#door-size')[0].value))
	});
	
	$('#room-height').attr('value', parseInt($('.room').css('height'))/factor);
	$('#room-width').attr('value', parseInt($('.room').css('width'))/factor);
	
	$('#canvas').mouseleave(function(){
		$('.float-info').hide();
	});
	
});

function createRoom(x, y){
	$('#canvas').html("");
	$('#canvas').append("<div class='room'></div>");
	$('#canvas > .room').css('height', y*factor).css('width', x*factor);
	$('#canvas').append("<div class='clear'></div>");
}

function createRect(x, y){
	numRect++;
	$('.room').append("<div class='rect-margin' id='rect-" + numRect + "'></div>");
	
	currRect = $('.room > #rect-' + numRect).css('position', 'absolute');
	currRect.append("<div class='rect'></div>");
	currRect.children('.rect').append("<div class='info'></div>");
	
	currRect.css('height', y*factor).css('width', x*factor).css('padding', margin);
	currRect.draggable({ 
		containment: 'parent',
		grid: [factor, factor],
		snap: true,
		snapMode: 'outer',
		stack: '.rect-margin'
	});
	
	currInfo = currRect.find('.info');
	currInfo.append("<div class='delete'></div>");
	currInfo.append("<div class='rotate'></div>");
	currInfo.append("<div class='dim'><span class='width'>" + formatDim(parseInt(currRect.css('width'))) + "</span>x<span class='height'>" + formatDim(parseInt(currRect.css('height'))) + "</span></div>");
	
	/*$('.rect-margin').resizable({
		containment: 'parent',
		resize: function(){
			rectContainer = $(this)
			rectContainer.find('.width').html(formatDim(parseInt(rectContainer.css('width'))));
			rectContainer.find('.height').html(formatDim(parseInt(rectContainer.css('height'))));
		}
	});*/
	$('.rect-margin').hover(function(){
		$('.float-info').hide();
		rectContainer = $(this);
		rectContainer.find('.info').show();
	
		rectContainer.find('.rotate').unbind('click').click(function(){
			rotate(rectContainer);
		});
		rectContainer.find('.delete').click(function(){
			rectContainer.remove();
		});
	}, function(){
		$(this).find('.info').hide();
	});

}

function createDoor(wall, size){
	numDoor++;
	$('.room').append("<div class='door " + wall + "'  id='door-" + numDoor + "'></div>");
	currDoor = $('.room > #door-' + numDoor).css('position', 'absolute');
	
	$('#canvas').append($("<div class='float-info' id='door-" + numDoor + "-info'></div>").append("<div class='delete'></div>"));
	
	$('.door').hover(function(){
		$('.float-info').hide();
		currDoor = $(this)
		currInfo = resetInfoPosition(currDoor, currDoor.attr('class').split(' ')[1]).show();
		currInfo.children('.delete').click(function(){
			currDoor.remove();
			$(this).parent().remove();
		});
	}, function(){
	});
	
	function resetInfoPosition(ele, side){
		if(side == 'top' || side == 'left') return $('#' + ele.attr('id') + '-info').css('top', ele.offset().top).css('left', ele.offset().left);
		else if(side == 'right') return $('#' + ele.attr('id') + '-info').css('top', ele.offset().top).css('left', ele.offset().left + 6); //right
		return $('#' + ele.attr('id') + '-info').css('top', ele.offset().top + 6).css('left', ele.offset().left); //bottom
	}
	
	switch(wall){
		
		case 'top':	
			currDoor.css('width', size*factor).css('height', 22).css('marginTop', -16);
			currDoor.draggable({ 
				containment: 'parent',
				grid: [factor, factor],
				axis: 'x',
				drag: function() {
					resetInfoPosition($(this), wall);
				},
				stop: function() {
					resetInfoPosition($(this), wall);
				}
			});
			break;
		case 'left':
			currDoor.css('height', size*factor).css('width', 22).css('marginLeft', -16);
			currDoor.draggable({ 
				containment: 'parent',
				grid: [factor, factor],
				axis: 'y',
				drag: function() {
					resetInfoPosition($(this), wall);
				},
				stop: function() {
					resetInfoPosition($(this), wall);
				}
			});
			break;
		case 'right':
			currDoor.css('height', size*factor).css('width', 22).css('marginRight', -16).css('right', 0);
			currDoor.draggable({ 
				containment: 'parent',
				grid: [factor, factor],
				axis: 'y',
				drag: function() {
					resetInfoPosition($(this), wall);
				},
				stop: function() {
					resetInfoPosition($(this), wall);
				}
			});
			break;
		case 'bottom':
			currDoor.css('width', size*factor).css('height', 22).css('marginBottom', -16).css('bottom', 0);
			currDoor.draggable({ 
				containment: 'parent',
				grid: [factor, factor],
				axis: 'x',
				drag: function() {
					resetInfoPosition($(this), wall);
				},
				stop: function() {
					resetInfoPosition($(this), wall);
				}
			});
			break;
		default:
			alert("Something went wrong!");
			numDoor--;
			break;
	}
}

function rotate(ele){
	height = ele.css('height');
	ele.css('height', ele.css('width'));
	ele.css('width', height);
}

function formatDim(total){
	feet = Math.floor(total/(12*factor));
	inches = total/factor - (feet * 12);
	
	if(feet !=0 && inches !=0) return feet + '\' ' + inches + '\"';
	if(feet != 0) return feet + '\'';
	if(inches != 0) return inches + '\"';
	
}