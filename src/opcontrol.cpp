#include "subsystems.hpp"

void motorControl(const pros::Motor* motor, const pros::controller_digital_e_t buttons[2], uint speed = 127) {
	const int motorPower = static_cast<int>((master.get_digital(buttons[0]) - master.get_digital(buttons[1])) * speed);

	(*motor).move(motorPower);
}

void pistonControl(const pros::adi::Pneumatics* piston, pros::controller_digital_e_t toggleButton) {
	if (master.get_digital_new_press(toggleButton)) {
		(*const_cast<pros::adi::Pneumatics*>(piston)).toggle();
	}
}

void opcontrol() {
	while (true) {
		chassis::drivetrain.drive_brake_set(chassis::drive::brakeMode);
		chassis::drivetrain.opcontrol_arcade_standard(chassis::drive::stickType);

		motorControl(&chassis::conveyor.motor, chassis::conveyor.controller);
		motorControl(&chassis::top.motor, chassis::top.controller);

		pistonControl(&chassis::tube.piston, chassis::tube.controller);
		pistonControl(&chassis::holder.piston, chassis::tube.controller);

		pros::delay(ez::util::DELAY_TIME);
	}
}
