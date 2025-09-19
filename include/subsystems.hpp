#pragma once

#include "EZ-Template/api.hpp"
#include "api.h"

extern Drive drivetrain;

// Your motors, sensors, etc. should go here.  Below are examples
namespace chassis {
    namespace ports {
        const std::vector<int> leftMotors = {-1, 2, -3};
        const std::vector<int> rightMotors = {4, -5, 6};
        constexpr int imu = 11;
    }
    constexpr double wheelDiameter = 2.75;
    constexpr double ticks = (600.0) * (48.0 / 60.0);
    constexpr double ratio = 1;
}

// inline pros::Motor intake(1);
// inline pros::adi::DigitalIn limit_switch('A');
