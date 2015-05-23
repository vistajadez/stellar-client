(function (window, angular) {
    "use strict";

    /**
     * @ngdoc service
     * @name contactsService
     *
     * @description
     * Provides all inter-app contact persistence functionality.
     *
     */
    angular.module('wc.contacts.service', [])
        .factory('contactsService', [
            'authService',
            'groupsService',
            '$http',
            'wcConfig',
            '$q',
            function contactsServiceFactory(authService, groupsService, $http, wcConfig, $q) {
                /**
                 * Load Contacts.
                 * Refresh the contacts list with any updates that have occurred on the server since our last check.
                 *
                 * @returns {Promise} Promise resolves to an object with "contacts" and "groups" keys, each for
                 * the respective collection of objects.
                 */
                var loadContacts = function() {
                    let groupsPromise = $q((resolve, reject) => {
                        groupsService.load()
                            .then((result) => {
                                this.groups = result;
                                resolve(this.groups);
                            })
                            .then(null, (err) => {
                                reject(err);
                            });
                    });

                    let contactsPromise = $q((resolve, reject) => {
                        var userInfo;
                        var url;

                        if (!authService.isLoggedIn()) {
                            throw new Error(wcConfig.errorMessages.notAuthorized);
                        }

                        // refresh from server since last pull
                        userInfo = authService.getUserInfo();
                        url = wcConfig.api.contacts.url
                            + '?since=' + this.lastPullTimestamp
                            + '&dependents=' + wcConfig.api.contacts.dependents;
                        $http({method: 'GET', url: url, headers: {
                            'x-stellar-token': userInfo.token
                        }})
                            .then((result) => {
                                /* Converts array in form of [{key:2,..},{key:4,..},...] to an object in form of
                                 * {2:{key:2,..}, 4:{key:4,..},...}. Combines newly pulled contacts with those
                                 * already pulled, if any.
                                 *
                                 * This provides us with an object of contact entries whose keys are the contact keys.
                                 * As subsequent calls add or replace contact entries, updating the containing
                                 * object is quick and efficient.
                                 */
                                let pulledContacts = result.data.data;
                                for (let i = 0, len = pulledContacts.length; i < len; i++) {
                                    this.contacts[pulledContacts[i].key] = pulledContacts[i];
                                }

                                resolve(this.contacts);
                            })
                            .then(null, (err) => {
                                reject(err);
                            });

                        // reset timestamp
                        this.lastPullTimestamp = Math.round((new Date()).getTime() / 1000);
                    });

                    // resolve both contacts and groups calls to a single promise
                    return $q.all({groups: groupsPromise, contacts: contactsPromise});
                };

                //var buildGroupMap = function() {
                //    this.contactsByGroup = {};
                //
                //    angular.forEach(this.contacts, (contact) => {
                //        if (!this.contactsByGroup[contact.group_key]) {
                //            this.contactsByGroup[contact.group_key] = [];
                //        }
                //        this.contactsByGroup[contact.group_key].push(contact.key);
                //    });
                //};
                //
                ///**
                // * Due Contacts For Group.
                // *
                // * @param groupId
                // *
                // * @returns {Object} List of sorted due contacts for the requested group.
                // */
                //var dueContactsForGroup = function(groupId) {
                //    if (this.groups.hasOwnProperty(groupId)) {
                //        // determine which contacts are due, and order them by priority
                //        let contacts = [];
                //
                //
                //
                //        return {
                //            groupId: groupId,
                //            groupName: this.groups[groupId].name,
                //            contacts
                //        };
                //    }
                //};
                //
                ///**
                // * Get Due Contacts.
                // *
                // * @returns {Object} List of groups, each containing a list of due contacts for that group.
                // */
                //var getDueContacts = function() {
                //    let dueContacts = [];
                //
                //    angular.forEach(this.groups, (group, groupId) => {
                //        dueContacts[groupId] = this.dueContactsForGroup(groupId);
                //    });
                //
                //    return dueContacts;
                //};


                // Return the model
                return {
                    contacts: {},
                    groups: {},
                    dueContacts: {},
                    lastPullTimestamp: '',
                    load: loadContacts
                };



            }
        ]);


})(window, window.angular);