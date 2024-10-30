import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';



@Injectable()
export class PrismaService  extends  PrismaClient implements  OnModuleInit{
  onModuleInit() {
      this.$connect()
      .then(()=> console.log('connected  to  DB'))
      .catch((err)=>{
       console.log('Error  Congesting  to  DB')
      });
  }
}



// import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   private readonly logger = new Logger(PrismaService.name);

//   async onModuleInit() {
//     try {
//       await this.$connect();
//       this.logger.log('Connected to the database');
//     } catch (error) {
//       this.logger.error('Error connecting to the database:', error);
//     }
//   }
// }