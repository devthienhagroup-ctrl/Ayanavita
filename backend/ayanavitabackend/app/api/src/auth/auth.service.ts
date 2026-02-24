import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as tls from 'tls'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from '../users/dto/register.dto'
import { LoginDto } from '../users/dto/login.dto'
import { SendOtpDto } from './dto/send-otp.dto'
import { RegisterNewDto } from './dto/register-new.dto'

type JwtPayload = { sub: number; email: string; role: string }

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ForbiddenException('Email already exists')

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        name: dto.name,
        role: 'USER',
      },
      select: { id: true, email: true, name: true, role: true },
    })

    const tokens = await this.issueTokens(user.id, user.email, user.role)
    await this.setRefreshTokenHash(user.id, tokens.refreshToken)

    return { user, ...tokens }
  }

  async sendOtp(dto: SendOtpDto) {
    const email = dto.email.trim().toLowerCase()
    const exists = await this.prisma.user.findUnique({ where: { email } })
    if (exists) throw new ForbiddenException('Email already exists')

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await this.prisma.registrationOtp.upsert({
      where: { email },
      update: { code: otp, expiresAt, usedAt: null },
      create: { email, code: otp, expiresAt },
    })

    await this.sendOtpMail(email, otp)

    return { success: true, expiresInSeconds: 300 }
  }

  async registerNew(dto: RegisterNewDto) {
    if (!dto.acceptedPolicy) throw new ForbiddenException('Bạn phải chấp nhận chính sách')

    const email = dto.email.trim().toLowerCase()
    const exists = await this.prisma.user.findUnique({ where: { email } })
    if (exists) throw new ForbiddenException('Email already exists')

    const otpRow = await this.prisma.registrationOtp.findUnique({ where: { email } })
    if (!otpRow || otpRow.usedAt || otpRow.code !== dto.otp) {
      throw new ForbiddenException('OTP không hợp lệ')
    }
    if (otpRow.expiresAt.getTime() < Date.now()) {
      throw new ForbiddenException('OTP đã hết hạn')
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: dto.name,
        phone: dto.phone,
        role: 'USER',
      },
      select: { id: true, email: true, name: true, role: true, phone: true },
    })

    await this.prisma.registrationOtp.update({
      where: { email },
      data: { usedAt: new Date() },
    })

    const tokens = await this.issueTokens(user.id, user.email, user.role)
    await this.setRefreshTokenHash(user.id, tokens.refreshToken)

    return { user, ...tokens }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const ok = await bcrypt.compare(dto.password, user.password)
    if (!ok) throw new UnauthorizedException('Invalid credentials')

    const tokens = await this.issueTokens(user.id, user.email, user.role)
    await this.setRefreshTokenHash(user.id, tokens.refreshToken)

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
      ...tokens,
    }
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access denied')

    const ok = await bcrypt.compare(refreshToken, user.hashedRefreshToken)
    if (!ok) throw new ForbiddenException('Access denied')

    const tokens = await this.issueTokens(user.id, user.email, user.role)
    await this.setRefreshTokenHash(user.id, tokens.refreshToken)

    return tokens
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    })
    return { success: true }
  }

  private async sendOtpMail(email: string, otp: string) {
    const user = process.env.MAIL_USER ?? 'manage.ayanavita@gmail.com'
    const pass = process.env.MAIL_PASS ?? 'xetp fhph luse qydj'
    const to = email
    const subject = 'Mã OTP xác nhận đăng ký AYANAVITA'
    const body = `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`

    await this.sendSmtpViaGmail({ user, pass, to, subject, body })
  }

  private async sendSmtpViaGmail(params: { user: string; pass: string; to: string; subject: string; body: string }) {
    const { user, pass, to, subject, body } = params

    await new Promise<void>((resolve, reject) => {
      const socket = tls.connect(465, 'smtp.gmail.com', { servername: 'smtp.gmail.com' }, () => {
        const authUser = Buffer.from(user).toString('base64')
        const authPass = Buffer.from(pass).toString('base64')
        const lines = [
          'EHLO ayanavita.local',
          'AUTH LOGIN',
          authUser,
          authPass,
          `MAIL FROM:<${user}>`,
          `RCPT TO:<${to}>`,
          'DATA',
          `Subject: ${subject}`,
          `From: AYANAVITA <${user}>`,
          `To: ${to}`,
          'Content-Type: text/plain; charset=UTF-8',
          '',
          body,
          '.',
          'QUIT',
        ]
        socket.write(lines.join('\r\n') + '\r\n')
      })

      let data = ''
      socket.on('data', (chunk) => {
        data += chunk.toString('utf8')
      })
      socket.on('error', reject)
      socket.on('end', () => {
        if (data.includes(' 535 ') || data.includes('\n535-') || data.includes('\n535 ')) {
          reject(new Error('SMTP auth failed'))
          return
        }
        if (!data.includes('\n250 ') && !data.startsWith('250')) {
          reject(new Error(`SMTP send failed: ${data}`))
          return
        }
        resolve()
      })
    })
  }

  private issueTokens(userId: number, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role }

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: 15 * 60,
    })

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: 7 * 24 * 60 * 60,
    })

    return { accessToken, refreshToken }
  }

  private async setRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    })
  }
}
