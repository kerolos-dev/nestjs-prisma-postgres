import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserBody,
  forGetPass,
  loginUserBody,
  restPass,
} from 'src/Custom/dtos/body.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as voucher from 'voucher-code-generator';
import { resetPassTemp, signUpTemp } from 'src/Custom/utils/htmlTemplates';
import { EmailService } from 'src/Custom/email/email.service';
//import { SendMessage } from 'src/Custom/utils/sendEmail';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly _jwtService: JwtService,
    private readonly configService: ConfigService, // Inject ConfigService
    private emailService: EmailService,
  ) {}

  async signup(body: CreateUserBody) {
    // Check if the user already exists
    // const existingUser = await this.prisma.user.findFirst({
    //   where: { email: body.email },
    // });
    // if (existingUser) throw new ConflictException('Email already exists');
    // تحقق إذا كان البريد الإلكتروني موجودًا
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash the password
    const hashPassword = bcrypt.hashSync(body.password, 8);

    // Generate token
    const tokenSecret = this.configService.get<string>('JWT_SECRET');
    const token = this._jwtService.sign(
      { email: body.email },
      { secret: tokenSecret },
    );

    // Create new user
    const newUser = await this.prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashPassword,
        phone: body.phoneNumber,
        role: body.role,
        gender: body.gender,
      },
    });

    // Confirmation link
    const confirmedLink = `http://localhost:3333/user/activateAccount/${token}`; // Try sending the email
    try {
      await this.emailService.sendEmail({
        to: body.email,
        subject: 'Active user',
        text: 'Active user',
        html: signUpTemp(confirmedLink),
      });
    } catch (error) {
      throw new ConflictException(
        'Something went wrong while sending the email!',
      );
    }

    return { message: 'Success, go to ACTIVATE ' };
  }

  async activateAccount(token: string) {
    const tokenSecret = this.configService.get<string>('JWT_SECRET'); // Get JWT secret from .env
    const { email } = this._jwtService.verify(token, { secret: tokenSecret }); // Verify the token and extract email      // find  user  and  update  ic confirmed
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('user  not  found ');
    }
    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: { isConfirmed: true },
    });
    if (!updatedUser) throw new NotFoundException('user   up  not  found  ');
    //  create a cart  // TODAY
    // send  response
    return { massage: 'try  to  login' };
  }

  async login(body: loginUserBody) {
    // Check if the user already exists
    const user = await this.prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (!user) throw new NotFoundException('user  not  found ');
    //  check  is  conform
    if (!user.isConfirmed)
      throw new NotFoundException('you  are  not  confirmed  !');

    //   is match  password
    const isMatch = bcrypt.compareSync(body.password, user.password);
    if (!isMatch) throw new NotFoundException('password  is  not  match ');
    //garnet  token
    const tokenSecret = this.configService.get<string>('JWT_SECRET'); // Get JWT secret from .env
    const token = this._jwtService.sign(
      { id: user.id, email: user.email },
      { secret: tokenSecret },
    );
    await this.prisma.token.create({
      data: {
        token: token,
        userId: user.id,
        isValid: true, // Default value or any value based on your logic
        agent: 'some_agent_string', // Replace with actual agent information if available
      },
    });

    // send response
    return { message: 'success ', results: token };
  }

  async forGetPass(body: forGetPass) {
    // Find the user by email
    // Throw an error if the user is not found
    const user = await this.prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new HttpException(
        'User not found with this email',
        HttpStatus.NOT_FOUND,
      );
    }

    // Generate the forget code
    const forgetCode = voucher.generate({
      length: 8, // Length of the voucher code
      charset: voucher.charset('alphanumeric'), // Customize the charset as needed
    });

    // Save the forget code in the database
    await this.prisma.user.update({
      where: { email: body.email },
      data: {
        forgetCode: forgetCode.join(','), // Convert array to a comma-separated string
      },
    });

    // Send the forget code via email
    try {
      await this.emailService.sendEmail({
        // Use await to wait for email sending
        to: body.email,
        subject: 'Reset Password',
        text: `Your reset code is: ${forgetCode}`, // Provide a plain text version
        html: resetPassTemp(forgetCode), // Use your reset password template function for HTML
      });

      console.log('Email sent successfully:');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return 'Check your email to reset your password.'; // Improved return message
  }

  async resetPass(body: restPass) {
    // Check for user
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (!user) throw new NotFoundException('User not found.');

    // Check forgetCode
    const forgetCode = body.forgetCode; // Ensure forgetCode is obtained from the request body
    if (forgetCode !== user.forgetCode) {
      throw new NotFoundException(
        'The provided code does not match our records.',
      );
    }

    // Hash and update password
    const hashedPassword = bcrypt.hashSync(body.password, 8);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Find all tokens associated with the user and invalidate them
    const tokens = await this.prisma.token.findMany({
      where: { userId: user.id },
    });

    // Update tokens to set isValid to false
    await Promise.all(
      tokens.map(async (token) => {
        await this.prisma.token.update({
          where: { id: token.id },
          data: { isValid: false },
        });
      }),
    );
    return { message: 'success ', results: tokens };
  }
}
