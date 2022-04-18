import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { getMongoDBConfig } from './config/mongo.config';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypegooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: getMongoDBConfig,
        }),
        AuthModule,
    ],
})
export class AppModule {}
