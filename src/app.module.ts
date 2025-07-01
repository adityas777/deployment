import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ✅ Use NestJS config here

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';

import { User } from './users/user.entity';
import { Doctor } from './doctors/doctor.entity';

@Module({
  imports: [
    // ✅ NestJS global config setup
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available app-wide
      envFilePath: '.env', // ensure this points to your .env file
    }),

    // ✅ TypeORM config with injected ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Doctor],
        synchronize: true,
      }),
    }),

    // ✅ App modules
    AuthModule,
    UsersModule,
    DoctorsModule,
  ],
})
export class AppModule {}
