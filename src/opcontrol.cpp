#include "main.h"
#include "subsystems.hpp"

void motorControl(chassis::MotorData* motorData) {
	const int motorPower = 
		master.get_digital(motorData->controller[0]) - master.get_digital(motorData->controller[1]);
	
	motorData->motor.move(motorPower * motorData->speed);
}

void pistonControl(chassis::PneumaticData* pneumaticData) {
	if (master.get_digital_new_press(pneumaticData->controller)) {
		pneumaticData->piston.toggle();
	}
}

void opcontrol() {
	while (true) {
		chassis::drivetrain.drive_brake_set(chassis::drive::brakeMode);
		chassis::drivetrain.opcontrol_arcade_standard(chassis::drive::stickType);

		if (master.get_digital_new_press(pros::E_CONTROLLER_DIGITAL_A)) {
			chassis::conveyor.toggleSpeed();
		}

		motorControl(&chassis::conveyor);
		motorControl(&chassis::top);

		pistonControl(&chassis::tube);
		pistonControl(&chassis::holder);
		pros::delay(ez::util::DELAY_TIME);
	}
}

