import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../utils/db';
import { config } from '../config';
import { AppError } from '../middlewares/errorHandler';
import type { User, JwtPayload } from '../types';

class AuthService {
  async login(username: string, password: string) {
    const rows = await query('SELECT * FROM users WHERE username = ?', [username]);
    const user = (rows as any[])[0] as User | undefined;
    if (!user) throw new AppError('用户名或密码错误', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError('用户名或密码错误', 401);

    const payload: JwtPayload = { userId: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });

    return {
      token,
      user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, email: user.email, role: user.role },
    };
  }

  async getCurrentUser(userId: number) {
    const rows = await query('SELECT id, username, nickname, avatar, email, role, created_at FROM users WHERE id = ?', [userId]);
    const user = (rows as any[])[0];
    if (!user) throw new AppError('用户不存在', 404);
    return user;
  }
}

export const authService = new AuthService();
