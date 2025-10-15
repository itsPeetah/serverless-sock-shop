(function () {
  "use strict";

  var patcher = {};

  const dispatcherSvcName = "dispatcher";
  const dispatcherSvcNamespace = "default";
  const dispatcherSvcUrl = `${dispatcherSvcName}.${dispatcherSvcNamespace}.svc.cluster.local`;

  const is_prod = process.env.NODE_ENV === "production";

  /**
   * @param {string} url2Patch
   */
  function patch_function_url(url2Patch) {
    const isDispatcherUrl = url2Patch.includes(dispatcherSvcUrl);
    if (isDispatcherUrl) {
      return url2Patch;
    }
    const [protocol, noProtocol] = url2Patch.split("://");
    const [functionName, functionNamespace, ...others] = noProtocol.split(".");
    const endpoint = others.at(-1).replace("local/", "");

    const patched = `${protocol}://${dispatcherSvcUrl}/function/${functionNamespace}/${functionName}/${endpoint}`;

    if (!is_prod) {
      console.log(`[URL PATCHER] patched ${url2Patch} to ${patched}`);
    }

    return patched;
  }

  patcher.patch_function_url = patch_function_url;

  module.exports = patcher;
})();
