import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from '../src/auth/auth.module';

import { getMockMongoDBConfig } from '../src/config/mock-mongo.config';
import { Module } from '@nestjs/common';
import { UserModule } from '../src/user/user.module';
import { GenreModule } from '../src/genre/genre.module';
import { FileModule } from '../src/file/file.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypegooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: getMockMongoDBConfig,
		}),
		AuthModule,
		UserModule,
		GenreModule,
		FileModule,
	],
})
export class MockAppModule {}
