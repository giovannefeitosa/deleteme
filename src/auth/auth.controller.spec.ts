import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

// const mockAuthService = () => ({
//   signUpWithPassword: jest.fn(),
//   signIn: jest.fn(),
// });
jest.mock('./auth.service');
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth Controller', () => {
  let authController: AuthController;
  let authService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('/signUp', () => {
    it('should call authService.signUpWithPassword', async () => {
      expect(authService.signUpWithPassword).not.toHaveBeenCalled();
      const creds: AuthCredentialsDto = {
        username: 'TestUser',
        email: 'test@test.com',
        password: 'TestPassword',
      };
      const result = await authController.signUp(creds);
      expect(authService.signUpWithPassword).toHaveBeenCalledWith(creds);
      expect(result).toMatchInlineSnapshot(`undefined`);
    });
  });

  describe('/signin', () => {
    it('should call authService.generateJwtToken', async () => {
      const mockJwt = 'FAKE_JWT';
      authService.generateJwtToken.mockReturnValueOnce(mockJwt);
      expect(authService.generateJwtToken).not.toHaveBeenCalled();
      const req: any = {
        user: {
          id: 1,
          username: 'TestUser',
          email: 'test@test.com',
        },
      };
      const result = await authController.signIn(req);
      expect(authService.generateJwtToken).toHaveBeenCalledWith(req.user);
      expect(result).toBe(mockJwt);
    });
  });

  describe('/protected', () => {
    it('should return string', () => {
      const result = authController.getProtected();
      expect(result).toMatchInlineSnapshot(`"JWT is working"`);
    });
  });

  describe('/google', () => {
    it('should return void', () => {
      const result = authController.googleLogin();
      expect(result).toBeUndefined();
    });
  });

  describe('/google/callback', () => {
    it('should call authService.generateJwtToken', async () => {
      const mockJwt = 'FAKE_JWT';
      authService.generateJwtToken.mockReturnValueOnce(mockJwt);
      expect(authService.generateJwtToken).not.toHaveBeenCalled();
      const req: any = {
        query: { code: 'FAKE_CODE' },
        user: {
          id: 1,
          username: 'TestUser',
          email: 'test@test.com',
        },
      };
      const result = await authController.googleLoginCallback(req);
      expect(authService.generateJwtToken).toHaveBeenCalledWith(req.user);
      expect(result).toBe(mockJwt);
    });
  });
});
