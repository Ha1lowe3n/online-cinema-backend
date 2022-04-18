import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from '../src/auth/auth.module';

import { getMockMongoDBConfig } from '../src/config/mock-mongo.config';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypegooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: getMockMongoDBConfig,
		}),
		AuthModule,
	],
})
export class MockAppModule {}
