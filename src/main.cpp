#include "main.h"

namespace chassis {
	ez::Drive drivetrain(chassis::ports::driveLeft,
						 chassis::ports::driveRight,
						 chassis::ports::imu,
						 chassis::drive::wheelDiameter,
						 chassis::drive::ticks	//
	);

	void setupMotor(const chassis::MotorData* motorData) {
		(*motorData).motor.set_brake_mode((*motorData).brakeMode);
		(*motorData).motor.set_encoder_units((*motorData).encoderUnits);
	}
}  // namespace chassis

void initialize() {
	ez::ez_template_print();

	pros::delay(500);

	chassis::drivetrain.opcontrol_curve_buttons_toggle(false);
	chassis::drivetrain.opcontrol_drive_activebrake_set(2.0);
	chassis::drivetrain.opcontrol_curve_default_set(1.019, 1.019);

	defaultAutonConstants();

	ez::as::auton_selector.autons_add({
		{"Drive Forward 2ft", driveForward},
		{"Turn Right 90 Degrees", turnRight},
		{"Run 'Base' Auton", base},
	});

	chassis::drivetrain.initialize();
	ez::as::initialize();
	master.rumble(chassis::drivetrain.drive_imu_calibrated() ? "." : "-------");

	setupMotor(&chassis::conveyor);
	setupMotor(&chassis::top);
}

void disabled() {}

void competition_initialize() {}
