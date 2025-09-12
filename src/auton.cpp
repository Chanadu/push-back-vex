#include "auton.hpp"
#include "main.h"
#include "subsystems.hpp"

void autonomous() {
	chassis.pid_targets_reset();
	chassis.drive_imu_reset();
	chassis.drive_sensor_reset();

	chassis.drive_brake_set(pros::E_MOTOR_BRAKE_HOLD);

	// drive_forward();
	// turn_right();

	ez::as::auton_selector.selected_auton_call();
}

void defaultAutonConstants() {
	chassis.pid_drive_constants_set(20.0, 0.0, 100.0);		   // Fwd/rev constants, used for odom and non odom motions
	chassis.pid_heading_constants_set(11.0, 0.0, 20.0);		   // Holds the robot straight while going forward without odom
	chassis.pid_turn_constants_set(3.0, 0.05, 20.0, 15.0);	   // Turn in place constants
	chassis.pid_swing_constants_set(6.0, 0.0, 65.0);		   // Swing constants
	chassis.pid_odom_angular_constants_set(6.5, 0.0, 52.5);	   // Angular control for odom motions
	chassis.pid_odom_boomerang_constants_set(5.8, 0.0, 32.5);  // Angular control for boomerang motions

	// Exit conditions
	chassis.pid_turn_exit_condition_set(90_ms, 3_deg, 250_ms, 7_deg, 500_ms, 500_ms);
	chassis.pid_swing_exit_condition_set(90_ms, 3_deg, 250_ms, 7_deg, 500_ms, 500_ms);
	chassis.pid_drive_exit_condition_set(90_ms, 1_in, 250_ms, 3_in, 500_ms, 500_ms);
	chassis.pid_odom_turn_exit_condition_set(90_ms, 3_deg, 250_ms, 7_deg, 500_ms, 750_ms);
	chassis.pid_odom_drive_exit_condition_set(90_ms, 1_in, 250_ms, 3_in, 500_ms, 750_ms);
	chassis.pid_turn_chain_constant_set(3_deg);
	chassis.pid_swing_chain_constant_set(5_deg);
	chassis.pid_drive_chain_constant_set(3_in);

	// Slew constants
	chassis.slew_turn_constants_set(3_deg, 70);
	chassis.slew_drive_constants_set(3_in, 70);
	chassis.slew_swing_constants_set(3_in, 80);

	// The amount that turns are prioritized over driving in odom motions
	// - if you have tracking wheels, you can run this higher.  1.0 is the max
	chassis.odom_turn_bias_set(0.9);

	chassis.odom_look_ahead_set(7_in);			 // This is how far ahead in the path the robot looks at
	chassis.odom_boomerang_distance_set(16_in);	 // This sets the maximum distance away from target that the carrot point can be
	chassis.odom_boomerang_dlead_set(0.625);	 // This handles how aggressive the end of boomerang motions are

	chassis.pid_angle_behavior_set(ez::shortest);  // Changes the default behavior for turning, this defaults it to the shortest path there
}

void base() {
	chassis.odom_xyt_set(-61_in, -24.53_in, 270_deg);

	chassis.pid_odom_set(
		{
			{{-26.66_in, -25.665_in, 225_deg}, rev, DRIVE_SPEED},
			{{-24.868_in, -43.17_in, 164_deg}, fwd, static_cast<int>(DRIVE_SPEED * .75)},
			{{-17.414_in, -29.22_in, 0_deg}, fwd, DRIVE_SPEED},
			{{-14.723_in, -11.338_in, 0_deg}, fwd, DRIVE_SPEED},
		},
		true);

	int currentIndex = 0;

	chassis.pid_wait_until_index(currentIndex++);  // 0
	chassis.pid_wait_until_index(currentIndex++);  // 1
	chassis.pid_wait_until_index(currentIndex++);  // 2
	chassis.pid_wait_until_index(currentIndex++);  // 3

	chassis.pid_wait();
}

void driveForward() {}
void turnRight() {}
