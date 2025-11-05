#pragma once

#include "EZ-Template/api.hpp"
#include "api.h"

// Your motors, sensors, etc. should go here.  Below are examples
namespace chassis {
    namespace ports {
        const std::vector<int> leftMotors = {-11, -6, 5};
        const std::vector<int> rightMotors = {18, 8, -7};
        constexpr int topMotor = 19;
        constexpr int conveyorMotor = 9;
        constexpr int tubeMotor = 4;
        constexpr int imu = 10;
        constexpr int radio = 20;
    }
    
    const inline pros::Motor topMotor(ports::topMotor);
    const inline pros::Motor conveyorMotor(ports::conveyorMotor);

    const inline pros::Motor tubeMotor(ports::tubeMotor);
    constexpr double tubeBasePosition = 20;
    constexpr double tubeExtendedPosition = 176;

    constexpr double wheelDiameter = 2.75;
    constexpr double ticks = (600.0) * (48.0 / 60.0);
    constexpr double ratio = 1;

    
    extern Drive drivetrain;
}

// inline pros::adi::DigitalIn limit_switch('A');
