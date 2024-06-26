import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

// 当前环境文件路径: 例如当前处于开发环境时会得到 .env.development
const envFilePath = `.env.${process.env.NODE_ENV} || 'development`;

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal为true代表开启全局模块
      isGlobal: true,
      // envFilePath: 指定当前要读取的是那个环境文件
      envFilePath,
      // 使用dotenv加载.env环境中的所有环境变量,如果访问了生产环境与开发环境中都不存在的环境变量,那么默认就回去.env环境文件中去找
      load: [() => dotenv.config({ path: '.env' })],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, UserModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'mysql',
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User],
          synchronize: configService.get(ConfigEnum.DB_SYNCHRONIZE),
          logging: ['error'],
        }) as TypeOrmModuleAsyncOptions,
    }),
    // 连接数据库的一些信息
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'example',
    //   database: 'testdb',
    //   entities: [],
    //   // 同步本地的schema与数据库 => 初始化的时候去使用
    //   synchronize: true,
    //   logging: ['error'],
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
