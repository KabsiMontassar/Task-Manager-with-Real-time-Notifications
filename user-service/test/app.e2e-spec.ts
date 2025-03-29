import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

chai.use(chaiHttp);

describe('AppController (e2e)', function () {
  let app: INestApplication;

  before(async function () {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  after(async function () {
    await app.close();
  });

  it('should return "Hello World!"', async function () {
    const res = await chai.request(app.getHttpServer()).get('/');
    expect(res).to.have.status(200);
    expect(res.text).to.equal('Hello World!');
  });
});
function after(hook: () => Promise<void>) {
  // Executes the provided hook after the test suite completes
  afterEach(async () => {
    await hook();
  });
}
function before(hook: () => Promise<void>) {
  // Executes the provided hook before the test suite starts
  beforeEach(async () => {
    await hook();
  });
}


