import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// 当前环境文件路径: 例如当前处于开发环境时会得到 .env.development
const envFilePath = `.env.${process.env.NODE_ENV} || 'development`;

console.log(ConfigService);
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
