/**
 * Nome del file: editor.client.service.js
 * Percorso: /public/modules/editor/services/editor.client.service.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-24
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-27 - Aggiunta funzione saveResolution() e getResolution() - Simone Campagna
 * 2015-08-20 - Aggiunta funzione getProductionWidth() - Simone Campagna
 * 2015-08-18 - Aggiunte funzioni saveProductionWidth() e saveOverviewWidth() - Simone Campagna
 * 2015-08-16 - Modificata funzione savePresentation() ed aggiunta funzione
 *              saveWidth() - Simone Campagna
 * 2015-08-16 - Modificata funzione savePresentation() - Simone Campagna
 * 2015-08-09 - Creato metodo savePresentation() - Simone Campagna
 * 2015-08-05 - Rimossi metodi getContainersLength(), reorderContainers(),
 *              removeContainer() e addContainer(), creato metodo
 *              saveContainers() e modificato metodo init() - Simone Campagna
 * 2015-08-03 - Creati metodi save(), reorderContainer(), saveContainer()
 *              removeContainer() e updatePresentationInfo() - Enrico Ceron
 * 2015-07-30 - Creato metodo getContainer() e getContainersLength() - Enrico Ceron
 * 2015-07-28 - Creati metodi getPresentationInfo(), getContainers() e
 *              addContainer() - Enrico Ceron
 * 2015-07-24 - Creato metodo init() - Simone Campagna
 */

'use strict';

angular.module('editor').factory('Editor', [
  '$http',
  '$stateParams',
  '$rootScope',
  'Presentations',
  function($http, $stateParams, $rootScope, Presentations) {
    var presentation = {};

    return {

      /**
       * Richiede la presentazione da editare al server.
       *
       * @fires editor:init
       * @fires editor:error
       */
      init: function() {
        Presentations.findOne($stateParams.presentationId).success(function(res) {
          presentation = res;
          $rootScope.$emit('editor:init');
        }).error(function(err) {
          $rootScope.$emit('editor:error');
        });
      },

      /**
       * Restituisce le informazioni della presentazione attualmente in
       *     modifica.
       *
       * @returns {Object}
       */
      getPresentationInfo: function() {
        return presentation.info;
      },

      /**
       * Aggiorna le informazioni della presentazione attualmente in modifica.
       *
       * @param {Object} info - Le informazioni della presentazione.
       * @returns {HttpPromise}
       */
      updatePresentationInfo: function(info) {
        presentation.info = info;
        return this.savePresentation();
      },

      /**
       * Restituisce tutti i contenitori della presentazione attualmente in
       *     modifica.
       *
       * @returns {Array}
       */
      getContainers: function() {
        return presentation.containers;
      },

      /**
       * Restituisce il contenitore alla posizione index.
       *
       * @param {Number} index - La posizione del contenitore nel cammino.
       * @returns {Object}
       */
      getContainer: function(index) {
        return presentation.containers[index];
      },

      /**
       * Salva in containers il contenitore aggiornato.
       *
       * @param {Object} container - Il contenitore da aggiornare.
       * @param {Number} index - La posizione del contenitore nel cammino.
       */
      saveContainer: function(container, index) {
        presentation.containers[index] = container;
      },

      /**
       * Salva tutti i contenitori della presentazione attualmente in modifica.
       *
       * @param {Object} containers - I contenitori della presentazione.
       */
      saveContainers: function(containers) {
        presentation.containers = containers;
      },

      /**
       * Salva la presentazione modificata.
       *
       * @returns {HttpPromise}
       */
      savePresentation: function() {
        return Presentations.update(presentation);
      },

      /**
       * Salva la dimensione della presentazione in editing.
       *
       * @param {Number} width - Dimensione della presentazione
       */
      saveProductionWidth: function(width) {
        presentation.productionWidth = width;
      },

      /**
       * Salva la dimensione dello spazio dell'overview.
       *
       * @param {Number} width - Dimensione dell'overview.
       */
      saveOverviewWidth: function(width) {
        presentation.overviewWidth = width;
      },

      /**
       * Ritorna la dimensione della presentazione durante l'editing.
       *
       * @returns {Number} width - Larghezza della presentazione in editing.
       */
      getProductionWidth: function() {
        return presentation.productionWidth;
      },

      /**
       * Salva la aspect ratio della presentazione.
       *
       * @param {Object} resolution - Aspect ratio della presentazione.
       * @fires editor:resolution
       */
      setResolution: function(resolution) {
        var old = presentation.resolution;
        presentation.resolution = resolution;
        $rootScope.$emit('editor:resolution', old, resolution);
      },

      /**
       * Ritorna la aspect ratio della presentazione.
       *
       * @returns {Object} resolution - Aspect ratio della presentazione.
       */
      getResolution: function() {
        return presentation.resolution;
      }
    };
  }
]);
