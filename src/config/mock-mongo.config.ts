import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMockMongoDBConfig = async (
	configService: ConfigService,
): Promise<TypegooseModuleOptions> => ({
	uri: getMockMongoString(configService),
});

const getMockMongoString = (configService: ConfigService): string => {
	return (
		'mongodb://' +
		configService.get('MOCK_MONGO_LOGIN') +
		':' +
		configService.get('MOCK_MONGO_PASSWORD') +
		'@' +
		configService.get('MOCK_MONGO_HOST') +
		':' +
		configService.get('MOCK_MONGO_PORT') +
		'/' +
		configService.get('MOCK_MONGO_AUTHDATABASE')
	);
};
