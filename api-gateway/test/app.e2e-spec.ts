import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

chai.use(chaiHttp);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  before(async function () {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  after(async () => {
    await app.close();
  });

  it('should return "Hello World!"', async () => {
    const res = await chai.request(app.getHttpServer()).get('/');
    expect(res).to.have.status(200);
    expect(res.text).to.equal('Hello World!');
  });
});
function before(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}
// Removed duplicate implementation of the 'after' function.
function after(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

