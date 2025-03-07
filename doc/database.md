<!-- Kết nối MySQL TypeORM  -->

npm install --save @nestjs/typeorm typeorm mysql2

<!-- Trong app.module.ts import thêm database-->

    imports: [
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    ],
