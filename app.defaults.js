var path = require('path');

var libPrefix = {
    bower: {
        path: './bower_components/'
    },
    dev: {
        path: './public/'
    },
    prod: {
        path: './public/'
    },
    test: {
        path: './test/'
    },
    templates: {
        name: 'wc.templates'
    }
};

var vendorNgJs = [
    'angular/angular.js',
    'angular-bootstrap/ui-bootstrap-tpls.js',
    'angular-ui-router/release/angular-ui-router.js'
].map(function(sPath) {
    return path.join(libPrefix.bower.path, sPath);
});

var testVendorNgJs = vendorNgJs.concat([
    'angular-mocks/angular-mocks.js'
].map(function(sPath){
    return path.join(libPrefix.bower.path, sPath);
}));

module.exports = {
   libPrefix: libPrefix,
   vendorNgJs: vendorNgJs,
   testVendorNgJs: testVendorNgJs
};
