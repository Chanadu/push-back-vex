#pragma once

#include "main.h"

constexpr int DRIVE_SPEED = 110;
constexpr int SLOW_DRIVE_SPEED = static_cast<int>(DRIVE_SPEED * 0.60);
constexpr int TURN_SPEED = 50;
constexpr int SWING_SPEED = 50;

void defaultAutonConstants();

void rightAuton();
void leftAuton();