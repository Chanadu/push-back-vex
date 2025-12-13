#pragma once

#include "main.h"

namespace chassis {
	namespace ports {
		const std::uint8_t imu = 10;
		const std::uint8_t radio = 20;

		const std::vector<int> driveLeft = {-15, -6, 5};
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
		const std::int8_t defaultSpeed = 127;
		const bool canSlow = false;
		const pros::controller_digital_e_t speedToggleController;
		const double slowFactor = 0.5;
		int speed = defaultSpeed;

		void setup(void) {
			motor.set_brake_mode(brakeMode);
			motor.set_encoder_units(encoderUnits);
		}

		void toggleSpeed(void) { speed = (speed == defaultSpeed) ? static_cast<std::int8_t>(defaultSpeed * slowFactor) : defaultSpeed; }
	};

	extern MotorData top;
	extern MotorData conveyor;

	struct PneumaticData {
		pros::adi::Pneumatics piston;
		const pros::controller_digital_e_t controller;
	};

	extern PneumaticData tube;
	extern PneumaticData holder;

	extern std::string controllerText[3];
}  // namespace chassis

