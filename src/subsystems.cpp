#include "main.h"

namespace chassis {
	ez::Drive drivetrain(chassis::ports::driveLeft,
						 chassis::ports::driveRight,
						 chassis::ports::imu,
						 chassis::drive::wheelDiameter,
						 chassis::drive::ticks	//
	);

	MotorData top{
		pros::Motor(ports::top, pros::MotorGears::blue),
		{pros::E_CONTROLLER_DIGITAL_L1, pros::E_CONTROLLER_DIGITAL_L2},
	};

	MotorData conveyor{
		pros::Motor(ports::conveyor, pros::MotorGears::blue),
		{pros::E_CONTROLLER_DIGITAL_R2, pros::E_CONTROLLER_DIGITAL_R1},
	};

	PneumaticData tube{
		pros::adi::Pneumatics(ports::tube, false),
		pros::E_CONTROLLER_DIGITAL_Y,
	};

	PneumaticData holder{
		pros::adi::Pneumatics(ports::holder, false),
		pros::E_CONTROLLER_DIGITAL_X,
	};
}  // namespace chassis