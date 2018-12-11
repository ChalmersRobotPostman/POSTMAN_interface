
var twist;
var cmdVel;
var publishImmidiately = true;
var robot_IP;
var manager;
var teleop;
//var ros;
var a;
var ros = new ROSLIB.Ros({
   	url: 'ws://localhost:8080'
});


function ToBalazs(){
	a = 1
	console.log('Going to Balasz');
    var audio = new Audio('Balazsmp3.mp3');
    audio.play();
    document.getElementById("direction").innerHTML = "Rolling my way to Balazs";
    //setTimeout(function(){ location.reload(); }, 3000);

	
}

/*
   //publish the time every 1000 miliseconds
   	var cmdVel = new ROSLIB.Topic({
   		ros : ros,
   		name : '/cmd_vel',
   		messageType : 'geometry_msgs/Twist'});

   var mess = new ROSLIB.Message({
   		data: 'Hello'
   	});

    var twist = new ROSLIB.Message({
    linear : {
      x : -5.0,
      y : 0.2,
      z : 0.3
    },
    angular : {
      x : -0.1,
      y : -0.2,
      z : -0.3
    }
  });
     cmdVel.publish(twist);

   //node.subscribe('/talker', 'std_msgs/String', function(msg){  log(msg.data) });
 	const Http = new XMLHttpRequest();
	//const url='http://ec27dd70.ngrok.io';
	Http.open("GET", robotcommands);
	Http.send();


	Http.onreadystatechange=(e)=>{
	console.log(Http.responseText)

}
}
/*
function handleinput(){
          //this.id=id;
          var that;
          this.id="up";
          this.velocity={};
          this.velocity.linear=0;
          this.velocity.angular=0;

          if(this.id=="up"){
                this.velocity.linear=2;
             }
             else if(this.id=="down"){
                this.velocity.linear=-2;
             }
             else if(this.id=="left"){
                this.velocity.angular=-2;
             }
             else{
                this.velocity.angular=2;
             }
          this.rosNode=that.rosNode;
          that=this;

          return interval=setInterval(function(){
              that.rosNode.publish('/turtle1/command_velocity', 'turtlesim/Velocity',  ros.json(that.velocity));
            },100);

          };
*/

function ToJanitor(){
    a = 2
    console.log('Going to Janitors\' office')
    const Http = new XMLHttpRequest();
	//const url='http://ec27dd70.ngrok.io';
	Http.open("GET", 'JANITOR');
	Http.send();


	Http.onreadystatechange=(e)=>{
	console.log(Http.responseText)

}

}


function StepIntoElevator(){
    a = 3
    console.log('Going into the elevator')
}
function foo(a){
    if (a==1){
    var audio = new Audio('Balazsmp3.mp3');
    audio.play();
}
}

function moveAction(linear, angular) {
    if (linear !== undefined && angular !== undefined) {
        twist.linear.x = linear;
        twist.angular.z = angular;
    } else {
        twist.linear.x = 0;
        twist.angular.z = 0;
    }
    cmdVel.publish(twist);
}

function initVelocityPublisher() {
    // Init message with zero values.
    twist = new ROSLIB.Message({
        linear: {
            x: 0,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: 0
        }
    });
    // Init topic object
    cmdVel = new ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist'
    });
    // Register publisher within ROS system
    cmdVel.advertise();
}

function initTeleopKeyboard() {
    // Use w, s, a, d keys to drive your robot

    // Check if keyboard controller was aready created
    if (teleop == null) {
        // Initialize the teleop.
        teleop = new KEYBOARDTELEOP.Teleop({
            ros: ros,
            topic: '/cmd_vel'
        });
    }

    // Add event listener for slider moves
    robotSpeedRange = document.getElementById("robot-speed");
    robotSpeedRange.oninput = function () {
        teleop.scale = robotSpeedRange.value / 100
    }
}

function createJoystick() {
    // Check if joystick was aready created
    if (manager == null) {
        joystickContainer = document.getElementById('joystick');
        // joystck configuration, if you want to adjust joystick, refer to:
        // https://yoannmoinet.github.io/nipplejs/
        var options = {
            zone: joystickContainer,
            position: { left: 50 + '%', top: 105 + 'px' },
            mode: 'static',
            size: 200,
            color: '#0066ff',
            restJoystick: true
        };
        manager = nipplejs.create(options);
        // event listener for joystick move
        manager.on('move', function (evt, nipple) {
            // nipplejs returns direction is screen coordiantes
            // we need to rotate it, that dragging towards screen top will move robot forward
            var direction = nipple.angle.degree - 90;
            if (direction > 180) {
                direction = -(450 - nipple.angle.degree);
            }
            // convert angles to radians and scale linear and angular speed
            // adjust if youwant robot to drvie faster or slower
            var lin = Math.cos(direction / 57.29) * nipple.distance * 0.005;
            var ang = Math.sin(direction / 57.29) * nipple.distance * 0.05;
            // nipplejs is triggering events when joystic moves each pixel
            // we need delay between consecutive messege publications to 
            // prevent system from being flooded by messages
            // events triggered earlier than 50ms after last publication will be dropped 
            if (publishImmidiately) {
                publishImmidiately = false;
                moveAction(lin, ang);
                setTimeout(function () {
                    publishImmidiately = true;
                }, 50);
            }
        });
        // event litener for joystick release, always send stop message
        manager.on('end', function () {
            moveAction(0, 0);
        });
    }
}

window.onload = function () {
    // determine robot address automatically
    // robot_IP = location.hostname;
    // set robot address statically
    robot_IP = "127.0.0.1";

    // // Init handle for rosbridge_websocket
    ros = new ROSLIB.Ros({
        url: "ws://" + robot_IP + ":9090"
    });

    initVelocityPublisher();
    // get handle for video placeholder
    //video = document.getElementById('video');
    // Populate video source 
    //video.src = "http://" + robot_IP + ":8080/stream?topic=/camera/rgb/image_raw&type=mjpeg&quality=80";
    //video.onload = function () {
        // joystick and keyboard controls will be available only when video is correctly loaded
        createJoystick();
        initTeleopKeyboard();
};
