#include "main.h"
#include "subsystems.hpp"

void motorControl(chassis::MotorData& motorData) {
	if (motorData.canSlow && master.get_digital_new_press(motorData.speedToggleController)) {
		motorData.toggleSpeed();
	}

	const int motorPower = 
		master.get_digital(motorData.controller[0]) - master.get_digital(motorData.controller[1]);
	
	motorData.motor.move(motorPower * motorData.speed);


}

void pistonControl(chassis::PneumaticData& pneumaticData) {
	if (master.get_digital_new_press(pneumaticData.controller)) {
		pneumaticData.piston.toggle();
	}
}

void controllerTextControl(int frameCount, int& currentControllerLine) {
	// Controller Layout
	// Battery: XX%
	// Top: [S/F]  Conveyor: [S/F]
	// Tube: [O/I]  Holder: [O/I]
	chassis::controllerText[0] = "Battery: " + std::to_string(pros::battery::get_capacity()) + "%";
	chassis::controllerText[1] = "Top: [" + std::string((chassis::top.speed == chassis::top.defaultSpeed) ? "F" : "S") + "]  "
						+ "Conveyor: [" + std::string((chassis::conveyor.speed == chassis::conveyor.defaultSpeed) ? "F" : "S") + "]";
	chassis::controllerText[2] = "Tube: [" + std::string(chassis::tube.piston.is_extended() ? "O" : "I") + "]  "
						+ "Holder: [" + std::string(chassis::holder.piston.is_extended() ? "O" : "I") + "]";


	if (frameCount % 5 == 0) {
		master.set_text(currentControllerLine, 0, chassis::controllerText[currentControllerLine].c_str());
		currentControllerLine++;
		currentControllerLine %= 3;
	}
}

void opcontrol() {
	int frameCount = 0;
	int currentControllerLine = 0;
	while (true) {
		chassis::drivetrain.drive_brake_set(chassis::drive::brakeMode);
		chassis::drivetrain.opcontrol_arcade_standard(chassis::drive::stickType);

		motorControl(chassis::conveyor);
		motorControl(chassis::top);

		pistonControl(chassis::tube);
		pistonControl(chassis::holder);
		
		controllerTextControl(frameCount, currentControllerLine);
		
		frameCount++;
		pros::delay(ez::util::DELAY_TIME);
	}
}

