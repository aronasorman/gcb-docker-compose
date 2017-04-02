const path = require('path');
const grpc = require('grpc');
const should = require('should');
const async = require('async');

const PORT = process.env.PORT || 50051;
const PROTO_PATH = path.join(__dirname, '..', 'counter.proto');
const counterProto = grpc.load(PROTO_PATH);

describe('integration tests', () => {

  let client;

  before(() => {
    // Create a grpc client.
    // This assumes that the server is running.
    client = new counterProto.counter.CounterService(
      'localhost:' + PORT,
      grpc.credentials.createInsecure()
    );
    console.log('yo : ', client);
  });

  it('should reset, then add to the counter', (done) => {
    async.series({
      reset: function(callback) {
        client.reset({}, callback);
      },
      add: function(callback) {
        client.add({count: 1}, callback);
      },
      get: function(callback) {
        client.get({}, (err, res) => {
          should.not.exist(err);
          res.count.should.equal(1);
        });
      }
    }, done);
  });

});
