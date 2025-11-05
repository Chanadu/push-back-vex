#pragma once

#include <cstdint>
#include <vector>
#include "EZ-Template/drive/drive.hpp"
#include "EZ-Template/util.hpp"
#include "pros/abstract_motor.hpp"
#include "pros/misc.h"
#include "pros/motors.h"

namespace chassis {
	namespace ports {
		const std::uint8_t imu = 10;
		const std::uint8_t radio = 20;

		const std::vector<int> driveLeft = {-11, -6, 5};
		const std::vector<int> driveRight = {18, 8, -7};

		const std::uint8_t top = 19;
		const std::uint8_t conveyor = 9;
		const std::uint8_t tube = 'A';
		const std::uint8_t holder = 'B';
	}  // namespace ports

	namespace drive {
		const pros::MotorGears gearset = pros::MotorGears::red;
		const double wheelDiameter = 2.75;
		const double ticks = (600.0) * (48.0 / 60.0);
		const double ratio = 1;

		const pros::motor_brake_mode_e_t brakeMode = pros::E_MOTOR_BRAKE_COAST;
		const ez::e_type stickType = ez::SPLIT;
	}  // namespace drive
	extern ez::Drive drivetrain;

	struct MotorData {
		const pros::Motor motor;
		const pros::controller_digital_e_t controller[2];
		const pros::motor_brake_mode_e_t brakeMode = pros::E_MOTOR_BRAKE_COAST;
		const pros::motor_encoder_units_e_t encoderUnits = pros::E_MOTOR_ENCODER_DEGREES;
	};

	const MotorData top{
		pros::Motor(ports::top, pros::MotorGears::blue),
		{pros::E_CONTROLLER_DIGITAL_L1, pros::E_CONTROLLER_DIGITAL_L2},
	};

	const MotorData conveyor{
		pros::Motor(ports::conveyor, pros::MotorGears::blue),
		{pros::E_CONTROLLER_DIGITAL_R2, pros::E_CONTROLLER_DIGITAL_R1},
	};

	struct PneumaticData {
		const pros::adi::Pneumatics piston;
		const pros::controller_digital_e_t controller;
	};

	const PneumaticData tube{
		pros::adi::Pneumatics(ports::tube, false),
		pros::E_CONTROLLER_DIGITAL_Y,
	};

	const PneumaticData holder{
		pros::adi::Pneumatics(ports::holder, false),
		pros::E_CONTROLLER_DIGITAL_X,
	};

	extern void setupMotor(MotorData* motorData);
}  // namespace chassis
