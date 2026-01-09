#include "auton.hpp"
#include "main.h"
#include "okapi/api/units/QAngle.hpp"
#include "subsystems.hpp"

void autonomous() {
	chassis::drivetrain.pid_targets_reset();
	chassis::drivetrain.drive_imu_reset();
	chassis::drivetrain.drive_sensor_reset();

	chassis::drivetrain.drive_brake_set(pros::E_MOTOR_BRAKE_HOLD);

	pros::delay(500);
	rightAuton();
	leftAuton();
	// ez::as::auton_selector.selected_auton_call();
}

void defaultAutonConstants() {
	chassis::drivetrain.pid_drive_constants_set(15, 10.0, 5.0);			   // Fwd/rev constants, used for odom and non odom motions
	chassis::drivetrain.pid_heading_constants_set(11.0, 0.0, 20.0);		   // Holds the robot straight while going forward without odom
	chassis::drivetrain.pid_turn_constants_set(3.0, 0.05, 20.0, 15.0);	   // Turn in place constants
	chassis::drivetrain.pid_swing_constants_set(6.0, 0.0, 65.0);		   // Swing constants
	chassis::drivetrain.pid_odom_angular_constants_set(6.5, 0.0, 52.5);	   // Angular control for odom motions
	chassis::drivetrain.pid_odom_boomerang_constants_set(5.8, 0.0, 32.5);  // Angular control for boomerang motions

	// Exit conditions
	chassis::drivetrain.pid_turn_exit_condition_set(90_ms, 3_deg, 250_ms, 7_deg, 500_ms, 500_ms);
	chassis::drivetrain.pid_swing_exit_condition_set(90_ms, 3_deg, 250_ms, 7_deg, 500_ms, 500_ms);
	chassis::drivetrain.pid_drive_exit_condition_set(90_ms, 1_in, 250_ms, 3_in, 500_ms, 500_ms);
	chassis::drivetrain.pid_odom_turn_exit_condition_set(90_ms, 3_deg, 250_ms, 7_deg, 500_ms, 750_ms);
	chassis::drivetrain.pid_odom_drive_exit_condition_set(90_ms, 1_in, 250_ms, 3_in, 500_ms, 750_ms);
	chassis::drivetrain.pid_turn_chain_constant_set(3_deg);
	chassis::drivetrain.pid_swing_chain_constant_set(5_deg);
	chassis::drivetrain.pid_drive_chain_constant_set(3_in);

	// Slew constants
	chassis::drivetrain.slew_turn_constants_set(3_deg, 70);
	chassis::drivetrain.slew_drive_constants_set(3_in, 70);
	chassis::drivetrain.slew_swing_constants_set(3_in, 80);

	// The amount that turns are prioritized over driving in odom motions
	// - if you have tracking wheels, you can run this higher.  1.0 is the max
	chassis::drivetrain.odom_turn_bias_set(0.9);

	// This is how far ahead in the path the robot looks at
	chassis::drivetrain.odom_look_ahead_set(7_in);

	// This sets the maximum distance away from target that the carrot point can be
	chassis::drivetrain.odom_boomerang_distance_set(16_in);

	// This handles how aggressive the end of boomerang motions are
	chassis::drivetrain.odom_boomerang_dlead_set(0.625);

	// Changes the default behavior for turning, this defaults it to the shortest path there
	chassis::drivetrain.pid_angle_behavior_set(ez::shortest);
}

void autonActions() {
	chassis::drivetrain.pid_wait_until_index(0);
	chassis::drivetrain.pid_wait_until_index(1);

	chassis::conveyor.motor.move(-1 * chassis::conveyor.defaultSpeed);

	chassis::drivetrain.pid_wait_until_index(2);

	chassis::drivetrain.pid_wait_until_index(3);
	chassis::drivetrain.pid_wait_until_index(4);
	chassis::holder.piston.extend();
	chassis::drivetrain.pid_wait_until_index(5);
	chassis::top.motor.move(chassis::top.defaultSpeed * chassis::top.slowFactor);
	// for (int i = 0; i < 4; i++) {
	// 	chassis::conveyor.motor.move(chassis::conveyor.defaultSpeed);
	// 	pros::delay(150);
	// 	chassis::conveyor.motor.move(-1 * chassis::conveyor.defaultSpeed);
	// 	pros::delay(400);
	// }
	chassis::conveyor.motor.move(-1 * chassis::conveyor.defaultSpeed);
	pros::delay(3000);
	chassis::drivetrain.pid_wait();

	chassis::conveyor.motor.move(0);
	chassis::top.motor.move(0);
	chassis::holder.piston.retract();
	chassis::drivetrain.pid_wait();
}

void rightAuton() {
	chassis::drivetrain.odom_xyt_set(-61.435_in, -18.354_in, 90_deg);

	chassis::drivetrain.pid_odom_set(
		{
			{{-46.207_in, -18.354_in, 90_deg}, fwd, DRIVE_SPEED},
			{{-42.002_in, -44.943_in, 45_deg}, fwd, DRIVE_SPEED},
			{{-14.889_in, -16.391_in, 45_deg}, fwd, SLOW_DRIVE_SPEED},
			{{-44.06_in, -47.846_in, 45_deg}, rev, DRIVE_SPEED},
			{{-44.06_in, -49.5_in, 270_deg}, rev, SLOW_DRIVE_SPEED},
			{{-23.236_in, -49.5_in, 270_deg}, rev, SLOW_DRIVE_SPEED},
		},
		true);

		autonActions();
}

// void leftAuton() {
// 	chassis::drivetrain.odom_y_flip();
// 	chassis::drivetrain.odom_theta_flip();
// 	rightAuton();
// }

okapi::QAngle flipAngle(okapi::QAngle angle) {
	return okapi::QAngle((double)((180 - (int)(angle.getValue()) + 360) % 360));
}

void leftAuton() {
	chassis::drivetrain.odom_xyt_set(-61.435_in, 18.354_in, 90_deg);

	chassis::drivetrain.pid_odom_set(
		{
			{{-46.207_in, 18.354_in, flipAngle(90_deg)}, fwd, DRIVE_SPEED},
			{{-42.002_in, 44.943_in, flipAngle(45_deg)}, fwd, DRIVE_SPEED},
			{{-14.889_in, 16.391_in, flipAngle(45_deg)}, fwd, SLOW_DRIVE_SPEED},
			{{-44.06_in, 47.846_in, flipAngle(45_deg)}, rev, DRIVE_SPEED},
			{{-44.06_in, 49.5_in, flipAngle(270_deg)}, rev, SLOW_DRIVE_SPEED},
			{{-23.236_in, 49.5_in, flipAngle(270_deg)}, rev, SLOW_DRIVE_SPEED},
		},
		true);

	autonActions();
}