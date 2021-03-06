'use strict';

const appRootPath = require('cta-common').root('cta-app-agent');
const nodepath = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinon = require('sinon');
require('sinon-as-promised');

const Context = require('cta-flowcontrol').Context;
const Logger = require('cta-logger');
const ResultCollector = require(nodepath.join(appRootPath,
  '/lib/bricks/resultcollector/', 'resultcollector.js'));
const SystemDetails = require(nodepath.join(appRootPath,
  '/lib/utils/systemdetails/', 'index.js'));

const DEFAULTS = {
  name: 'resultcollector',
  module: 'cta-resultcollector',
  properties: {
    reportsQueue: 'cta.ids.',
  },
};
const DEFAULTLOGGER = new Logger(null, null, DEFAULTS.name);

describe('ResultCollector - start', function() {
  let resultCollector;
  const mockCementHelper = {
    constructor: {
      name: 'CementHelper',
    },
    brickName: 'resultCollector',
    dependencies: {
      logger: DEFAULTLOGGER,
    },
    createContext: function() {},
  };
  const updateInstanceJob = {
    nature: {
      type: 'instances',
      quality: 'update',
    },
    payload: {
      query: {
        // hostname: SystemDetails.hostname,
        hostname: SystemDetails.getHostnameAsIS(),
      },
      content: {
        ip: SystemDetails.ip,
        properties: {
          platform: SystemDetails.platform,
          hostname: SystemDetails.hostname,
        },
      },
    },
  };
  const produceJob = {
    nature: {
      type: 'messages',
      quality: 'produce',
    },
    payload: {
      queue: DEFAULTS.properties.instancesQueue,
      content: updateInstanceJob,
    },
  };
  const produceContext = new Context(mockCementHelper, produceJob);
  before(function() {
    resultCollector = new ResultCollector(mockCementHelper, DEFAULTS);
    sinon.stub(resultCollector.cementHelper, 'createContext')
      .withArgs(produceJob)
      .returns(produceContext);
    sinon.stub(produceContext, 'publish').returns(produceContext);
    resultCollector.start();
  });

  context('when everything ok', function() {
    it('should publish new message-produce Context', function() {
      sinon.assert.called(produceContext.publish);
    });
  });
});

