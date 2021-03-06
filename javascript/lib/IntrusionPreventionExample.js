/*
 * Copyright 2019 Trend Micro.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Turns on the automatic application of recommendation scans for Intrusion Prevention in a policy.
 * @param {Object} api The Deep Security API modules.
 * @param {Number} policyId The ID of the policy to modify.
 * @param {String} apiVersion The version of the api to use.
 * @returns {Promise} A promise that contains the modified policy.
 */
exports.modifyIntrusionPreventionPolicy = function(api, policyID, apiVersion) {
  return new Promise((resolve, reject) => {
    // Configure the setting
    const policySettings = new api.PolicySettings();
    const settingValue = new api.SettingValue();
    settingValue.value = "yes";
    policySettings.intrusionPreventionSettingAutoApplyRecommendationsEnabled = settingValue;

    // Add to a policy
    const policy = new api.Policy();
    policy.policySettings = policySettings;

    // Modifies the policy on Deep Security Manager
    const modify = function() {
      const policiesApi = new api.PoliciesApi();
      return policiesApi.modifyPolicy(policyID, policy, apiVersion, { overrides: false });
    };

    modify()
      .then(policy => {
        resolve(policy);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/*
 * Retrieves the Intrusion Prevention rules that are applied to all computers.
 * @param {Object} api The Deep Security API modules.
 * @param {String} apiVersion The version of the api to use.
 * @return {Promise} A promise that contains an array of objects that contain
 * the computer host name and their assigned rules or undefined if no rules.
 */
exports.getAssignedIntrusionPreventionRules = function(api, apiVersion) {
  return new Promise((resolve, reject) => {
    // Retreives computers from Deep Security Manager
    const getComputers = function() {
      const computersApi = new api.ComputersApi();
      return computersApi.listComputers(apiVersion, { overrides: false });
    };

    // Extracts intrusion prevention rules from computers
    const getRules = computers => {
      const rules = {};
      for (let i = 0; i < computers.computers.length; i++) {
        rules[computers.computers[i].hostName] = computers.computers[i].intrusionPrevention.ruleIDs;
      }
      return rules;
    };

    getComputers()
      .then(computerList => {
        resolve(getRules(computerList));
      })
      .catch(error => {
        reject(error);
      });
  });
};
