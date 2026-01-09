#include "main.h"
#include "subsystems.hpp"

void setupMotors(void) {
	chassis::conveyor.setup();
	chassis::top.setup();
}

void initialize() {
	ez::ez_template_print();

	pros::delay(500);

	chassis::drivetrain.opcontrol_curve_buttons_toggle(false);
	chassis::drivetrain.opcontrol_drive_activebrake_set(2.0);
	chassis::drivetrain.opcontrol_curve_default_set(1.019, 1.019);

	defaultAutonConstants();

	ez::as::auton_selector.autons_add({
		// {"Drive Forward 2ft", driveForward},
		// {"Turn Right 90 Degrees", turnRight},
		// {"Run 'Base' Auton", base},
		{"Auton", rightAuton},
	});

	chassis::drivetrain.initialize();
	setupMotors();
	ez::as::initialize();
	master.rumble(chassis::drivetrain.drive_imu_calibrated() ? "." : "-------");
}

void disabled() {}

void competition_initialize() {}
