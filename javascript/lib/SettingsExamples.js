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
 * Retrieves the value of the FirewallSettingNetworkEngineMode property of a policy.
 * @param {Object} api The Deep Security API modules.
 * @param {String} policyID The ID of the policy.
 * @param {String} apiVersion The API version to use.
 * @returns {Promise} A promise that resolves to the property value.
 */
exports.getNetworkEngineMode = function(api, policyID, apiVersion) {
  return new Promise((resolve, reject) => {
    // Get the policy details from Deep Security Manager
    const policiesApi = new api.PoliciesApi();
    policiesApi
      .describePolicy(policyID, apiVersion, { overrides: false })
      .then(policy => {
        // Resolve the setting value
        resolve(policy.policySettings.firewallSettingNetworkEngineMode.value);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/*
 * Sets the value of the FirewallSettingNetworkEngineMode property of a policy to Inline.
 * @param {Object} api The Deep Security API modules.
 * @param {String} policyID The ID of the policy.
 * @param {String} apiVersion The API version to use.
 * @returns {Promise} A promise that resolves to the new value of FirewallSettingNetworkEngineMode.
 */
exports.setNetworkEngineModeToInline = function(api, policyID, apiVersion) {
  return new Promise((resolve, reject) => {
    // Setting value
    const networkEngineModeValue = new api.SettingValue();
    networkEngineModeValue.value = "Inline";

    // Set the value of the setting
    const policySettings = new api.PolicySettings();
    policySettings.firewallSettingNetworkEngineMode = networkEngineModeValue;

    // Create a policy and add the setting values
    const policy = new api.Policy();
    policy.policySettings = policySettings;

    // Modify the policy on Deep Security Manager.
    const policiesApi = new api.PoliciesApi();
    policiesApi
      .modifyPolicy(policyID, policy, apiVersion, { overrides: false })
      .then(returnedPolicy => {
        resolve(returnedPolicy.policySettings.firewallSettingNetworkEngineMode.value);
      })
      .catch(error => {
        reject(error);
      });
  });
};
