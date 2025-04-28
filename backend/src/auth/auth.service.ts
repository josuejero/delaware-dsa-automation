import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

interface User {
  id: number;
  email: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser(email: string, password: string): User | null {
    // In a real implementation, we would look up a User entity
    // For now, we'll mock this with fixed admin credentials
    if (email === 'admin@dsa.org' && password === 'password123') {
      return { id: 1, email, roles: ['admin'] };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, roles: user.roles };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    };
  }
}
