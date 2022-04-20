import { applyDecorators, UseGuards } from '@nestjs/common';

import { AdminGuard } from '../guards/admin.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleType } from '../types/auth-types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const AuthRoleGuard = (role: RoleType = 'user') => {
	return applyDecorators(
		role === 'admin' ? UseGuards(JwtGuard, AdminGuard) : UseGuards(JwtGuard),
	);
};
