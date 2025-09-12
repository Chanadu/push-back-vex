#include "main.h"
#include "auton.hpp"
#include "subsystems.hpp"

ez::Drive chassis(	//
	{-1, 2, -3},
	{4, -5, 6},
	11,
	2.75,
	(600.0) * (48.0 / 60.0)	 //
);

void initialize() {
	ez::ez_template_print();

	pros::delay(500);

	chassis.opcontrol_curve_buttons_toggle(true);
	chassis.opcontrol_drive_activebrake_set(2.0);
	chassis.opcontrol_curve_default_set(1.019, 1.019);

	defaultAutonConstants();

	ez::as::auton_selector.autons_add(	//
		{
			{"Drive Forward 2ft", driveForward},  //
			{"Turn Right 90 Degrees", turnRight}  //
		}  //
	);

	chassis.initialize();
	ez::as::initialize();
	master.rumble(chassis.drive_imu_calibrated() ? "." : "---");
}

void disabled() {
	// . . .
}

void competition_initialize() {
	// . . .
}
