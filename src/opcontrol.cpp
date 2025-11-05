#include "EZ-Template/util.hpp"
#include "main.h"
#include "pros/misc.h"
#include "pros/misc.hpp"
#include "pros/motors.h"
#include "pros/motors.hpp"
#include "subsystems.hpp"

void practiceOnly() {
	if (!pros::competition::is_connected()) {
		if (chassis::drivetrain.pid_tuner_enabled())
			chassis::drivetrain.pid_tuner_disable();

		if (master.get_digital(pros::E_CONTROLLER_DIGITAL_B) && master.get_digital(pros::E_CONTROLLER_DIGITAL_DOWN)) {
			pros::motor_brake_mode_e_t preference = chassis::drivetrain.drive_brake_get();
			pros::lcd::print(5, "Running Auton");

			autonomous();
			chassis::drivetrain.drive_brake_set(preference);
		}
	}
}

void motorControl(const pros::Motor* motor,
				  pros::controller_digital_e_t button1,
				  pros::controller_digital_e_t button2,
				  uint speed = 127,
				  bool forward = true) {
	const int motorPower = static_cast<int>((master.get_digital(button1) - master.get_digital(button2)) * speed);

	// chassis::topMotor.move(-motorPower);
	(*motor).move(motorPower * (forward ? 1 : -1));
}

// void holderPistonControl() {
// 	pros::controller_digital_e_t holderPistonButton = pros::E_CONTROLLER_DIGITAL_Y;
// 	if (master.get_digital_new_press(holderPistonButton)) {
// 		holderPiston.toggle();
// 	}
// }

void opcontrol() {
	chassis::tubeMotor.move_absolute(chassis::tubeBasePosition, 50);
	while (true) {
		chassis::drivetrain.drive_brake_set(pros::E_MOTOR_BRAKE_COAST);
		chassis::drivetrain.opcontrol_arcade_standard(ez::SPLIT);

		// practiceOnly();
		// intakeMotorControl();

		motorControl(&chassis::conveyorMotor, pros::E_CONTROLLER_DIGITAL_R1, pros::E_CONTROLLER_DIGITAL_R2, 127, false);
		motorControl(&chassis::topMotor, pros::E_CONTROLLER_DIGITAL_L1, pros::E_CONTROLLER_DIGITAL_L2);

		// armMotorControl();
		// holderPistonControl();

		pros::delay(ez::util::DELAY_TIME);
	}
}
