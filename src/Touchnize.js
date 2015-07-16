/*Copyright [2015] [VINICIUS MONTENEGRO SILVA]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

const BASE_TEN = 10;
const MERGE_ERROR = 3;
const TAP_LIMIT_MS = 80;
const FLICK_LIMIT_MS = 200;
const FLICK_MIN_VELOCITY = 1.5;
const PRESS_MIN_MS = 200;
const MINIMAL_DISTANCE_Y = 50;
const MINIMAL_DISTANCE_X = 200;
const MINIMAL_DB_CLICK_DISTANCE_MS = 50;
const MAXIMUM_DB_CLICK_DISTANCE_MS = 600;
const TOLERANCE_X = 50;
const TOLERANCE_Y = 50; 
const DOUBLE = 2;
const HALF = 2;

var lastFingerTaped = null;		

function Finger(id, pointXi, pointYi, pointX, pointY, intervalX, intervalY, coordinate, startTime)
{	this.id = id;
	this.pointX = pointX;
	this.pointY = pointY;
	this.pointXi = pointXi;
	this.pointYi = pointYi;
	this.intervalX = intervalX;
	this.intervalY = intervalY;
	this.coordinate_initial = coordinate;
	this.startTime = startTime;
}

function isNull(object)
{	if (object != null)
		return false;
	else
		return true;
}

function distanceOfTwoCoordinates(finger1,finger2)
{	return Math.sqrt(Math.pow((finger1.pointX-finger2.pointX),2)
		   +Math.pow((finger1.pointY-finger2.pointY),2)); 
}

function isTwoFingersGesture(fingers){
	if(fingers.length == 2 && !isNull(fingers.twoFingersInitialDistance))
	{	return true;
	}
	return false;
}

function isScrollHorizontal(finger1, finger2)
{	if (finger1.intervalX >= MINIMAL_DISTANCE_X && finger1.intervalY <= TOLERANCE_Y
		&& finger2.intervalX >= MINIMAL_DISTANCE_X && finger2.intervalY <= TOLERANCE_Y)	
	{	resetFingers(fingers);
		return true;
	}
	return false;
}

function isScrollVertical(finger1, finger2)
{	if (finger1.intervalY >= MINIMAL_DISTANCE_Y && finger1.intervalX <= TOLERANCE_X
		&& finger2.intervalY >= MINIMAL_DISTANCE_Y && finger2.intervalX <= TOLERANCE_X)	
	{	resetFingers(fingers);
		return true;
	}
	return false;
}

function isZoom(fingers)
{	fingers.twoFingerDistance = distanceOfTwoCoordinates(fingers[0],fingers[1]);
	
	if (twoFingersDistance >= (MINIMAL_DISTANCE_Y*DOUBLE))
	{	resetFingers(fingers);
		return true;
	}
	return false;
}

function isPinch(fingers)
{	fingers.twoFingerDistance = distanceOfTwoCoordinates(fingers[0],fingers[1]);
	if (fingers.twoFingersDistance < fingers.twoFingersInitialDistance)
	{	resetFingers(fingers);
		return true;
	}
	return false;
}

function resetFingers(fingers)
{	fingers.twoFingersInitialDistance = null;
	fingers.twoFingersDistance = null;
	fingers.splice(0,2);
}

// ONE FINGER GESTURES

function isOneFingerGesture(arrayTouches){
	if (arrayTouches.length == 1)
	{	return true;
	}
	return false;
}

function getIntervalTime(finger)
{	var instantTime = (new Date).getTime(); 
	var interval = instantTime-finger.startTime;
	return interval;
}

function isTap(finger){
	if (getIntervalTime(finger) <= TAP_LIMIT_MS)
	{	lastFingerTaped = finger;
		resetOneFinger(finger.id);
		return true;
	}
	return false;
}

function isPress(finger){
	console.log("OI");
	if (getIntervalTime(finger) >= PRESS_MIN_MS) 
	{	console.log("OI2");
		resetOneFinger(finger.id);
		return true;
	}
	return false;
}

function isDrag(finger){
	if (getIntervalTime(finger) >= PRESS_MIN_MS)
	{	if (finger.intervalX > (MINIMAL_DISTANCE_X/HALF) 
		|| finger.intervalY > MINIMAL_DISTANCE_Y)
		{	resetOneFinger(finger.id);
			return true;
		}
		return false;
	}
	return false;
}

function isFlick(finger){
	var intervalTime = getIntervalTime(finger);
	if (intervalTime > TAP_LIMIT_MS && intervalTime < FLICK_LIMIT_MS)
	{	var velocityX = (finger.intervalX/intervalTime);
		if (velocityX >= FLICK_MIN_VELOCITY && finger.intervalX >= MINIMAL_DISTANCE_X && finger.intervalY <= TOLERANCE_Y)
		{	resetOneFinger(finger.id);
			return true;
		}
		return false;
	}
	else	
		return false;
}

function isDoubleTap(finger, lastFinger){
	if(isNull(lastFinger))
		return false;

	if(finger.startTime-lastFinger.startTime >= MINIMAL_DB_CLICK_DISTANCE_MS
	&&	finger.startTime-lastFinger.startTime <= MAXIMUM_DB_CLICK_DISTANCE_MS)
	{	
		lastFingerPosition = parseInt(((lastFinger.coordinate_initial * BASE_TEN)%BASE_TEN));
		thisFingerPosition = parseInt(((finger.coordinate_initial * BASE_TEN)%BASE_TEN));
	     
		if((thisFingerPosition >= lastFingerPosition && thisFingerPosition <= lastFingerPosition+MERGE_ERROR) 
			|| (thisFingerPosition <= lastFingerPosition-MERGE_ERROR && thisFingerPosition >= lastFingerPosition))
		{	lastFingerTaped = finger;
			resetOneFinger(finger.id);
			return true;
		}
		return false;
	}	
	return false;
}

function resetOneFinger(index){
	fingers.splice(index, 1);
}