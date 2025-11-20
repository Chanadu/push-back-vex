#include "main.h"

namespace chassis {
	ez::Drive drivetrain(chassis::ports::driveLeft,
						 chassis::ports::driveRight,
						 chassis::ports::imu,
						 chassis::drive::wheelDiameter,
						 chassis::drive::ticks	//
	);

	MotorData top{
		.motor=pros::Motor(ports::top, pros::MotorGears::blue),
		.controller={pros::E_CONTROLLER_DIGITAL_L1, pros::E_CONTROLLER_DIGITAL_L2},
		.canSlow=true,
		.speedToggleController=pros::E_CONTROLLER_DIGITAL_B,
	};

	MotorData conveyor{
		.motor=pros::Motor(ports::conveyor, pros::MotorGears::blue),
		.controller={pros::E_CONTROLLER_DIGITAL_R2, pros::E_CONTROLLER_DIGITAL_R1},
		.canSlow=true,
		.speedToggleController=pros::E_CONTROLLER_DIGITAL_A,
	};

	PneumaticData tube{
		.piston=pros::adi::Pneumatics(ports::tube, false),
		.controller=pros::E_CONTROLLER_DIGITAL_Y,
	};

	PneumaticData holder{
		.piston=pros::adi::Pneumatics(ports::holder, false),
		.controller=pros::E_CONTROLLER_DIGITAL_X,
	};

	std::string controllerText[3] = {"", "", ""};
}  // namespace chassis