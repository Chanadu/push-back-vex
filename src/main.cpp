#include "main.h"
#include "auton.hpp"
#include "subsystems.hpp"



ez::Drive drivetrain(	
	chassis::ports::leftMotors,
	chassis::ports::rightMotors,
	chassis::ports::imu,
	chassis::wheelDiameter,
	chassis::ticks //	
);

void initialize() {
	ez::ez_template_print();

	pros::delay(500);

	drivetrain.opcontrol_curve_buttons_toggle(true);
	drivetrain.opcontrol_drive_activebrake_set(2.0);
	drivetrain.opcontrol_curve_default_set(1.019, 1.019);

	defaultAutonConstants();

	ez::as::auton_selector.autons_add(	//
		{
			{"Drive Forward 2ft", driveForward},   //
			{"Turn Right 90 Degrees", turnRight},  //
			{"Run 'Base' Auton", base}			   //
		}  //
	);

	drivetrain.initialize();
	ez::as::initialize();
	master.rumble(drivetrain.drive_imu_calibrated() ? "." : "-------");
}

void disabled() {
	// . . .
}

void competition_initialize() {
	// . . .
}
