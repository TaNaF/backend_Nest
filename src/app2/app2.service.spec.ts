import { Test, TestingModule } from '@nestjs/testing';
import { App2Service } from './app2.service';

describe('App2Service', () => {
  let service: App2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [App2Service],
    }).compile();

    service = module.get<App2Service>(App2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
