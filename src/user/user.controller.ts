import { Body, Controller, Get, Header, Headers, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
// import { JoivalidationPipe } from 'src/pipe/joivalidation/joivalidation.pipe';
// import { signupSchema } from './user.joi';
import { CreateUserBody, forGetPass, loginUserBody, restPass } from 'src/dtos/body.dto';
import { AuthenticationGuard } from 'src/gurads/authentication/authentication.guard';

@Controller('user')
export class UserController {
    constructor(private  readonly _userService: UserService){}
    @Post('signup')    
    // @UsePipes(new  JoivalidationPipe(signupSchema))
    signup(@Body() body: CreateUserBody){
     
        return  this._userService.signup(body)
    }

    @Get('/activateAccount/:token')
    activateAccount(@Param('token') token: string) {
      return this._userService.activateAccount(token);
    }
    

    @Post('login')
    login(@Body() body:loginUserBody){
        return  this._userService.login(body)

    }
    

    @Patch('forGetPass')
    forGetPass(@Body() body:forGetPass){
        return  this._userService.forGetPass(body)

    }

    @Patch('restPass')
    restPass(@Body() body:restPass){
        return  this._userService.resetPass(body)
    }

}
