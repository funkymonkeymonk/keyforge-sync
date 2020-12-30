const scheduledSync = require('../../../src/handlers/scheduled-sync');

describe('Test for scheduledSync', function () {
  xit('calls calls sync when invoked', async () => {
    // Mock console.info statements so we can verify them. For more information, see
    // https://jestjs.io/docs/en/mock-functions.html
    console.info = jest.fn()

    // Create a sample payload with CloudWatch scheduled event message format
    // TODO: fix the types here
    var payload = {
      "id": "cdc73f9d-aea9-11e3-9d5a-835b769c0d9c",
      "detail-type": "Scheduled Event",
      "source": "aws.events",
      "account": "",
      "time": "1970-01-01T00:00:00Z",
      "region": "us-west-2",
      "resources": [
        "arn:aws:events:us-west-2:123456789012:rule/ExampleRule"
      ],
      "detail": {}
    }

    await scheduledSync.handler(payload, null, null)

    // Verify that console.info has been called with the expected payload
    expect(console.info).toHaveBeenCalledWith(JSON.stringify(payload))
  });
});
