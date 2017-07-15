(function () {
  'use strict';

  angular
      .module('contactChipsDemo', ['ngMaterial'])
      .controller('ContactChipDemoCtrl', DemoCtrl);

  function DemoCtrl ($q, $timeout) {
    var self = this;
    var pendingSearch, cancelSearch = angular.noop;
    var lastSearch;

    self.allContacts = loadContacts();
    self.filteredJson = dataglobal;
    // console.log(self.filteredJson);
    self.contacts = [];
    self.asyncContacts = [];
    self.filterSelected = true;

    self.querySearch = querySearch;
    self.delayedQuerySearch = delayedQuerySearch;

    /**
     * Search for contacts; use a random delay to simulate a remote call
     */
    function querySearch (criteria) {
      return criteria ? self.allContacts.filter(createFilterFor(criteria)) : [];
    }

    /**
     * Async search for contacts
     * Also debounce the queries; since the md-contact-chips does not support this
     */
    function delayedQuerySearch(criteria) {
      if ( !pendingSearch || !debounceSearch() )  {
        cancelSearch();

        return pendingSearch = $q(function(resolve, reject) {
          // Simulate async search... (after debouncing)
          cancelSearch = reject;
          $timeout(function() {

            resolve( self.querySearch(criteria) );

            refreshDebounce();
          }, Math.random() * 500, true)
        });
      }

      return pendingSearch;
    }

    function refreshDebounce() {
      lastSearch = 0;
      pendingSearch = null;
      cancelSearch = angular.noop;
    }

    /**
     * Debounce if querying faster than 300ms
     */
    function debounceSearch() {
      var now = new Date().getMilliseconds();
      lastSearch = lastSearch || now;

      return ((now - lastSearch) < 300);
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(contact) {
        return (contact._lowername.indexOf(lowercaseQuery) != -1);
      };

    }

    function loadContacts() {
      var contacts = [
      'Chart Paper',
      'News Paper',
      'Paper cups',
      'Plastic cups',
      'Sellotape',
      'Thermocol',
      'Hardboard',
      'Cardboard',
      'Plastic Bottle',
      'Origami Paper',
      ];

      return contacts.map(function (c, index) {
        var cParts = c.split(' ');
        var email = '';
        var hash = '';

        var contact = {
          name: c,
          email: email,
       };
        contact._lowername = contact.name.toLowerCase();
        return contact;
      });
    }
  }

})();