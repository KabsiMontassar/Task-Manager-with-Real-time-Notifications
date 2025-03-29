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
// Removed duplicate implementation of the 'after' function.
function after(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}
function before(callback: () => Promise<void>) {
  (async () => {
    try {
      await callback();
    } catch (error) {
      console.error('Error in before hook:', error);
    }
  })();
}

