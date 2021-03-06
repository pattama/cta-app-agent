'use strict';

const appRootPath = require('cta-common').root('cta-app-agent');
const nodepath = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');

const ObjectID = require('bson').ObjectID;
const _ = require('lodash');

const JobBroker = require(nodepath.join(appRootPath,
  '/lib/bricks/jobbroker/', 'index.js'));

const JOB = require('./jobbroker.execution.run.testdata.js');

const DEFAULTS = {
  name: 'jobbroker',
  module: 'cta-jobbroker',
  properties: {},
};

describe('JobBroker - process', function() {
  let jobBroker;
  const mockCementHelper = {
    constructor: {
      name: 'CementHelper',
    },
    brickName: 'jobbroker',
  };
  before(function() {
    // mock jobHandler
    jobBroker = new JobBroker(mockCementHelper, DEFAULTS);
  });
  context('when job is execution-cancelation', function() {
    const job = _.cloneDeep(JOB);
    job.id = new ObjectID();
    job.nature.quality = 'cancel';
    job.payload.jobid = job.id;
    const context = {
      data: job,
    };
    before(function() {
      sinon.stub(jobBroker.jobBrokerHelper, 'cancel');
      jobBroker.process(context);
    });
    after(function() {
      jobBroker.jobBrokerHelper.cancel.restore();
    });

    it('should call jobBrokerHelper cancel() method', function() {
      expect(jobBroker.jobBrokerHelper.cancel.calledWithExactly(context));
    });
  });

  context('when job is execution-run', function() {
    const job = _.cloneDeep(JOB);
    job.id = new ObjectID();
    job.nature.quality = 'run';
    const context = {
      data: job,
    };
    before(function() {
      sinon.stub(jobBroker.jobBrokerHelper, 'processDefault');
      jobBroker.process(context);
    });
    after(function() {
      jobBroker.jobBrokerHelper.processDefault.restore();
    });

    it('should call jobBrokerHelper processDefault() method', function() {
      expect(jobBroker.jobBrokerHelper.processDefault.calledWithExactly(context));
    });
  });

  context('when job is execution-read', function() {
    const job = _.cloneDeep(JOB);
    job.id = new ObjectID();
    job.nature.quality = 'read';
    const context = {
      data: job,
    };
    before(function() {
      sinon.stub(jobBroker.jobBrokerHelper, 'processDefault');
      jobBroker.process(context);
    });
    after(function() {
      jobBroker.jobBrokerHelper.processDefault.restore();
    });

    it('should call jobBrokerHelper processDefault() method', function() {
      expect(jobBroker.jobBrokerHelper.processDefault.calledWithExactly(context));
    });
  });
});
