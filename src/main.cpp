#include "main.h"
#include "auton.hpp"
#include "pros/motors.h"
#include "subsystems.hpp"

namespace chassis {
ez::Drive drivetrain(chassis::ports::leftMotors,
					 chassis::ports::rightMotors,
					 chassis::ports::imu,
					 chassis::wheelDiameter,
					 chassis::ticks	 //
);
}
void initialize() {
	ez::ez_template_print();

	pros::delay(500);

	chassis::drivetrain.opcontrol_curve_buttons_toggle(true);
	chassis::drivetrain.opcontrol_drive_activebrake_set(2.0);
	chassis::drivetrain.opcontrol_curve_default_set(1.019, 1.019);

	defaultAutonConstants();

	ez::as::auton_selector.autons_add(	//
		{
			{"Drive Forward 2ft", driveForward},   //
			{"Turn Right 90 Degrees", turnRight},  //
			{"Run 'Base' Auton", base}			   //
		}  //
	);

	chassis::drivetrain.initialize();
	ez::as::initialize();
	master.rumble(chassis::drivetrain.drive_imu_calibrated() ? "." : "-------");

	chassis::tubeMotor.set_brake_mode(pros::E_MOTOR_BRAKE_HOLD);
	// chassis::tubeMotor.set_brake_mode(pros::E_MOTOR_BRAKE_COAST);
	chassis::conveyorMotor.set_brake_mode(pros::E_MOTOR_BRAKE_COAST);
	chassis::topMotor.set_brake_mode(pros::E_MOTOR_BRAKE_COAST);

	chassis::tubeMotor.set_zero_position(chassis::tubeMotor.get_position());

	chassis::tubeMotor.set_encoder_units(pros::E_MOTOR_ENCODER_DEGREES);
	chassis::conveyorMotor.set_encoder_units(pros::E_MOTOR_ENCODER_DEGREES);
	chassis::topMotor.set_encoder_units(pros::E_MOTOR_ENCODER_DEGREES);
}

void disabled() {
	// . . .
}

void competition_initialize() {
	// . . .
}
