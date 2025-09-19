#include "EZ-Template/util.hpp"
#include "main.h"
#include "subsystems.hpp"

void practiceOnly() {
	if (!pros::competition::is_connected()) {
		if (drivetrain.pid_tuner_enabled())
			drivetrain.pid_tuner_disable();

		if (master.get_digital(pros::E_CONTROLLER_DIGITAL_B) && master.get_digital(pros::E_CONTROLLER_DIGITAL_DOWN)) {
			pros::motor_brake_mode_e_t preference = drivetrain.drive_brake_get();
			pros::lcd::print(5, "Running Auton");

			autonomous();
			drivetrain.drive_brake_set(preference);
		}
	}
}

// void intakeMotorControl() {
// 	pros::controller_digital_e_t intakeInButton = pros::E_CONTROLLER_DIGITAL_R2;
// 	pros::controller_digital_e_t intakeOutButton = pros::E_CONTROLLER_DIGITAL_R1;
// 	double intakeVelocity = 0.75;
//
// 	const int motorPower = static_cast<int>((master.get_digital(intakeInButton) - master.get_digital(intakeOutButton)) * 127 * intakeVelocity);
// 	intakeMotors.move(motorPower);
// }
//
// void armMotorControl() {
// 	pros::controller_digital_e_t armInButton = pros::E_CONTROLLER_DIGITAL_L2;
// 	pros::controller_digital_e_t armOutButton = pros::E_CONTROLLER_DIGITAL_L1;
// 	double armVelocity = 1.0;
//
// 	const int motorPower = (master.get_digital(armInButton) - master.get_digital(armOutButton)) * 127 * armVelocity;
// 	armMotor.move(motorPower);
// }
//
// void holderPistonControl() {
// 	pros::controller_digital_e_t holderPistonButton = pros::E_CONTROLLER_DIGITAL_Y;
// 	if (master.get_digital_new_press(holderPistonButton)) {
// 		holderPiston.toggle();
// 	}
// }

void opcontrol() {
	while (true) {
		drivetrain.drive_brake_set(pros::E_MOTOR_BRAKE_COAST);
		drivetrain.opcontrol_arcade_standard(ez::SPLIT);

		practiceOnly();
		// intakeMotorControl();
		// armMotorControl();
		// holderPistonControl();

		pros::delay(ez::util::DELAY_TIME);
	}
}
