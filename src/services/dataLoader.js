/**
 * dataLoader.js
 * -----------------------------------------------------------------------
 * The only data-access surface pages/components should import from.
 * Everything here delegates to api.js, so when api.js starts hitting the
 * real Worker, this file (and every caller) stays untouched.
 * -----------------------------------------------------------------------
 */

import * as api from "./api.js";

export const getBusiness = api.fetchBusiness;
export const getServices = api.fetchServices;
export const getContent = api.fetchContent;
export const addContent = api.createContent;
export const editContent = api.updateContent;
export const removeContent = api.deleteContent;
export const getLeads = api.fetchLeads;
export const addLead = api.createLead;
export const setLeadStatus = api.updateLeadStatus;
export const login = api.adminLogin;

/** Convenience helper used by several components to label a service id. */
export async function serviceLabel(serviceId) {
  const services = await getServices();
  const match = services.find((s) => s.id === serviceId);
  return match ? match.title : serviceId;
}
