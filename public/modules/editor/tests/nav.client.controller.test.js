/**
 * Nome del file: nav.client.controller.test.js
 * Percorso: /public/modules/editor/tests/nav.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-09-01
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-02 - Aggiunti tests per metodi moveContainerUp(),
 *              moveContainerDown(), removeContainer(), selectContainer(),
 *              save(), refreshResolution() - Tommaso Miotto
 * 2015-09-01 - Aggiunti test metodi getContainers(), scale(), make() - Tommaso Miotto
 */

'use strict';

describe('NavController',function() {
  //Initialize global variables
  var scope;
  var $httpBackend;
  var NavController;
  var Editor;
  var $stateParams;
  var mockPresentation;

  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  beforeEach(inject(function($controller,
                             $rootScope,
                             _$httpBackend_,
                             _Editor_,
                             _Presentations_,
                             _$stateParams_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    Editor = _Editor_;
    $stateParams = _$stateParams_;
    NavController = $controller('NavController', {
      $scope: scope
    });
    mockPresentation = {
      _id: '12234',
      info: {
        title: 'A sample presentation',
        description: 'Premi rocks!'
      },
      containers: [
        'First container',
        'Second container'
      ],
      productionWidth: '500',
      overviewWidth: '500',
      resolution: {
        width: '500',
        height: '500'
      }
    };
    $stateParams.presentationId = mockPresentation._id;
  }));

  it('make(index,oldResolution,newResolution) should create new canvas', function() {
      spyOn(Editor, 'getResolution').and.returnValue(mockPresentation.resolution);
      spyOn(Editor, 'getProductionWidth').and.returnValue(mockPresentation.productionWidth);
      scope.make(2,mockPresentation.resolution,mockPresentation.resolution);
      expect(Editor.getResolution).toHaveBeenCalled();
      expect(Editor.getProductionWidth).toHaveBeenCalled();
      expect(scope.resolution).toBe(mockPresentation.resolution);
      expect(scope.productionWidth).toBe(mockPresentation.productionWidth);
    });

  it('scale(canvas, index, oldResolution, newResolution) should scale slide objects for new resolution',function() {
    var canvas = new fabric.StaticCanvas('container' + 2);
    canvas.loadFromJSON(scope.containers[2], canvas.renderAll.bind(canvas));
    spyOn(Editor, 'getResolution').and.returnValue(mockPresentation.resolution);
    spyOn(Editor, 'getProductionWidth').and.returnValue(mockPresentation.productionWidth);
    scope.scale(canvas, 2, mockPresentation.resolution, mockPresentation.productionWidth);
    //expectations
    expect(Editor.getResolution).toHaveBeenCalled();
    expect(Editor.getProductionWidth).toHaveBeenCalled();
    expect(scope.resolution).toBe(mockPresentation.resolution);
    expect(scope.productionWidth).toBe(mockPresentation.productionWidth);
  });

  it('getContainers() should returns presentation containers', function() {
    spyOn(Editor, 'getContainers').and.returnValue(mockPresentation.containers);
    scope.getContainers();
    //expectations
    expect(Editor.getContainers).toHaveBeenCalled();
    expect(scope.containers).toBe(mockPresentation.containers);
  });

  it('removeContainer(index) should removes container index', function() {
    scope.containers = mockPresentation.containers;
    scope.removeContainer(1);
    //expectations
    expect(scope.containers.length).toBe(1);
    expect(scope.containers).toBe(mockPresentation.containers);
  });

  it('removeContainer(index) should add a container if there aren\'t containers', function() {
    var mockPresentation2 = {
      _id: '12234',
      info: {
        title: 'A sample presentation',
        description: 'Premi rocks!'
      },
      containers: [],
      productionWidth: '500',
      overviewWidth: '500',
      resolution: {
        width: '500',
        height: '500'
      }
    };
    scope.containers = mockPresentation2.containers;
    scope.removeContainer(0);
    //expectations
    expect(scope.containers.length).toBe(1);
    expect(scope.containers).toBe(mockPresentation2.containers);
  });

  it('selectContainer(index) should select clicked container', function() {
    scope.selectContainer(1);
    //expectations
    expect(scope.current).toBe(1);
  });

  it('save() should save containers presentation', function() {
    spyOn(Editor, 'saveContainers');
    scope.containers = mockPresentation.containers;
    scope.save();
    //expectations
    expect(Editor.saveContainers).toHaveBeenCalled();
  });

  it('moveContainerUp(index) should move up container in path',function() {
    scope.containers = mockPresentation.containers;
    scope.moveContainerUp(1);
    //expectations
    expect(scope.current).toBe(0);
  });

  it('moveContainerUp(index) should not move up first container',function() {
    scope.containers = mockPresentation.containers;
    scope.moveContainerUp(0);
    //expectations
    expect(scope.current).toBe(null);
    expect(scope.containers).toBe(mockPresentation.containers);
  });

  it('moveContainerDown(index) should move down container in path',function() {
    scope.containers = mockPresentation.containers;
    scope.moveContainerDown(0);
    //expectations
    expect(scope.current).toBe(1);
  });

  it('moveContainerDown(index) should not move down last container in path', function() {
    scope.containers = mockPresentation.containers;
    scope.moveContainerDown(1);
    //expectations
    expect(scope.current).toBe(null);
    expect(scope.containers).toBe(mockPresentation.containers);
  });

  it('refreshResolution(oldResolution, newResolution) should refresh presentations resolution',function() {
    scope.containers = mockPresentation.containers;
    spyOn(scope, 'make').and.callFake(function() {
      return true;
    });
    var newResolution = {width: '16', height: '9'};
    scope.refreshResolution(mockPresentation.resolution,newResolution);
    //expectations
    expect(scope.make).toHaveBeenCalled();
  });

  it('$rootScope.$on(\'editor:init\') should call getContainers() when needed', function() {
    spyOn(Editor, 'getContainers').and.returnValue(mockPresentation.containers);
    scope.$emit('editor:init');
    //expectations
    expect(scope.containers).toBe(mockPresentation.containers);
  });

  it('$rootScope.$on(\'last\') should intercept if presentation isn\'t initialized', function() {
    scope.justInitialized = false;
    scope.$emit('last');
    //expectations
    expect(scope.justInitialized).toBe(true);
    expect(scope.current).toBe(0);
  });

  it('$rootScope.$on(\'last\') should intercept if presentation is initialized', function() {
    scope.justInitialized = true;
    scope.$emit('last');
    //expectations
    expect(scope.justInitialized).toBe(true);
  });

  it('$rootScope.$on(\'editor:resolution\',oldResolution, newResolution) should intercept resolution change', function() {
    spyOn(scope, 'refreshResolution').and.callThrough;
    scope.$emit('editor:resolution', {
      width: '4',
      height: '3'
    }, {
      width: '16',
      height: '9'
    });
    //expectations
    expect(scope.refreshResolution).toHaveBeenCalled();
  });

  it('insertContainer() should insert new container in path last position', function() {
    scope.containers = mockPresentation.containers;
    scope.insertContainer();
    //expectations
    expect(scope.containers.length).toBe(3);
  });
});
